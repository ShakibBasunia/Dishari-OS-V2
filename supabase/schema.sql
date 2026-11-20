-- =====================================================================
-- Dishari OS, Supabase / Postgres 16 schema (extends the NextEdu prototype)
-- Run in the Supabase SQL editor. Requires: pgvector, pgcrypto.
-- =====================================================================
create extension if not exists vector;
create extension if not exists pgcrypto;

-- ---------- Identity & tenancy ----------
create table if not exists institutions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  kind        text check (kind in ('school','college','madrasah','polytechnic','ngo','employer')),
  district    text,
  data_region text not null default 'bd-dhaka',          -- data-sovereignty pin
  created_at  timestamptz default now()
);

create table if not exists profiles (                    -- 1:1 with auth.users
  id              uuid primary key references auth.users(id) on delete cascade,
  institution_id  uuid references institutions(id),
  role            text not null check (role in ('student','teacher','parent','admin','recruiter')),
  display_name    text,
  class_level     text,                                    -- e.g. 'HSC', 'Dakhil', 'Diploma'
  pseudonym       text unique,                             -- HMAC(student_id, tenant salt) for analytics
  preferred_lang  text default 'bn' check (preferred_lang in ('bn','en')),
  date_of_birth   date,                                    -- drives guardian-consent requirement
  created_at      timestamptz default now()
);

create table if not exists guardianships (
  guardian_id uuid references profiles(id) on delete cascade,
  student_id  uuid references profiles(id) on delete cascade,
  primary key (guardian_id, student_id)
);

create table if not exists enrolments (
  teacher_id uuid references profiles(id) on delete cascade,
  student_id uuid references profiles(id) on delete cascade,
  subject    text,
  primary key (teacher_id, student_id, subject)
);

create table if not exists consents (                    -- PDPO 2025 / GDPR Art. 8 / COPPA
  id          uuid primary key default gen_random_uuid(),
  subject_id  uuid references profiles(id) on delete cascade,
  granted_by  uuid references profiles(id),               -- guardian for minors
  purpose     text not null check (purpose in ('learning','analytics','talent_sharing','research_pilot','sms')),
  granted     boolean not null,
  at          timestamptz default now()
);

-- ---------- Curriculum & retrieval ----------
create table if not exists curriculum_documents (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  publisher   text not null,                               -- NCTB | OpenStax | O*NET
  edition     text,
  language    text check (language in ('bn','en','bn-en')),
  licence     text not null,
  source_url  text,
  sha256      char(64) not null,
  status      text default 'indexed' check (status in ('licence-pending','indexed','retired')),
  ingested_at timestamptz default now()
);

create table if not exists curriculum_chunks (
  id          bigint generated always as identity primary key,
  document_id uuid references curriculum_documents(id) on delete cascade,
  chunk_id    text unique,
  subject     text,
  ref         text,
  content_bn  text,
  content_en  text,
  tokens      int,
  embedding   vector(1024),
  tsv         tsvector generated always as (to_tsvector('simple', coalesce(content_en,'') || ' ' || coalesce(content_bn,''))) stored,
  metadata    jsonb default '{}'
);
create index if not exists chunks_vec on curriculum_chunks using hnsw (embedding vector_cosine_ops);
create index if not exists chunks_tsv on curriculum_chunks using gin (tsv);

create or replace function match_chunks(q_embedding vector(1024), q_text text, q_subject text, k int default 5)
returns table (chunk_id text, ref text, score real)
language sql stable as $$
  with v as (select c.chunk_id, c.ref, row_number() over (order by c.embedding <=> q_embedding) r
             from curriculum_chunks c where c.subject = q_subject
             order by c.embedding <=> q_embedding limit 20),
       l as (select c.chunk_id, c.ref, row_number() over (order by ts_rank(c.tsv, plainto_tsquery('simple', q_text)) desc) r
             from curriculum_chunks c where c.subject = q_subject and c.tsv @@ plainto_tsquery('simple', q_text) limit 20)
  select coalesce(v.chunk_id, l.chunk_id), coalesce(v.ref, l.ref),
         (coalesce(1.0/(60+v.r),0) + coalesce(1.0/(60+l.r),0))::real
  from v full outer join l using (chunk_id)
  order by 3 desc limit k;
$$;

-- ---------- Knowledge graph: concept → skill → occupation ----------
create table if not exists kg_nodes (id text primary key, kind text check (kind in ('concept','skill','occupation')), label_en text, label_bn text, onet_code text);
create table if not exists kg_edges (src text references kg_nodes(id), dst text references kg_nodes(id), rel text, weight real default 1, primary key (src, dst, rel));

-- ---------- Learning, game & credentials ----------
create table if not exists progress (
  user_id   uuid references profiles(id) on delete cascade,
  subject   text,
  part      text check (part in ('p1','p2','p3','p4')),
  pct       int check (pct between 0 and 100),
  updated_at timestamptz default now(),
  primary key (user_id, subject, part)
);
create table if not exists mastery (
  user_id uuid references profiles(id) on delete cascade,
  tier    text check (tier in ('remember','understand','apply','analyze','evaluate','create')),
  value   int check (value between 0 and 100),
  primary key (user_id, tier)
);
create table if not exists game_state (
  user_id uuid primary key references profiles(id) on delete cascade,
  xp int default 0, streak int default 0, gems int default 0, best_combo int default 0,
  badges jsonb default '[]'
);
create table if not exists chat_turns (                   -- redacted text only, 30-day TTL
  id bigint generated always as identity primary key,
  user_id uuid references profiles(id) on delete cascade,
  subject text, mode text, role text check (role in ('learner','tutor')),
  content text, grounding real, sources text[], created_at timestamptz default now()
);
create table if not exists skill_passports (
  id text primary key, holder_id uuid references profiles(id) on delete cascade,
  skill text, level text, onet_code text, evidence jsonb, issued date default current_date,
  sha256 char(64), signature text                          -- Ed25519 (W3C VC 2.0) in production
);

-- ---------- Governance ----------
create table if not exists audit_log (                    -- append-only, hash-chained
  id bigint generated always as identity primary key,
  at timestamptz default now(), actor uuid, role text, action text not null, detail text,
  prev_hash char(64), hash char(64)
);
create or replace function audit_chain() returns trigger language plpgsql as $$
begin
  select hash into new.prev_hash from audit_log order by id desc limit 1;
  new.hash := encode(digest(coalesce(new.prev_hash,'') || new.at::text || coalesce(new.actor::text,'') || new.action || coalesce(new.detail,''), 'sha256'), 'hex');
  return new;
end $$;
drop trigger if exists audit_chain_t on audit_log;
create trigger audit_chain_t before insert on audit_log for each row execute function audit_chain();
revoke update, delete on audit_log from authenticated, anon;

-- ---------- Row-level security ----------
alter table profiles        enable row level security;
alter table progress        enable row level security;
alter table mastery         enable row level security;
alter table game_state      enable row level security;
alter table chat_turns      enable row level security;
alter table skill_passports enable row level security;
alter table consents        enable row level security;

create or replace function my_role() returns text language sql stable as $$ select role from profiles where id = auth.uid() $$;

create policy own_profile on profiles for select using (id = auth.uid());
create policy own_progress on progress for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy teacher_progress on progress for select using (exists (select 1 from enrolments e where e.student_id = progress.user_id and e.teacher_id = auth.uid()));
create policy guardian_progress on progress for select using (exists (select 1 from guardianships g where g.student_id = progress.user_id and g.guardian_id = auth.uid()));
create policy own_mastery on mastery for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy own_game on game_state for all using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy own_chat on chat_turns for select using (user_id = auth.uid());
create policy own_passports on skill_passports for select using (holder_id = auth.uid());
-- Recruiters only see passports whose holder has an active talent_sharing consent
create policy recruiter_passports on skill_passports for select using (
  my_role() = 'recruiter' and exists (select 1 from consents c where c.subject_id = skill_passports.holder_id and c.purpose = 'talent_sharing' and c.granted)
);
create policy own_consents on consents for select using (subject_id = auth.uid() or granted_by = auth.uid());

-- Retention job (schedule with pg_cron): delete chat turns older than 30 days
-- select cron.schedule('dishari-chat-ttl', '15 3 * * *', $$delete from chat_turns where created_at < now() - interval '30 days'$$);

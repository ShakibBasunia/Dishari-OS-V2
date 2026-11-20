/* Dishari OS, /data : data architecture, lineage, vector schema, knowledge graph, PII flow */
(function () {
  'use strict';
  const D = window.D;
  const { T, esc } = D;
  const tx = D.tx;

  const SOURCES = [
    ['NCTB textbooks (Class 6–12, Bangla & English versions)', 'PDF (Bangla Unicode + legacy fonts)', T('Licence/MoU with NCTB required', 'NCTB-এর সাথে লাইসেন্স/সমঝোতা প্রয়োজন'), T('Each academic year', 'প্রতি শিক্ষাবর্ষ'), 'Curriculum'],
    ['OpenStax (Biology 2e, Chemistry 2e, College Physics 2e, Calculus, Python)', 'HTML / CNXML', 'CC BY 4.0', T('Per edition', 'প্রতি সংস্করণ'), 'Curriculum'],
    ['O*NET 28 Database + Web Services', 'TSV / REST API', 'CC BY 4.0 (USDOL/ETA)', T('Quarterly', 'ত্রৈমাসিক'), 'Labour market'],
    ['BBS Labour Force Survey · BANBEIS statistics', 'PDF / XLSX', T('Public government data', 'সরকারি উন্মুক্ত তথ্য'), T('Annual', 'বার্ষিক'), 'Context'],
    ['Teacher-authored items & misconception tags', 'Dishari CMS', T('Owned by schools; licensed to Dishari', 'প্রতিষ্ঠানের মালিকানাধীন'), T('Continuous', 'চলমান'), 'Pedagogy'],
    ['Learner interaction events', 'App events (pseudonymous)', T('Owned by learner/guardian (PDPO 2025)', 'শিক্ষার্থী/অভিভাবকের মালিকানা'), T('Real-time', 'রিয়েল-টাইম'), 'Personal']
  ];
  const SQL = `-- Supabase / Postgres 16 + pgvector (extends the NextEdu prototype schema)
create extension if not exists vector;

create table curriculum_documents (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,             -- e.g. 'NCTB HSC Biology 1st Paper'
  publisher    text not null,             -- NCTB | OpenStax | O*NET
  edition      text,
  language     text check (language in ('bn','en','bn-en')),
  licence      text not null,             -- CC BY 4.0 | NCTB MoU ...
  source_url   text,
  sha256       char(64) not null,         -- lineage: hash of the ingested file
  ingested_at  timestamptz default now()
);

create table curriculum_chunks (
  id           bigint generated always as identity primary key,
  document_id  uuid references curriculum_documents(id) on delete cascade,
  chunk_id     text unique,               -- 'bio-01'
  subject      text,                      -- math | eq | bio | chem | ict
  ref          text,                      -- chapter / section / page
  content_bn   text,
  content_en   text,
  tokens       int,
  embedding    vector(1024),              -- multilingual-e5-large / bge-m3
  tsv          tsvector,                  -- BM25-style lexical leg (hybrid search)
  metadata     jsonb default '{}'
);
create index on curriculum_chunks using hnsw (embedding vector_cosine_ops);
create index on curriculum_chunks using gin (tsv);

-- Concept → Skill → Occupation knowledge graph (property-graph tables)
create table kg_nodes (id text primary key, kind text check (kind in ('concept','skill','occupation')), label_en text, label_bn text, onet_code text);
create table kg_edges (src text references kg_nodes, dst text references kg_nodes, rel text, weight real, primary key (src, dst, rel));

-- Hybrid retrieval: reciprocal-rank fusion of vector + lexical results
create or replace function match_chunks(q_embedding vector(1024), q_text text, q_subject text, k int default 5)
returns table (chunk_id text, ref text, score real) language sql stable as $$
  with v as (select chunk_id, ref, row_number() over (order by embedding <=> q_embedding) r
             from curriculum_chunks where subject = q_subject order by embedding <=> q_embedding limit 20),
       l as (select chunk_id, ref, row_number() over (order by ts_rank(tsv, plainto_tsquery(q_text)) desc) r
             from curriculum_chunks where subject = q_subject and tsv @@ plainto_tsquery(q_text) limit 20)
  select coalesce(v.chunk_id, l.chunk_id), coalesce(v.ref, l.ref),
         (coalesce(1.0/(60+v.r),0) + coalesce(1.0/(60+l.r),0))::real
  from v full outer join l using (chunk_id) order by 3 desc limit k;
$$;`;

  // Knowledge graph (subset), concepts → skills → occupations
  const KG = {
    concepts: [['c-cell', { en: 'Cell organelles', bn: 'কোষ অঙ্গাণু' }], ['c-immune', { en: 'Immune response', bn: 'রোগপ্রতিরোধ' }], ['c-titr', { en: 'Titration & molarity', bn: 'টাইট্রেশন' }], ['c-int', { en: 'Integration', bn: 'যোগজীকরণ' }], ['c-quad', { en: 'Quadratics', bn: 'দ্বিঘাত' }], ['c-loop', { en: 'Loops & logic', bn: 'লুপ ও লজিক' }]],
    skills: [['s-bio', 'BIOINF-101'], ['s-py', 'PYDATA-101'], ['s-env', 'ENVCHEM-101'], ['s-fin', 'FINQ-101']],
    jobs: [['j-bioinf', '19-1029.01', { en: 'Bioinformatics Scientist', bn: 'বায়োইনফরমেটিক্স' }], ['j-data', '15-2051.00', { en: 'Data Scientist', bn: 'ডেটা সায়েন্টিস্ট' }], ['j-env', '19-2041.00', { en: 'Environmental Scientist', bn: 'পরিবেশ বিজ্ঞানী' }], ['j-quant', '13-2099.01', { en: 'FinTech Quant', bn: 'ফিনটেক কোয়ান্ট' }], ['j-biomed', '17-2031.00', { en: 'Biomedical Engineer', bn: 'বায়োমেডিকেল' }]],
    edges: [['c-cell', 's-bio'], ['c-immune', 's-bio'], ['c-loop', 's-bio'], ['c-loop', 's-py'], ['c-int', 's-py'], ['c-titr', 's-env'], ['c-quad', 's-fin'], ['c-int', 's-fin'], ['s-bio', 'j-bioinf'], ['s-bio', 'j-biomed'], ['s-py', 'j-data'], ['s-py', 'j-biomed'], ['s-env', 'j-env'], ['s-fin', 'j-quant'], ['s-py', 'j-quant']]
  };

  D.page('data', {
    title: { en: 'Data architecture', bn: 'ডেটা আর্কিটেকচার' },
    render(el) {
      let sel = null;
      el.innerHTML = `
        ${D.sectionHead(T('Data architecture & lineage', 'ডেটা আর্কিটেকচার ও লিনিয়েজ'), '' + T('From textbooks & labour data to a skills knowledge graph', 'পাঠ্যবই ও শ্রমবাজার থেকে দক্ষতার নলেজ গ্রাফ'), T('Every answer the tutor gives can be traced back to a licensed source, a hashed document version and a chunk id.', 'টিউটরের প্রতিটি উত্তর লাইসেন্সকৃত উৎস, হ্যাশকৃত সংস্করণ ও অংশ-আইডিতে ফিরিয়ে দেখা যায়।'))}
        <div class="card"><div class="card-head"><h3>${T('Ingestion pipeline', 'ইনজেশন পাইপলাইন')}</h3></div>
          <div class="flow">
            <div class="node"><b>① ${T('Sources', 'উৎস')}</b><span>NCTB · OpenStax · O*NET API · BBS/BANBEIS</span></div><div class="arrow">→</div>
            <div class="node"><b>② ${T('Extract & clean', 'নিষ্কাশন ও পরিচ্ছন্নতা')}</b><span>${T('Bangla OCR (Tesseract ben), legacy-font → Unicode, NFC normalisation, SHA-256 per file', 'বাংলা OCR, ইউনিকোড রূপান্তর, SHA-256')}</span></div><div class="arrow">→</div>
            <div class="node"><b>③ ${T('Chunk', 'খণ্ডকরণ')}</b><span>${T('Heading-aware, ~512 tokens, 64 overlap; keeps chapter/section/page refs', 'শিরোনাম-সচেতন, ~৫১২ টোকেন')}</span></div><div class="arrow">→</div>
            <div class="node"><b>④ ${T('Embed + index', 'এমবেড ও ইনডেক্স')}</b><span>multilingual-e5-large · pgvector HNSW + tsvector (hybrid)</span></div><div class="arrow">→</div>
            <div class="node"><b>⑤ ${T('Knowledge graph', 'নলেজ গ্রাফ')}</b><span>${T('Concept → Skill → Occupation (O*NET codes)', 'ধারণা → দক্ষতা → পেশা')}</span></div><div class="arrow">→</div>
            <div class="node"><b>⑥ ${T('Serve', 'পরিবেশন')}</b><span>${T('match_chunks() RPC → Pedagogy & Career agents, cited', 'match_chunks() → এজেন্ট, সাইটেশনসহ')}</span></div>
          </div>
          <p class="small muted" style="margin-top:10px">${T('This demo runs steps ③ and ⑥ live in your browser (BM25 over the bundled corpus); the hosted pipeline adds ② and ④ on Supabase.', 'এই ডেমো ব্রাউজারে ③ ও ⑥ সরাসরি চালায়; হোস্টেড পাইপলাইনে ② ও ④ যুক্ত হয়।')}</p></div>

        <div class="card" style="margin-top:16px"><div class="card-head"><h3>${T('Data sources, licences & refresh', 'ডেটা উৎস, লাইসেন্স ও হালনাগাদ')}</h3></div>
          <div class="table-wrap"><table class="t"><thead><tr><th>${T('Source', 'উৎস')}</th><th>${T('Format', 'ফরম্যাট')}</th><th>${T('Licence / ownership', 'লাইসেন্স / মালিকানা')}</th><th>${T('Refresh', 'হালনাগাদ')}</th><th>${T('Class', 'শ্রেণি')}</th></tr></thead><tbody>${SOURCES.map((r) => `<tr><td><b>${esc(r[0])}</b></td><td class="small">${esc(r[1])}</td><td class="small">${esc(r[2])}</td><td class="small">${esc(r[3])}</td><td><span class="chip ${r[4] === 'Personal' ? 'danger' : ''}">${esc(r[4])}</span></td></tr>`).join('')}</tbody></table></div></div>

        <div class="bento" style="margin-top:16px">
          <div class="card s7"><div class="card-head"><h3>${T('Concept → Skill → Job knowledge graph', 'ধারণা → দক্ষতা → পেশা নলেজ গ্রাফ')}</h3><span class="small muted">${T('Click a node', 'নোডে ক্লিক করো')}</span></div><div id="kg"></div></div>
          <div class="card s5"><div class="card-head"><h3>${T('Lineage of a single answer', 'একটি উত্তরের লিনিয়েজ')}</h3></div>
            <ol class="small" style="padding-left:18px;line-height:1.9;margin:0">
              <li>${T('Learner asks: "Why do muscle cells have many mitochondria?"', 'শিক্ষার্থী জিজ্ঞেস করে: "পেশিকোষে কেন বেশি মাইটোকন্ড্রিয়া?"')}</li>
              <li>${T('Redacted query → retriever → chunk', 'মুছে ফেলা প্রশ্ন → রিট্রিভার → অংশ')} <code>bio-03</code> (${T('confidence', 'আস্থা')} ${(() => { const r = D.RAG.retrieve(D.kbIndex(), 'why do muscle cells have many mitochondria', { subject: 'bio', k: 1 })[0]; return r ? r.confidence.toFixed(2) : '-'; })()})</li>
              <li><code>bio-03</code> → ${T('document', 'নথি')} <i>OpenStax Biology 2e</i>, ${T('Ch. 7', 'অধ্যায় ৭')} → ${T('licence', 'লাইসেন্স')} CC BY 4.0 → ${T('file hash', 'ফাইল হ্যাশ')} <code>sha256:…</code></li>
              <li>${T('Pedagogy policy + mode → reply → grounding score → audit event', 'শিক্ষণ নীতি + মোড → উত্তর → গ্রাউন্ডিং → অডিট ইভেন্ট')} <code>tutor.turn</code></li>
            </ol>
            <hr><h4>${T('Data models (core)', 'ডেটা মডেল')}</h4>
            <div class="small mono" style="line-height:1.9">profiles · progress · quiz_attempts · chat_history (30-day TTL) · curriculum_documents · curriculum_chunks · kg_nodes · kg_edges · skill_passports · consents · audit_log</div></div>
        </div>

        <div class="card" style="margin-top:16px"><div class="card-head"><h3>${T('PII anonymisation flow', 'PII বেনামিকরণ প্রবাহ')}</h3></div>
          <div class="flow">
            <div class="node"><b>${T('Device', 'ডিভাইস')}</b><span>${T('Typed text, voice, photos', 'লেখা, ভয়েস, ছবি')}</span></div><div class="arrow">→</div>
            <div class="node"><b>${T('Edge redaction', 'এজ রিড্যাকশন')}</b><span>${T('Names, phones, NID, emails, addresses masked before leaving the request', 'নাম, ফোন, NID, ইমেইল, ঠিকানা মুছে ফেলা')}</span></div><div class="arrow">→</div>
            <div class="node"><b>${T('Pseudonymise', 'ছদ্মনামকরণ')}</b><span>HMAC-SHA256(student_id, ${T('per-tenant salt', 'প্রতিষ্ঠানভিত্তিক সল্ট')}): ${T('key in KMS', 'চাবি KMS-এ')}</span></div><div class="arrow">→</div>
            <div class="node"><b>${T('Minimise & expire', 'ন্যূনতম ও মেয়াদ')}</b><span>${T('Chat logs 30 days; events 12 months; photos not stored', 'চ্যাট ৩০ দিন; ইভেন্ট ১২ মাস; ছবি সংরক্ষিত নয়')}</span></div><div class="arrow">→</div>
            <div class="node"><b>${T('Aggregate', 'সমষ্টিকরণ')}</b><span>${T('k-anonymity ≥ 10 for dashboards; recruiters see passports only with consent', 'ড্যাশবোর্ডে k ≥ ১০; সম্মতিতে পাসপোর্ট')}</span></div>
          </div>
          <form id="pii" class="row nowrap" style="gap:8px;margin-top:12px"><input type="text" id="pii-in" value="আমার নাম আউরিন জাহান, ফোন 01812345678, NID 1987654321"><button class="btn primary">${T('Redact', 'মুছে ফেলো')}</button></form><div id="pii-out" class="feedback" style="font-family:ui-monospace,monospace"></div></div>

        <div class="bento" style="margin-top:16px">
          <div class="card s7"><div class="card-head"><h3>${T('Vector & graph schema (Supabase / pgvector)', 'ভেক্টর ও গ্রাফ স্কিমা')}</h3><span class="small muted">supabase/schema.sql</span></div><pre style="max-height:420px">${esc(SQL)}</pre></div>
          <div class="card s5"><div class="card-head"><h3>${T('Chunk explorer (live corpus)', 'অংশ অনুসন্ধান (লাইভ)')}</h3>${D.liveTag()}</div><input type="search" id="cx" placeholder="${T('Filter chunks…', 'অংশ খোঁজো…')}"><div id="cx-out" style="margin-top:10px;max-height:380px;overflow:auto"></div></div>
        </div>`;

      const drawKG = () => {
        const W = 640, H = 330;
        const col = (arr, x) => arr.map((n, i) => ({ id: n[0], x, y: 30 + (i * (H - 60)) / Math.max(1, arr.length - 1) }));
        const P = {};
        col(KG.concepts, 80).forEach((p) => (P[p.id] = p)); col(KG.skills, 320).forEach((p) => (P[p.id] = p)); col(KG.jobs, 548).forEach((p) => (P[p.id] = p));
        const lit = new Set();
        if (sel) { lit.add(sel); let frontier = [sel]; for (let k = 0; k < 2; k++) { const nx = []; KG.edges.forEach(([a, b]) => { if (frontier.includes(a)) { lit.add(b); nx.push(b); } if (frontier.includes(b)) { lit.add(a); nx.push(a); } }); frontier = nx; } }
        const label = (id) => { const c = KG.concepts.find((x) => x[0] === id); if (c) return tx(c[1]); const s = KG.skills.find((x) => x[0] === id); if (s) return s[1]; const j = KG.jobs.find((x) => x[0] === id); return tx(j[2]) + ' · ' + j[1]; };
        let g = KG.edges.map(([a, b]) => `<path d="M${P[a].x + 70} ${P[a].y} C ${(P[a].x + P[b].x) / 2 + 30} ${P[a].y}, ${(P[a].x + P[b].x) / 2 - 30} ${P[b].y}, ${P[b].x - 70} ${P[b].y}" style="fill:none;stroke:${sel && lit.has(a) && lit.has(b) ? 'var(--em)' : 'var(--line2)'};stroke-width:${sel && lit.has(a) && lit.has(b) ? 2.5 : 1.2}"/>`).join('');
        g += Object.values(P).map((p) => { const kind = p.id[0]; const on = !sel || lit.has(p.id); return `<g data-node="${p.id}" style="cursor:pointer;opacity:${on ? 1 : 0.3}"><rect x="${p.x - 70}" y="${p.y - 14}" width="140" height="28" rx="14" style="fill:${kind === 'c' ? 'var(--card2)' : kind === 's' ? 'var(--gold-soft)' : 'var(--em-soft)'};stroke:${kind === 'c' ? 'var(--line2)' : kind === 's' ? 'var(--gold)' : 'var(--em)'}"/><text x="${p.x}" y="${p.y + 4}" text-anchor="middle" style="font-size:10.5px;font-weight:700;fill:var(--text)">${esc(label(p.id)).slice(0, 26)}</text></g>`; }).join('');
        g += `<text x="80" y="${H - 4}" text-anchor="middle">${T('Concepts', 'ধারণা')}</text><text x="320" y="${H - 4}" text-anchor="middle">${T('Skills', 'দক্ষতা')}</text><text x="548" y="${H - 4}" text-anchor="middle">${T('Occupations (O*NET)', 'পেশা (O*NET)')}</text>`;
        D.$('#kg').innerHTML = `<svg class="chart" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Knowledge graph">${g}</svg>`;
        D.$$('[data-node]').forEach((n) => (n.onclick = () => { sel = sel === n.dataset.node ? null : n.dataset.node; drawKG(); }));
      };
      drawKG();
      const pii = () => { const r = D.RAG.redact(D.$('#pii-in').value); D.$('#pii-out').textContent = r.text + '   ← ' + (r.found.join(', ') || 'none'); };
      D.$('#pii').onsubmit = (e) => { e.preventDefault(); pii(); };
      pii();
      const cx = () => {
        const q = D.$('#cx').value.toLowerCase();
        const all = D.KB.concat(D.state.kbExtra || []).filter((c) => !q || (c.id + c.src + c.ref + c.en + c.bn).toLowerCase().includes(q));
        D.$('#cx-out').innerHTML = all.map((c) => `<div style="padding:8px 0;border-bottom:1px dashed var(--line)"><div class="row between small"><code>${esc(c.id)}</code><span class="muted">${D.RAG.tokens(c.en + ' ' + c.bn).length} ${T('tokens', 'টোকেন')}</span></div><div class="small"><b>${esc(c.src)}</b>: ${esc(c.ref)}</div><div class="small muted">${esc(c.lic)}</div></div>`).join('');
      };
      D.$('#cx').oninput = cx;
      cx();
    }
  });
})();

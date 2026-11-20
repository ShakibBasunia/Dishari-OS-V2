/* Dishari OS, /architecture : interactive system, AI & multi-agent blueprint */
(function () {
  'use strict';
  const D = window.D;
  const { T, esc } = D;
  const tx = D.tx;

  const LAYERS = [
    { id: 'client', t: { en: 'Client layer', bn: 'ক্লায়েন্ট স্তর' }, items: { en: 'Web PWA · Android (low-end) · Bangla voice · 2G Lite · offline cache', bn: 'ওয়েব PWA · অ্যান্ড্রয়েড · বাংলা ভয়েস · ২জি লাইট' }, d: { en: 'Zero-dependency SPA (~100 KB gzipped JS+CSS), service-worker offline cache, speech synthesis/recognition, 2G Lite mode that drops web fonts and animation. The offline policy engine runs entirely on-device so learning continues without a connection.', bn: 'শূন্য-নির্ভরতা SPA, অফলাইন ক্যাশ, স্পিচ, ২জি লাইট। অফলাইন নীতি ইঞ্জিন ডিভাইসেই চলে।' }, code: 'index.html · assets/js/core/* · sw.js' },
    { id: 'gateway', t: { en: 'API gateway & auth', bn: 'API গেটওয়ে ও প্রমাণীকরণ' }, items: { en: 'Vercel Edge · Supabase Auth (OTP, MFA) · rate limits · WAF · CSP', bn: 'ভার্সেল এজ · সুপাবেস অথ · রেট লিমিট' }, d: { en: 'Serverless functions terminate TLS, verify JWTs, apply per-user rate limits (e.g. 30 tutor turns/min) and keep model API keys server-side only.', bn: 'সার্ভারলেস ফাংশন JWT যাচাই, রেট লিমিট ও API কী সার্ভারে রাখে।' }, code: 'api/tutor.js · api/autopsy.js · vercel.json' },
    { id: 'orch', t: { en: 'Multi-agent orchestrator (MCP)', bn: 'মাল্টি-এজেন্ট অর্কেস্ট্রেটর (MCP)' }, items: { en: 'Router → specialised agents, each with an allow-listed MCP toolset', bn: 'রাউটার → বিশেষায়িত এজেন্ট, প্রতিটির নির্দিষ্ট টুল' }, d: { en: 'A lightweight router classifies each request and dispatches to one agent. Agents call tools only through Model Context Protocol servers with explicit allow-lists (least agency). Deterministic pedagogy policies decide what to do; LLMs verbalise.', bn: 'রাউটার অনুরোধ শ্রেণিবদ্ধ করে এজেন্টে পাঠায়; এজেন্ট শুধু MCP টুল ব্যবহার করে।' }, code: 'assets/js/engine/tutor.js (policy engine)' },
    { id: 'know', t: { en: 'Hybrid knowledge layer', bn: 'হাইব্রিড নলেজ স্তর' }, items: { en: 'Supabase Postgres · pgvector (HNSW) · tsvector · concept→skill→job graph · object storage', bn: 'পোস্টগ্রেস · pgvector · নলেজ গ্রাফ' }, d: { en: 'Hybrid retrieval fuses dense multilingual embeddings with lexical BM25 (reciprocal-rank fusion). The knowledge graph links NCTB concepts to skills and O*NET occupations for the Career Graph Agent.', bn: 'ঘন এমবেডিং ও BM25 মিলিয়ে রিট্রিভাল; নলেজ গ্রাফ ধারণা থেকে পেশায় যুক্ত করে।' }, code: 'assets/js/engine/rag.js · supabase/schema.sql' },
    { id: 'guard', t: { en: 'Responsible-AI guardrails (cross-cutting)', bn: 'দায়িত্বশীল-AI গার্ডরেইল' }, items: { en: 'PII redaction · injection filter · safety router · grounding threshold · LLM-judge · audit log', bn: 'PII · ইনজেকশন · নিরাপত্তা · গ্রাউন্ডিং · অডিট' }, d: { en: 'Every request passes the same pipeline before and after any model call; low-confidence retrieval makes the tutor abstain rather than guess; all decisions are written to the audit trail.', bn: 'প্রতিটি অনুরোধ একই পাইপলাইন দিয়ে যায়; কম আস্থায় টিউটর বিরত থাকে।' }, code: 'assets/js/engine/rag.js · api/tutor.js' }
  ];
  const AGENTS = [
    { id: 'ped', n: { en: 'Pedagogy Agent', bn: 'পেডাগজি এজেন্ট' }, tools: ['curriculum.search', 'learner.mastery.read', 'learner.mastery.update'], d: { en: 'Runs Socratic, Bloom, Feynman and ZPD-scaffolding policies; tracks mastery; produces the explanation trace.', bn: 'চারটি শিক্ষণ নীতি চালায়; দক্ষতা ট্র্যাক করে।' }, model: 'Policy engine + mid-size LLM (verbaliser)' },
    { id: 'gm', n: { en: 'Game Master Agent', bn: 'গেম মাস্টার এজেন্ট' }, tools: ['quest.state', 'xp.award', 'leaderboard.update'], d: { en: 'Adaptive practice (Rasch θ), boss-battle scenarios, combo multipliers, co-op leagues.', bn: 'অ্যাডাপটিভ অনুশীলন, বস ব্যাটল, কম্বো, কো-অপ।' }, model: 'Rules + small LLM for scenario variation' },
    { id: 'vis', n: { en: 'Vision Autopsy Agent', bn: 'ভিশন অটোপসি এজেন্ট' }, tools: ['image.ocr', 'curriculum.search', 'drill.generate'], d: { en: 'Reads handwritten work, finds the first incorrect line, names the misconception and prescribes 3 drills.', bn: 'হাতের লেখা পড়ে প্রথম ভুল লাইন খুঁজে ৩টি অনুশীলন দেয়।' }, model: 'Vision-capable LLM (cloud only)' },
    { id: 'cop', n: { en: 'Teacher Co-Pilot Agent', bn: 'শিক্ষক কো-পাইলট এজেন্ট' }, tools: ['itembank.template', 'class.analytics.read', 'sms.queue'], d: { en: 'Generates NCTB-format CQs/MCQs with answer keys; class misconception heatmaps; Bangla parent snapshots.', bn: 'NCTB ফরম্যাটে প্রশ্ন, হিটম্যাপ, অভিভাবক স্ন্যাপশট।' }, model: 'Templates + LLM paraphrase, teacher approval' },
    { id: 'car', n: { en: 'Career Graph Agent', bn: 'ক্যারিয়ার গ্রাফ এজেন্ট' }, tools: ['kg.traverse', 'onet.lookup', 'passport.issue'], d: { en: 'Maps mastery to O*NET occupations, runs micro-internship vivas, issues and verifies Skill Passports.', bn: 'দক্ষতাকে পেশায় মেলায়, ভাইভা নেয়, পাসপোর্ট দেয়।' }, model: 'Graph traversal + small LLM viva' },
    { id: 'saf', n: { en: 'Guardian (Safety) Agent', bn: 'গার্ডিয়ান (নিরাপত্তা) এজেন্ট' }, tools: ['pii.redact', 'injection.scan', 'audit.write', 'teacher.alert'], d: { en: 'Wraps every agent call: redaction, injection and safety screening, grounding checks, audit events, wellbeing escalation.', bn: 'প্রতিটি কলে রিড্যাকশন, স্ক্রিনিং, অডিট ও সতর্কবার্তা।' }, model: 'Deterministic filters + classifier' }
  ];
  const TRACE = [
    ['client', null, { en: 'Aurin types (Bangla): "পেশিকোষে কেন বেশি মাইটোকন্ড্রিয়া?" on a 2G connection', bn: 'আউরিন ২জি-তে লেখে: "পেশিকোষে কেন বেশি মাইটোকন্ড্রিয়া?"' }],
    ['guard', 'saf', { en: 'Guardian Agent: PII scan (none), injection scan (clean), safety (clean)', bn: 'গার্ডিয়ান: PII নেই, ইনজেকশন নেই, নিরাপদ' }],
    ['gateway', null, { en: 'Edge function verifies JWT, applies rate limit, attaches tenant id', bn: 'এজ ফাংশন JWT যাচাই ও রেট লিমিট' }],
    ['orch', 'ped', { en: 'Router → Pedagogy Agent (mode: Socratic, subject: Biology)', bn: 'রাউটার → পেডাগজি এজেন্ট (সক্রেটিক, জীববিজ্ঞান)' }],
    ['know', 'ped', { en: 'curriculum.search → hybrid retrieval → bio-03, bio-07 (confidence above threshold)', bn: 'রিট্রিভাল → bio-03, bio-07 (সীমার উপরে)' }],
    ['orch', 'ped', { en: 'Socratic policy: give a clue from bio-03, ask a narrower question (no answer dump)', bn: 'সক্রেটিক নীতি: সূত্র দাও, ছোট প্রশ্ন করো' }],
    ['guard', 'saf', { en: 'Grounding check on draft reply; audit event written; mastery +3 (Understand)', bn: 'গ্রাউন্ডিং যাচাই; অডিট; দক্ষতা +৩' }],
    ['client', 'gm', { en: 'Reply + citations streamed back (≈2 KB); Game Master awards XP and combo', bn: 'উত্তর ও সাইটেশন ফেরত; XP ও কম্বো' }]
  ];

  D.page('architecture', {
    title: { en: 'System architecture', bn: 'সিস্টেম আর্কিটেকচার' },
    render(el) {
      let selL = 'orch', selA = 'ped', running = false;
      el.innerHTML = `
        ${D.sectionHead(T('System · AI · Multi-agent architecture', 'সিস্টেম · AI · মাল্টি-এজেন্ট আর্কিটেকচার'), '' + T('Interactive blueprint', 'ইন্টারঅ্যাকটিভ ব্লুপ্রিন্ট'), T('Click any layer or agent for details, or trace a real request end-to-end. Design principle: deterministic pedagogy decides, LLMs only verbalise, so behaviour is auditable and works offline.', 'যেকোনো স্তর বা এজেন্টে ক্লিক করো, বা একটি অনুরোধ শুরু থেকে শেষ পর্যন্ত দেখো।'))}
        <div class="bento">
          <div class="card s7">
            <div class="card-head"><h3>${T('Layered blueprint', 'স্তরভিত্তিক ব্লুপ্রিন্ট')}</h3><button class="btn sm gold" id="trace">${T('Trace a request', 'একটি অনুরোধ ট্রেস করো')}</button></div>
            <div id="bp"></div>
          </div>
          <div class="col s5" style="gap:16px">
            <div class="card" id="detail"></div>
            <div class="card"><div class="card-head"><h3>${T('Request trace', 'অনুরোধ ট্রেস')}</h3></div><div class="log" id="tlog"><div class="muted">${T('Press "Trace a request".', '"ট্রেস করো" চাপো।')}</div></div></div>
          </div>
        </div>
        <div class="bento" style="margin-top:16px">
          <div class="card s6"><div class="card-head"><h3>${T('Technology stack', 'প্রযুক্তি স্ট্যাক')}</h3></div><div class="table-wrap"><table class="t"><tbody>
            ${[[T('Frontend', 'ফ্রন্টএন্ড'), 'Vanilla JS SPA (no build step), SVG charts, Web Speech API, Service Worker'], [T('Edge / API', 'এজ / API'), 'Vercel serverless (Node 20), path routes + static fallbacks'], [T('LLM', 'LLM'), T('Anthropic Claude via Messages API (configurable model; zero-retention); provider-agnostic adapter', 'Anthropic Claude (মডেল পরিবর্তনযোগ্য); প্রদানকারী-নিরপেক্ষ')], [T('Retrieval', 'রিট্রিভাল'), 'BM25 (on-device) + pgvector HNSW + RRF (cloud), multilingual-e5-large'], [T('Database', 'ডেটাবেজ'), 'Supabase Postgres 16, RLS, pgvector, kg tables'], [T('Observability', 'পর্যবেক্ষণ'), T('Audit log, grounding/refusal telemetry, LLM-judge sampling', 'অডিট লগ, টেলিমেট্রি, LLM-judge')], [T('Credentials', 'সনদ'), 'SHA-256 integrity (demo) → Ed25519 W3C Verifiable Credentials (prod)']].map(([a, b]) => `<tr><td><b>${esc(a)}</b></td><td class="small">${esc(b)}</td></tr>`).join('')}
          </tbody></table></div></div>
          <div class="card s6"><div class="card-head"><h3>${T('Scalability plan, to 1M+ learners', 'স্কেল পরিকল্পনা, ১০ লাখ+ শিক্ষার্থী')}</h3></div>
            <ul class="small" style="padding-left:18px;line-height:1.9;margin:0">
              <li>${T('Static assets on a CDN; only tutor turns hit serverless functions', 'স্ট্যাটিক ফাইল CDN-এ; শুধু টিউটর কল সার্ভারে')}</li>
              <li>${T('On-device policy engine handles most turns; LLM verbaliser only when online → lower cost per learner', 'বেশিরভাগ কাজ ডিভাইসে; অনলাইনে LLM → কম খরচ')}</li>
              <li>${T('Model routing: small model for routine turns, larger model for Create-tier feedback & vision', 'মডেল রাউটিং: সাধারণ কাজে ছোট মডেল')}</li>
              <li>${T('Semantic cache for repeated curriculum questions; per-tenant rate limits', 'বারবার প্রশ্নে সিম্যান্টিক ক্যাশ')}</li>
              <li>${T('Read replicas + partitioned event tables; in-country primary for sovereignty', 'রিড রেপ্লিকা; দেশীয় প্রাইমারি')}</li>
              <li>${T('Multi-curriculum: NCTB first, then Cambridge/IB and other South-Asian boards through the same chunk schema', 'NCTB প্রথমে, পরে অন্যান্য বোর্ড')}</li>
            </ul></div>
        </div>`;

      const drawBP = (lit) => {
        lit = lit || {};
        D.$('#bp').innerHTML = LAYERS.map((L, i) => `${i ? '<div class="down">↓</div>' : ''}<div class="layer ${selL === L.id ? 'active' : ''} ${lit.l === L.id ? 'lit' : ''}" data-l="${L.id}" tabindex="0" role="button">
            <div class="lt">${D.n(i + 1)} · ${esc(tx(L.t))}</div><div class="small" style="margin-top:4px">${esc(tx(L.items))}</div>
            ${L.id === 'orch' ? `<div class="agents">${AGENTS.map((a) => `<div class="agent ${selA === a.id ? 'active' : ''} ${lit.a === a.id ? 'lit' : ''}" data-a="${a.id}" tabindex="0" role="button"><b>${esc(tx(a.n))}</b><span class="muted">${a.tools.length} ${T('MCP tools', 'MCP টুল')}</span></div>`).join('')}</div>` : ''}</div>`).join('');
        D.$$('[data-l]').forEach((n) => (n.onclick = (e) => { if (e.target.closest('[data-a]')) return; selL = n.dataset.l; drawBP(); detail(); }));
        D.$$('[data-a]').forEach((n) => (n.onclick = () => { selL = 'orch'; selA = n.dataset.a; drawBP(); detail(true); }));
      };
      const detail = (agent) => {
        const box = D.$('#detail');
        if (agent) {
          const a = AGENTS.find((x) => x.id === selA);
          box.innerHTML = `<div class="eyebrow">${T('Agent', 'এজেন্ট')}</div><h3 style="margin:4px 0 8px">${esc(tx(a.n))}</h3><p class="small">${esc(tx(a.d))}</p><div class="small"><b>${T('MCP tool allow-list', 'MCP টুল অনুমতি-তালিকা')}:</b></div><div class="row" style="gap:5px;margin:6px 0">${a.tools.map((t) => `<code class="chip">${t}</code>`).join('')}</div><div class="small muted">${T('Model', 'মডেল')}: ${esc(a.model)}</div>`;
        } else {
          const L = LAYERS.find((x) => x.id === selL);
          box.innerHTML = `<div class="eyebrow">${T('Layer', 'স্তর')}</div><h3 style="margin:4px 0 8px">${esc(tx(L.t))}</h3><p class="small">${esc(tx(L.d))}</p><div class="small muted">${T('In this repository', 'এই রিপোজিটরিতে')}: <code>${esc(L.code)}</code></div>`;
        }
      };
      drawBP(); detail(true);
      D.$('#trace').onclick = async () => {
        if (running) return;
        running = true;
        const log = D.$('#tlog');
        log.innerHTML = '';
        for (let i = 0; i < TRACE.length; i++) {
          const [l, a, m] = TRACE[i];
          drawBP({ l, a });
          log.insertAdjacentHTML('beforeend', `<div class="pass">[${(i * 0.18 + 0.04).toFixed(2)}s] ${esc(tx(m))}</div>`);
          log.scrollTop = log.scrollHeight;
          await D.sleep(D.state.lite ? 60 : 650);
        }
        log.insertAdjacentHTML('beforeend', `<div class="warn">${T('Done, total ≈1.3 s on 4G, ≈2.6 s on 2G (illustrative)', 'শেষ, ৪জি-তে ≈১.৩ s, ২জি-তে ≈২.৬ s (উদাহরণমূলক)')}</div>`);
        drawBP();
        running = false;
      };
    }
  });
})();

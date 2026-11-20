/* Dishari OS, retrieval & guardrail core (shared by browser and /api/tutor).
   - Bilingual tokenizer (English + Bangla), BM25 retrieval over curriculum chunks
   - Grounding score (share of answer content words supported by retrieved passages)
   - PII redaction, prompt-injection detection, age-appropriate safety routing
   - Gold-set retrieval evaluation used by /admin and /audit */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else { root.D = root.D || {}; root.D.RAG = api; }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  const BN_DIG = '০১২৩৪৫৬৭৮৯';
  const toAsciiDigits = (s) => String(s).replace(/[০-৯]/g, (d) => String(BN_DIG.indexOf(d)));

  const STOP = new Set(('a an the and or of to in on at for from by with is are was were be been being it its this that these those as if then than so such do does did can could would should will shall may might must i you he she we they me my your our their them his her what which who whom whose why how when where there here not no yes into out up down over under again more most some any each every all both few other own same very just also only about above below between through during before after while because until against too s t don nor ' +
    'এবং ও বা যে যা কি কী এই সেই এটি এটা ওটা হয় হলো হল হচ্ছে করে করা করো কর না নয় একটি এক থেকে দিয়ে জন্য মধ্যে উপর নিচে তার তাদের আমার আমি তুমি তোমার আপনি সে তারা আমরা যদি তবে কিন্তু আর বলে হবে ছিল আছে নেই কেন কিভাবে কীভাবে কোন কোথায় কখন').split(/\s+/));

  function stem(w) {
    if (/[ঀ-৿]/.test(w)) return w.replace(/(গুলো|গুলি|টি|টা|কে|রা|ের|র|ে)$/u, '') || w;
    if (w.length > 5 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
    if (w.length > 5 && w.endsWith('ing')) return w.slice(0, -3);
    if (w.length > 4 && w.endsWith('ed')) return w.slice(0, -2);
    if (w.length > 4 && w.endsWith('es')) return w.slice(0, -2);
    if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
    return w;
  }
  function tokens(text) {
    const norm = toAsciiDigits(String(text || '').toLowerCase().normalize('NFC')).replace(/[‌]/g, '');
    return norm.split(/[^\p{L}\p{N}\p{M}]+/u).filter((w) => w && w.length > 1 && !STOP.has(w)).map(stem);
  }

  /* ---------------- Contextual headers, query rewriting, local n-gram vectors ---------------- */
  const SUBJECT = { bio: 'Biology', chem: 'Chemistry', phy: 'Physics', math: 'Mathematics', career: 'Career and skills' };
  function contextHeader(c) {
    return 'Subject: ' + (SUBJECT[c.s] || c.s || 'General') + '. Source: ' + (c.src || '') + '. Reference: ' + (c.ref || '') + '.';
  }
  // Small bilingual rewrite map: everyday phrasing -> curriculum terms (query rewriting before retrieval).
  const REWRITE = {
    powerhouse: 'mitochondria atp energy', পাওয়ারহাউস: 'মাইটোকন্ড্রিয়া', dengue: 'ns1 platelet', ডেঙ্গু: 'ns1 platelet',
    titration: 'indicator concentration', immune: 'antibody lymphocyte', immunity: 'antibody lymphocyte', protection: 'antibody',
    balance: 'coefficient subscript', balancing: 'coefficient subscript', neutralisation: 'acid base salt water', neutralization: 'acid base salt water',
    job: 'occupation skill', career: 'occupation skill', চাকরি: 'পেশা দক্ষতা', ক্যারিয়ার: 'পেশা দক্ষতা'
  };
  function rewrite(query) {
    const toks = String(query || '').toLowerCase().split(/[^\p{L}\p{N}\p{M}]+/u).filter(Boolean);
    const extra = [];
    toks.forEach((t) => { if (REWRITE[t]) extra.push(REWRITE[t]); });
    return extra.length ? query + ' ' + extra.join(' ') : query;
  }
  // Hashed character-trigram vector (512 dims): a cheap local similarity signal that tolerates spelling variants and Bangla suffixes.
  // This is not a neural embedding.
  const DIM = 512;
  function ngramVec(toks) {
    const v = new Float32Array(DIM);
    toks.forEach((t) => {
      const w = '^' + t + '$';
      for (let i = 0; i + 3 <= w.length; i++) {
        let h = 2166136261;
        for (let j = i; j < i + 3; j++) { h ^= w.charCodeAt(j); h = Math.imul(h, 16777619); }
        v[(h >>> 0) % DIM] += 1;
      }
    });
    let n = 0; for (let i = 0; i < DIM; i++) n += v[i] * v[i];
    n = Math.sqrt(n) || 1;
    for (let i = 0; i < DIM; i++) v[i] /= n;
    return v;
  }
  function cosine(a, b) { let s = 0; for (let i = 0; i < DIM; i++) s += a[i] * b[i]; return s; }

  /* ---------------- BM25 index ---------------- */
  function buildIndex(chunks) {
    const docs = chunks.map((c) => {
      // Contextual chunk header: every chunk is indexed together with where it comes from (subject, source, chapter reference).
      const ctx = contextHeader(c);
      const toks = tokens([ctx, c.en, c.bn, c.kw, c.kw].join(' '));
      const tf = new Map();
      toks.forEach((t) => tf.set(t, (tf.get(t) || 0) + 1));
      return { c, tf, len: toks.length, vec: ngramVec(toks) };
    });
    const df = new Map();
    docs.forEach((d) => d.tf.forEach((_, t) => df.set(t, (df.get(t) || 0) + 1)));
    const avg = docs.reduce((a, d) => a + d.len, 0) / Math.max(1, docs.length);
    return { docs, df, avg, N: docs.length };
  }
  function bm25Pass(index, q, opts) {
    const k1 = 1.4, b = 0.75, res = [];
    for (const d of index.docs) {
      if (opts.subject && d.c.s !== opts.subject && !(opts.includeCareer && d.c.s === 'career')) continue;
      let score = 0, hits = 0;
      for (const t of q) {
        const f = d.tf.get(t);
        if (!f) continue;
        hits++;
        const n = index.df.get(t) || 0;
        const idf = Math.log(1 + (index.N - n + 0.5) / (n + 0.5));
        score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.len) / index.avg)));
      }
      if (score > 0) res.push({ chunk: d.c, score, coverage: hits / q.length, _d: d });
    }
    res.sort((x, y) => y.score - x.score);
    return res;
  }
  function retrieve(index, query, opts) {
    opts = opts || {};
    const first = Array.from(new Set(tokens(query)));
    if (!first.length) return [];
    let res = bm25Pass(index, first, opts);
    let rewritten = false;
    // Corrective step: weak first pass -> rewrite the query to curriculum terms and retrieve again.
    if (opts.rewrite !== false && (!res.length || res[0].coverage < 0.5)) {
      const q2 = rewrite(query);
      if (q2 !== query) {
        const second = bm25Pass(index, Array.from(new Set(tokens(q2))), opts);
        if (second.length && (!res.length || second[0].score > res[0].score)) { res = second; rewritten = true; }
      }
    }
    // Hybrid rerank: reciprocal-rank fusion of BM25 order and local n-gram cosine order (candidates stay BM25 hits only,
    // so out-of-scope questions are still declined).
    if (opts.hybrid !== false && res.length > 1) {
      const qv = ngramVec(tokens(rewritten ? rewrite(query) : query));
      const dense = res.map((r) => ({ r, s: cosine(qv, r._d.vec) })).sort((x, y) => y.s - x.s);
      const rank = new Map(dense.map((x, i) => [x.r, i]));
      res.forEach((r, i) => { r.rrf = 1 / (60 + i) + 0.6 / (60 + rank.get(r)); });
      res.sort((x, y) => y.rrf - x.rrf);
    }
    const top = res.slice(0, opts.k || 3);
    top.forEach((r) => {
      r.confidence = +(0.55 * r.coverage + 0.45 * (r.score / (r.score + 6))).toFixed(3);
      if (rewritten) r.rewritten = true;
      delete r._d;
    });
    return top;
  }

  /* ---------------- Grounding ---------------- */
  // Share of the answer's content words that also appear in the retrieved passages.
  function grounding(answer, hits) {
    const a = tokens(answer);
    if (!a.length || !hits || !hits.length) return { score: 0, supported: 0, total: a.length, unsupported: [] };
    const pool = new Set();
    hits.forEach((h) => tokens([h.chunk.en, h.chunk.bn, h.chunk.kw].join(' ')).forEach((t) => pool.add(t)));
    const uniq = Array.from(new Set(a));
    const sup = uniq.filter((t) => pool.has(t) || /^\d+(\.\d+)?$/.test(t));
    return { score: +(sup.length / uniq.length).toFixed(3), supported: sup.length, total: uniq.length, unsupported: uniq.filter((t) => !sup.includes(t)).slice(0, 12) };
  }

  /* ---------------- PII redaction ---------------- */
  const PII = [
    { tag: 'EMAIL', re: /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g },
    { tag: 'PHONE', re: /(?:\+?880[\s-]?1|\b01)[3-9]\d{2}[\s-]?\d{3}[\s-]?\d{3}\b/g },
    { tag: 'NATIONAL-ID', re: /\b(?:\d{17}|\d{13}|\d{10})\b/g },
    { tag: 'NAME', re: /\b(my name is|i am called|this is)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)/g, keep: 1 },
    { tag: 'NAME', re: /(আমার নাম)\s+([ঀ-৿]+(?:\s[ঀ-৿]+)?)/gu, keep: 1 },
    { tag: 'ADDRESS', re: /\b(house|road|holding|বাসা|রোড)\s*(?:no\.?|নং)?\s*[#:]?\s*\d+[A-Za-z]?\b/gi }
  ];
  function redact(text) {
    let out = toAsciiDigits(String(text || ''));
    const found = [];
    PII.forEach((p) => {
      out = out.replace(p.re, (m, g1) => {
        found.push(p.tag);
        return p.keep ? g1 + ' [' + p.tag + ']' : '[' + p.tag + ']';
      });
    });
    return { text: out, found };
  }

  /* ---------------- Prompt-injection detection ---------------- */
  const INJ = [
    [/ignore\s+(all\s+|any\s+|the\s+)?(previous|prior|above|earlier)\s+(instructions|rules|prompts?)/i, 'override-instructions'],
    [/disregard\s+(your|the|all)\s+(rules|instructions|guidelines)/i, 'override-instructions'],
    [/(reveal|show|print|repeat|leak)\s+(me\s+)?(your|the)\s+(system\s+)?(prompt|instructions)/i, 'prompt-exfiltration'],
    [/\b(you are now|act as|pretend to be)\b.{0,40}\b(dan|developer mode|jailbroken|unrestricted|no rules)/i, 'role-hijack'],
    [/\bjailbreak\b|\bdo anything now\b/i, 'jailbreak'],
    [/(give|tell|show)\s+(me\s+)?(the\s+)?(answer key|all answers|exam answers)\s+(without|with no|no)\s+(expla\w*|steps|working)/i, 'academic-integrity'],
    [/<\s*\/?\s*(system|assistant)\s*>|\[\s*system\s*\]/i, 'fake-role-tag'],
    [/(আগের|পূর্বের)\s*(সব\s*)?(নির্দেশ|নির্দেশনা)\s*(উপেক্ষা|ভুলে)/u, 'override-instructions-bn'],
    [/(সিস্টেম\s*প্রম্পট)\s*(দেখাও|বলো)/u, 'prompt-exfiltration-bn']
  ];
  function injection(text) {
    for (const [re, rule] of INJ) if (re.test(text)) return { blocked: true, rule };
    return { blocked: false };
  }

  /* ---------------- Age-appropriate safety routing ---------------- */
  const SAFETY = [
    [/\b(kill myself|suicide|self[- ]?harm|end my life|hurt myself)\b|আত্মহত্যা|নিজেকে আঘাত/iu, 'wellbeing'],
    [/\b(make|build)\b.{0,20}\b(bomb|explosive|weapon|poison)\b/i, 'dangerous'],
    [/\b(porn|sex|nude)\b/i, 'adult']
  ];
  function safety(text) {
    for (const [re, cat] of SAFETY) if (re.test(text)) return { flagged: true, category: cat };
    return { flagged: false };
  }

  /* ---------------- Gold-set retrieval evaluation ---------------- */
  const GOLD = [
    ['Why is the mitochondria called the powerhouse of the cell?', 'bio', ['bio-07', 'bio-01', 'bio-03']],
    ['Which organelle packages proteins into vesicles?', 'bio', ['bio-02']],
    ['Platelet count is low and NS1 is positive, what infection?', 'bio', ['bio-06']],
    ['Which cells produce antibodies?', 'bio', ['bio-05']],
    ['Why do muscle cells have many mitochondria?', 'bio', ['bio-03']],
    ['Can I change the subscript to balance an equation?', 'chem', ['chem-01']],
    ['How do I find the concentration of acid from a titration?', 'chem', ['chem-03']],
    ['Which indicator for strong acid strong base titration?', 'chem', ['chem-04']],
    ['What does HCl and NaOH make?', 'chem', ['chem-02']],
    ['Molar mass of NaOH and mass of 800 mol', 'chem', ['chem-06']],
    ['What is the difference between ionic and covalent bonds?', 'chem', ['chem-05']],
    ['How does a Riemann sum approximate area?', 'math', ['math-01']],
    ['Where is the vertex of a parabola?', 'math', ['math-04']],
    ['Evaluate the integral using an antiderivative F(b) − F(a)', 'math', ['math-03']],
    ['What is the integral of sin x? sign error in integration by parts', 'math', ['math-05']],
    ['Does area below the x-axis count as negative?', 'math', ['math-02']],
    ['How long does a packet dropped from a drone take to fall?', 'eq', ['eq-03']],
    ['What does F = ma mean?', 'eq', ['eq-02', 'eq-04']],
    ['How do I make s the subject of v² = u² + 2as?', 'eq', ['eq-05', 'eq-01']],
    ['Which motion equation has no time in it?', 'eq', ['eq-01']],
    ['What is the weight formula W = mg?', 'eq', ['eq-04']],
    ['Why does range(1, 10) not include 10?', 'ict', ['ict-03']],
    ['XOR gate truth table', 'ict', ['ict-01']],
    ['Python if statement missing colon error', 'ict', ['ict-04']],
    ['What is a primary key in a database?', 'ict', ['ict-06']],
    ['What is a star topology?', 'ict', ['ict-05']],
    ['When should I use a for loop or while loop?', 'ict', ['ict-02']],
    ['কোষের শক্তিঘর কোনটি?', 'bio', ['bio-07', 'bio-01']],
    ['সমীকরণ সমতা করতে পাদাঙ্ক পরিবর্তন করা যায়?', 'chem', ['chem-01']],
    ['লজিক গেট সত্যক সারণি', 'ict', ['ict-01']]
  ];
  function evaluate(index) {
    let hit1 = 0, hit3 = 0;
    const rows = GOLD.map(([q, s, ids]) => {
      const r = retrieve(index, q, { subject: s, k: 3 });
      const top = r[0] ? r[0].chunk.id : '-';
      const h1 = ids.includes(top);
      const h3 = r.some((x) => ids.includes(x.chunk.id));
      if (h1) hit1++;
      if (h3) hit3++;
      return { q, s, expected: ids.join('|'), got: top, h1, h3, conf: r[0] ? r[0].confidence : 0 };
    });
    return { n: GOLD.length, hit1: hit1 / GOLD.length, hit3: hit3 / GOLD.length, rows };
  }
  const OUT_OF_SCOPE = ['Who will win the next football world cup?', 'What is the price of bitcoin today?', 'Write me a love poem about my neighbour'];

  return { tokens, buildIndex, retrieve, grounding, redact, injection, safety, evaluate, GOLD, OUT_OF_SCOPE, toAsciiDigits };
});

/* Dishari OS, Pedagogy Agent (policy engine).
   Deterministic, auditable teaching policies for 4 models; every turn returns an explanation
   trace (guardrails → retrieval → evaluation → policy decision) for the RAG drawer.
   When /api/tutor is configured with an LLM key, the policy engine still decides WHAT to do,
   and the LLM only re-phrases the turn under the same policy and sources ("verbalizer"). */
(function () {
  'use strict';
  const D = window.D;
  const R = D.RAG;
  let INDEX = null;
  D.kbIndex = () => {
    if (!INDEX) INDEX = R.buildIndex(D.KB.concat(D.state.kbExtra || []));
    return INDEX;
  };
  D.reindex = () => { INDEX = null; return D.kbIndex(); };

  /* ---------------- helpers ---------------- */
  const norm = (s) => R.toAsciiDigits(String(s || '')).toLowerCase().normalize('NFC');
  const compact = (s) => norm(s).replace(/\s+/g, '').replace(/[−–]/g, '-').replace(/[×]/g, '*').replace(/²/g, '^2').replace(/³/g, '^3');
  function matchGroups(input, groups) {
    const t = norm(input);
    return groups.every((g) => g.some((k) => t.includes(norm(k))));
  }
  function parseNum(input) {
    const t = norm(input).replace(/,/g, '').replace(/[−–]/g, '-');
    const frac = t.match(/(-?\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
    if (frac) return parseFloat(frac[1]) / parseFloat(frac[2]);
    const m = t.match(/-?\d+(?:\.\d+)?/);
    return m ? parseFloat(m[0]) : NaN;
  }
  D.parseNum = parseNum;
  const isQuestion = (s) => /\?\s*$|^\s*(what|why|how|when|where|which|who|explain|define|tell me|can you|is it true|কী|কি |কেন|কিভাবে|কীভাবে|কোন|ব্যাখ্যা)/i.test(s);
  const tx = (o) => D.tx(o);

  /* ---------------- sessions ---------------- */
  const sessions = {};
  const key = (s, m) => s + ':' + m;
  D.Tutor = {
    session(subject, mode) {
      const k = key(subject, mode);
      if (!sessions[k]) sessions[k] = { subject, mode, step: 0, msgs: [], done: false, covered: new Set(), streak: 0, hintLevel: 1, attempts: 0, bestClarity: 0, lastTrace: null };
      return sessions[k];
    },
    reset(subject, mode) { delete sessions[key(subject, mode)]; },
    opening(subject, mode) {
      let S = this.session(subject, mode);
      // Re-localise an untouched session after a Bangla ↔ English switch
      if (S.msgs.length === 1 && S.lang && S.lang !== D.state.lang) { this.reset(subject, mode); S = this.session(subject, mode); }
      if (S.msgs.length) return S;
      S.lang = D.state.lang;
      const T = D.TUTOR[subject];
      let text;
      if (mode === 'socratic') text = tx({ en: 'Socratic mode: I won\'t hand you answers, I\'ll ask questions so you discover them. Type your thinking in Bangla or English.', bn: 'সক্রেটিক মোড: আমি সরাসরি উত্তর দেব না, প্রশ্ন করব, তুমি আবিষ্কার করবে। বাংলা বা ইংরেজিতে লেখো।' }) + '\n\n' + tx(T.socratic[0].q);
      else if (mode === 'bloom') text = tx({ en: 'Bloom\'s Adaptive Ladder: we climb Remember → Understand → Apply → Analyze → Evaluate → Create. Answer correctly to unlock the next tier.', bn: 'ব্লুম ল্যাডার: স্মরণ → অনুধাবন → প্রয়োগ → বিশ্লেষণ → মূল্যায়ন → সৃষ্টি। সঠিক উত্তরে পরের ধাপ খুলবে।' }) + '\n\n' + tx(D.BLOOM[0][1]) + ': ' + tx(T.bloom[0].q);
      else if (mode === 'feynman') text = tx({ en: 'Feynman mode, roles reversed! I\'m your curious classmate and YOU are the teacher. I\'ll score how clearly you explain (0–100%).', bn: 'ফাইনম্যান মোড, ভূমিকা উল্টো! আমি কৌতূহলী সহপাঠী, তুমি শিক্ষক। তোমার ব্যাখ্যার স্পষ্টতা (০–১০০%) মাপব।' }) + '\n\n' + tx(T.feynman.prompt);
      else text = tx({ en: 'Scaffolding (ZPD) mode: we split the problem into micro-steps. Set your hint level, hints fade automatically as you get steps right.', bn: 'স্ক্যাফোল্ডিং মোড: সমস্যাকে ছোট ধাপে ভাগ করি। হিন্ট লেভেল বেছে নাও, সঠিক ধাপে হিন্ট নিজে কমবে।' }) + '\n\n' + tx(T.scaffold.problem) + '\n\n' + tx(T.scaffold.steps[0].p);
      S.msgs.push({ who: 'ai', text, kind: mode === 'bloom' ? 'bloom' : '', bloomIdx: mode === 'bloom' ? 0 : undefined });
      const trace = this.trace(subject, mode, '', text, { decision: { en: 'Session opened with mode policy', bn: 'মোড নীতি অনুযায়ী সেশন শুরু' } });
      S.lastTrace = trace;
      return S;
    },

    /* Build the explainability trace shown in the RAG drawer */
    trace(subject, mode, input, answer, extra) {
      const sub = D.subject(subject);
      const T = D.TUTOR[subject];
      const S = this.session(subject, mode);
      let citeIds = (extra && extra.cite) || [];
      if (!citeIds.length) {
        if (mode === 'socratic') citeIds = (T.socratic[Math.min(S.step, T.socratic.length - 1)] || {}).cite || [];
        else if (mode === 'bloom') citeIds = (T.bloom[Math.min(S.step, 5)] || {}).cite || [];
        else if (mode === 'feynman') citeIds = T.feynman.cite;
        else citeIds = T.scaffold.cite;
      }
      const q = [input, tx(sub.topic), sub.q].join(' ');
      const hits = R.retrieve(D.kbIndex(), q, { subject, k: 3 });
      // guarantee the policy's cited passages are shown first
      const cited = citeIds.map((id) => D.KB.find((c) => c.id === id)).filter(Boolean).map((c) => ({ chunk: c, score: 0, coverage: 1, confidence: 1, pinned: true }));
      const merged = cited.concat(hits.filter((h) => !citeIds.includes(h.chunk.id))).slice(0, 3);
      // Policy-linked passages come from the curriculum map; report their honest BM25 score for this query.
      const wide = R.retrieve(D.kbIndex(), q, { subject, k: 12 });
      merged.forEach((h) => { if (h.pinned) { const r = wide.find((x) => x.chunk.id === h.chunk.id); h.confidence = r ? r.confidence : null; h.score = r ? r.score : 0; } });
      const g = R.grounding(answer, merged);
      return Object.assign({ subject, mode, input, answer, hits: merged, grounding: g, at: new Date().toISOString(), engine: D.LLM.available ? 'policy+llm' : 'policy' }, extra || {});
    },

    /* Main turn handler */
    async reply(subject, mode, rawInput) {
      const S = this.session(subject, mode);
      const G = D.state.guard;
      const steps = [];
      let input = String(rawInput || '').trim();
      if (!input) return null;

      // 1 · PII redaction
      let red = { text: input, found: [] };
      if (G.pii) { red = R.redact(input); input = red.text; }
      steps.push({ k: 'pii', ok: true, en: G.pii ? (red.found.length ? 'PII redacted before processing: ' + red.found.join(', ') : 'PII scan: none found') : 'PII redaction disabled by admin', bn: G.pii ? (red.found.length ? 'ব্যক্তিগত তথ্য মুছে ফেলা হয়েছে: ' + red.found.join(', ') : 'ব্যক্তিগত তথ্য পাওয়া যায়নি') : 'অ্যাডমিন PII রিড্যাকশন বন্ধ রেখেছেন' });
      S.msgs.push({ who: 'me', text: input });

      // 2 · Prompt-injection guard
      if (G.injection) {
        const inj = R.injection(input);
        if (inj.blocked) {
          const text = tx({ en: 'I can\'t follow instructions that try to change my rules (' + inj.rule + '). I\'m here to help you learn, shall we continue with the question?', bn: 'আমার নিয়ম বদলানোর নির্দেশ মানতে পারব না (' + inj.rule + ')। আমি শেখাতে আছি, প্রশ্নে ফিরি?' });
          steps.push({ k: 'inj', ok: false, en: 'Prompt-injection pattern blocked: ' + inj.rule + ' (logged to audit trail)', bn: 'প্রম্পট-ইনজেকশন আটকানো হয়েছে: ' + inj.rule });
          D.log('guardrail.injection_blocked', inj.rule);
          return this.finish(S, text, steps, { decision: { en: 'Refuse & redirect (guardrail)', bn: 'প্রত্যাখ্যান ও ফেরানো (গার্ডরেইল)' }, guard: 'blocked' });
        }
        steps.push({ k: 'inj', ok: true, en: 'Prompt-injection scan: clean', bn: 'প্রম্পট-ইনজেকশন: পরিষ্কার' });
      }
      // 3 · Age-appropriate safety routing
      if (G.age) {
        const sf = R.safety(input);
        if (sf.flagged) {
          const text = sf.category === 'wellbeing'
            ? tx({ en: 'It sounds like you might be going through something hard. You don\'t have to face it alone, please talk to a trusted adult, teacher or family member now. If you are in danger, call 999 (Bangladesh national emergency). I\'ve also let your teacher know you may need support.', bn: 'মনে হচ্ছে তুমি কঠিন সময় পার করছ। একা নও, এখনই বিশ্বস্ত কোনো বড়, শিক্ষক বা পরিবারের কারও সাথে কথা বলো। বিপদে থাকলে ৯৯৯-এ কল করো। তোমার শিক্ষককেও জানানো হয়েছে।' })
            : tx({ en: 'That\'s outside what I can help with here. Let\'s get back to learning.', bn: 'এ বিষয়ে এখানে সাহায্য করতে পারব না। চলো শেখায় ফিরি।' });
          steps.push({ k: 'safety', ok: false, en: 'Safety router: ' + sf.category + ' → safe response' + (sf.category === 'wellbeing' ? ' + teacher alert' : ''), bn: 'নিরাপত্তা রাউটার: ' + sf.category });
          D.log('guardrail.safety_route', sf.category);
          return this.finish(S, text, steps, { decision: { en: 'Safety response', bn: 'নিরাপত্তা উত্তর' }, guard: 'safety' });
        }
      }

      // 4 · Free questions → grounded answer or refusal (all modes except Feynman, where the learner teaches)
      if (mode !== 'feynman' && isQuestion(input) && !(mode === 'bloom' && S.awaitCreate)) {
        const hits = R.retrieve(D.kbIndex(), input, { subject, k: 3, includeCareer: true });
        const top = hits[0];
        const conf = top ? top.confidence : 0;
        steps.push({ k: 'ret', ok: conf >= G.threshold, en: `Retrieval confidence ${conf.toFixed(2)} vs threshold ${G.threshold.toFixed(2)}`, bn: `রিট্রিভাল আত্মবিশ্বাস ${conf.toFixed(2)} (সীমা ${G.threshold.toFixed(2)})` });
        if (!top || conf < G.threshold) {
          const text = tx({ en: 'I couldn\'t find this in your verified curriculum sources, so I won\'t guess. Try rephrasing, or ask your teacher, I\'ve added it to their question queue.', bn: 'যাচাইকৃত পাঠ্যসূত্রে এটি পাইনি, তাই অনুমান করব না। অন্যভাবে জিজ্ঞেস করো বা শিক্ষককে জিজ্ঞেস করো, তাঁর প্রশ্ন-তালিকায় যোগ করেছি।' });
          D.log('rag.refused_low_confidence', input.slice(0, 80));
          return this.finish(S, text, steps, { decision: { en: 'Abstain: below grounding threshold (no hallucination)', bn: 'বিরত: সীমার নিচে (হ্যালুসিনেশন নয়)' }, cite: [], hitsOverride: hits });
        }
        const passage = tx({ en: top.chunk.en, bn: top.chunk.bn });
        let text;
        if (mode === 'socratic') {
          const first = passage.split(/(?<=[.।])\s/)[0];
          text = tx({ en: 'Good question! I won\'t just tell you, here\'s a clue from ', bn: 'ভালো প্রশ্ন! সরাসরি বলব না, একটি সূত্র দিচ্ছি ' }) + `${top.chunk.src} (${top.chunk.ref}): “${first}”\n\n` + tx({ en: 'What does that suggest? Then back to our question: ', bn: 'এ থেকে কী বোঝা যায়? এবার আমাদের প্রশ্নে ফিরি: ' }) + tx(D.TUTOR[subject].socratic[Math.min(S.step, 3)].q);
          steps.push({ k: 'policy', ok: true, en: 'Socratic policy: give a clue, not the answer', bn: 'সক্রেটিক নীতি: উত্তর নয়, সূত্র দাও' });
        } else {
          text = tx({ en: 'From ', bn: 'উৎস: ' }) + `${top.chunk.src}: ${top.chunk.ref}:\n${passage}`;
          steps.push({ k: 'policy', ok: true, en: 'Answer extracted from top-ranked passage (extractive, cited)', bn: 'শীর্ষ অংশ থেকে উদ্ধৃত উত্তর' });
        }
        return this.finish(S, text, steps, { decision: { en: 'Grounded answer with citation', bn: 'সূত্রসহ উত্তর' }, cite: hits.map((h) => h.chunk.id) });
      }

      // 5 · Mode policy
      const T = D.TUTOR[subject];
      if (mode === 'socratic') return this.socratic(S, T, input, steps);
      if (mode === 'bloom') return this.bloomFree(S, T, input, steps);
      if (mode === 'feynman') return this.feynman(S, T, input, steps);
      return this.scaffold(S, T, input, steps);
    },

    socratic(S, T, input, steps) {
      if (S.done) { S.done = false; S.step = 0; }
      const st = T.socratic[S.step];
      const ok = matchGroups(input, st.keys);
      steps.push({ k: 'eval', ok, en: `Step ${S.step + 1}/${T.socratic.length}: learner answer ${ok ? 'matches' : 'does not yet match'} expected concepts`, bn: `ধাপ ${S.step + 1}: উত্তর ${ok ? 'মিলেছে' : 'এখনও মেলেনি'}` });
      let text;
      if (ok) {
        D.answer(true); D.addXP(15, D.T('Socratic step', 'সক্রেটিক ধাপ')); D.bumpBloom('understand', 3);
        S.step++;
        if (S.step >= T.socratic.length) {
          S.done = true;
          text = tx(st.affirm) + '\n\n' + tx(T.wrap);
          D.addGems(5); D.award('socratic-' + S.subject, { en: 'Socratic Discoverer: ' + D.subject(S.subject).name.en, bn: 'সক্রেটিক আবিষ্কারক: ' + D.subject(S.subject).name.bn }, '');
          steps.push({ k: 'policy', ok: true, en: 'All guided questions answered → summary of what the learner discovered', bn: 'সব প্রশ্নের উত্তর → সারাংশ' });
        } else {
          text = tx(st.affirm) + '\n\n' + tx(T.socratic[S.step].q);
          steps.push({ k: 'policy', ok: true, en: 'Affirm reasoning, advance to the next guiding question (answer never revealed)', bn: 'যুক্তি স্বীকার, পরের প্রশ্নে অগ্রসর' });
        }
      } else {
        D.answer(false);
        S.attempts++;
        text = '' + tx(st.nudge) + (S.attempts >= 3 ? '\n\n' + tx({ en: '(Take your time, think aloud, there are no wrong steps in thinking.)', bn: '(সময় নাও, জোরে ভাবো, চিন্তায় ভুল ধাপ নেই।)' }) : '');
        steps.push({ k: 'policy', ok: true, en: 'Narrow the question (smaller cognitive step) instead of giving the answer', bn: 'উত্তর না দিয়ে প্রশ্ন ছোট করা' });
      }
      if (ok) S.attempts = 0;
      return this.finish(S, text, steps, { decision: ok ? { en: 'Advance', bn: 'অগ্রসর' } : { en: 'Nudge', bn: 'ইঙ্গিত' }, cite: st.cite });
    },

    // Bloom tiers 0–4 are answered with option buttons (bloomAnswer); tier 5 (Create) is free text.
    bloomFree(S, T, input, steps) {
      const item = T.bloom[5];
      if (!S.awaitCreate) {
        return this.finish(S, tx({ en: 'Pick one of the options above to answer this tier. ', bn: 'এই ধাপের উত্তর দিতে উপরের একটি অপশন বেছে নাও। ' }), steps, { decision: { en: 'Await option selection', bn: 'অপশনের অপেক্ষা' } });
      }
      const hits = item.keys.filter((g) => g.some((k) => norm(input).includes(norm(k)))).length;
      const words = norm(input).split(/\s+/).filter(Boolean).length;
      const score = Math.round(Math.min(100, (hits / item.keys.length) * 80 + Math.min(20, words / 2)));
      steps.push({ k: 'eval', ok: score >= 60, en: `Create-tier rubric: ${hits}/${item.keys.length} criteria met, ${words} words → ${score}/100`, bn: `সৃষ্টি-রুব্রিক: ${hits}/${item.keys.length} মানদণ্ড, ${words} শব্দ → ${score}/১০০` });
      let text;
      if (score >= 60) {
        D.bumpBloom('create', 12); D.addXP(40, D.T('Create tier', 'সৃষ্টি ধাপ')); D.addGems(10);
        D.award('bloom-top-' + S.subject, { en: 'Bloom Summit: ' + D.subject(S.subject).name.en, bn: 'ব্লুম শিখর: ' + D.subject(S.subject).name.bn }, '');
        text = `${tx({ en: 'Summit reached! Rubric score', bn: 'শিখরে পৌঁছেছ! রুব্রিক স্কোর' })} ${D.n(score)}/100. ${tx({ en: 'Your design shows original application of the concept, the highest tier of Bloom\'s taxonomy.', bn: 'তোমার নকশায় ধারণার মৌলিক প্রয়োগ আছে, ব্লুমের সর্বোচ্চ স্তর।' })}`;
        S.awaitCreate = false; S.done = true;
      } else {
        const missing = item.keys.filter((g) => !g.some((k) => norm(input).includes(norm(k)))).map((g) => g[0]);
        text = `${tx({ en: 'Rubric score', bn: 'রুব্রিক স্কোর' })} ${D.n(score)}/100. ${tx({ en: 'Strengthen it by addressing:', bn: 'আরও ভালো করতে যোগ করো:' })} ${missing.join(', ')}. ${tx({ en: 'Try again!', bn: 'আবার চেষ্টা করো!' })}`;
      }
      return this.finish(S, text, steps, { decision: { en: 'Rubric feedback (Create tier)', bn: 'রুব্রিক মতামত' }, cite: item.cite });
    },
    bloomAnswer(subject, idx, choice) {
      const S = this.session(subject, 'bloom');
      const T = D.TUTOR[subject];
      const item = T.bloom[idx];
      const ok = choice === item.a;
      const steps = [{ k: 'eval', ok, en: `Tier ${D.BLOOM[idx][1].en}: learner chose “${D.tx(item.o[choice])}” → ${ok ? 'correct' : 'incorrect'}`, bn: `ধাপ ${D.BLOOM[idx][1].bn}: উত্তর ${ok ? 'সঠিক' : 'ভুল'}` }];
      S.msgs.push({ who: 'me', text: D.tx(item.o[choice]) });
      D.answer(ok);
      let text;
      if (ok) {
        D.bumpBloom(item.t, 10); D.addXP(20 + idx * 5, D.T('Bloom tier', 'ব্লুম ধাপ'));
        S.step = idx + 1;
        if (S.step === 5) {
          S.awaitCreate = true;
          text = `${tx({ en: 'Correct! Unlocked the final tier:', bn: 'সঠিক! শেষ ধাপ খুলেছে:' })} ${tx(D.BLOOM[5][1])}.\n\n${tx(T.bloom[5].q)}`;
          steps.push({ k: 'policy', ok: true, en: 'Advance to Create tier → open-ended task scored by rubric', bn: 'সৃষ্টি ধাপে অগ্রসর → রুব্রিকে মূল্যায়ন' });
          S.msgs.push({ who: 'ai', text, kind: '' });
        } else {
          text = `${tx({ en: 'Correct! Climbing to', bn: 'সঠিক! পরের ধাপ:' })} ${tx(D.BLOOM[S.step][1])}.`;
          steps.push({ k: 'policy', ok: true, en: 'Mastery +10 on this tier → advance one tier', bn: 'দক্ষতা +১০ → এক ধাপ উপরে' });
          S.msgs.push({ who: 'ai', text: text + '\n\n' + tx(T.bloom[S.step].q), kind: 'bloom', bloomIdx: S.step });
        }
      } else {
        D.bumpBloom(item.t, -3);
        const back = Math.max(0, idx - 1);
        text = `${tx({ en: 'Not quite. The answer is', bn: 'হয়নি। সঠিক উত্তর' })}: “${tx(item.o[item.a])}”. ${idx > 0 ? tx({ en: 'Let\'s reinforce one tier down before retrying.', bn: 'আবার চেষ্টার আগে এক ধাপ নিচে মজবুত করি।' }) : ''}`;
        steps.push({ k: 'policy', ok: true, en: idx > 0 ? 'Adaptive step-down: revisit previous tier, then retry' : 'Retry Remember tier with feedback', bn: 'অ্যাডাপটিভ: এক ধাপ নিচে ফিরে আবার চেষ্টা' });
        S.step = back;
        S.msgs.push({ who: 'ai', text: text + '\n\n' + tx(T.bloom[back].q), kind: 'bloom', bloomIdx: back });
      }
      const trace = this.trace(subject, 'bloom', tx(item.q), text, { steps, decision: ok ? { en: 'Advance tier', bn: 'ধাপ অগ্রসর' } : { en: 'Step down & retry', bn: 'নেমে আবার চেষ্টা' }, cite: item.cite });
      S.lastTrace = trace;
      this.afterTurn(S, text);
      return S;
    },

    feynman(S, T, input, steps) {
      const F = T.feynman;
      const t = norm(input);
      F.concepts.forEach((c, i) => { if (c.keys.some((k) => t.includes(norm(k)))) S.covered.add(i); });
      const coverage = S.covered.size / F.concepts.length;
      const jargonUsed = F.jargon.filter((j) => t.includes(norm(j)));
      const sentences = input.split(/[.!?।]+/).map((x) => x.trim()).filter(Boolean);
      const words = input.split(/\s+/).filter(Boolean).length;
      const avg = words / Math.max(1, sentences.length);
      const simplicity = avg <= 18 ? 20 : avg <= 26 ? 12 : 4;
      const hasExample = /(for example|e\.g\.|like a|imagine|such as|যেমন|ধরো|উদাহরণ|মতো)/i.test(input);
      let score = Math.round(coverage * 65 + simplicity + (hasExample ? 15 : 0) - jargonUsed.length * 8);
      if (words < 12) score = Math.min(score, 40);
      score = D.clamp(score, 0, 100);
      S.bestClarity = Math.max(S.bestClarity, score);
      steps.push({ k: 'eval', ok: score >= 70, en: `Clarity rubric: concepts ${S.covered.size}/${F.concepts.length} (${Math.round(coverage * 65)}), simplicity avg ${avg.toFixed(1)} words/sentence (+${simplicity}), example ${hasExample ? '+15' : '+0'}, jargon −${jargonUsed.length * 8}${jargonUsed.length ? ' [' + jargonUsed.join(', ') + ']' : ''} → ${score}%`, bn: `স্পষ্টতা: ধারণা ${S.covered.size}/${F.concepts.length}, সরলতা +${simplicity}, উদাহরণ ${hasExample ? '+১৫' : '+০'}, জার্গন −${jargonUsed.length * 8} → ${score}%` });
      const understood = F.concepts.filter((_, i) => S.covered.has(i)).map((c) => tx(c.label));
      const missing = F.concepts.findIndex((_, i) => !S.covered.has(i));
      let text = `${tx({ en: 'Clarity score', bn: 'স্পষ্টতা স্কোর' })}: **${D.n(score)}%**\n`;
      if (understood.length) text += `${tx({ en: 'I understood', bn: 'বুঝেছি' })}: ${understood.join(' · ')}\n`;
      if (jargonUsed.length) text += `${tx({ en: 'Wait, what does', bn: 'দাঁড়াও , ' })} “${jargonUsed[0]}” ${tx({ en: 'mean? Can you say it in everyday words?', bn: 'মানে কী? সহজ ভাষায় বলবে?' })}\n`;
      if (missing >= 0) text += `${tx(F.concepts[missing].follow)}`;
      else if (!hasExample) text += `${tx({ en: 'I almost get it! Can you give me an everyday example?', bn: 'প্রায় বুঝে গেছি! একটা দৈনন্দিন উদাহরণ দেবে?' })}`;
      else text += `${tx({ en: 'Now I really get it, you explained it better than my textbook! The Protégé Effect at work: teaching made you learn it deeper.', bn: 'এবার সত্যিই বুঝলাম, তুমি বইয়ের চেয়েও ভালো বোঝালে! শেখাতে গিয়ে তুমি আরও গভীরভাবে শিখলে।' })}`;
      D.addXP(Math.round(10 + score / 5), D.T('Feynman explanation', 'ফাইনম্যান ব্যাখ্যা'));
      D.bumpBloom('understand', 4); if (score >= 70) D.bumpBloom('create', 5);
      if (score >= 80) D.award('feynman-80', { en: 'Feynman Clarity 80+', bn: 'ফাইনম্যান স্পষ্টতা ৮০+' }, '');
      steps.push({ k: 'policy', ok: true, en: missing >= 0 ? 'Curious-peer policy: ask about the first missing concept' : 'All concepts covered → request/confirm an example', bn: 'কৌতূহলী সহপাঠী নীতি: বাদ পড়া ধারণা নিয়ে প্রশ্ন' });
      return this.finish(S, text, steps, { decision: { en: 'Score clarity & ask a curious follow-up', bn: 'স্পষ্টতা মাপো ও প্রশ্ন করো' }, cite: F.cite, clarity: score });
    },

    scaffold(S, T, input, steps) {
      const P = T.scaffold;
      if (S.done) { S.done = false; S.step = 0; S.streak = 0; }
      const st = P.steps[S.step];
      let ok;
      if (st.num != null) { const v = parseNum(input); ok = !isNaN(v) && Math.abs(v - st.num) <= (st.tol || 0.001) + 1e-9; }
      else if (st.exact) ok = st.exact.some((e) => compact(input) === compact(e) || compact(input).endsWith('=' + compact(e)));
      else ok = matchGroups(input, st.keys);
      const effLevel = Math.max(0, S.hintLevel - Math.floor(S.streak / 2));
      steps.push({ k: 'eval', ok, en: `Micro-step ${S.step + 1}/${P.steps.length} → ${ok ? 'correct' : 'incorrect'}; hint level set ${S.hintLevel}, effective ${effLevel} (fades every 2 correct in a row)`, bn: `ধাপ ${S.step + 1} → ${ok ? 'সঠিক' : 'ভুল'}; হিন্ট লেভেল ${effLevel}` });
      let text;
      if (ok) {
        S.streak++; D.answer(true); D.addXP(12, D.T('Scaffold step', 'স্ক্যাফোল্ড ধাপ')); D.bumpBloom('apply', 3);
        S.step++;
        if (S.step >= P.steps.length) {
          S.done = true;
          text = `${tx({ en: 'All steps solved independently!', bn: 'সব ধাপ নিজে সমাধান করেছ!' })} ${S.streak >= P.steps.length ? tx({ en: 'Hints faded to zero, this problem is now inside your independent zone.', bn: 'হিন্ট শূন্যে নেমেছে, সমস্যাটি এখন তোমার স্বাধীন অঞ্চলে।' }) : ''}`;
          D.addGems(8); D.award('scaffold-' + S.subject, { en: 'Independent Solver: ' + D.subject(S.subject).name.en, bn: 'স্বাধীন সমাধানকারী: ' + D.subject(S.subject).name.bn }, '');
        } else {
          const nl = Math.max(0, S.hintLevel - Math.floor(S.streak / 2));
          text = `${tx({ en: 'Correct.', bn: 'সঠিক।' })}${nl < effLevel ? ' ' + tx({ en: '(Hints fading, you\'re getting independent.)', bn: '(হিন্ট কমছে, তুমি স্বাধীন হচ্ছ।)' }) : ''}\n\n${tx(P.steps[S.step].p)}`;
        }
      } else {
        S.streak = 0; D.answer(false);
        const lvl = Math.max(effLevel, 1);
        text = `${tx({ en: 'Not yet.', bn: 'এখনও হয়নি।' })} ${tx({ en: 'Hint', bn: 'হিন্ট' })} ${lvl}: ${tx(st.h[Math.min(lvl, 3) - 1])}`;
        if (S.hintLevel < 3) S.hintLevel = Math.min(3, S.hintLevel + 0); // learner controls the slider; streak reset re-raises effective level
      }
      steps.push({ k: 'policy', ok: true, en: ok ? 'ZPD policy: advance; fade support as success accumulates' : 'ZPD policy: supply the minimum hint that unblocks the learner', bn: ok ? 'ZPD: অগ্রসর, সহায়তা কমাও' : 'ZPD: ন্যূনতম হিন্ট দাও' });
      return this.finish(S, text, steps, { decision: ok ? { en: 'Advance & fade', bn: 'অগ্রসর ও হিন্ট হ্রাস' } : { en: 'Targeted hint', bn: 'লক্ষ্যভিত্তিক হিন্ট' }, cite: P.cite });
    },

    finish(S, text, steps, extra) {
      const trace = this.trace(S.subject, S.mode, S.msgs.length ? S.msgs[S.msgs.length - 1].text : '', text, Object.assign({ steps }, extra));
      if (extra && extra.hitsOverride) { trace.hits = extra.hitsOverride; trace.grounding = R.grounding(text, extra.hitsOverride); }
      S.lastTrace = trace;
      S.msgs.push({ who: 'ai', text });
      this.afterTurn(S, text);
      return S;
    },
    afterTurn(S, text) {
      if (D.state.audio) D.speak(text);
    },

    /* Optional LLM verbalizer, rephrases the policy engine's turn with the same sources. */
    async verbalize(S) {
      if (!D.LLM.available) return false;
      const tr = S.lastTrace;
      const last = S.msgs[S.msgs.length - 1];
      if (!tr || !last || last.who !== 'ai' || tr.guard) return false;
      try {
        const ctl = new AbortController();
        const to = setTimeout(() => ctl.abort(), 12000);
        const r = await fetch(new URL('api/tutor', document.baseURI), {
          method: 'POST', signal: ctl.signal, headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: S.mode, subject: S.subject, lang: D.state.lang, learner: tr.input, plan: last.text, sources: tr.hits.map((h) => h.chunk.id) })
        });
        clearTimeout(to);
        if (!r.ok) return false;
        const j = await r.json();
        if (j && j.text) {
          last.text = j.text; last.llm = j.model;
          tr.grounding = R.grounding(j.text, tr.hits);
          tr.engine = 'policy+llm'; tr.model = j.model;
          return true;
        }
      } catch (e) { /* fall back silently to policy engine output */ }
      return false;
    }
  };

  /* LLM availability probe (only on real HTTP hosts) */
  D.LLM = { available: false, model: null, checked: false };
  D.probeLLM = async () => {
    if (D.LLM.checked || D.hashMode()) { D.LLM.checked = true; return D.LLM; }
    D.LLM.checked = true;
    try {
      const ctl = new AbortController();
      setTimeout(() => ctl.abort(), 2500);
      const r = await fetch(new URL('api/tutor', document.baseURI), { signal: ctl.signal });
      if (r.ok) { const j = await r.json(); D.LLM.available = !!j.llm; D.LLM.model = j.model || null; }
    } catch (e) { /* static hosting: local engine only */ }
    return D.LLM;
  };
})();

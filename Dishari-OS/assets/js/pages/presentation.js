/* Dishari OS, /presentation : 180-second "Vibe to Production" pitch storyboard + rehearsal timer */
(function () {
  'use strict';
  const D = window.D;
  const { T, esc } = D;
  const tx = D.tx;

  const SEG = [
    { t: [0, 30], title: { en: 'Problem', bn: 'সমস্যা' }, route: '', show: { en: 'Home: sourced stat cards', bn: 'হোম: সূত্রসহ পরিসংখ্যান' },
      script: { en: '"9.4 million secondary students in Bangladesh, 6.5 million of them rural. Over three in four rely on paid coaching, secondary dropout hit 14% in 2025, and 8.56 million young people are not in education, employment or training. The gap isn\'t talent, it\'s access to a great tutor and a credible path to work."', bn: '"বাংলাদেশে ৯৪ লাখ মাধ্যমিক শিক্ষার্থী, ৬৫ লাখ গ্রামে। চারজনের তিনজনের বেশি কোচিং-নির্ভর, ২০২৫-এ ঝরে পড়া ১৪%, আর ৮৫ লাখ তরুণ শিক্ষা-কর্ম-প্রশিক্ষণের বাইরে। সমস্যা মেধার নয়, ভালো শিক্ষক ও কাজের বিশ্বাসযোগ্য পথের অভাব।"' } },
    { t: [30, 60], title: { en: 'SDG 4 & pedagogical solution', bn: 'SDG ৪ ও শিক্ষণ সমাধান' }, route: 'sdg4', show: { en: '/sdg4 matrix → research cards', bn: '/sdg4 ম্যাট্রিক্স → গবেষণা' },
      script: { en: '"Dishari OS is a bilingual AI tutor that teaches the way the research says works: Socratic questioning, Bloom\'s mastery ladder, Feynman teach-back and scaffolding. It is grounded in NCTB and OpenStax, shows its sources, and runs offline on 2G."', bn: '"দিশারী একটি দ্বিভাষিক AI টিউটর যা গবেষণা-প্রমাণিত পদ্ধতিতে শেখায়: সক্রেটিক প্রশ্ন, ব্লুম ল্যাডার, ফাইনম্যান ও স্ক্যাফোল্ডিং। NCTB ও OpenStax-ভিত্তিক, উৎস দেখায়, ২জি-তে অফলাইনে চলে।"' } },
    { t: [60, 120], title: { en: 'Live game & tutor demo', bn: 'লাইভ গেম ও টিউটর ডেমো' }, route: 'demo-user', show: { en: '/demo-user → /app: switch modes, Boss Battle, Snap-to-Solve', bn: '/demo-user → /app: মোড বদল, বস ব্যাটল, স্ন্যাপ-টু-সলভ' },
      script: { en: '"Meet Aurin from Rangpur, one click, Level 15, 21-day streak. Watch the same biology question in Socratic mode, then flip to Feynman where she teaches the AI and gets a clarity score. Part 3: she diagnoses a dengue case in a Kurigram clinic. Snap-to-Solve finds the exact wrong line in a calculus answer and prescribes three drills."', bn: '"রংপুরের আউরিন, এক ক্লিকে লেভেল ১৫, ২১ দিনের ধারা। সক্রেটিক থেকে ফাইনম্যানে বদল, বস ব্যাটলে ডেঙ্গু নির্ণয়, স্ন্যাপ-টু-সলভে ভুল লাইন চিহ্নিত।"' } },
    { t: [120, 150], title: { en: 'Multi-agent RAG & research proof', bn: 'মাল্টি-এজেন্ট RAG ও প্রমাণ' }, route: 'architecture', show: { en: 'Open the "Why this answer?" drawer → /architecture trace', bn: '"কেন এই উত্তর?" → /architecture ট্রেস' },
      script: { en: '"Every answer opens its evidence: textbook passages, a live grounding score and the policy\'s reasoning. Six agents, Pedagogy, Game Master, Vision Autopsy, Teacher Co-Pilot, Career Graph and a Guardian, share one guardrail pipeline. If retrieval confidence is low, the tutor refuses to guess."', bn: '"প্রতিটি উত্তরে প্রমাণ: পাঠ্যাংশ, লাইভ গ্রাউন্ডিং স্কোর ও যুক্তি। ছয়টি এজেন্ট এক গার্ডরেইল পাইপলাইন ভাগ করে; আস্থা কম হলে টিউটর অনুমান করে না।"' } },
    { t: [150, 180], title: { en: 'Global scalability & impact', bn: 'বৈশ্বিক স্কেল ও প্রভাব' }, route: 'audit', show: { en: 'Career Bridge → Skill Passport QR → /audit run', bn: 'ক্যারিয়ার ব্রিজ → পাসপোর্ট QR → /audit' },
      script: { en: '"Mastery becomes a QR-verifiable Skill Passport linked to O*NET occupations, so a recruiter in Toronto can trust a learner in Kurigram. Freemium for students, paid for schools, NGOs and recruiters. Next: a 24-school randomised pilot in Rangpur. One click runs our live audit. Dishari, from classroom to global career."', bn: '"দক্ষতা হয় QR-যাচাইযোগ্য স্কিল পাসপোর্ট, টরন্টোর রিক্রুটার কুড়িগ্রামের শিক্ষার্থীকে বিশ্বাস করতে পারেন। শিক্ষার্থীদের জন্য ফ্রি, প্রতিষ্ঠানের জন্য পেইড। পরবর্তী: রংপুরে ২৪ প্রতিষ্ঠানে পাইলট। দিশারী, ক্লাসরুম থেকে বিশ্ব ক্যারিয়ার।"' } }
  ];

  D.page('presentation', {
    title: { en: '180-second pitch', bn: '১৮০ সেকেন্ডের পিচ' },
    render(el) {
      let timer = null, t0 = 0, elapsed = 0;
      el.innerHTML = `
        ${D.sectionHead(T('Congress pitch storyboard', 'কংগ্রেস পিচ স্টোরিবোর্ড'), '' + T('"Vibe to Production in 180 Seconds"', '"১৮০ সেকেন্ডে ভাইব থেকে প্রোডাকশন"'), T('Mapped to the AIBC 2026 preliminary format (Problem → Solution → Demo → AI approach → Impact). Use the rehearsal timer while recording; each segment links to the exact route to show.', 'AIBC ২০২৬ ফরম্যাট অনুযায়ী। রেকর্ডিংয়ের সময় টাইমার ব্যবহার করো।'))}
        <div class="card gold-edge" style="margin-bottom:16px"><div class="row between">
          <div class="row nowrap" style="gap:14px"><div class="kpi mono" id="clock">0:00</div><div class="small muted">/ 3:00 · <span id="seg-name">${T('Ready', 'প্রস্তুত')}</span></div></div>
          <div class="row"><button class="btn primary" id="go">${T('Start rehearsal', 'রিহার্সাল শুরু')}</button><button class="btn" id="stop"></button><button class="btn ghost" id="rst"></button><button class="btn" id="read">${T('Read script', 'স্ক্রিপ্ট পড়ো')}</button></div>
        </div>${D.bar(0, 'gold')}</div>
        <div class="timeline" id="tl">${SEG.map((s, i) => `<div class="seg" data-i="${i}"><div class="time">${fmt(s.t[0])}–${fmt(s.t[1])}</div><h3 style="margin:6px 0">${esc(tx(s.title))}</h3>
          <p class="small" style="margin:0 0 10px">${esc(tx(s.script))}</p>
          <div class="small muted">${esc(tx(s.show))}</div>
          <div style="margin-top:10px">${D.a(s.route, T('Open', 'খোলো') + ' /' + (s.route || ''), 'btn sm')}</div><div class="prog"></div></div>`).join('')}</div>
        <div class="bento" style="margin-top:16px">
          <div class="card s6"><div class="card-head"><h3>${T('Product, users, market, impact', 'পণ্য, ব্যবহারকারী, বাজার, প্রভাব')}</h3></div>
            <table class="t"><tbody>
              <tr><td><b>${T('Problem', 'সমস্যা')}</b></td><td class="small">${T('Unequal access to quality tutoring; weak link between school STEM and jobs; rural, madrasah and girls most affected.', 'মানসম্মত টিউটরিংয়ে অসম প্রবেশ; স্কুল বিজ্ঞান ও চাকরির দুর্বল সংযোগ।')}</td></tr>
              <tr><td><b>${T('Users', 'ব্যবহারকারী')}</b></td><td class="small">${T('Class 6–12, HSC, madrasah (Dakhil/Alim) & polytechnic learners; teachers; parents; schools & NGOs; recruiters.', '৬–১২ শ্রেণি, মাদ্রাসা ও পলিটেকনিক শিক্ষার্থী; শিক্ষক; অভিভাবক; প্রতিষ্ঠান; রিক্রুটার।')}</td></tr>
              <tr><td><b>${T('Solution', 'সমাধান')}</b></td><td class="small">${T('AI tutor with 4 pedagogies + 4-part STEM quest game + Snap-to-Solve + Teacher Co-Pilot + Career Bridge & Skill Passport.', '৪ পদ্ধতির টিউটর + ৪-পর্বের গেম + স্ন্যাপ-টু-সলভ + কো-পাইলট + পাসপোর্ট।')}</td></tr>
              <tr><td><b>${T('Market', 'বাজার')}</b></td><td class="small">${T('~9.4M secondary learners in Bangladesh, households already paying for coaching; institutions, NGOs and employers as paying B2B customers.', '~৯৪ লাখ মাধ্যমিক শিক্ষার্থী; কোচিংয়ে পরিবারের খরচ; B2B গ্রাহক।')}</td></tr>
              <tr><td><b>${T('Impact KPIs', 'প্রভাব KPI')}</b></td><td class="small">${T('Learning gain (effect size) in RCT · completion & girls\' participation · passports issued · interviews & placements.', 'শিখন অগ্রগতি · সম্পন্ন ও মেয়েদের অংশগ্রহণ · পাসপোর্ট · নিয়োগ।')}</td></tr>
            </tbody></table></div>
          <div class="card s6"><div class="card-head"><h3>${T('Recording checklist', 'রেকর্ডিং চেকলিস্ট')}</h3></div>
            <div class="col small" style="gap:8px" id="chk">${[T('Switch to Bangla once on camera (localisation requirement)', 'একবার বাংলায় বদলাও (স্থানীয়করণ)'), T('Show the "Why this answer?" drawer (AI explanation requirement)', '"কেন এই উত্তর?" দেখাও'), T('Show input → AI → output flow (/architecture trace)', 'ইনপুট → AI → আউটপুট দেখাও'), T('State KPIs and the next step (pilot)', 'KPI ও পরবর্তী পদক্ষেপ বলো'), T('Mention team roles & NRB collaborator', 'দলের ভূমিকা ও NRB সহযোগী উল্লেখ করো'), T('Keep under 3:00, the timer turns red after', '৩:০০-এর মধ্যে রাখো')].map((c, i) => `<label class="switch"><input type="checkbox" data-c="${i}"><span class="track"></span>${esc(c)}</label>`).join('')}</div></div>
        </div>`;
      function tick() {
        const now = elapsed + (timer ? (performance.now() - t0) / 1000 : 0);
        const s = Math.min(now, 999);
        const clock = D.$('#clock'); if (!clock) { clearInterval(timer); return; }
        clock.textContent = fmt(Math.floor(s));
        clock.style.color = s > 180 ? 'var(--danger)' : '';
        el.querySelector('.card .bar > i').style.width = Math.min(100, (s / 180) * 100) + '%';
        SEG.forEach((g, i) => {
          const n = D.$(`.seg[data-i="${i}"]`);
          const live = s >= g.t[0] && s < g.t[1];
          n.classList.toggle('live', live);
          n.querySelector('.prog').style.width = Math.max(0, Math.min(100, ((s - g.t[0]) / (g.t[1] - g.t[0])) * 100)) + '%';
          if (live) D.$('#seg-name').textContent = tx(g.title);
        });
        if (s >= 180 && timer) { D.$('#seg-name').textContent = T('Time!', 'সময় শেষ!'); }
      }
      D.$('#go').onclick = () => { if (timer) return; t0 = performance.now(); timer = setInterval(tick, 200); tick(); };
      D.$('#stop').onclick = () => { if (!timer) return; elapsed += (performance.now() - t0) / 1000; clearInterval(timer); timer = null; tick(); };
      D.$('#rst').onclick = () => { clearInterval(timer); timer = null; elapsed = 0; tick(); D.$('#seg-name').textContent = T('Ready', 'প্রস্তুত'); };
      D.$('#read').onclick = () => { const s = elapsed + (timer ? (performance.now() - t0) / 1000 : 0); const g = SEG.find((x) => s >= x.t[0] && s < x.t[1]) || SEG[0]; D.speak(tx(g.script)); };
    }
  });
  function fmt(s) { return Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0'); }
})();

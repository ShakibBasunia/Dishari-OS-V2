/* Dishari OS, /sdg4 : UN SDG 4 alignment, research evidence, efficacy simulator, equity & ROI */
(function () {
  'use strict';
  const D = window.D;
  const { T, esc } = D;
  const tx = D.tx;

  const TARGETS = [
    ['4.1', { en: 'Free, equitable, quality primary & secondary education with relevant, effective learning outcomes', bn: 'বিনামূল্যে, ন্যায্য ও মানসম্মত প্রাথমিক ও মাধ্যমিক শিক্ষা' }, 'direct', { en: 'Free tier for every NCTB learner; adaptive tutor targets measured learning outcomes', bn: 'প্রতিটি NCTB শিক্ষার্থীর জন্য বিনামূল্যে; অ্যাডাপটিভ টিউটর' }],
    ['4.2', { en: 'Early childhood development & pre-primary education', bn: 'শৈশবকালীন বিকাশ ও প্রাক-প্রাথমিক' }, 'out', { en: 'Out of scope (Class 6–12 & TVET focus), stated honestly', bn: 'পরিধির বাইরে (৬–১২ শ্রেণি ও কারিগরি)' }],
    ['4.3', { en: 'Equal access to affordable technical, vocational & tertiary education', bn: 'সাশ্রয়ী কারিগরি, বৃত্তিমূলক ও উচ্চশিক্ষায় সমান প্রবেশ' }, 'direct', { en: 'Polytechnic & madrasah tracks; 2G Lite; free micro-internships', bn: 'পলিটেকনিক ও মাদ্রাসা ট্র্যাক; ২জি লাইট' }],
    ['4.4', { en: 'Increase youth & adults with relevant skills for employment, decent jobs & entrepreneurship', bn: 'চাকরি ও উদ্যোক্তার জন্য প্রাসঙ্গিক দক্ষতা বৃদ্ধি' }, 'direct', { en: 'Career Navigator (O*NET), SkillBridge internships, verifiable Skill Passports, talent marketplace', bn: 'ক্যারিয়ার নেভিগেটর, স্কিলব্রিজ, স্কিল পাসপোর্ট' }],
    ['4.5', { en: 'Eliminate gender disparities; equal access for the vulnerable, persons with disabilities', bn: 'লিঙ্গবৈষম্য দূর; সুবিধাবঞ্চিত ও প্রতিবন্ধীদের সমান প্রবেশ' }, 'direct', { en: 'Gender-parity dashboards, read-aloud & dyslexia mode, rural/char equity metrics, blind hiring', bn: 'লিঙ্গ-সমতা ড্যাশবোর্ড, পড়ে শোনানো, অন্ধ নিয়োগ' }],
    ['4.6', { en: 'Youth & adults achieve literacy and numeracy', bn: 'যুব ও প্রাপ্তবয়স্কদের সাক্ষরতা ও গণনা দক্ষতা' }, 'partial', { en: 'Numeracy through Math/Equations labs; Bangla-first interface supports literacy', bn: 'গণিত ল্যাবে গণনা দক্ষতা; বাংলা-প্রথম ইন্টারফেস' }],
    ['4.7', { en: 'Knowledge & skills for sustainable development & global citizenship', bn: 'টেকসই উন্নয়ন ও বিশ্ব নাগরিকত্বের জ্ঞান' }, 'direct', { en: 'Boss Battles on floods, river pollution, dengue & rural health data', bn: 'বন্যা, নদীদূষণ, ডেঙ্গু ও স্বাস্থ্য-ডেটা বস ব্যাটল' }],
    ['4.a', { en: 'Inclusive, effective learning environments', bn: 'অন্তর্ভুক্তিমূলক শিক্ষার পরিবেশ' }, 'partial', { en: 'Offline-first PWA, low-end Android, shared-device mode', bn: 'অফলাইন-ফার্স্ট, কম দামের অ্যান্ড্রয়েড' }],
    ['4.c', { en: 'Increase the supply of qualified teachers', bn: 'যোগ্য শিক্ষকের সরবরাহ বৃদ্ধি' }, 'partial', { en: 'Teacher Co-Pilot: NCTB CQ/MCQ generator & misconception heatmaps', bn: 'শিক্ষক কো-পাইলট' }]
  ];

  D.page('sdg4', {
    title: { en: 'SDG 4 & research evidence', bn: 'SDG ৪ ও গবেষণা' },
    render(el) {
      const st = { d: 0.76, learners: 100000, tuition: 1500, months: 10, cost: 600, ready: 5, income: 350, fx: 122, adopt: 40 };
      el.innerHTML = `
        ${D.sectionHead('UN SDG 4 · Quality Education', '' + T('Education for All, Impact & Evidence Lab', 'সবার জন্য শিক্ষা, প্রভাব ও প্রমাণ ল্যাব'), T('How Dishari maps to SDG 4 targets, the learning science behind it (with caveats), and transparent models of equity and economic impact.', 'দিশারী কীভাবে SDG ৪ লক্ষ্যে যুক্ত, এর পেছনের শিক্ষাবিজ্ঞান (সীমাবদ্ধতাসহ) এবং প্রভাবের স্বচ্ছ মডেল।'))}
        <div class="card"><div class="card-head"><h3>${T('SDG 4 alignment matrix', 'SDG ৪ সামঞ্জস্য ম্যাট্রিক্স')}</h3><div class="legend"><span><i style="background:var(--em)"></i>${T('Direct', 'সরাসরি')}</span><span><i style="background:var(--gold)"></i>${T('Partial', 'আংশিক')}</span><span><i style="background:var(--card3)"></i>${T('Out of scope', 'পরিধির বাইরে')}</span></div></div>
          <div class="table-wrap"><table class="t"><thead><tr><th>${T('Target', 'লক্ষ্য')}</th><th>${T('UN target (summary)', 'জাতিসংঘ লক্ষ্য (সারাংশ)')}</th><th>${T('Coverage', 'আওতা')}</th><th>${T('Dishari feature', 'দিশারী ফিচার')}</th></tr></thead><tbody>
          ${TARGETS.map(([n, t, c, f]) => `<tr><td><b>${n}</b></td><td class="small">${esc(tx(t))}</td><td><span class="chip ${c === 'direct' ? 'em' : c === 'partial' ? 'gold' : ''}">${c === 'direct' ? T('Direct', 'সরাসরি') : c === 'partial' ? T('Partial', 'আংশিক') : T('Out of scope', 'বাইরে')}</span></td><td class="small">${esc(tx(f))}</td></tr>`).join('')}
          </tbody></table></div></div>

        <h2 style="margin:28px 0 12px">${T('Peer-reviewed evidence engine', 'পিয়ার-রিভিউড প্রমাণ')}</h2>
        <div class="grid g2">${D.RESEARCH.map((r) => `<div class="card"><div class="row between"><h3 style="margin:0">${esc(tx(r.title))}</h3><span class="chip em">${esc(tx(r.feature))}</span></div>
          <p style="margin:10px 0 8px">${esc(tx(r.finding))}</p>
          <div class="banner" style="font-size:12.5px"><span><b>${T('Caveat', 'সতর্কতা')}:</b> ${esc(tx(r.caveat))}</span></div>
          <p class="small muted" style="margin:8px 0 0">${esc(r.cite)} <a href="${esc(r.doi)}" target="_blank" rel="noopener">${T('Source ', 'উৎস ')}</a></p></div>`).join('')}</div>

        <div class="bento" style="margin-top:20px">
          <div class="card s7">
            <div class="card-head"><h3>${T('A/B efficacy simulator, Traditional vs Dishari OS', 'A/B কার্যকারিতা সিমুলেটর, প্রচলিত বনাম দিশারী')}</h3><span class="tag-demo">${T('Projection from literature, not a trial result', 'গবেষণা-ভিত্তিক প্রক্ষেপণ, ট্রায়াল ফল নয়')}</span></div>
            <div class="tabs" id="dsel" style="margin-bottom:10px">${[[0.3, T('Conservative d = 0.30', 'রক্ষণশীল d = ০.৩০')], [0.49, T('Gamification g = 0.49', 'গেমিফিকেশন g = ০.৪৯')], [0.76, T('ITS meta-analysis d = 0.76', 'ITS মেটা d = ০.৭৬')], [2.0, T("Bloom's 2σ (upper bound)", 'ব্লুমের ২σ (ঊর্ধ্বসীমা)')]].map(([d, l]) => `<button class="tab ${d === st.d ? 'active' : ''}" data-d="${d}">${esc(l)}</button>`).join('')}</div>
            <div id="curve"></div>
            <div class="grid g3" style="margin-top:8px" id="dstats"></div>
          </div>
          <div class="card s5">
            <div class="card-head"><h3>${T('Planned pilot (pre-registered design)', 'পরিকল্পিত পাইলট')}</h3></div>
            <ul class="small" style="padding-left:18px;line-height:1.9;margin:0">
              <li>${T('Cluster-randomised trial: 24 schools in Rangpur & Kurigram (12 treatment / 12 control), ~1,200 Class 9–12 learners', 'ক্লাস্টার-র্যান্ডমাইজড ট্রায়াল: রংপুর ও কুড়িগ্রামের ২৪টি প্রতিষ্ঠান')}</li>
              <li>${T('Primary outcome: NCTB-aligned STEM test, 12 weeks; secondary: completion, attendance, girls\' participation', 'মূল ফলাফল: NCTB-ভিত্তিক বিজ্ঞান পরীক্ষা, ১২ সপ্তাহ')}</li>
              <li>${T('Stratified by rural/urban, madrasah/general and gender; analysis plan registered before data collection', 'গ্রাম/শহর, মাদ্রাসা/সাধারণ ও লিঙ্গভিত্তিক স্তরবিন্যাস')}</li>
              <li>${T('Consent from guardians; data stays in-country; results published regardless of direction', 'অভিভাবকের সম্মতি; ডেটা দেশে; ফল যাই হোক প্রকাশ')}</li>
            </ul>
          </div>
        </div>

        <div class="bento" style="margin-top:16px">
          <div class="card s6"><div class="card-head"><h3>${T('Rural & gender equity metrics', 'গ্রামীণ ও লিঙ্গ সমতা')}</h3>${D.demoTag()}</div>
            ${D.bars(D.ADMIN.cohorts.map((c) => c.g.split(' ')[0]), [{ name: T('Quest completion %', 'কোয়েস্ট সম্পন্ন %'), values: D.ADMIN.cohorts.map((c) => c.completion), color: D.C.em }, { name: T('Job-ready %', 'চাকরি-প্রস্তুত %'), values: D.ADMIN.cohorts.map((c) => c.ready), color: D.C.gold }], { max: 100, unit: '%', labels: true })}
            <div class="row" style="margin-top:10px;gap:10px"><span class="chip">${T('Girls / boys completion parity', 'মেয়ে/ছেলে সমতা')}: <b>${(D.ADMIN.gender.girls.completion / D.ADMIN.gender.boys.completion).toFixed(2)}</b></span><span class="chip">${T('Rural share of learners', 'গ্রামীণ শিক্ষার্থীর অংশ')}: <b>${Math.round((1 - D.ADMIN.cohorts[0].n / D.ADMIN.cohorts.reduce((a, c) => a + c.n, 0)) * 100)}%</b></span></div></div>
          <div class="card s6"><div class="card-head"><h3>${T('Sourced context', 'সূত্রসহ প্রেক্ষাপট')}</h3></div>
            ${['dropout', 'tertiaryUnemp', 'notPrepared', 'entrants'].map((k) => { const f = D.FACTS[k]; return `<div style="padding:8px 0;border-bottom:1px dashed var(--line)"><b class="gold">${esc(f.v)}</b> <span class="small">${esc(tx(f.label))}</span><div class="small"><a href="${esc(f.url)}" target="_blank" rel="noopener" class="muted">${esc(f.src)}</a></div></div>`; }).join('')}</div>
        </div>

        <div class="card gold-edge" style="margin-top:16px">
          <div class="card-head"><h3>${T('National Impact & ROI Calculator', 'জাতীয় প্রভাব ও ROI ক্যালকুলেটর')}</h3><span class="tag-demo">${T('Every assumption is editable', 'প্রতিটি অনুমান পরিবর্তনযোগ্য')}</span></div>
          <div class="grid g2">
            <div class="col" style="gap:10px" id="roi-in"></div>
            <div id="roi-out"></div>
          </div>
        </div>`;

      const drawCurve = () => {
        D.$('#curve').innerHTML = D.normalShift(st.d, { a: T('Traditional class', 'প্রচলিত ক্লাস'), b: 'Dishari OS' });
        const pct = D.phi(st.d) * 100;
        D.$('#dstats').innerHTML = `<div class="card flat tint"><div class="kpi">${D.n(+st.d.toFixed(2))}σ</div><div class="small muted">${T('Effect size', 'ইফেক্ট সাইজ')}</div></div>
          <div class="card flat tint"><div class="kpi">${D.n(Math.round(pct))}<small>th</small></div><div class="small muted">${T('Percentile of the average Dishari learner vs the traditional class', 'গড় দিশারী শিক্ষার্থীর পার্সেন্টাইল')}</div></div>
          <div class="card flat tint"><div class="kpi">+${D.n(Math.round(pct - 50))}</div><div class="small muted">${T('percentile points for the median learner', 'মধ্যম শিক্ষার্থীর পার্সেন্টাইল বৃদ্ধি')}</div></div>`;
      };
      D.$$('#dsel [data-d]').forEach((b) => (b.onclick = () => { st.d = +b.dataset.d; D.$$('#dsel .tab').forEach((x) => x.classList.toggle('active', x === b)); drawCurve(); }));
      drawCurve();

      const fields = [
        ['learners', T('Learners reached', 'শিক্ষার্থী'), 10000, 1000000, 10000, ''],
        ['adopt', T('% who replace part of paid coaching', '% যারা কোচিংয়ের অংশ বাদ দেয়'), 0, 100, 5, '%'],
        ['tuition', T('Coaching spend replaced (৳ / month)', 'কোচিং খরচ সাশ্রয় (৳/মাস)'), 0, 5000, 100, '৳'],
        ['months', T('Months per year', 'বছরে মাস'), 1, 12, 1, ''],
        ['cost', T('Dishari cost per learner (৳ / year)', 'প্রতি শিক্ষার্থী খরচ (৳/বছর)'), 0, 3000, 50, '৳'],
        ['ready', T('% reaching paid remote / digital work', '% রিমোট/ডিজিটাল কাজে'), 0, 20, 0.5, '%'],
        ['income', T('Avg. remote income (US$ / month)', 'গড় আয় (US$/মাস)'), 50, 1500, 25, '$'],
        ['fx', T('Exchange rate (৳ per US$)', 'বিনিময় হার (৳/US$)'), 100, 140, 1, '৳']
      ];
      D.$('#roi-in').innerHTML = fields.map(([k, l, mn, mx, sp, u]) => `<label class="field">${esc(l)}: <b id="rv-${k}"></b><input type="range" min="${mn}" max="${mx}" step="${sp}" value="${st[k]}" data-roi="${k}"></label>`).join('');
      const roi = () => {
        fields.forEach(([k, , , , , u]) => (D.$('#rv-' + k).textContent = (u === '$' ? '$' : '') + D.n(st[k]) + (u === '%' ? '%' : u === '৳' ? ' ৳' : '')));
        const savings = st.learners * (st.adopt / 100) * st.tuition * st.months; // BDT / year
        const income = st.learners * (st.ready / 100) * st.income * 12 * st.fx; // BDT / year
        const cost = st.learners * st.cost;
        const benefit = savings + income;
        const crore = (v) => D.n(+(v / 1e7).toFixed(1)) + T(' crore ৳', ' কোটি ৳');
        D.$('#roi-out').innerHTML = `<div class="grid g2">
            <div class="card flat tint"><div class="small muted">${T('Household coaching savings / yr', 'পরিবারের কোচিং সাশ্রয় / বছর')}</div><div class="kpi">${crore(savings)}</div><div class="small muted">≈ US$ ${D.n(Math.round(savings / st.fx / 1e6 * 10) / 10)}M</div></div>
            <div class="card flat tint"><div class="small muted">${T('Remote / digital-work income / yr', 'রিমোট আয় / বছর')}</div><div class="kpi">${crore(income)}</div><div class="small muted">≈ US$ ${D.n(Math.round(income / st.fx / 1e6 * 10) / 10)}M · ${D.n(Math.round(st.learners * st.ready / 100))} ${T('workers', 'কর্মী')}</div></div>
            <div class="card flat tint"><div class="small muted">${T('Programme cost / yr', 'কর্মসূচি খরচ / বছর')}</div><div class="kpi">${crore(cost)}</div></div>
            <div class="card flat tint"><div class="small muted">${T('Benefit ÷ cost', 'লাভ ÷ খরচ')}</div><div class="kpi gold">${cost ? D.n(+(benefit / cost).toFixed(1)) + '×' : '∞'}</div></div>
          </div>
          <pre style="margin-top:10px;white-space:pre-wrap">${T('savings = learners × adopt% × ৳/month × months', 'সাশ্রয় = শিক্ষার্থী × গ্রহণ% × ৳/মাস × মাস')}
${T('income  = learners × ready% × US$/month × 12 × FX', 'আয় = শিক্ষার্থী × প্রস্তুত% × US$/মাস × ১২ × বিনিময়')}
${T('cost    = learners × ৳/year', 'খরচ = শিক্ষার্থী × ৳/বছর')}</pre>
          <p class="small muted">${T('Gross benefits, not causal estimates: income figures assume placement rates the pilot must verify, and savings assume families actually reduce coaching spend. Context:', 'মোট সুবিধা, কার্যকারণ অনুমান নয়। প্রেক্ষাপট:')} <a href="${esc(D.FACTS.tutoring.url)}" target="_blank" rel="noopener">${esc(D.FACTS.tutoring.v)} ${T('use coaching (CAMPE)', 'কোচিং নেয় (CAMPE)')}</a>.</p>`;
      };
      D.$$('[data-roi]').forEach((i) => (i.oninput = () => { st[i.dataset.roi] = +i.value; roi(); }));
      roi();
    }
  });
})();

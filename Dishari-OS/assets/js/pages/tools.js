/* Dishari OS - Workspace Tools & Workforce Modules:
   1. Snap-to-Solve (Vision Autopsy Agent)
   2. Teacher & Parent Co-Pilot (Curriculum & Misconceptions)
   3. Career Navigator & Interactive Knowledge Graph
   4. Talent Marketplace (B2B Blind Hiring Portal)
*/
(function () {
  'use strict';
  const D = window.D;
  const { T, esc } = D;
  const tx = D.tx;
  const I = (n, s) => D.icon(n, s);
  D.TABS = D.TABS || {};

  /* ==========================================================================
     MODULE 5: Snap-to-Solve (Split-Screen Handwritten Mistake Analyzer)
     ========================================================================== */
  D.TABS.snap = (container) => {
    let cur = 0;
    let ran = false;
    let scanning = false;
    let guess = null;
    let upload = null;
    let selectedSubj = 'math';

    const draw = () => {
      const S = D.SNAPS[cur];
      container.innerHTML = `
        <div class="row between" style="margin-bottom:24px;gap:16px;align-items:flex-end">
          <div>
            <div class="row nowrap" style="gap:8px;margin-bottom:6px">
              <span class="chip primary">${I('camera', 14)} Vision Mistake Autopsy</span>
              <span class="chip ok">${I('shieldCheck', 14)} NCTB Diagnostic Engine</span>
              ${D.demoTag()}
            </div>
            <h1 style="font-size:clamp(24px, 2.8vw, 34px);margin:0">
              ${T('Snap-to-Solve: Handwritten Mistake Analysis', 'স্ন্যাপ-টু-সলভ: হাতে লেখা সমাধান ও ভুল বিশ্লেষণ')}
            </h1>
            <p class="muted" style="margin:6px 0 0;font-size:14.5px">
              ${T('Upload a photo of your handwritten math, physics, or chemistry solution. The AI pinpoints the exact line of conceptual error and prescribes 3 targeted remedial drills.', 'তোমার হাতে লেখা অংক বা সমীকরণের ছবি আপলোড করো। এআই ভুলের সঠিক লাইন চিহ্নিত করে সহজ ভাষায় ভুল বুঝিয়ে দেবে এবং ৩টি অনুশীলন দেবে।')}
            </p>
          </div>
        </div>

        <!-- Split Screen Layout: Left Upload & Preview (1fr), Right AI Feedback & Drills (1.15fr) -->
        <div class="snap-split">
          <!-- Left Column: Upload Work & Samples -->
          <div class="card" style="padding:22px">
            <div class="card-head">
              <h3>${I('upload', 18)} ${T('Upload Handwritten Work', 'হাতে লেখা কাজ আপলোড')}</h3>
              <span class="chip teal">${T('Step 1', 'ধাপ ১')}</span>
            </div>

            <!-- Subject Selector -->
            <label class="field" style="margin-bottom:14px">
              ${T('Select Academic Subject', 'বিষয় নির্বাচন')}
              <select id="snap-subj-select">
                <option value="math" ${selectedSubj === 'math' ? 'selected' : ''}>${T('Higher Mathematics (ক্যালকুলাস ও বীজগণিত)', 'উচ্চতর গণিত')}</option>
                <option value="chem" ${selectedSubj === 'chem' ? 'selected' : ''}>${T('Chemistry (রাসায়নিক সমীকরণ ও সমতা)', 'রসায়ন')}</option>
                <option value="bio" ${selectedSubj === 'bio' ? 'selected' : ''}>${T('Biology (সালোকসংশ্লেষণ ও কোষীয় বিক্রিয়া)', 'জীববিজ্ঞান')}</option>
                <option value="ict" ${selectedSubj === 'ict' ? 'selected' : ''}>${T('ICT (Python প্রোগ্রামিং ও লজিক)', 'আইসিটি')}</option>
              </select>
            </label>

            <!-- Drag & Drop Upload Zone -->
            <div class="dropzone" id="snap-drop-zone" style="min-height:130px;flex-direction:column;gap:10px;padding:20px;border-width:2px;margin-bottom:18px">
              <span class="ic-box lg">${I('camera', 24)}</span>
              <div style="text-align:center">
                <b>${T('Drag & drop photo here or browse', 'এখানে ছবি টেনে আনুন বা ফাইল বাছুন')}</b>
                <div class="small muted" style="margin-top:4px">${T('Supports PNG, JPG, HEIC under 4MB (2G-friendly)', '৪ MB এর মধ্যে ছবি দিন')}</div>
              </div>
              <label class="btn sm primary" style="cursor:pointer">
                ${I('upload', 14)} ${T('Choose Image', 'ছবি নির্বাচন')}
                <input type="file" accept="image/*" id="snap-file-input" class="sr-only">
              </label>
            </div>

            <!-- Pre-loaded Handwritten Student Samples -->
            <div class="eyebrow" style="margin-bottom:10px">${T('Or Try A Real Student Sample:', 'অথবা নমুনা বেছে নিন:')}</div>
            <div class="col" style="gap:8px">
              ${D.SNAPS.map((s, i) => `
                <button class="pick ${i === cur && !upload ? 'active' : ''}" data-snap-idx="${i}">
                  <b>${I(D.subject(s.subject).icon, 15)} ${esc(tx(s.title))}</b>
                  <span>${esc(s.student)}</span>
                </button>
              `).join('')}
            </div>
            
            <p class="small muted" style="margin-top:14px;line-height:1.5">
              ${I('shield', 13)} ${T('Student privacy guarantee: Photos are processed in memory and never stored for training.', 'ছবিগুলো ক্ষণস্থায়ী মেমরিতে বিশ্লেষিত হয় এবং কখনো মডেল প্রশিক্ষণে ব্যবহৃত হয় না।')}
            </p>
          </div>

          <!-- Right Column: Split Screen Handwritten Solution & AI Feedback -->
          <div class="card" style="padding:22px">
            <div class="card-head">
              <h3>${I('microscope', 18)} ${esc(tx(S.title))}</h3>
              <div class="row nowrap" style="gap:6px">
                ${ran ? `<span class="chip danger">${I('alert', 13)} ${T('Mistake on Line', 'ভুল লাইন')} ${D.n(S.err + 1)}</span>` : `<span class="chip gold">${I('zap', 13)} ${T('Click wrong line for +15 XP', 'ভুল লাইন অনুমানে +১৫ XP')}</span>`}
              </div>
            </div>

            <!-- Handwritten Paper Preview -->
            <div class="paper" id="snap-paper" style="margin-bottom:18px">
              ${S.lines.map((l, i) => `
                <div class="hl ${ran && i === S.err ? 'err' : ''}" data-line-no="${i}" style="${guess === i && !ran ? 'outline:2px dashed var(--primary);background:var(--primary-soft)' : ''}">
                  <span class="small mono muted" style="margin-right:12px;user-select:none">${i + 1}.</span>
                  <span>${esc(l)}</span>
                  ${ran && i === S.err ? `<span class="chip danger" style="margin-left:12px;padding:1px 6px;font-size:10.5px">${T('Mistake identified', 'চিহ্নিত ভুল')}</span>` : ''}
                </div>
              `).join('')}
            </div>

            <!-- Analyze Action Button -->
            <div class="row" style="gap:12px;margin-bottom:18px;align-items:center">
              <button class="btn primary" id="run-autopsy-btn" ${ran || scanning ? 'disabled' : ''}>
                ${scanning ? `<span class="spin">${I('refresh', 15)}</span> ${T('Analyzing Handwriting...', 'হাতে লেখা বিশ্লেষণ হচ্ছে...')}` : `${I('sparkles', 15)} ${T('Analyze My Work', 'আমার সমাধান বিশ্লেষণ করো')}`}
              </button>
              ${guess != null && !ran ? `<span class="chip em" style="font-size:12px">${I('pin', 12)} ${T('Predicted Error: Line', 'চিহ্নিত ভুল: লাইন')} ${D.n(guess + 1)}</span>` : ''}
            </div>

            <!-- AI Vision Scanning Animation Box -->
            ${scanning ? `
              <div class="card flat" style="background:var(--primary-soft);border:1.5px solid var(--primary-light);padding:18px;margin-bottom:18px;border-radius:12px">
                <div class="row nowrap" style="gap:12px;align-items:center">
                  <span class="spin" style="display:inline-block;color:var(--primary)">${I('sparkles', 24)}</span>
                  <div class="grow">
                    <b style="font-size:15px">${T('AI Vision Multimodal Scanning & Diagnosis...', 'AI ভিশন মাল্টিমোডাল স্ক্যানিং ও বিশ্লেষণ...')}</b>
                    <div class="small muted" style="margin-top:4px">${T('Extracting handwriting tokens · Cross-referencing NCTB curriculum formulas...', 'হাতের লেখা ডিজিটাইজ করা হচ্ছে · এনসিটিবি সূত্রের সাথে ধাপ মেলানো হচ্ছে...')}</div>
                    <div class="bar em" style="margin-top:8px;height:5px"><i style="width:85%;transition:width .5s ease"></i></div>
                  </div>
                </div>
              </div>
            ` : ''}

            <!-- AI Feedback and Mistake Diagnostic Section -->
            ${ran ? `
              <div class="banner ${guess === S.err ? 'em' : 'warn'}" style="margin-bottom:18px">
                <div class="grow">
                  <div class="row between" style="margin-bottom:4px">
                    <b>${I('alert', 16)} ${T('Diagnosis', 'নির্ণয়')}: ${esc(tx(S.tag))}</b>
                    ${guess != null ? (guess === S.err ? `<span class="chip ok">${T('Accurate Prediction! +15 XP', 'সঠিক অনুমান! +১৫ XP')}</span>` : `<span class="chip">${T('You predicted line', 'তোমার অনুমান')} ${D.n(guess + 1)}</span>`) : ''}
                  </div>
                  <p style="margin:6px 0;line-height:1.6">${esc(tx(S.explain))}</p>
                  <div class="small" style="margin-top:8px">
                    <b>${T('Corrected Derivation', 'সংশোধিত ধাপ')}:</b> <code>${esc(S.fix)}</code>
                    <button class="btn sm ghost" data-snap-src="${S.cite}" style="margin-left:8px">${I('bookOpen', 13)} ${T('NCTB Source', 'পাঠ্যসূত্র')}</button>
                  </div>
                </div>
              </div>

              <!-- 3 Targeted Practice Drills -->
              <div style="margin-top:20px">
                <div class="row between" style="margin-bottom:12px">
                  <h4 style="margin:0">${I('target', 16)} ${T('3 Targeted Remedial Practice Drills', '৩টি লক্ষ্যভিত্তিক প্রতিকার অনুশীলন')}</h4>
                  <span class="small muted">+10 XP ${T('per correct drill', 'প্রতিটি সঠিক অনুশীলনে')}</span>
                </div>
                <div class="col" style="gap:12px">
                  ${S.drills.map((d, di) => {
                    const ord = D.order(d.o.length, di + 71);
                    return `
                      <div class="card flat tint" style="border:1px solid var(--line);padding:14px" data-drill-box="${di}">
                        <div class="small" style="font-weight:700;margin-bottom:8px">
                          ${D.n(di + 1)}. ${esc(tx(d.q))}
                        </div>
                        <div class="opts">
                          ${ord.map((k, j) => `
                            <button class="opt" data-drill-choice="${k}">
                              <span class="k">${'ABCD'[j]}</span>
                              <span>${esc(typeof d.o[k] === 'string' ? d.o[k] : tx(d.o[k]))}</span>
                            </button>
                          `).join('')}
                        </div>
                      </div>
                    `;
                  }).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      // Event bindings
      D.$$('[data-snap-idx]').forEach((b) => {
        b.onclick = () => {
          cur = +b.dataset.snapIdx;
          ran = false;
          guess = null;
          upload = null;
          draw();
        };
      });

      D.$$('#snap-subj-select').forEach((s) => {
        s.onchange = (e) => {
          selectedSubj = e.target.value;
          const matchIdx = D.SNAPS.findIndex((x) => x.subject === selectedSubj);
          if (matchIdx !== -1) cur = matchIdx;
          ran = false;
          draw();
        };
      });

      D.$$('[data-line-no]').forEach((line) => {
        line.onclick = () => {
          if (ran) return;
          guess = +line.dataset.lineNo;
          draw();
        };
      });

      const upInp = D.$('#snap-file-input');
      if (upInp) {
        upInp.onchange = (e) => {
          const f = e.target.files[0];
          if (!f) return;
          const r = new FileReader();
          r.onload = () => {
            upload = { url: r.result, name: f.name };
            D.toast(T('Handwritten work loaded. Click "Analyze My Work".', 'ছবি লোড হয়েছে। "বিশ্লেষণ করো"-তে চাপুন।'));
            draw();
          };
          r.readAsDataURL(f);
        };
      }

      const runBtn = D.$('#run-autopsy-btn');
      if (runBtn) {
        runBtn.onclick = async () => {
          if (scanning || ran) return;
          scanning = true;
          draw();
          await D.sleep(600);
          scanning = false;
          ran = true;
          if (guess === S.err) {
            D.answer(true);
            D.addXP(15, T('Correct mistake prediction', 'সঠিক ভুল অনুমান'));
            D.toast(T('🎯 Bulls-eye Prediction! +15 XP Awarded', '🎯 নির্ভুল অনুমান! +১৫ XP অর্জিত'), 'ok', 'zap');
          }
          draw();
        };
      }

      // Source drawer
      D.$$('[data-snap-src]').forEach((b) => {
        b.onclick = () => D.showSource(b.dataset.snapSrc);
      });

      // Drills answering
      D.$$('[data-drill-box]').forEach((card) => {
        const di = +card.dataset.drillBox;
        const d = S.drills[di];
        D.$$('[data-drill-choice]', card).forEach((b) => {
          b.onclick = () => {
            const ok = +b.dataset.drillChoice === d.a;
            D.answer(ok);
            D.$$('.opt', card).forEach((opt) => {
              opt.disabled = true;
              if (+opt.dataset.drillChoice === d.a) opt.classList.add('right');
            });
            if (!ok) b.classList.add('wrong');
            else D.addXP(10, T('Remedial drill', 'প্রতিকার অনুশীলন'));
          };
        });
      });
    };

    draw();
  };

  /* ==========================================================================
     MODULE 8: Teacher & Parent Co-Pilot Dashboard
     ========================================================================== */
  D.TABS.copilot = (container) => {
    let mode = 'teacher'; // 'teacher' | 'parent'
    let selectedSubj = 'bio';
    let cqCount = 5;

    const CQ_GENERATORS = {
      bio: () => ({
        stem: {
          en: 'A 15-year-old student in Kurigram is admitted with a 3-day severe fever, joint pain, and headache. Laboratory results reveal: Platelet count 68,000/µL, WBC 3,100/µL, and NS1 Antigen test is POSITIVE. The family wants to buy over-the-counter antibiotics.',
          bn: 'কুড়িগ্রামের ১৫ বছর বয়সী একজন শিক্ষার্থী ৩ দিন ধরে তীব্র জ্বর, অস্থিসন্ধিতে ব্যথা ও মাথা ব্যথায় ভুগছে। রক্ত পরীক্ষায় পাওয়া গেল: অণুচক্রিকা (Platelet) ৬৮,০০০/µL, শ্বেতকণিকা ৩,১০০/µL এবং NS1 অ্যান্টিজেন পজিটিভ। পরিবার ফার্মেসি থেকে অ্যান্টিবায়োটিক কিনতে চায়।'
        },
        qA: { en: 'What is an antigen?', bn: 'অ্যান্টিজেন কী?' },
        qB: { en: 'Explain the function of cytotoxic T-cells in eliminating viral infected cells.', bn: 'ভাইরাস আক্রান্ত কোষ ধ্বংসকরণে সাইটোটক্সিক T-কোষের ভূমিকা ব্যাখ্যা করো।' },
        qC: { en: 'Analyze the diagnostic report to identify the pathogen and explain the drop in platelets.', bn: 'ডায়াগনস্টিক রিপোর্ট বিশ্লেষণ করে প্যাথোজেন শনাক্ত করো এবং প্লাটিলেট কমার কারণ ব্যাখ্যা করো।' },
        qD: { en: 'Evaluate the family\'s decision to administer antibiotics from an immunological perspective.', bn: 'পরিবারের অ্যান্টিবায়োটিক গ্রহণের সিদ্ধান্তটি ইমিউনোলজির আলোকে মূল্যায়ন করো।' }
      }),
      chem: () => ({
        stem: {
          en: 'In a laboratory water testing experiment, 25.0 mL of industrial runoff collected from the Buriganga River requires 18.5 mL of 0.10 M standard NaOH solution to reach the phenolphthalein equivalence point (pH 7-8).',
          bn: 'বুড়িগঙ্গা নদী থেকে সংগৃহীত ২৫.০ mL শিল্পবর্জ্যের অম্লীয় নমুনা ফেনলফথ্যালিন নির্দেশকের উপস্থিতিতে প্রশমিত হতে ১৮.৫ mL ০.১০ M প্রমাণ NaOH দ্রবণ প্রয়োজন হয়।'
        },
        qA: { en: 'Define acid-base titration.', bn: 'অম্ল-ক্ষার টাইট্রেশন কাকে বলে?' },
        qB: { en: 'Why does phenolphthalein change color at the equivalence point?', bn: 'প্রান্তবিন্দুতে ফেনলফথ্যালিনের বর্ণ পরিবর্তন ঘটে কেন?' },
        qC: { en: 'Calculate the molar concentration of acid in the river water sample.', bn: 'নদীর পানির নমুনায় অ্যাসিডের মোলার ঘনমাত্রা নির্ণয় করো।' },
        qD: { en: 'Evaluate the environmental impact on aquatic ecosystems if this effluent is discharged without neutralization.', bn: 'প্রশমন ব্যতীত এই শিল্পবর্জ্য নদীতে ফেললে জলজ বাস্তুতন্ত্রের উপর কী প্রভাব পড়বে বিশ্লেষণ করো।' }
      }),
      math: () => ({
        stem: {
          en: 'A flood relief quadcopter drone follows the parabolic altitude path y = -0.05x² + 2.4x + 15 meters, where x is horizontal distance from the Gaibandha launch pad.',
          bn: 'গাইবান্ধা লঞ্চপ্যাড থেকে উৎক্ষেপিত একটি বন্যা ত্রাণ ড্রোনের গতিপথ y = -0.05x² + 2.4x + 15 মিটার সমীকরণ মেনে চলে (যেখানে x অনুভূমিক দূরত্ব)।'
        },
        qA: { en: 'What is a quadratic function?', bn: 'দ্বিঘাত ফাংশন কী?' },
        qB: { en: 'Explain why the parabola opens downward in this flight trajectory.', bn: 'এই গতিপথে পরাবৃত্তটি কেন নিচের দিকে উন্মুক্ত তা ব্যাখ্যা করো।' },
        qC: { en: 'Determine the maximum altitude reached by the relief drone.', bn: 'ত্রাণ ড্রোনটি কত সর্বোচ্চ উচ্চতায় পৌঁছাবে তা নির্ণয় করো।' },
        qD: { en: 'If an obstruction of height 35m stands at x = 15m, analyze whether the drone safely clears it.', bn: 'x = ১৫ মিটারে ৩৫ মিটার উঁচু প্রতিবন্ধক থাকলে ড্রোনটি তা নিরাপদে অতিক্রম করবে কিনা গাণিতিকভাবে বিশ্লেষণ করো।' }
      })
    };

    const draw = () => {
      container.innerHTML = `
        <div class="row between" style="margin-bottom:24px;gap:16px;align-items:flex-end">
          <div>
            <div class="row nowrap" style="gap:8px;margin-bottom:6px">
              <span class="chip primary">${I('users', 14)} Co-Pilot Intelligence</span>
              <span class="chip teal">${I('teacher', 14)} NCTB Curriculum Aligned</span>
              ${D.demoTag()}
            </div>
            <h1 style="font-size:clamp(24px, 2.8vw, 34px);margin:0">
              ${T('Teacher and Parent Co-Pilot', 'শিক্ষক ও অভিভাবক কো-পাইলট')}
            </h1>
            <p class="muted" style="margin:6px 0 0;font-size:14.5px">
              ${T('Empowering educators with AI lesson plans, creative questions, and misconception diagnostics, while giving parents weekly transparent progress reports.', 'শিক্ষকদের জন্য পাঠ পরিকল্পনা ও সৃজনশীল প্রশ্ন তৈরি এবং অভিভাবকদের জন্য সহজ বাংলায় সাপ্তাহিক অগ্রগতি বিবরণী।')}
            </p>
          </div>

          <!-- Section Switcher Mode -->
          <div class="tabs pills">
            <button class="tab ${mode === 'teacher' ? 'active' : ''}" id="mode-teacher-btn">
              ${I('teacher', 16)} ${T('Teacher Section', 'শিক্ষক বিভাগ')}
            </button>
            <button class="tab ${mode === 'parent' ? 'active' : ''}" id="mode-parent-btn">
              ${I('users', 16)} ${T('Parent Section', 'অভিভাবক বিভাগ')}
            </button>
          </div>
        </div>

        ${mode === 'teacher' ? renderTeacherSection() : renderParentSection()}
      `;

      D.$('#mode-teacher-btn').onclick = () => { mode = 'teacher'; draw(); };
      D.$('#mode-parent-btn').onclick = () => { mode = 'parent'; draw(); };

      if (mode === 'teacher') {
        const subSel = D.$('#cp-subject-sel');
        if (subSel) subSel.onchange = (e) => { selectedSubj = e.target.value; draw(); };
        const copyBtn = D.$('#cp-copy-cq');
        if (copyBtn) copyBtn.onclick = () => {
          D.toast(T('NCTB Creative Question copied to clipboard!', 'সৃজনশীল প্রশ্ন কপি হয়েছে!'));
        };
        const printBtn = D.$('#cp-print-cq');
        if (printBtn) printBtn.onclick = () => window.print();
      }
    };

    function renderTeacherSection() {
      const cq = (CQ_GENERATORS[selectedSubj] || CQ_GENERATORS.bio)();

      return `
        <div class="bento" style="gap:24px">
          <!-- Left 8 cols: Lesson Plan & CQ Generator -->
          <div class="card s8 primary-edge" id="printable-cq-view">
            <div class="row between" style="margin-bottom:16px">
              <div class="row nowrap" style="gap:10px">
                <span class="ic-box lg">${I('file', 20)}</span>
                <div>
                  <h3 style="font-size:18px;margin:0">${T('NCTB Creative Question (CQ) & Lesson Plan Generator', 'সৃজনশীল প্রশ্ন (CQ) ও পাঠ পরিকল্পনা')}</h3>
                  <span class="small muted">Standard 10-Mark Format (ক ১, খ ২, গ ৩, ঘ ৪)</span>
                </div>
              </div>

              <div class="row nowrap" style="gap:6px">
                <select id="cp-subject-sel" style="width:auto;font-weight:600">
                  <option value="bio" ${selectedSubj === 'bio' ? 'selected' : ''}>Biology (জীববিজ্ঞান)</option>
                  <option value="chem" ${selectedSubj === 'chem' ? 'selected' : ''}>Chemistry (রসায়ন)</option>
                  <option value="math" ${selectedSubj === 'math' ? 'selected' : ''}>Mathematics (উচ্চতর গণিত)</option>
                </select>
                <button class="btn sm" id="cp-copy-cq">${I('copy', 14)} ${T('Copy', 'কপি')}</button>
                <button class="btn sm" id="cp-print-cq">${I('printer', 14)} ${T('Print', 'প্রিন্ট')}</button>
              </div>
            </div>

            <!-- AI Generated Stimulus (উদ্দীপক) -->
            <div class="card flat tint" style="border:1px solid var(--line);padding:16px;margin-bottom:16px">
              <div class="eyebrow" style="margin-bottom:6px">${T('Stimulus / Scenario (উদ্দীপক)', 'উদ্দীপক')}</div>
              <p style="margin:0;line-height:1.65;font-size:14.5px">
                ${D.state.lang === 'bn' ? esc(cq.stem.bn) : esc(cq.stem.en)}
              </p>
            </div>

            <!-- CQ 4 Sub-questions Table -->
            <table class="t" style="margin-bottom:18px">
              <thead>
                <tr>
                  <th style="width:40px">${T('Part', 'অংশ')}</th>
                  <th>${T('Question', 'প্রশ্ন')}</th>
                  <th style="width:110px">${T('Bloom Level', 'ব্লুম স্তর')}</th>
                  <th class="num" style="width:50px">${T('Marks', 'নম্বর')}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><b>(ক)</b></td>
                  <td>${D.state.lang === 'bn' ? esc(cq.qA.bn) : esc(cq.qA.en)}</td>
                  <td><span class="chip primary">Knowledge (জ্ঞান)</span></td>
                  <td class="num"><b>1</b></td>
                </tr>
                <tr>
                  <td><b>(খ)</b></td>
                  <td>${D.state.lang === 'bn' ? esc(cq.qB.bn) : esc(cq.qB.en)}</td>
                  <td><span class="chip teal">Comprehension (অনুধাবন)</span></td>
                  <td class="num"><b>2</b></td>
                </tr>
                <tr>
                  <td><b>(গ)</b></td>
                  <td>${D.state.lang === 'bn' ? esc(cq.qC.bn) : esc(cq.qC.en)}</td>
                  <td><span class="chip gold">Application (প্রয়োগ)</span></td>
                  <td class="num"><b>3</b></td>
                </tr>
                <tr>
                  <td><b>(ঘ)</b></td>
                  <td>${D.state.lang === 'bn' ? esc(cq.qD.bn) : esc(cq.qD.en)}</td>
                  <td><span class="chip danger">Higher Ability (উচ্চতর দক্ষতা)</span></td>
                  <td class="num"><b>4</b></td>
                </tr>
              </tbody>
            </table>

            <!-- AI Lesson Plan Generator Summary -->
            <div class="card flat tint" style="border:1px solid var(--line);padding:16px">
              <div class="row between" style="margin-bottom:8px">
                <b style="font-size:14px">${I('sparkles', 15)} ${T('AI Structured Lesson Plan (45 Minutes)', '৪৫ মিনিটের স্বয়ংক্রিয় পাঠ পরিকল্পনা')}</b>
                <span class="chip ok">NCTB Guideline</span>
              </div>
              <div class="grid g3" style="font-size:13px;line-height:1.5">
                <div>
                  <b>0-10m: Entry Hook</b>
                  <p class="muted" style="margin:4px 0 0">Present real patient fever symptoms and prompt Socratic discussion.</p>
                </div>
                <div>
                  <b>10-30m: Active Investigation</b>
                  <p class="muted" style="margin:4px 0 0">Students analyze cell components and run titration derivations in pairs.</p>
                </div>
                <div>
                  <b>30-45m: Feynman Reflection</b>
                  <p class="muted" style="margin:4px 0 0">Peer explain-back to verify true understanding and debunk antibiotic myths.</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right 4 cols: Class Misconception & Performance Analytics -->
          <div class="col s4" style="gap:20px">
            <!-- Student Misconceptions Diagnostics -->
            <div class="card">
              <div class="card-head">
                <h3>${I('alert', 16)} ${T('Student Misconception Radar', 'ভুল ধারণা বিশ্লেষণ')}</h3>
                <span class="chip danger">Action Needed</span>
              </div>
              <p class="small muted" style="margin:0 0 14px">Detected from student errors in quizzes & homework:</p>
              
              <div class="col" style="gap:10px">
                <div>
                  <div class="row between small"><span>Confusing Virus with Bacteria (Antibiotic misuse)</span><b>64%</b></div>
                  ${D.bar(64, 'red thin')}
                </div>
                <div>
                  <div class="row between small"><span>Subscripts vs Coefficients in Balancing</span><b>48%</b></div>
                  ${D.bar(48, 'gold thin')}
                </div>
                <div>
                  <div class="row between small"><span>Off-by-one in range(1, n) Loops</span><b>52%</b></div>
                  ${D.bar(52, 'red thin')}
                </div>
                <div>
                  <div class="row between small"><span>Sign inversion in Projectile Velocity</span><b>38%</b></div>
                  ${D.bar(38, 'teal thin')}
                </div>
              </div>
              <button class="btn sm primary" style="margin-top:14px;width:100%;justify-content:center">
                ${T('Push Remedial Practice Drill to Class', 'ক্লাসে প্রতিকারমূলক ড্রিল পাঠাও')}
              </button>
            </div>

            <!-- Class Performance Overview -->
            <div class="card">
              <div class="card-head">
                <h3>${I('chart', 16)} ${T('Class Performance Overview', 'ক্লাস পারফরম্যান্স')}</h3>
                <span class="chip">Grade 11-A</span>
              </div>
              <div class="row between" style="margin-bottom:10px">
                <span class="small muted">Average Mastery Score:</span>
                <b style="font-size:16px;color:var(--primary)">74.2%</b>
              </div>
              <div class="row between" style="margin-bottom:10px">
                <span class="small muted">Active Learners:</span>
                <b>42 / 45 Students</b>
              </div>
              <div class="row between">
                <span class="small muted">Homework Completion Rate:</span>
                <b style="color:var(--ok)">91.3%</b>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    function renderParentSection() {
      const g = D.state.game;
      return `
        <div class="bento" style="gap:24px">
          <!-- Left 8 cols: Bangla Weekly Progress Summary -->
          <div class="card s8 primary-edge">
            <div class="row between" style="margin-bottom:16px">
              <div class="row nowrap" style="gap:10px">
                <span class="ic-box lg">${I('users', 20)}</span>
                <div>
                  <h3 style="font-size:18px;margin:0">${T('Weekly Progress Report for Guardians', 'অভিভাবকের জন্য সাপ্তাহিক অগ্রগতি বিবরণী')}</h3>
                  <span class="small muted">Student: Aurin Jahan (আউরিন জাহান) · Class 11 Science</span>
                </div>
              </div>
              <span class="chip ok">${I('checkCircle', 13)} এই সপ্তাহে নিয়মিত</span>
            </div>

            <!-- Easy Bangla Summary -->
            <div class="card flat tint" style="border:1px solid var(--line);padding:20px;margin-bottom:20px;font-size:15px;line-height:1.8">
              <b>সম্মানিত অভিভাবক,</b><br>
              আপনার সন্তান <b>আউরিন জাহান</b> এই সপ্তাহে দিশারী প্ল্যাটফর্মে <b>টানা ২১ দিন</b> সফলভাবে পড়াশোনা অব্যাহত রেখেছে এবং মোট <b>২১,৪৫০ XP</b> অর্জন করেছে।
              <br><br>
              <b>এই সপ্তাহের সাফল্য:</b>
              <ul style="margin:6px 0 12px;padding-left:22px">
                <li>জীববিজ্ঞান অধ্যায় ৪ (সালোকসংশ্লেষণ ও জীবনীশক্তি) পাঠ্যক্রমের ৮২% দক্ষতা অর্জন করেছে।</li>
                <li>ডেঙ্গু রোগ প্রতিরোধ ও ভেক্টর নিয়ন্ত্রণের বাস্তব চ্যালেঞ্জ সফলভাবে সম্পন্ন করেছে।</li>
                <li>বায়োইনফরমেটিক্স মাইক্রো-ইন্টার্নশিপ ও ৩-প্রশ্নের এআই ভাইভায় সফল হয়ে ডিজিটাল স্কিল পাসপোর্ট অর্জন করেছে।</li>
              </ul>
              <b>যে বিষয়ে আরও মনোযোগ প্রয়োজন:</b><br>
              রসায়ন রাসায়নিক সমীকরণ সমতা ও মোলারিটি গণনায় সামান্য ভুলত্রুটি হয়েছে। তাকে প্রতিদিন অন্তত ১৫ মিনিট "ফাইনম্যান পদ্ধতিতে টিউটরকে বোঝানো" অনুশীলনে উৎসাহিত করুন।
            </div>

            <!-- SMS Notification Preview -->
            <div class="card flat" style="background:var(--card2);border:1px dashed var(--line2);padding:16px">
              <div class="row between" style="margin-bottom:6px">
                <b class="small">${I('message', 14)} বাংলা এসএমএস প্রিভিউ (অফলাইন অভিভাবকদের জন্য)</b>
                <span class="small muted">১৬০ অক্ষর · ইউনিকোড</span>
              </div>
              <code style="display:block;white-space:pre-wrap;font-size:13px;color:var(--text)">আউরিন এই সপ্তাহে ৪টি বিজ্ঞান পাঠ শেষ করেছে এবং ডেঙ্গু সচেতনতা প্রকল্পে সফল হয়েছে। রসায়ন সমতায় আরেকটু অনুশীলন দরকার। - দিশারী ওএস</code>
              <button class="btn sm primary" style="margin-top:10px" onclick="window.D.toast('SMS sent to guardian (simulated)', 'অভিভাবকের মোবাইলে এসএমএস পাঠানো হয়েছে (সিমুলেটেড)')">
                ${I('send', 13)} ${T('Send SMS to Guardian Phone', 'অভিভাবকের ফোনে SMS পাঠান')}
              </button>
            </div>
          </div>

          <!-- Right 4 cols: Home Learning Recommendations -->
          <div class="col s4" style="gap:20px">
            <div class="card">
              <div class="card-head">
                <h3>${I('lightbulb', 16)} ${T('Home Learning Recommendations', 'পারিবারিক সহযোগিতার পরামর্শ')}</h3>
              </div>
              <div class="col small" style="gap:12px;line-height:1.6">
                <div class="row nowrap" style="gap:10px">
                  <span class="ic-box ok">${I('check', 15)}</span>
                  <span><b>উৎসাহিত করুন:</b> প্রতিদিন নির্দিষ্ট সময়ে পড়ার অভ্যাস গড়ে তোলায় প্রশংসা করুন।</span>
                </div>
                <div class="row nowrap" style="gap:10px">
                  <span class="ic-box teal">${I('bookOpen', 15)}</span>
                  <span><b>প্রশ্ন করুন:</b> "আজ এআই শিক্ষকের কাছ থেকে নতুন কী শিখলে?" এমন প্রশ্ন করে কথা বলতে দিন।</span>
                </div>
                <div class="row nowrap" style="gap:10px">
                  <span class="ic-box gold">${I('clock', 15)}</span>
                  <span><b>বিরতি নিশ্চিত করুন:</b> একটানা পড়ার পর চোখ ও মনের বিশ্রামের দিকে খেয়াল রাখুন।</span>
                </div>
              </div>
            </div>

            <!-- Quick Contacts -->
            <div class="card">
              <div class="card-head">
                <h3>${I('teacher', 16)} ${T('College Teacher Connect', 'শ্রেণি শিক্ষকের সাথে যোগাযোগ')}</h3>
              </div>
              <div class="small muted" style="line-height:1.6;margin-bottom:12px">
                রংপুর সরকারি কলেজ জীববিজ্ঞান শিক্ষক <b>মো. কামরুল হাসান</b> এর সাথে যেকোনো পরামর্শের জন্য অ্যাপের মাধ্যমে বার্তা পাঠাতে পারেন।
              </div>
              <button class="btn sm" onclick="window.D.toast('Connecting to teacher co-pilot...', 'শিক্ষকের সাথে সংযোগ করা হচ্ছে...')">
                ${I('messageSquare', 14)} বার্তা পাঠান
              </button>
            </div>
          </div>
        </div>
      `;
    }

    draw();
  };

  /* ==========================================================================
     MODULE 9: Career Navigator & Concept-to-Skill-to-Job Graph
     ========================================================================== */
  D.TABS.career = (container) => {
    const matches = D.careerMatches();
    let sel = matches[0].c.id;

    const draw = () => {
      const m = matches.find((x) => x.c.id === sel) || matches[0];
      const subjW = Object.entries(m.c.w);

      container.innerHTML = `
        <div class="row between" style="margin-bottom:24px;gap:16px;align-items:flex-end">
          <div>
            <div class="row nowrap" style="gap:8px;margin-bottom:6px">
              <span class="chip primary">${I('compass', 14)} Labor Market Intelligence</span>
              <span class="chip teal">${I('globe', 14)} O*NET 28 Occupations</span>
              ${D.liveTag(T('From Quest Mastery', 'দক্ষতাভিত্তিক'))}
            </div>
            <h1 style="font-size:clamp(24px, 2.8vw, 34px);margin:0">
              ${T('Career Navigator: Classroom to Global Careers', 'ক্যারিয়ার নেভিগেটর: ক্লাসরুম থেকে বৈশ্বিক ক্যারিয়ার')}
            </h1>
            <p class="muted" style="margin:6px 0 0;font-size:14.5px">
              ${T('Discover how your academic subjects connect to high-growth tech and science occupations. Identify skill gaps and bridge them with verified micro-credentials.', 'শ্রেণিকক্ষের বিজ্ঞান বিষয়গুলো কীভাবে বাস্তব পেশার সাথে যুক্ত তা আবিষ্কার করো। নিজের যোগ্যতার ফাঁক চিহ্নিত করে তা পূরণ করো।')}
            </p>
          </div>
        </div>

        <!-- 4 Recommended Occupations Grid -->
        <div class="grid g4" style="margin-bottom:28px">
          ${matches.slice(0, 4).map((x) => {
            const isAct = x.c.id === sel;
            return `
              <div class="card hoverable ${isAct ? 'primary-edge' : ''}" data-car-id="${x.c.id}" style="cursor:pointer;border-color:${isAct ? 'var(--primary)' : 'var(--line)'}">
                <div class="row between" style="margin-bottom:8px">
                  <span class="chip ${isAct ? 'primary' : ''}">${D.n(x.pct)}% ${T('Match', 'মিল')}</span>
                  <span class="small mono muted">O*NET ${x.c.onet}</span>
                </div>
                <b style="font-size:15px;display:block;margin-bottom:6px">${esc(tx(x.c.name))}</b>
                ${D.bar(x.pct, isAct ? '' : 'teal')}
                <div class="row between small muted" style="margin-top:10px">
                  <span>${T('Skill Gap', 'ঘাটতি')}: <b>${esc(tx(D.subject(x.gap).name))}</b></span>
                  <span style="color:var(--primary);font-weight:700">${isAct ? 'Selected' : 'View'} →</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Interactive Concept-to-Skill-to-Job Graph & Gap Analysis -->
        <div class="bento" style="gap:24px">
          <!-- Left 8 cols: Interactive Skills Graph -->
          <div class="card s8">
            <div class="card-head">
              <h3>${I('network', 18)} ${T('Concept → Skill → Job Interactive Graph', 'ধারণা → দক্ষতা → পেশা সংযোগ গ্রাফ')}: ${esc(tx(m.c.name))}</h3>
              <span class="chip primary">O*NET ${m.c.onet}</span>
            </div>
            <p class="small muted" style="margin:0 0 16px">
              Live mapping of NCTB curriculum units through applied workforce skills to global labor market demand.
            </p>

            <!-- Dynamic SVG Node Graph -->
            <div style="background:var(--card2);padding:16px;border-radius:12px;border:1px solid var(--line);overflow-x:auto">
              <svg viewBox="0 0 580 ${60 + subjW.length * 52}" width="100%" class="chart" style="display:block">
                <!-- Academic Concept Nodes on Left -->
                ${subjW.map(([s, w], i) => {
                  const y = 36 + i * 52;
                  const ms = D.subjectMastery(s);
                  return `
                    <g transform="translate(10, ${y - 18})">
                      <rect width="160" height="36" rx="8" fill="var(--card)" stroke="${ms >= 70 ? 'var(--primary)' : 'var(--gold)'}" stroke-width="1.8"/>
                      <text x="12" y="22" font-size="12" font-weight="700" fill="var(--text)">${esc(tx(D.subject(s).name))}</text>
                      <text x="148" y="22" text-anchor="end" font-size="11.5" font-weight="800" fill="${ms >= 70 ? 'var(--ok)' : 'var(--gold)'}">${D.n(ms)}%</text>
                    </g>
                    <!-- Curved connecting paths -->
                    <path d="M 170 ${y} C 230 ${y}, 230 ${(subjW.length * 52) / 2 + 10}, 270 ${(subjW.length * 52) / 2 + 10}" fill="none" stroke="var(--line2)" stroke-width="${1 + w * 6}" stroke-linecap="round"/>
                  `;
                }).join('')}

                <!-- Central Applied Skill Node -->
                <g transform="translate(270, ${(subjW.length * 52) / 2 - 12})">
                  <rect width="150" height="44" rx="10" fill="var(--secondary-soft)" stroke="var(--secondary)" stroke-width="2"/>
                  <text x="75" y="22" text-anchor="middle" font-size="11.5" font-weight="800" fill="var(--secondary)">APPLIED SKILL</text>
                  <text x="75" y="36" text-anchor="middle" font-size="11" font-weight="600" fill="var(--text)">${esc(D.INTERNSHIPS[m.c.intern].skill)}</text>
                </g>

                <!-- Connecting line to Target Job -->
                <line x1="420" y1="${(subjW.length * 52) / 2 + 10}" x2="450" y2="${(subjW.length * 52) / 2 + 10}" stroke="var(--primary)" stroke-width="3" stroke-dasharray="4,3"/>

                <!-- Target Occupation Node on Right -->
                <g transform="translate(450, ${(subjW.length * 52) / 2 - 12})">
                  <rect width="120" height="44" rx="10" fill="var(--primary-soft)" stroke="var(--primary)" stroke-width="2"/>
                  <text x="60" y="20" text-anchor="middle" font-size="11" font-weight="800" fill="var(--primary)">O*NET OCCUPATION</text>
                  <text x="60" y="34" text-anchor="middle" font-size="10.5" font-weight="600" fill="var(--text)">${m.c.onet}</text>
                </g>
              </svg>
            </div>

            <!-- Career Recommendation Card & Skill Gap Callout -->
            <div class="banner em" style="margin-top:18px">
              <div>
                <b style="font-size:14.5px">${T('Skill Gap Analysis & Recommendation:', 'দক্ষতার ঘাটতি ও করণীয়:')}</b>
                <p style="margin:4px 0 8px;line-height:1.6">
                  ${T('Your biggest growth gap for', 'তোমার সবচেয়ে বড় ঘাটতি')} <b>${esc(tx(m.c.name))}</b> ${T('is in', 'রয়েছে')} <b>${esc(tx(D.subject(m.gap).name))} (${D.n(m.gapV)}%)</b>.
                  ${T('Recommended next step: Complete the real-world challenge in', 'সুপারিশকৃত পদক্ষেপ: এর বাস্তব চ্যালেঞ্জ ও মাইক্রো-ইন্টার্নশিপ সম্পন্ন করো।')}
                </p>
                <div class="row" style="gap:10px">
                  <button class="btn sm primary" onclick="window.D.wsGo('bridge')">${I('route', 13)} ${T('Take SkillBridge Challenge', 'স্কিলব্রিজ চ্যালেঞ্জ নাও')}</button>
                  <button class="btn sm ghost" onclick="window.D.wsGo('quest')">${I('puzzle', 13)} ${T('Practice Subject Quest', 'কোয়েস্ট অনুশীলন')}</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Right 4 cols: Career Profile Overview -->
          <div class="col s4" style="gap:20px">
            <div class="card">
              <div class="card-head">
                <h3>${I('user', 18)} ${T('Career Profile Overview', 'ক্যারিয়ার প্রোফাইল')}</h3>
                <span class="chip ok">Active Target</span>
              </div>
              <div class="col small" style="gap:10px">
                <div>
                  <span class="muted">${T('Target Career:', 'লক্ষ্য পেশা:')}</span>
                  <b style="display:block;font-size:14px;color:var(--primary)">Biomedical (AI) Engineer</b>
                </div>
                <div>
                  <span class="muted">${T('Global Alignment:', 'বৈশ্বিক মান:')}</span>
                  <b>O*NET 17-2031.00 (Bioengineering)</b>
                </div>
                <div>
                  <span class="muted">${T('Education Level:', 'শিক্ষাগত যোগ্যতা:')}</span>
                  <b>HSC Science (Rangpur Govt. College)</b>
                </div>
                <div>
                  <span class="muted">${T('Overall Readiness Score:', 'সার্বিক প্রস্তুতি স্কোর:')}</span>
                  <div class="row nowrap" style="gap:8px;margin-top:4px">
                    ${D.bar(82, 'teal')}
                    <b>82%</b>
                  </div>
                </div>
              </div>
            </div>

            <!-- Current Skills Portfolio -->
            <div class="card">
              <div class="card-head">
                <h3>${I('award', 18)} ${T('Current Verified Skills', 'অর্জিত যাচাইকৃত দক্ষতা')}</h3>
              </div>
              <div class="row" style="gap:6px">
                <span class="chip primary">Cell Biology</span>
                <span class="chip primary">DNA GC-Content</span>
                <span class="chip teal">Python Loops</span>
                <span class="chip teal">Titration pH</span>
                <span class="chip">Kinematics</span>
                <span class="chip">Logic Gates</span>
              </div>
            </div>
          </div>
        </div>
      `;

      D.$$('[data-car-id]').forEach((b) => {
        b.onclick = () => {
          sel = b.dataset.carId;
          draw();
        };
      });
    };

    draw();
  };

  /* ==========================================================================
     MODULE 11: Talent Marketplace (Employer B2B Dashboard)
     ========================================================================== */
  D.TABS.talent = (container) => {
    let skillFilter = '';
    let occFilter = '';
    let eduFilter = '';
    let searchTxt = '';

    const draw = () => {
      let list = D.TALENT.filter((c) => {
        if (skillFilter && !c.skills.includes(skillFilter)) return false;
        if (eduFilter && !c.track.toLowerCase().includes(eduFilter.toLowerCase())) return false;
        if (searchTxt && !c.id.toLowerCase().includes(searchTxt.toLowerCase()) && !c.skills.some((s) => s.toLowerCase().includes(searchTxt.toLowerCase()))) return false;
        return true;
      }).sort((a, b) => b.readiness - a.readiness);

      const allSkills = Array.from(new Set(D.TALENT.flatMap((c) => c.skills)));

      container.innerHTML = `
        <div class="row between" style="margin-bottom:24px;gap:16px;align-items:flex-end">
          <div>
            <div class="row nowrap" style="gap:8px;margin-bottom:6px">
              <span class="chip primary">${I('briefcase', 14)} Employer & Recruiter Portal</span>
              <span class="chip ok">${I('shieldCheck', 14)} Privacy-First Blind Hiring</span>
              ${D.demoTag()}
            </div>
            <h1 style="font-size:clamp(24px, 2.8vw, 34px);margin:0">
              ${T('Verified Talent Discovery', 'যাচাইকৃত প্রতিভা অনুসন্ধান')}
            </h1>
            <p class="muted" style="margin:6px 0 0;font-size:14.5px">
              ${T('Connect directly with rural, madrasah, and polytechnic candidates based on cryptographically verified skills. Personal identity is blinded until learner provides explicit consent.', 'গ্রামীণ, মাদ্রাসা ও পলিটেকনিক শিক্ষার্থীদের যাচাইকৃত দক্ষতার ভিত্তিতে খুঁজে নিন। প্রার্থীর সম্মতি ছাড়া পরিচয় গোপন থাকবে।')}
            </p>
          </div>
        </div>

        <!-- Privacy & Compliance Notice Banner -->
        <div class="banner info" style="margin-bottom:24px">
          <div class="grow">
            <b>${I('lock', 16)} ${T('Strict Blind-Hiring Privacy Guarantee (PDPO 2025):', 'গোপনীয়তা ও ব্লাইন্ড হায়ারিং সুরক্ষা:')}</b>
            <span style="line-height:1.6;display:block;margin-top:2px">
              ${T('Candidates are anonymized by default. Names, photos, gender, and personal contact info are never displayed to prevent algorithmic bias. Contact information is shared only after the learner reviews and accepts your request.', 'পক্ষপাত রোধে নাম, ছবি, লিঙ্গ ও যোগাযোগ গোপন থাকে। শিক্ষার্থী অনুরোধ গ্রহণ করলে তবেই যোগাযোগের তথ্য প্রকাশ পাবে।')}
            </span>
          </div>
        </div>

        <!-- Filters Strip -->
        <div class="card" style="padding:18px 20px;margin-bottom:24px">
          <div class="grid g4" style="gap:14px;align-items:flex-end">
            <!-- Search Input -->
            <label class="field">
              ${T('Search by Candidate ID or Skill', 'আইডি বা দক্ষতা দিয়ে খুঁজুন')}
              <input type="text" id="talent-search-inp" placeholder="e.g. BD-RP-0415, Python, BIOINF..." value="${esc(searchTxt)}">
            </label>

            <!-- Skill Filter -->
            <label class="field">
              ${T('Filter by Verified Skill', 'দক্ষতা ফিল্টার')}
              <select id="talent-skill-sel">
                <option value="">${T('All Verified Skills', 'সকল দক্ষতা')}</option>
                ${allSkills.map((s) => `<option value="${s}" ${skillFilter === s ? 'selected' : ''}>${s}</option>`).join('')}
              </select>
            </label>

            <!-- Education Level Filter -->
            <label class="field">
              ${T('Education Stream', 'শিক্ষা ধারা')}
              <select id="talent-edu-sel">
                <option value="">${T('All Education Streams', 'সকল ধারা')}</option>
                <option value="HSC" ${eduFilter === 'HSC' ? 'selected' : ''}>HSC Science</option>
                <option value="Polytechnic" ${eduFilter === 'Polytechnic' ? 'selected' : ''}>Polytechnic Diploma</option>
                <option value="Madrasah" ${eduFilter === 'Madrasah' ? 'selected' : ''}>Madrasah (Alim Science)</option>
              </select>
            </label>

            <!-- Reset Filters Button -->
            <div>
              <button class="btn ghost" id="talent-reset-btn" style="width:100%;justify-content:center">
                ${I('refresh', 14)} ${T('Reset Filters', 'ফিল্টার রিসেট')}
              </button>
            </div>
          </div>
        </div>

        <!-- Candidate Cards Grid -->
        <div class="grid g3">
          ${list.map((c) => `
            <div class="card hoverable" style="display:flex;flex-direction:column;border-top:3px solid var(--primary)">
              <!-- Card Header -->
              <div class="row between" style="margin-bottom:12px">
                <div class="row nowrap" style="gap:8px">
                  <div class="user-avatar" style="width:32px;height:32px;font-size:12px">${c.id.slice(3, 5)}</div>
                  <b class="mono" style="font-size:14px">Candidate #${esc(c.id)}</b>
                </div>
                <span class="chip ok" style="font-size:11px">${I('shieldCheck', 12)} Skill Passport</span>
              </div>

              <!-- Education & Track -->
              <div class="small muted" style="margin-bottom:8px">
                <b>${esc(c.track)}</b> · ${esc(c.langs)}
              </div>

              <!-- Verified Skill Badges -->
              <div class="row" style="gap:5px;margin-bottom:14px">
                ${c.skills.map((s) => `<span class="chip primary" style="font-size:11px">${esc(s)}</span>`).join('')}
              </div>

              <!-- Readiness Score Meter -->
              <div class="grow">
                <div class="row between small" style="margin-bottom:4px">
                  <span>${T('Workforce Readiness Score', 'কর্মসংস্থান প্রস্তুতি')}</span>
                  <b style="color:var(--primary);font-size:14px">${D.n(c.readiness)}%</b>
                </div>
                ${D.bar(c.readiness, 'teal')}
              </div>

              <!-- Action Footer -->
              <div class="row between" style="margin-top:16px;border-top:1px solid var(--line);padding-top:12px">
                <span class="small muted">${D.n(c.passports)} ${T('Verified Passports', 'সনদ')}</span>
                <button class="btn sm primary" data-request-intro="${esc(c.id)}">
                  ${I('messageSquare', 13)} ${T('Request Contact', 'যোগাযোগের অনুরোধ')}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      `;

      // Search & filter listeners
      const sInp = D.$('#talent-search-inp');
      if (sInp) {
        sInp.oninput = (e) => {
          searchTxt = e.target.value.trim();
          draw();
        };
      }

      const skSel = D.$('#talent-skill-sel');
      if (skSel) {
        skSel.onchange = (e) => {
          skillFilter = e.target.value;
          draw();
        };
      }

      const edSel = D.$('#talent-edu-sel');
      if (edSel) {
        edSel.onchange = (e) => {
          eduFilter = e.target.value;
          draw();
        };
      }

      const rstBtn = D.$('#talent-reset-btn');
      if (rstBtn) {
        rstBtn.onclick = () => {
          searchTxt = '';
          skillFilter = '';
          eduFilter = '';
          draw();
        };
      }

      // Contact request modal
      D.$$('[data-request-intro]').forEach((btn) => {
        btn.onclick = () => {
          const cid = btn.dataset.requestIntro;
          D.modal(
            T('Contact Request Sent', 'যোগাযোগের অনুরোধ পাঠানো হয়েছে'),
            `
              <div style="padding:10px 0">
                <p>
                  ${T('Your request has been routed to', 'আপনার অনুরোধটি পাঠানো হয়েছে')} <b class="mono">Candidate #${esc(cid)}</b>.
                </p>
                <p class="small muted" style="line-height:1.6">
                  Under Dishari blind-hiring protocols, the learner will review your company profile in their notification tray. Once they tap "Consent & Connect", their full verified profile, academic credentials, and email will be unlocked in your recruiter inbox.
                </p>
                <button class="btn primary" onclick="window.D.closeModal()">${T('Understood', 'বুঝেছি')}</button>
              </div>
            `
          );
        };
      });
    };

    draw();
  };
})();

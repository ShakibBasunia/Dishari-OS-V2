/* Dishari OS - Landing Page
   Figma Make App PDF Inspired UI/UX Design
   Primary: Deep Indigo (#3730A3) · Accent: Coral (#FF5A36) · Secondary: Teal (#0D9488)
*/
(function () {
  'use strict';
  const D = window.D;
  const { T, esc } = D;
  const I = (n, s) => D.icon(n, s);

  D.ROUTE_MAP = [
    ['app', 'layers', { en: 'Learning workspace: student dashboard, AI tutor, quests, Snap-to-Solve, career tools', bn: 'ওয়ার্কস্পেস: ড্যাশবোর্ড, টিউটর, কোয়েস্ট, স্ন্যাপ-টু-সলভ, ক্যারিয়ার' }],
    ['login', 'key', { en: 'Portal Gateway: Student, Teacher, Admin, Parent, and Recruiter logins', bn: 'পোর্টাল গেটওয়ে: শিক্ষার্থী, শিক্ষক, অ্যাডমিন, অভিভাবক ও নিয়োগকারী' }],
    ['admin', 'shield', { en: 'Curriculum, telemetry, cohorts, roles and AI guardrails', bn: 'পাঠ্যক্রম, টেলিমেট্রি, কোহর্ট ও AI গার্ডরেইল' }],
    ['sdg4', 'target', { en: 'SDG 4 Quality Education alignment and research evidence', bn: 'SDG ৪ মানসম্মত শিক্ষা ও গবেষণা প্রমাণ' }],
    ['data', 'database', { en: 'Data pipeline, lineage, schema and knowledge graph', bn: 'ডেটা পাইপলাইন, স্কিমা ও নলেজ গ্রাফ' }],
    ['security', 'lock', { en: 'Privacy, compliance alignment, bias & injection defense', bn: 'গোপনীয়তা, সম্মতি ও ইনজেকশন প্রতিরক্ষা' }],
    ['architecture', 'network', { en: 'Multi-agent system blueprint with live request trace', bn: 'মাল্টি-এজেন্ট সিস্টেম ও লাইভ ট্রেস' }],
    ['audit', 'shieldCheck', { en: 'One-click live audit with exportable scorecard', bn: 'এক-ক্লিক লাইভ অডিট' }]
  ];

  D.page('', {
    title: { en: 'From Classroom to Global Career', bn: 'ক্লাসরুম থেকে বিশ্ব ক্যারিয়ার' },
    render(el) {
      el.innerHTML = `
        <div style="max-width:1180px;margin:0 auto;padding:12px 16px 64px">
          
          <!-- 1. HERO SECTION (Page 1 of Figma PDF) -->
          <section id="hero" style="padding:48px 0 36px;text-align:left">
            <div style="max-width:760px">
              
              <!-- Tag Badge -->
              <div style="margin-bottom:20px">
                <span class="chip" style="background:var(--card);border:1px solid var(--line);border-radius:9999px;padding:6px 16px;font-size:12px;font-weight:700;letter-spacing:0.06em;color:var(--text);display:inline-flex;align-items:center;gap:8px">
                  <span style="width:7px;height:7px;border-radius:50%;background:var(--coral)"></span>
                  ${T('EDUCATION THAT MOVES YOU FORWARD', 'ভবিষ্যতের শিক্ষা')}
                </span>
              </div>

              <!-- Main Headline -->
              <h1 style="font-size:clamp(38px, 5.5vw, 64px);font-weight:850;line-height:1.06;margin:0 0 20px;letter-spacing:-0.03em;color:var(--text)">
                ${T('From classroom to', 'ক্লাসরুম থেকে')}<br>
                <span class="coral-under">${T('global career.', 'বিশ্ব ক্যারিয়ার।')}</span>
              </h1>

              <!-- Subtitle -->
              <p style="font-size:clamp(16px, 1.8vw, 19px);color:var(--muted);max-width:620px;line-height:1.5;margin:0 0 32px">
                ${T('Learn smarter with AI. Build real-world skills. Prove what you can do.', 'AI এর সাথে শিখুন আরও সহজে। অর্জন করুন বাস্তব দক্ষতা। প্রমাণ করুন নিজের যোগ্যতা।')}
              </p>

              <!-- Pill Action Buttons -->
              <div style="display:flex;gap:14px;flex-wrap:wrap;align-items:center;margin-bottom:32px">
                <a href="${D.href('login')}" data-link="login" class="btn-pill btn-pill-dark">
                  ${T('Start learning', 'শেখা শুরু করুন')} &rarr;
                </a>
                <a href="#features" class="btn-pill btn-pill-white">
                  ${T('Explore platform', 'প্ল্যাটফর্ম দেখুন')}
                </a>
              </div>

              <!-- Social Proof Stack -->
              <div style="display:flex;align-items:center;gap:12px">
                <div class="avatar-stack">
                  <div class="avatar-circle" style="background:#F59E0B">AJ</div>
                  <div class="avatar-circle" style="background:#0D9488">SA</div>
                  <div class="avatar-circle" style="background:#FF5A36">FR</div>
                </div>
                <div style="font-size:13.5px;color:var(--text2);font-weight:600">
                  ${T('Built with learners, for every kind of learner.', 'শিক্ষার্থীদের সাথে নির্মিত, সব ধরণের শিক্ষার্থীর জন্য।')}
                </div>
              </div>
            </div>
          </section>

          <!-- 2. HERO ILLUSTRATION CONTAINER (Page 2 of Figma PDF) -->
          <div class="figma-hero-card" style="margin-bottom:64px;padding:0;overflow:hidden">
            <!-- Floating Top-Left Badge -->
            <div style="position:absolute;top:20px;left:20px;background:var(--card);border:1px solid var(--line);border-radius:14px;padding:10px 16px;box-shadow:var(--shadow-md);display:flex;align-items:center;gap:10px;z-index:2">
              <span style="width:26px;height:26px;border-radius:50%;background:rgba(13,148,136,0.12);color:var(--secondary);display:flex;align-items:center;justify-content:center">
                ${I('check', 16)}
              </span>
              <div>
                <div style="font-size:11px;font-weight:700;color:var(--text);line-height:1.2">${T('Quest complete', 'কোয়েস্ট সম্পন্ন')}</div>
                <div style="font-size:10px;color:var(--secondary);font-weight:700">Critical Thinking +40</div>
              </div>
            </div>

            <!-- Floating Bottom-Right Badge -->
            <div style="position:absolute;bottom:20px;right:20px;background:#111827;border-radius:14px;padding:10px 18px;box-shadow:var(--shadow-lg);display:flex;align-items:center;gap:12px;z-index:2">
              <span style="width:28px;height:28px;border-radius:50%;background:var(--coral);color:#fff;display:flex;align-items:center;justify-content:center">
                ${I('upload', 15)}
              </span>
              <div>
                <div style="font-size:9.5px;font-weight:700;letter-spacing:0.08em;color:rgba(255,255,255,0.7);text-transform:uppercase">${T('NEXT MILESTONE', 'পরবর্তী মাইলফলক')}</div>
                <div style="font-size:12.5px;font-weight:750;color:#fff">${T('Career ready', 'চাকরি-প্রস্তুত')}</div>
              </div>
            </div>

            <!-- Exact High-Resolution Figma Artwork extracted from Figma Make App.pdf -->
            <picture>
              <source srcset="assets/img/hero-illustration.webp" type="image/webp">
              <img src="assets/img/hero-illustration.png" alt="Dishari OS - AI Learning and Workforce Environment" style="width:100%;height:auto;max-height:520px;object-fit:cover;display:block" loading="eager">
            </picture>
          </div>

          <!-- 3. ONE CONNECTED JOURNEY - 6 CARDS (Pages 2 & 3 of Figma PDF) -->
          <section id="features" style="margin-bottom:72px">
            <div style="margin-bottom:36px">
              <div style="font-size:12px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:var(--coral);margin-bottom:8px">
                ${T('ONE CONNECTED JOURNEY', 'একটি সংযুক্ত যাত্রা')}
              </div>
              <h2 style="font-size:clamp(30px, 4vw, 48px);font-weight:850;margin:0 0 10px;letter-spacing:-0.03em;color:var(--text)">
                ${T('Learn. Build. Prove.', 'শিখুন। গড়ুন। প্রমাণ করুন।')} <span style="color:var(--coral)">${T('Get discovered.', 'আবিষ্কৃত হন।')}</span>
              </h2>
              <p style="font-size:16px;color:var(--muted);max-width:580px;margin:0;line-height:1.5">
                ${T('Dishari brings personalized learning and meaningful opportunity together in one place.', 'দিশারী ব্যক্তিগতকৃত শিখন এবং বাস্তব কাজের সুযোগকে একসাথে সংযুক্ত করে।')}
              </p>
            </div>

            <!-- 6 Figma Feature Cards in 2x3 Grid -->
            <div class="grid g2" style="gap:24px">
              
              <!-- Card 01: AI Teacher -->
              <div class="figma-feature-card">
                <span class="card-num">01</span>
                <div class="figma-icon-box" style="background:#E6F7F5;color:#0D9488">
                  ${I('lightbulb', 22)}
                </div>
                <h3 style="font-size:21px;font-weight:800;color:var(--text);margin:0 0 8px">
                  ${T('AI Teacher', 'AI শিক্ষক')}
                </h3>
                <p style="font-size:14.5px;color:var(--muted);line-height:1.5;margin:0 0 20px">
                  ${T('A patient, bilingual guide that adapts explanations to how you learn best.', 'একটি সহনশীল দ্বিভাষিক গাইড যা আপনার সুবিধাজনক শেখার উপায়ে নিজেকে মানিয়ে নেয়।')}
                </p>
                <div style="margin-top:auto">
                  <a href="${D.href('app', { tab: 'tutor' })}" data-link="app" style="color:var(--text);font-weight:700;font-size:14px;text-decoration:none;display:inline-flex;align-items:center;gap:6px">
                    ${T('Discover more', 'বিস্তারিত দেখুন')} &rarr;
                  </a>
                </div>
              </div>

              <!-- Card 02: Learning Quest -->
              <div class="figma-feature-card">
                <span class="card-num">02</span>
                <div class="figma-icon-box" style="background:#FEF7E6;color:#D97706">
                  ${I('star', 22)}
                </div>
                <h3 style="font-size:21px;font-weight:800;color:var(--text);margin:0 0 8px">
                  ${T('Learning Quest', 'লার্নিং কোয়েস্ট')}
                </h3>
                <p style="font-size:14.5px;color:var(--muted);line-height:1.5;margin:0 0 20px">
                  ${T('Turn every lesson into a mission with goals, feedback, and rewarding progress.', 'প্রতিটি পাঠকে লক্ষ্য, তাৎক্ষণিক প্রতিক্রিয়া এবং পুরস্কারময় অগ্রগতিসহ একটি মিশনে পরিণত করুন।')}
                </p>
                <div style="margin-top:auto">
                  <a href="${D.href('app', { tab: 'quest' })}" data-link="app" style="color:var(--text);font-weight:700;font-size:14px;text-decoration:none;display:inline-flex;align-items:center;gap:6px">
                    ${T('Discover more', 'বিস্তারিত দেখুন')} &rarr;
                  </a>
                </div>
              </div>

              <!-- Card 03: Career Navigator -->
              <div class="figma-feature-card">
                <span class="card-num">03</span>
                <div class="figma-icon-box" style="background:#F0EEFF;color:#4F46E5">
                  ${I('compass', 22)}
                </div>
                <h3 style="font-size:21px;font-weight:800;color:var(--text);margin:0 0 8px">
                  ${T('Career Navigator', 'ক্যারিয়ার নেভিগেটর')}
                </h3>
                <p style="font-size:14.5px;color:var(--muted);line-height:1.5;margin:0 0 20px">
                  ${T('Discover career paths and see the exact skills you need to move forward.', 'পেশার পথ খুঁজুন এবং সামনে এগিয়ে যাওয়ার জন্য প্রয়োজনীয় নির্দিষ্ট দক্ষতা চিহ্নিত করুন।')}
                </p>
                <div style="margin-top:auto">
                  <a href="${D.href('app', { tab: 'career' })}" data-link="app" style="color:var(--text);font-weight:700;font-size:14px;text-decoration:none;display:inline-flex;align-items:center;gap:6px">
                    ${T('Discover more', 'বিস্তারিত দেখুন')} &rarr;
                  </a>
                </div>
              </div>

              <!-- Card 04: SkillBridge -->
              <div class="figma-feature-card">
                <span class="card-num">04</span>
                <div class="figma-icon-box" style="background:#FFF0ED;color:#FF5A36">
                  ${I('building', 22)}
                </div>
                <h3 style="font-size:21px;font-weight:800;color:var(--text);margin:0 0 8px">
                  ${T('SkillBridge', 'স্কিলব্রিজ')}
                </h3>
                <p style="font-size:14.5px;color:var(--muted);line-height:1.5;margin:0 0 20px">
                  ${T('Practice with real-world projects built around the skills employers value.', 'নিয়োগকারীদের প্রত্যাশিত যোগ্যতার ভিত্তিতে তৈরি বাস্তবধর্মী প্রজেক্টে অনুশীলন করুন।')}
                </p>
                <div style="margin-top:auto">
                  <a href="${D.href('app', { tab: 'bridge' })}" data-link="app" style="color:var(--text);font-weight:700;font-size:14px;text-decoration:none;display:inline-flex;align-items:center;gap:6px">
                    ${T('Discover more', 'বিস্তারিত দেখুন')} &rarr;
                  </a>
                </div>
              </div>

              <!-- Card 05: Skill Passport -->
              <div class="figma-feature-card">
                <span class="card-num">05</span>
                <div class="figma-icon-box" style="background:#F5EEFD;color:#7C3AED">
                  ${I('idCard', 22)}
                </div>
                <h3 style="font-size:21px;font-weight:800;color:var(--text);margin:0 0 8px">
                  ${T('Skill Passport', 'স্কিল পাসপোর্ট')}
                </h3>
                <p style="font-size:14.5px;color:var(--muted);line-height:1.5;margin:0 0 20px">
                  ${T('Collect verified proof of your strengths in one portable digital profile.', 'আপনার অর্জিত যোগ্যতার যাচাইযোগ্য প্রমাণ একটি ডিজিটাল প্রোফাইলে সংগ্রহ করুন।')}
                </p>
                <div style="margin-top:auto">
                  <a href="${D.href('app', { tab: 'passport' })}" data-link="app" style="color:var(--text);font-weight:700;font-size:14px;text-decoration:none;display:inline-flex;align-items:center;gap:6px">
                    ${T('Discover more', 'বিস্তারিত দেখুন')} &rarr;
                  </a>
                </div>
              </div>

              <!-- Card 06: Talent Marketplace -->
              <div class="figma-feature-card">
                <span class="card-num">06</span>
                <div class="figma-icon-box" style="background:#E8F4FD;color:#0284C7">
                  ${I('briefcase', 22)}
                </div>
                <h3 style="font-size:21px;font-weight:800;color:var(--text);margin:0 0 8px">
                  ${T('Talent Marketplace', 'ট্যালেন্ট মার্কেটপ্লেস')}
                </h3>
                <p style="font-size:14.5px;color:var(--muted);line-height:1.5;margin:0 0 20px">
                  ${T('Connect your proven potential with internships, mentors, and opportunities.', 'আপনার প্রমাণিত যোগ্যতাকে ইন্টার্নশিপ, মেন্টর এবং কর্মসংস্থানের সাথে সংযুক্ত করুন।')}
                </p>
                <div style="margin-top:auto">
                  <a href="${D.href('app', { tab: 'talent' })}" data-link="app" style="color:var(--text);font-weight:700;font-size:14px;text-decoration:none;display:inline-flex;align-items:center;gap:6px">
                    ${T('Discover more', 'বিস্তারিত দেখুন')} &rarr;
                  </a>
                </div>
              </div>

            </div>
          </section>

          <!-- 4. HOW THE AI TEACHES - 4 METHODS (Pages 3 & 4 of Figma PDF) -->
          <section id="how-it-works" class="figma-methods-container" style="margin-bottom:72px">
            <div style="margin-bottom:36px">
              <div style="font-size:12px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:#FDE68A;margin-bottom:8px">
                ${T('HOW THE AI TEACHES', 'AI কীভাবে শেখায়')}
              </div>
              <h2 style="font-size:clamp(30px, 4vw, 44px);font-weight:850;margin:0 0 10px;letter-spacing:-0.03em;color:#FFFFFF">
                ${T('Four methods. One deeper way to learn.', 'চারটি পদ্ধতি। শেখার গভীরতম পথ।')}
              </h2>
              <p style="font-size:15.5px;color:rgba(255,255,255,0.75);max-width:620px;margin:0 0 24px;line-height:1.5">
                ${T('Not just answers. Dishari uses a thoughtful cycle that helps every learner understand, apply, and own their progress.', 'কেবল সরাসরি উত্তর নয়। দিশারী একটি সুপরিকল্পিত প্রক্রিয়ার মাধ্যমে প্রতিটি শিক্ষার্থীকে উপলব্ধি, প্রয়োগ ও নিজস্ব অগ্রগতি অর্জনে সাহায্য করে।')}
              </p>
              
              <!-- Pill Tag from Page 3 -->
              <div style="display:inline-flex;align-items:center;gap:10px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);padding:6px 14px;border-radius:9999px">
                <span style="width:24px;height:24px;border-radius:50%;background:var(--coral);display:flex;align-items:center;justify-content:center;color:#fff">
                  ${I('lightbulb', 14)}
                </span>
                <span style="font-size:13px;font-weight:700;color:#FFFFFF">${T('AI with a human purpose', 'মানবিক উদ্দেশ্যে নির্মিত AI')}</span>
              </div>
            </div>

            <!-- 4 Method Cards from Page 4 of PDF -->
            <div class="grid g4" style="gap:16px">
              
              <!-- Method 1: Explain / বোঝাই -->
              <div class="figma-method-card">
                <div class="method-num-circle" style="background:#FF5A36">1</div>
                <div style="font-size:12px;color:rgba(255,255,255,0.6);font-weight:600">বোঝাই</div>
                <div style="font-size:18px;font-weight:800;color:#FFFFFF">Explain</div>
                <div style="font-size:13px;color:rgba(255,255,255,0.8);line-height:1.45;margin-top:4px">
                  ${T('Clear concepts in Bangla or English, matched to your level.', 'আপনার স্তর অনুযায়ী বাংলা বা ইংরেজিতে সহজবোধ্য ব্যাখ্যা।')}
                </div>
              </div>

              <!-- Method 2: Explore / খুঁজি -->
              <div class="figma-method-card">
                <div class="method-num-circle" style="background:#F59E0B">2</div>
                <div style="font-size:12px;color:rgba(255,255,255,0.6);font-weight:600">খুঁজি</div>
                <div style="font-size:18px;font-weight:800;color:#FFFFFF">Explore</div>
                <div style="font-size:13px;color:rgba(255,255,255,0.8);line-height:1.45;margin-top:4px">
                  ${T('Guided questions that turn curiosity into understanding.', 'নির্দেশিত প্রশ্নের মাধ্যমে কৌতূহলকে গভীর উপলব্ধিতে রূপান্তর।')}
                </div>
              </div>

              <!-- Method 3: Practice / অনুশীলন -->
              <div class="figma-method-card">
                <div class="method-num-circle" style="background:#0D9488">3</div>
                <div style="font-size:12px;color:rgba(255,255,255,0.6);font-weight:600">অনুশীলন</div>
                <div style="font-size:18px;font-weight:800;color:#FFFFFF">Practice</div>
                <div style="font-size:13px;color:rgba(255,255,255,0.8);line-height:1.45;margin-top:4px">
                  ${T('Active challenges and projects that make knowledge stick.', 'বাস্তবমুখী চ্যালেঞ্জ ও প্রজেক্ট যা শিক্ষাকে স্থায়ী করে।')}
                </div>
              </div>

              <!-- Method 4: Reflect / ভাবি -->
              <div class="figma-method-card">
                <div class="method-num-circle" style="background:#64748B">4</div>
                <div style="font-size:12px;color:rgba(255,255,255,0.6);font-weight:600">ভাবি</div>
                <div style="font-size:18px;font-weight:800;color:#FFFFFF">Reflect</div>
                <div style="font-size:13px;color:rgba(255,255,255,0.8);line-height:1.45;margin-top:4px">
                  ${T('Personal feedback to recognize growth and plan what comes next.', 'নিজের অগ্রগতি মূল্যায়ন ও পরবর্তী পদক্ষেপের জন্য ব্যক্তিগত প্রতিক্রিয়া।')}
                </div>
              </div>

            </div>
          </section>

          <!-- 5. SDG 4 · QUALITY EDUCATION (Pages 4 & 5 of Figma PDF) -->
          <section id="impact" style="margin-bottom:72px;background:#EAF4F2;border-radius:28px;padding:48px 40px;border:1px solid #D1E7E3">
            <div style="font-size:12px;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;color:#0D9488;margin-bottom:12px">
              ${T('SDG 4 · QUALITY EDUCATION', 'SDG ৪ · মানসম্মত শিক্ষা')}
            </div>

            <div class="grid g2" style="gap:36px;align-items:center">
              <!-- Left Card: UN SDG Goal 4 Card -->
              <div style="position:relative">
                <div style="background:#FFFFFF;border-radius:20px;padding:32px;box-shadow:var(--shadow-md);border:1px solid #D1E7E3">
                  <div style="display:flex;align-items:center;gap:12px;margin-bottom:16px">
                    <div style="width:36px;height:36px;border-radius:8px;background:#C5192D;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:18px">
                      4
                    </div>
                    <div>
                      <div style="font-size:11px;font-weight:800;letter-spacing:0.06em;color:var(--muted);text-transform:uppercase">UN SUSTAINABLE</div>
                      <div style="font-size:13.5px;font-weight:700;color:var(--text)">Development Goal</div>
                    </div>
                  </div>

                  <h3 style="font-size:clamp(20px, 2.2vw, 26px);font-weight:800;color:var(--text);line-height:1.3;margin:0 0 20px">
                    “Ensure inclusive and equitable quality education for all.”
                  </h3>

                  <!-- Progress indicators -->
                  <div style="display:flex;gap:6px;margin-top:14px">
                    <div style="flex:1;height:32px;border-radius:6px;background:#A7D7CF"></div>
                    <div style="flex:1;height:48px;border-radius:6px;background:#5BB7A8"></div>
                    <div style="flex:1;height:24px;border-radius:6px;background:#A7D7CF"></div>
                    <div style="flex:1;height:56px;border-radius:6px;background:#3D9F8E"></div>
                    <div style="flex:1;height:38px;border-radius:6px;background:#5BB7A8"></div>
                  </div>
                </div>

                <!-- Floating Gold Commitment Badge from Page 4 -->
                <div style="position:absolute;bottom:-14px;right:-10px;background:#FBBF24;border-radius:14px;padding:10px 16px;box-shadow:var(--shadow-md)">
                  <div style="font-size:9.5px;font-weight:800;letter-spacing:0.06em;text-transform:uppercase;color:#78350F">${T('OUR COMMITMENT', 'আমাদের অঙ্গীকার')}</div>
                  <div style="font-size:12.5px;font-weight:800;color:#78350F">${T('No learner left behind.', 'পিছিয়ে থাকবে না কেউ।')}</div>
                </div>
              </div>

              <!-- Right Content from Page 5 -->
              <div>
                <h3 style="font-size:clamp(24px, 3vw, 36px);font-weight:850;color:#0F172A;line-height:1.2;margin:0 0 16px;letter-spacing:-0.02em">
                  ${T('Local potential deserves', 'স্থানীয় সম্ভাবনা')} <span style="color:#0D9488">${T('global opportunity.', 'বিশ্ব সুযোগের দাবিদার।')}</span>
                </h3>
                <p style="font-size:15px;color:#334155;line-height:1.6;margin:0 0 24px">
                  ${T('Dishari OS advances inclusive, equitable education by giving learners personalized support, practical skills, and visible pathways into work—regardless of language or location.', 'দিশারী ওএস ভাষা বা অবস্থান নির্বিশেষে শিক্ষার্থীদের ব্যক্তিগতকৃত সহায়তা, বাস্তবমুখী দক্ষতা এবং কর্মসংস্থানের দৃশ্যমান পথ প্রদর্শনের মাধ্যমে অন্তর্ভুক্তিমূলক ও সমতাভিত্তিক শিক্ষা নিশ্চিত করে।')}
                </p>

                <!-- 3 Bullets with Check Circles from Page 5 -->
                <div style="display:flex;flex-direction:column;gap:12px">
                  <div style="display:flex;align-items:center;gap:12px;font-size:14.5px;font-weight:650;color:#0F172A">
                    <span style="width:24px;height:24px;border-radius:50%;background:#0D9488;color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                      ${I('check', 14)}
                    </span>
                    <span>${T('Bilingual access across Bangla and English', 'বাংলা ও ইংরেজিতে দ্বিভাষিক সুবিধা')}</span>
                  </div>
                  <div style="display:flex;align-items:center;gap:12px;font-size:14.5px;font-weight:650;color:#0F172A">
                    <span style="width:24px;height:24px;border-radius:50%;background:#0D9488;color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                      ${I('check', 14)}
                    </span>
                    <span>${T('Adaptive support for different learning needs', 'বিভিন্ন শিক্ষণ চাহিদার জন্য অভিযোজিত সহায়তা')}</span>
                  </div>
                  <div style="display:flex;align-items:center;gap:12px;font-size:14.5px;font-weight:650;color:#0F172A">
                    <span style="width:24px;height:24px;border-radius:50%;background:#0D9488;color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0">
                      ${I('check', 14)}
                    </span>
                    <span>${T('Skills connected to real economic opportunity', 'বাস্তব অর্থনৈতিক সুযোগের সাথে দক্ষতার সংযোগ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- 6. ILLUSTRATIVE SAMPLE DATA - STATS (Pages 5 & 6 of Figma PDF) -->
          <section id="stats" style="margin-bottom:72px">
            <div style="text-align:center;margin-bottom:36px">
              <span class="chip" style="background:#FEF3C7;color:#92400E;font-size:11px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;border-radius:9999px;padding:5px 14px;margin-bottom:12px;display:inline-block">
                ${T('ILLUSTRATIVE SAMPLE DATA', 'নমুনা তথ্য ও পরিসংখ্যান')}
              </span>
              <h2 style="font-size:clamp(28px, 3.5vw, 42px);font-weight:850;margin:0 0 8px;letter-spacing:-0.03em;color:var(--text)">
                ${T('What meaningful progress could look like.', 'সার্থক অগ্রগতি যেমন হতে পারে।')}
              </h2>
              <p style="font-size:14.5px;color:var(--muted);max-width:540px;margin:0 auto">
                ${T('Example metrics shown for product demonstration only—not actual platform results.', 'পণ্য প্রদর্শনের সুবিধার্থে নমুনা মেট্রিক্স নির্দেশ করা হয়েছে।')}
              </p>
            </div>

            <!-- 4 Stat Cards from Page 6 of PDF -->
            <div class="grid g4" style="gap:20px">
              
              <!-- Stat Card 1: Coral 18K+ -->
              <div class="figma-stat-coral">
                <div style="font-size:clamp(36px, 4vw, 52px);font-weight:850;line-height:1;margin-bottom:12px">18K+</div>
                <div style="font-size:15px;font-weight:750;margin-bottom:4px;line-height:1.2">${T('Sample learners reached', 'পৌঁছানো নমুনা শিক্ষার্থী')}</div>
                <div style="font-size:12.5px;opacity:0.9">${T('Across diverse communities', 'বিভিন্ন সম্প্রদায়ের মাঝে')}</div>
              </div>

              <!-- Stat Card 2: 72% -->
              <div class="figma-stat-white">
                <div style="font-size:clamp(36px, 4vw, 52px);font-weight:850;line-height:1;margin-bottom:12px;color:var(--text)">72%</div>
                <div style="font-size:15px;font-weight:750;margin-bottom:4px;color:var(--text);line-height:1.2">${T('Sample course completion', 'কোর্স সমাপ্তির হার')}</div>
                <div style="font-size:12.5px;color:var(--muted)">${T('With adaptive guidance', 'অভিযোজিত নির্দেশনার মাধ্যমে')}</div>
              </div>

              <!-- Stat Card 3: 4.8/5 -->
              <div class="figma-stat-white">
                <div style="font-size:clamp(36px, 4vw, 52px);font-weight:850;line-height:1;margin-bottom:12px;color:var(--text)">4.8/5</div>
                <div style="font-size:15px;font-weight:750;margin-bottom:4px;color:var(--text);line-height:1.2">${T('Sample learner rating', 'শিক্ষার্থীদের সন্তুষ্টি রেটিং')}</div>
                <div style="font-size:12.5px;color:var(--muted)">${T('For AI teacher support', 'AI শিক্ষকের সহায়তায়')}</div>
              </div>

              <!-- Stat Card 4: 3.2x -->
              <div class="figma-stat-white">
                <div style="font-size:clamp(36px, 4vw, 52px);font-weight:850;line-height:1;margin-bottom:12px;color:var(--text)">3.2×</div>
                <div style="font-size:15px;font-weight:750;margin-bottom:4px;color:var(--text);line-height:1.2">${T('Sample skill growth', 'দক্ষতা বৃদ্ধির হার')}</div>
                <div style="font-size:12.5px;color:var(--muted)">${T('After project practice', 'প্রজেক্ট অনুশীলনের পর')}</div>
              </div>

            </div>
          </section>

          <!-- 7. PRE-CLOSING CALL-TO-ACTION BANNER (Pages 6 & 7 of Figma PDF) -->
          <div class="figma-cta-banner">
            <div style="font-size:12px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.9);margin-bottom:14px">
              ${T('YOUR NEXT CHAPTER STARTS HERE', 'আপনার নতুন অধ্যায় শুরু হোক এখানে')}
            </div>
            <h2 style="font-size:clamp(28px, 4vw, 48px);font-weight:850;margin:0 0 14px;line-height:1.15;color:#FFFFFF;letter-spacing:-0.02em">
              ${T('Don’t just prepare for the future. Help shape it.', 'ভবিষ্যতের কেবল প্রস্তুতি নয়। একে নিজেই গড়ে তুলুন।')}
            </h2>
            <p style="font-size:16px;color:rgba(255,255,255,0.9);max-width:560px;margin:0 auto 28px;line-height:1.5">
              ${T('Join a new generation of learners turning curiosity into capability.', 'কৌতূহলকে যোগ্যতায় রূপান্তরকারী নতুন প্রজন্মের শিক্ষার্থীদের সাথে যোগ দিন।')}
            </p>
            <a href="${D.href('login')}" data-link="login" class="btn-pill btn-pill-dark" style="font-size:15.5px;padding:14px 34px">
              ${T('Start your journey', 'আপনার যাত্রা শুরু করুন')} &rarr;
            </a>
          </div>

          <!-- Notice: Footers are intentionally excluded as per user instruction ("fooder gulon rakhba nah") -->

        </div>
      `;
    }
  });
})();

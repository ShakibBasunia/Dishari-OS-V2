/* Dishari OS - /app : Main Student Dashboard & Learning Workspace
   Modern Premium SaaS Dashboard Layout with Left Sidebar Navigation
   Primary: Deep Indigo (#3730A3) · Secondary: Teal (#0D9488) · Background: #F8FAFC
*/
(function () {
  'use strict';
  const D = window.D;
  const { T, esc } = D;
  const tx = D.tx;
  const I = (n, s) => D.icon(n, s);

  const SIDEBAR_ITEMS = [
    ['dashboard', 'grid', { en: 'Dashboard', bn: 'ড্যাশবোর্ড' }, 'Home'],
    ['tutor', 'teacher', { en: 'AI Teacher', bn: 'AI শিক্ষক' }, '4 Methods'],
    ['quest', 'puzzle', { en: 'Learning Quest', bn: 'লার্নিং কোয়েস্ট' }, 'STEM'],
    ['snap', 'camera', { en: 'Snap-to-Solve', bn: 'স্ন্যাপ-টু-সলভ' }, 'Vision'],
    ['career', 'compass', { en: 'Career Navigator', bn: 'ক্যারিয়ার নেভিগেটর' }, 'O*NET'],
    ['bridge', 'route', { en: 'SkillBridge', bn: 'স্কিলব্রিজ' }, 'Internships'],
    ['passport', 'idCard', { en: 'Skill Passport', bn: 'স্কিল পাসপোর্ট' }, 'BNQF'],
    ['talent', 'briefcase', { en: 'Talent Marketplace', bn: 'ট্যালেন্ট মার্কেটপ্লেস' }, 'B2B'],
    ['copilot', 'users', { en: 'Teacher & Parent Co-Pilot', bn: 'কো-পাইলট' }, 'Analytics'],
    ['settings', 'settings', { en: 'Settings', bn: 'সেটিংস' }, 'A11y']
  ];

  const TEACHING_MODES = [
    {
      id: 'socratic',
      icon: 'help',
      name: { en: 'Socratic Questioning', bn: 'সক্রেটিক অনুসন্ধান' },
      desc: { en: 'Guides through progressive inquiry without giving away answers.', bn: 'উত্তর না দিয়ে ধাপে ধাপে প্রশ্ন করে।' }
    },
    {
      id: 'bloom',
      icon: 'ladder',
      name: { en: "Bloom's Mastery Ladder", bn: 'ব্লুমের মাস্টারি ল্যাডার' },
      desc: { en: 'Climbs systematically from Recall up to Evaluation & Creation.', bn: 'স্মরণ থেকে সৃষ্টি পর্যন্ত ছয় স্তর।' }
    },
    {
      id: 'feynman',
      icon: 'message',
      name: { en: 'Feynman Teach-back', bn: 'ফাইনম্যান টিচ-ব্যাক' },
      desc: { en: 'You teach the concept; the AI classmate scores conceptual clarity.', bn: 'তুমি ব্যাখ্যা করো; টিউটর স্পষ্টতা মাপে।' }
    },
    {
      id: 'scaffold',
      icon: 'mountain',
      name: { en: 'Scaffolding with Fading Hints', bn: 'ফেডিং হিন্টসহ স্ক্যাফোল্ডিং' },
      desc: { en: 'Step-by-step guidance with hints that fade as mastery builds.', bn: 'ধাপে ধাপে সমাধান, হিন্ট ক্রমশ কমে।' }
    }
  ];

  const W = {
    tab: 'dashboard',
    s: 'bio',
    p: '1',
    m: 'socratic',
    tutorChat: [
      {
        sender: 'ai',
        text: {
          en: 'Welcome, Aurin! In photosynthesis, light-dependent reactions take place across the thylakoid membrane of chloroplasts. Using absorbed sunlight and water (H₂O), which two high-energy carrier molecules are synthesized?',
          bn: 'স্বাগতম, আউরিন! সালোকসংশ্লেষণ প্রক্রিয়ায় ক্লোরোপ্লাস্টের থাইলাকয়েড মেমব্রেনে আলোক নির্ভর পর্যায় ঘটে। সূর্যালোক ও পানির (H₂O) সাহায্যে কোন দুটি উচ্চ-শক্তি অণু তৈরি হয়?'
        },
        method: 'Socratic Questioning',
        cite: 'bio-02'
      },
      {
        sender: 'user',
        text: {
          en: 'ATP and NADPH are synthesized, and oxygen (O₂) is released as a byproduct from the splitting of water (photolysis).',
          bn: 'ATP এবং NADPH তৈরি হয়, আর পানির সালোক-বিভাজন (ফটোলাইসিস) থেকে উপজাত হিসেবে অক্সিজেন (O₂) নির্গত হয়।'
        }
      },
      {
        sender: 'ai',
        text: {
          en: 'Outstanding answer! Exactly right. Now, taking those energetic ATP and NADPH molecules into the stroma during the Calvin cycle (light-independent reaction), what essential organic sugar molecule is produced when carbon dioxide (CO₂) is fixed?',
          bn: 'চমৎকার এবং নির্ভুল! এবার বলো, এই উৎপন্ন ATP ও NADPH পরবর্তীতে স্ট্রোমাতে কেলভিন চক্রে (অন্ধকার পর্যায়) গিয়ে কার্বন ডাই-অক্সাইডকে (CO₂) বিজারিত করে কোন প্রধান জৈব শর্করা সংশ্লেষণ করে?'
        },
        method: 'Socratic Questioning',
        cite: 'bio-03'
      },
      {
        sender: 'user',
        text: {
          en: 'It produces glucose: C₆H₁₂O₆ (via G3P intermediate synthesis).',
          bn: 'এটি গ্লুকোজ তৈরি করে: C₆H₁₂O₆ (G3P অন্তর্বর্তী ধাপের মাধ্যমে)।'
        }
      },
      {
        sender: 'ai',
        text: {
          en: 'Brilliant deduction, Aurin! The overall stoichiometry is 6CO₂ + 6H₂O + light → C₆H₁₂O₆ + 6O₂. You have demonstrated firm conceptual mastery of both the light-harvesting and carbon-fixation phases.',
          bn: 'অসাধারণ ধারণা, আউরিন! সার্বিক সমীকরণ হলো: 6CO₂ + 6H₂O + আলো → C₆H₁₂O₆ + 6O₂। তুমি আলোক-নির্ভর ও কার্বন বিজারণ উভয় পর্যায়ের মূল ধারণা নিখুঁতভাবে আয়ত্ত করেছ।'
        },
        method: 'Socratic Questioning',
        cite: 'bio-01'
      }
    ]
  };
  D.W = W;

  /* ---------------- Page Route Entry ---------------- */
  D.page('app', {
    title: { en: 'Student Workspace', bn: 'শিক্ষার্থী ওয়ার্কস্পেস' },
    render(el, params) {
      // Map old 'learn' param to 'dashboard' or 'tutor'
      let tabReq = params.get('tab');
      if (tabReq === 'learn') tabReq = 'tutor';
      if (!SIDEBAR_ITEMS.some((t) => t[0] === tabReq)) tabReq = 'dashboard';
      W.tab = tabReq;

      if (D.SUBJECTS.some((x) => x.id === params.get('s'))) W.s = params.get('s');
      if (['1', '2', '3', '4'].includes(params.get('p'))) W.p = params.get('p');
      if (TEACHING_MODES.some((x) => x.id === params.get('m'))) W.m = params.get('m');

      // Make sure Aurin demo student profile is active
      if (D.state.role !== 'student' && D.state.role !== 'admin') {
        D.loginStudent();
      }

      el.innerHTML = `
        <div class="saas-layout">
          <!-- Left Navigation Sidebar -->
          <aside class="saas-sidebar" id="app-sidebar" role="navigation" aria-label="${T('Workspace Navigation', 'ওয়ার্কস্পেস নেভিগেশন')}">
            <div class="row between" style="margin-bottom:18px;padding:0 6px">
              <div class="row nowrap" style="gap:10px">
                <span class="brand-mark" style="width:32px;height:32px">${I('compass', 18)}</span>
                <div>
                  <b style="font-size:15px;display:block;line-height:1.1">Dishari OS</b>
                  <small class="muted" style="font-size:11px">${T('Learning Workspace', 'লার্নিং ওয়ার্কস্পেস')}</small>
                </div>
              </div>
              <button class="btn sm ghost icon hide-lg" id="close-sidebar-btn" aria-label="Close sidebar">${I('x', 16)}</button>
            </div>

            <div class="sidebar-heading">${T('Core Modules', 'প্রধান মডিউলসমূহ')}</div>

            <nav class="col" style="gap:3px">
              ${SIDEBAR_ITEMS.map(([k, ic, label, badge]) => `
                <button class="nav-link-btn ${W.tab === k ? 'active' : ''}" data-stab="${k}" aria-selected="${W.tab === k}">
                  ${I(ic, 18, 'nav-ic')}
                  <span>${esc(D.tx(label))}</span>
                  ${badge ? `<span class="nav-badge">${badge}</span>` : ''}
                </button>
              `).join('')}
            </nav>

            <div class="sidebar-heading" style="margin-top:20px">${T('Learning Pulse', 'শেখার গতি')}</div>
            <div class="card flat tint" style="padding:14px;margin:4px 0 16px;border:1px solid var(--line)">
              <div class="row between small" style="margin-bottom:6px">
                <span class="muted">${T('Level 15 Scholar', 'লেভেল ১৫ স্কলার')}</span>
                <b style="color:var(--primary)">${D.n(21450)} XP</b>
              </div>
              ${D.bar(78, 'teal thin')}
              <div class="row between small" style="margin-top:8px">
                <span class="row nowrap" style="gap:4px;color:var(--gold);font-weight:700">${I('flame', 14)} 21 ${T('day streak', 'দিন ধারা')}</span>
                <span class="chip ok" style="padding:1px 6px;font-size:10.5px">2× XP</span>
              </div>
            </div>

            <!-- Bottom Student Profile -->
            <div class="sidebar-user">
              <div class="user-avatar">${D.NUSRAT.initials}</div>
              <div class="grow" style="min-width:0">
                <b style="font-size:13.5px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${D.state.lang === 'bn' ? D.NUSRAT.nameBn : D.NUSRAT.name}</b>
                <div class="small muted" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(tx(D.NUSRAT.school))}</div>
              </div>
              <a href="${D.href('demo-user')}" data-link="demo-user" class="btn sm ghost icon" title="${T('View Profile', 'প্রোফাইল দেখুন')}">${I('external', 15)}</a>
            </div>
          </aside>

          <!-- Main Content Area -->
          <main class="saas-content" id="app-content-body">
            <!-- Dynamic view injected here -->
          </main>
        </div>
      `;

      // Sidebar switching listener
      D.$$('#app-sidebar [data-stab]').forEach((btn) => {
        btn.onclick = () => {
          const t = btn.dataset.stab;
          W.tab = t;
          D.setParams({ tab: t });
          D.$$('#app-sidebar [data-stab]').forEach((b) => b.classList.toggle('active', b === btn));
          renderActiveTab();
          window.scrollTo(0, 0);
        };
      });

      const csBtn = D.$('#close-sidebar-btn');
      if (csBtn) csBtn.onclick = () => D.$('#app-sidebar').classList.remove('open');

      renderActiveTab();
    }
  });

  function renderActiveTab() {
    const container = D.$('#app-content-body');
    if (!container) return;

    switch (W.tab) {
      case 'dashboard':
        renderStudentDashboard(container);
        break;
      case 'tutor':
        renderAITeacherWorkspace(container);
        break;
      case 'quest':
        renderLearningQuestPage(container);
        break;
      case 'snap':
        if (D.TABS && D.TABS.snap) D.TABS.snap(container);
        break;
      case 'career':
        renderCareerNavigatorPage(container);
        break;
      case 'bridge':
        renderSkillBridgePage(container);
        break;
      case 'passport':
        renderSkillPassportPage(container);
        break;
      case 'talent':
        if (D.TABS && D.TABS.talent) D.TABS.talent(container);
        break;
      case 'copilot':
        if (D.TABS && D.TABS.copilot) D.TABS.copilot(container);
        break;
      case 'settings':
        renderSettingsPage(container);
        break;
      default:
        renderStudentDashboard(container);
    }
  }

  /* ==========================================================================
     MODULE 2: Student Dashboard
     ========================================================================== */
  function renderStudentDashboard(container) {
    const N = D.NUSRAT;
    const g = D.state.game;
    const lp = D.levelProgress(g.xp);
    const curTh = (D.THEMES && D.THEMES.find((x) => x.id === (D.state.theme || 'light'))) || { id: 'light', name: { en: 'SaaS Indigo', bn: 'ইন্ডিগো লাইট' }, icon: 'sun', dot: '#3730A3' };

    container.innerHTML = `
      <!-- Top Navigation (Profile, Notification, Language Switcher, Theme Toggle) -->
      <div style="display:flex;justify-content:space-between;align-items:center;padding:0 0 18px;margin-bottom:24px;border-bottom:1px solid var(--line);flex-wrap:wrap;gap:12px">
        <div style="display:flex;align-items:center;gap:12px">
          <button class="btn sm ghost hide-lg" id="app-sidebar-toggle" aria-label="Toggle navigation">
            ${I('menu', 18)} <span class="small" style="margin-left:4px">${T('Menu', 'মেনু')}</span>
          </button>
          <div class="row nowrap" style="gap:8px">
            <span class="chip primary">${I('graduation', 14)} HSC Science 2026</span>
            <span class="chip teal">${esc(tx(N.place))}</span>
            ${D.demoTag()}
          </div>
        </div>

        <div style="display:flex;align-items:center;gap:10px">
          <!-- Language Switcher -->
          <button class="btn sm ghost" id="dash-lang-btn" title="${T('Switch language', 'ভাষা পরিবর্তন')}">
            ${I('languages', 15)} <span>${esc(D.langInfo().native)}</span>
          </button>

          <!-- Theme Button (5 Palettes) -->
          <button class="btn sm ghost" id="dash-theme-btn" title="${T('Platform Theme (5 palettes)', 'থিম নির্বাচন (৫টি থিম)')}">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${curTh.dot};margin-right:4px"></span>
            ${I(curTh.icon, 14)} <span class="hide-sm">${esc(D.tx(curTh.name))}</span>
          </button>

          <!-- Notification Bell -->
          <button class="btn sm ghost icon" id="dash-notif-btn" title="${T('Notifications', 'বিজ্ঞপ্তি')}" style="position:relative">
            ${I('bell', 16)}
            <span style="position:absolute;top:5px;right:5px;width:7px;height:7px;border-radius:50%;background:var(--secondary)"></span>
          </button>

          <!-- Profile Badge -->
          <div style="display:flex;align-items:center;gap:8px;padding-left:10px;border-left:1px solid var(--line);cursor:pointer" id="dash-profile-btn">
            <div class="user-avatar" style="width:34px;height:34px;font-size:12px;background:var(--primary);color:#fff">${N.initials}</div>
            <div class="hide-sm" style="text-align:left;line-height:1.2">
              <div style="font-size:13px;font-weight:700;color:var(--text)">${D.state.lang === 'bn' ? N.nameBn : N.name}</div>
              <div style="font-size:11px;color:var(--muted)">stu-rp-0415</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Welcome Section -->
      <div class="row between" style="margin-bottom:28px;gap:20px;align-items:flex-end">
        <div>
          <h1 style="font-size:clamp(26px, 3vw, 36px);margin:0;letter-spacing:-0.02em">
            ${T('Welcome back, Aurin!', 'আবার স্বাগতম, আউরিন!')}
          </h1>
          <p class="muted" style="margin:6px 0 0;font-size:14.5px">
            ${T('You are on a 21-day learning streak. Ready to master Bioenergetics and advance toward your Biomedical AI career?', 'তুমি ২১ দিনের ধারায় আছো। জীবনীশক্তি পাঠ শেষ করে বায়োমেডিকেল AI ক্যারিয়ারের আরও কাছে যেতে প্রস্তুত?')}
          </p>
        </div>

        <div class="row" style="gap:10px">
          <button class="btn primary" id="dash-quick-study">
            ${I('play', 15)} ${T('Continue Learning', 'পড়া চালিয়ে যাও')}
          </button>
          <button class="btn" id="dash-snap-btn">
            ${I('camera', 15)} ${T('Snap-to-Solve', 'স্ন্যাপ-টু-সলভ')}
          </button>
        </div>
      </div>

      <!-- 4 Core Metric Cards -->
      <div class="grid g4" style="margin-bottom:28px">
        <!-- 1. Overall Progress -->
        <div class="stat-card">
          <div class="stat-top">
            <span class="small muted" style="font-weight:650">${T('Overall Learning Progress', 'সামগ্রিক শেখার অগ্রগতি')}</span>
            <span class="ic-box">${I('pieChart', 18)}</span>
          </div>
          <div class="stat-val">78%</div>
          <div class="stat-desc">
            <span class="trend-badge up">${I('trendingUp', 12)} +12%</span>
            <span>${T('vs last month', 'গত মাসের চেয়ে')}</span>
          </div>
          <div style="margin-top:12px">${D.bar(78, '')}</div>
        </div>

        <!-- 2. Lessons Completed -->
        <div class="stat-card">
          <div class="stat-top">
            <span class="small muted" style="font-weight:650">${T('Total Lessons Completed', 'মোট সম্পন্ন পাঠ')}</span>
            <span class="ic-box teal">${I('checkSquare', 18)}</span>
          </div>
          <div class="stat-val">42</div>
          <div class="stat-desc">
            <span class="trend-badge up">${I('trendingUp', 12)} +6</span>
            <span>${T('this week across 4 subjects', 'এই সপ্তাহে ৪ বিষয়ে')}</span>
          </div>
          <div style="margin-top:12px">${D.bar(84, 'teal')}</div>
        </div>

        <!-- 3. Current Streak -->
        <div class="stat-card">
          <div class="stat-top">
            <span class="small muted" style="font-weight:650">${T('Current Learning Streak', 'বর্তমান ধারাবাহিকতা')}</span>
            <span class="ic-box gold">${I('flame', 18)}</span>
          </div>
          <div class="stat-val" style="color:var(--gold)">21 ${T('Days', 'দিন')}</div>
          <div class="stat-desc">
            <span class="trend-badge up" style="background:var(--gold-soft);color:var(--gold)">${I('zap', 12)} 2× XP Multiplier</span>
            <span>${T('Active', 'সক্রিয়')}</span>
          </div>
          <div style="margin-top:12px">${D.bar(100, 'gold')}</div>
        </div>

        <!-- 4. Verified Skills -->
        <div class="stat-card">
          <div class="stat-top">
            <span class="small muted" style="font-weight:650">${T('Verified Skills & Passports', 'যাচাইকৃত দক্ষতা ও সনদ')}</span>
            <span class="ic-box ok">${I('shieldCheck', 18)}</span>
          </div>
          <div class="stat-val" style="color:var(--ok)">14</div>
          <div class="stat-desc">
            <span class="trend-badge up">${I('award', 12)} 2 Passports</span>
            <span>${T('Ready for employers', 'নিয়োগযোগ্য')}</span>
          </div>
          <div style="margin-top:12px">${D.bar(70, 'teal')}</div>
        </div>
      </div>

      <!-- Main Dashboard Grid -->
      <div class="bento" style="gap:24px">
        <!-- Continue Learning Active Banner (Left 8 cols) -->
        <div class="card s8 primary-edge">
          <div class="row between" style="margin-bottom:12px">
            <div class="row nowrap" style="gap:8px">
              <span class="chip primary">${I('microscope', 13)} Biology Ch. 4</span>
              <span class="chip teal">${T('Light-dependent Reactions', 'আলোক নির্ভর পর্যায়')}</span>
            </div>
            <span class="small muted">${T('68% Completed', '৬৮% সম্পন্ন')}</span>
          </div>
          <h3 style="font-size:20px;margin:8px 0 6px">
            ${T('Photosynthesis: Photolysis of Water & ATP Synthesis', 'সালোকসংশ্লেষণ: পানির ফটোলাইসিস ও ATP সংশ্লেষণ')}
          </h3>
          <p class="muted small" style="margin-bottom:16px;line-height:1.6">
            ${T(
      'Master how photosystem II absorbs light energy, splits H₂O into oxygen, and drives the chemiosmotic generation of ATP through ATP synthase.',
      'ফটোসিস্টেম II কীভাবে সৌরশক্তি শোষণ করে, পানি বিশ্লিষ্ট করে অক্সিজেন নির্গমন করে এবং ATP সিন্থেসিসের মাধ্যমে রাসায়নিক শক্তিতে রূপান্তর করে তা শিখুন।'
    )}
          </p>
          <div style="margin-bottom:16px">${D.bar(68, '')}</div>
          <div class="row between">
            <span class="small muted">${I('clock', 14)} ${T('Est. 12 mins remaining · Socratic Tutor Ready', 'বাকি আনুমানিক ১২ মিনিট')}</span>
            <button class="btn primary" id="dash-resume-lesson">${I('play', 15)} ${T('Resume Lesson', 'পাঠ চালিয়ে যান')}</button>
          </div>
        </div>

        <!-- Weekly Activity Visual Chart (Right 4 cols) -->
        <div class="card s4">
          <div class="card-head">
            <h3>${I('lineChart', 18)} ${T('Weekly Study Activity', 'সাপ্তাহিক অধ্যয়নের সময়')}</h3>
            <span class="chip">${D.liveTag()}</span>
          </div>
          <p class="small muted" style="margin:0 0 14px">${T('Daily learning minutes and focus points.', 'প্রতিদিনের পড়াশোনার সময় (মিনিট)।')}</p>
          
          <!-- Clean SVG Bar Chart -->
          <svg viewBox="0 0 320 160" width="100%" height="auto" class="chart" style="display:block">
            <line x1="30" y1="130" x2="310" y2="130" stroke="var(--line)" stroke-width="1.5"/>
            <line x1="30" y1="80" x2="310" y2="80" stroke="var(--line)" stroke-dasharray="3,3" stroke-width="1"/>
            <line x1="30" y1="30" x2="310" y2="30" stroke="var(--line)" stroke-dasharray="3,3" stroke-width="1"/>
            
            <!-- Bars for Mon - Sun -->
            <!-- Mon: 45m -->
            <rect x="45" y="65" width="22" height="65" rx="5" fill="var(--primary)" opacity="0.85"/>
            <text x="56" y="146" text-anchor="middle" font-size="10.5">Mon</text>
            
            <!-- Tue: 60m -->
            <rect x="85" y="45" width="22" height="85" rx="5" fill="var(--primary)" opacity="0.85"/>
            <text x="96" y="146" text-anchor="middle" font-size="10.5">Tue</text>
            
            <!-- Wed: 35m -->
            <rect x="125" y="80" width="22" height="50" rx="5" fill="var(--primary)" opacity="0.85"/>
            <text x="136" y="146" text-anchor="middle" font-size="10.5">Wed</text>
            
            <!-- Thu: 75m -->
            <rect x="165" y="25" width="22" height="105" rx="5" fill="var(--secondary)"/>
            <text x="176" y="146" text-anchor="middle" font-size="10.5">Thu</text>
            
            <!-- Fri: 50m -->
            <rect x="205" y="60" width="22" height="70" rx="5" fill="var(--primary)" opacity="0.85"/>
            <text x="216" y="146" text-anchor="middle" font-size="10.5">Fri</text>
            
            <!-- Sat: 90m (Peak) -->
            <rect x="245" y="10" width="22" height="120" rx="5" fill="var(--primary)"/>
            <text x="256" y="146" text-anchor="middle" font-size="10.5">Sat</text>
            
            <!-- Sun: Today (Active) -->
            <rect x="285" y="40" width="22" height="90" rx="5" fill="var(--gold)"/>
            <text x="296" y="146" text-anchor="middle" font-size="10.5" font-weight="700">Sun</text>
          </svg>
          <div class="row between small muted" style="margin-top:10px">
            <span>${T('Total: 6.8 hrs', 'মোট: ৬.৮ ঘণ্টা')}</span>
            <span class="row nowrap" style="gap:4px;color:var(--ok);font-weight:700">${I('trendingUp', 13)} +18% XP gain</span>
          </div>
        </div>

        <!-- Recommended Lessons (3 cards in 8 cols) -->
        <div class="card s8">
          <div class="card-head">
            <h3>${I('lightbulb', 18)} ${T('Recommended Next Lessons', 'সুপারিশকৃত পরবর্তী পাঠ')}</h3>
            <span class="small muted">${T('Tailored to your target: Biomedical AI', 'তোমার লক্ষ্য অনুযায়ী নির্বাচিত')}</span>
          </div>
          <div class="grid g3">
            <div class="card flat tint" style="border:1px solid var(--line);padding:16px">
              <span class="chip primary" style="font-size:11px;margin-bottom:8px">Biology · HSC</span>
              <b style="font-size:14px;display:block;margin-bottom:6px">${T('Cellular Respiration in Aerobic Organisms', 'সবাত শ্বসন ও ক্রেবস চক্র')}</b>
              <div class="small muted" style="margin-bottom:12px">${I('clock', 13)} 35 mins · Glycolysis & Krebs</div>
              <button class="btn sm" onclick="window.D.wsGo('tutor')">${T('Start', 'শুরু')} ${I('arrowRight', 13)}</button>
            </div>

            <div class="card flat tint" style="border:1px solid var(--line);padding:16px">
              <span class="chip teal" style="font-size:11px;margin-bottom:8px">Chemistry · HSC</span>
              <b style="font-size:14px;display:block;margin-bottom:6px">${T('Chemical Equilibrium & Le Chatelier', 'রাসায়নিক সাম্যাবস্থা ও লা-শাতেলীয়')}</b>
              <div class="small muted" style="margin-bottom:12px">${I('clock', 13)} 40 mins · Kc, Kp Titration</div>
              <button class="btn sm" onclick="window.D.wsGo('tutor')">${T('Start', 'শুরু')} ${I('arrowRight', 13)}</button>
            </div>

            <div class="card flat tint" style="border:1px solid var(--line);padding:16px">
              <span class="chip gold" style="font-size:11px;margin-bottom:8px">ICT · HSC</span>
              <b style="font-size:14px;display:block;margin-bottom:6px">${T('Boolean Algebra & Logic Gate Synthesis', 'বুলিয়ান অ্যালজেব্রা ও লজিক গেট')}</b>
              <div class="small muted" style="margin-bottom:12px">${I('clock', 13)} 30 mins · NAND & NOR Logic</div>
              <button class="btn sm" onclick="window.D.wsGo('tutor')">${T('Start', 'শুরু')} ${I('arrowRight', 13)}</button>
            </div>
          </div>
        </div>

        <!-- Recent Achievements & Badges (Right 4 cols) -->
        <div class="card s4">
          <div class="card-head">
            <h3>${I('award', 18)} ${T('Recent Achievements', 'সাম্প্রতিক অর্জন')}</h3>
            <span class="chip">${D.n(g.badges.length)}</span>
          </div>
          <div class="col" style="gap:10px">
            <div class="row nowrap" style="gap:10px;padding:8px;border-radius:10px;background:var(--card2)">
              <span class="ic-box gold">${I('flame', 18)}</span>
              <div>
                <b style="font-size:13.5px;display:block">21-Day Learning Streak</b>
                <span class="small muted">${T('Unbroken dedication to daily STEM mastery', 'টানা ২১ দিন বিজ্ঞান চর্চা')}</span>
              </div>
            </div>

            <div class="row nowrap" style="gap:10px;padding:8px;border-radius:10px;background:var(--card2)">
              <span class="ic-box">${I('dna', 18)}</span>
              <div>
                <b style="font-size:13.5px;display:block">Cell Architect</b>
                <span class="small muted">${T('Perfect organelle assembly in Sandbox', 'স্যান্ডবক্সে নিখুঁত কোষ নির্মাণ')}</span>
              </div>
            </div>

            <div class="row nowrap" style="gap:10px;padding:8px;border-radius:10px;background:var(--card2)">
              <span class="ic-box teal">${I('zap', 18)}</span>
              <div>
                <b style="font-size:13.5px;display:block">Combo ×9 Master</b>
                <span class="small muted">${T('9 consecutive correct adaptive answers', 'টানা ৯টি সঠিক উত্তর')}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- My Learning Quest Overview & Career Recommendations (Full width 12 cols) -->
        <div class="card s7">
          <div class="card-head">
            <h3>${I('puzzle', 18)} ${T('My Learning Quest Status', 'লার্নিং কোয়েস্ট অগ্রগতি')}</h3>
            <button class="btn sm ghost" onclick="window.D.wsGo('quest')">${T('View All Quests', 'সব কোয়েস্ট')} →</button>
          </div>
          ${D.SUBJECTS.map((s) => {
      const q = D.quest(s.id);
      const m = D.subjectMastery(s.id);
      return `
              <div style="margin-bottom:14px">
                <div class="row between small" style="margin-bottom:4px">
                  <span class="row nowrap" style="gap:6px"><b>${I(s.icon, 15)} ${esc(tx(s.name))}</b></span>
                  <span><b>${D.n(m)}%</b> <span class="muted">${T('Mastery', 'দক্ষতা')}</span></span>
                </div>
                <div class="grid g4" style="gap:6px">
                  <div>${D.bar(q.p1, 'thin')}<span class="small muted" style="font-size:10.5px">Sandbox</span></div>
                  <div>${D.bar(q.p2, 'thin')}<span class="small muted" style="font-size:10.5px">Sprint</span></div>
                  <div>${D.bar(q.p3, 'gold thin')}<span class="small muted" style="font-size:10.5px">Challenge</span></div>
                  <div>${D.bar(q.p4, 'teal thin')}<span class="small muted" style="font-size:10.5px">Co-op</span></div>
                </div>
              </div>
            `;
    }).join('')}
        </div>

        <div class="card s5">
          <div class="card-head">
            <h3>${I('compass', 18)} ${T('Top Career Recommendations', 'শীর্ষ ক্যারিয়ার সুপারিশ')}</h3>
            <button class="btn sm ghost" onclick="window.D.wsGo('career')">${T('Explore Career Graph', 'ক্যারিয়ার গ্রাফ')} →</button>
          </div>
          <div class="col" style="gap:12px">
            ${D.careerMatches().slice(0, 3).map((m) => `
              <div class="card flat tint" style="padding:14px;border:1px solid var(--line)">
                <div class="row between" style="margin-bottom:6px">
                  <b style="font-size:14px">${esc(tx(m.c.name))}</b>
                  <span class="chip primary" style="font-size:11.5px">${D.n(m.pct)}% ${T('Match', 'মিল')}</span>
                </div>
                ${D.bar(m.pct, 'teal')}
                <div class="row between small muted" style="margin-top:8px">
                  <span>O*NET ${esc(m.c.onet)}</span>
                  <span>${T('Gap', 'ঘাটতি')}: <b>${esc(tx(D.subject(m.gap).name))}</b></span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    D.$('#dash-quick-study').onclick = () => window.D.wsGo('tutor');
    D.$('#dash-resume-lesson').onclick = () => window.D.wsGo('tutor');
    D.$('#dash-snap-btn').onclick = () => window.D.wsGo('snap');

    // Dashboard Topbar actions
    const dashLang = D.$('#dash-lang-btn');
    if (dashLang) dashLang.onclick = () => D.openLanguages();
    const dashThBtn = D.$('#dash-theme-btn');
    if (dashThBtn) dashThBtn.onclick = () => D.openThemePicker();
    const dashNotif = D.$('#dash-notif-btn');
    if (dashNotif) {
      dashNotif.onclick = () => {
        D.modal(
          T('Notifications & Activity Alerts', 'বিজ্ঞপ্তি ও অ্যালার্ট'),
          `<div style="display:flex;flex-direction:column;gap:10px">
            <div style="display:flex;gap:12px;padding:12px;border-radius:10px;background:var(--bg);border:1px solid var(--line);align-items:flex-start">
              <span style="color:var(--secondary);margin-top:2px">${I('award', 18)}</span>
              <div>
                <div style="font-weight:700;font-size:13px">${T('Achievement Unlocked: Bioenergetics Specialist', 'অর্জন আনলক: জীবনীশক্তি বিশেষজ্ঞ')}</div>
                <div style="font-size:12px;color:var(--muted)">${T('You scored 94% on Calvin cycle stoichiometry in AI Teacher.', 'AI শিক্ষকে কেলভিন চক্রে ৯৪% নম্বর পেয়েছো।')}</div>
                <div style="font-size:10.5px;color:var(--primary);margin-top:4px">2 hours ago</div>
              </div>
            </div>
            <div style="display:flex;gap:12px;padding:12px;border-radius:10px;background:var(--bg);border:1px solid var(--line);align-items:flex-start">
              <span style="color:var(--primary);margin-top:2px">${I('teacher', 18)}</span>
              <div>
                <div style="font-weight:700;font-size:13px">${T('Teacher Shahana Akter assigned CQ Practice #4', 'শিক্ষক শাহানা আক্তার সৃজনশীল অনুশীলন #৪ বরাদ্দ করেছেন')}</div>
                <div style="font-size:12px;color:var(--muted)">${T('NCTB Creative Question set on light-dependent photolysis.', 'আলোক-নির্ভর ফটোলাইসিস সৃজনশীল প্রশ্ন সেট।')}</div>
                <div style="font-size:10.5px;color:var(--primary);margin-top:4px">Yesterday</div>
              </div>
            </div>
            <div style="display:flex;gap:12px;padding:12px;border-radius:10px;background:var(--bg);border:1px solid var(--line);align-items:flex-start">
              <span style="color:var(--gold);margin-top:2px">${I('briefcase', 18)}</span>
              <div>
                <div style="font-weight:700;font-size:13px">${T('SkillBridge Micro-internship Match Available', 'স্কিলব্রিজ মাইক্রো-ইন্টার্নশিপ সুযোগ পাওয়া গেছে')}</div>
                <div style="font-size:12px;color:var(--muted)">${T('River-Water Titration Analysis matched with 88% skill overlap.', 'নদীর পানি বিশ্লেষণ প্রকল্পে ৮৮% স্কিল ম্যাচ।')}</div>
                <div style="font-size:10.5px;color:var(--primary);margin-top:4px">3 days ago</div>
              </div>
            </div>
          </div>`
        );
      };
    }
    const dashProf = D.$('#dash-profile-btn');
    if (dashProf) dashProf.onclick = () => window.D.wsGo('passport');
    const sbToggle = D.$('#app-sidebar-toggle');
    if (sbToggle) {
      sbToggle.onclick = () => {
        const sb = D.$('#app-sidebar');
        if (sb) sb.classList.toggle('open');
      };
    }
  }

  /* ==========================================================================
     MODULE 3: AI Teacher Workspace
     ========================================================================== */
  function renderAITeacherWorkspace(container) {
    const sub = D.subject(W.s);
    const modeObj = TEACHING_MODES.find((m) => m.id === W.m) || TEACHING_MODES[0];

    container.innerHTML = `
      <!-- Workspace Header -->
      <div class="row between" style="margin-bottom:20px;gap:16px;align-items:flex-end">
        <div>
          <div class="row nowrap" style="gap:8px;margin-bottom:4px">
            <span class="chip primary">${I('cpu', 13)} Pedagogy Engine Active</span>
            <span class="chip teal">${I('languages', 13)} Bilingual Bangla & English</span>
          </div>
          <h1 style="font-size:clamp(24px, 2.5vw, 32px);margin:0">
            ${T('Dishari AI Teacher', 'দিশারী AI শিক্ষক')}
          </h1>
          <p class="muted" style="margin:4px 0 0;font-size:14px">
            ${T('Your personal bilingual learning companion grounded in NCTB textbooks.', 'এনসিটিবি পাঠ্যপুস্তক-নির্দেশিত আপনার ব্যক্তিগত দ্বিভাষিক শিক্ষণ সঙ্গী।')}
          </p>
        </div>

        <div class="row" style="gap:10px">
          <!-- Subject Selector -->
          <select id="tutor-subj-select" style="width:auto;font-weight:600">
            ${D.SUBJECTS.map((s) => `<option value="${s.id}" ${s.id === W.s ? 'selected' : ''}>${esc(tx(s.name))}</option>`).join('')}
          </select>

          <!-- Chapter Selector -->
          <select id="tutor-chap-select" style="width:auto;font-weight:600">
            <option value="ch4">Ch. 4: Bioenergetics & Photosynthesis (জীবনীশক্তি)</option>
            <option value="ch1">Ch. 1: Cell Structure & Organelles (কোষ ও অঙ্গাণু)</option>
            <option value="ch2">Ch. 2: Cell Division & Genetics (কোষ বিভাজন)</option>
          </select>
        </div>
      </div>

      <!-- 4 Teaching Methods Selector Cards -->
      <div class="methods-grid" style="margin-bottom:24px">
        ${TEACHING_MODES.map((m) => `
          <div class="method-card ${W.m === m.id ? 'active' : ''}" data-mode="${m.id}">
            <div class="row between">
              <span class="ic-box ${W.m === m.id ? 'primary' : ''}">${I(m.icon, 18)}</span>
              ${W.m === m.id ? `<span class="chip em" style="font-size:10.5px">Active</span>` : ''}
            </div>
            <b>${esc(tx(m.name))}</b>
            <span>${esc(tx(m.desc))}</span>
          </div>
        `).join('')}
      </div>

      <!-- Main Split Workspace: Left Chat (1fr), Right Context Panel (340px) -->
      <div class="tutor-workspace">
        <!-- Main Chat Area -->
        <div class="card" style="padding:0;overflow:hidden;display:flex;flex-direction:column;height:620px">
          <!-- Chat Card Header -->
          <div class="row between" style="padding:14px 20px;border-bottom:1px solid var(--line);background:var(--card2)">
            <div class="row nowrap" style="gap:10px">
              <span class="ic-box lg">${I('microscope', 22)}</span>
              <div>
                <b style="font-size:15px;display:block">${esc(tx(sub.name))}: ${T('Photosynthesis & Bioenergetics', 'সালোকসংশ্লেষণ ও জীবনীশক্তি')}</b>
                <span class="small muted">${I('book', 13)} NCTB Grade 9-10 Biology · Ch. 4</span>
              </div>
            </div>
            <div class="row nowrap" style="gap:6px">
              <span class="chip ok" id="tutor-ground-badge">${I('shieldCheck', 13)} 98.4% Grounded</span>
              <button class="btn sm ghost icon" id="tutor-clear-btn" title="${T('Clear Chat', 'চ্যাট মুছুন')}">${I('refresh', 16)}</button>
            </div>
          </div>

          <!-- Messages Scroll Area -->
          <div class="chat grow" id="tutor-chat-stream" style="padding:20px;max-height:none">
            ${W.tutorChat.map((m) => `
              <div class="msg ${m.sender === 'ai' ? 'ai' : 'me'}">
                <div style="white-space:pre-wrap">${D.state.lang === 'bn' ? esc(m.text.bn) : esc(m.text.en)}</div>
                ${m.sender === 'ai' ? `
                  <div class="meta">
                    <span class="chip" style="font-size:11px">${m.method || 'Curriculum Tutor'}</span>
                    <button class="tutor-cite-btn" data-cite="${m.cite || 'bio-01'}">${I('bookOpen', 12)} ${T('NCTB Source', 'পাঠ্যসূত্র')}</button>
                    <button class="tutor-tts-btn" data-tts="${esc(D.state.lang === 'bn' ? m.text.bn : m.text.en)}">${I('volume', 12)} ${T('Read aloud', 'শুনুন')}</button>
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>

          <!-- Quick Prompts Pills -->
          <div class="row nowrap" style="padding:8px 18px;gap:8px;overflow-x:auto;scrollbar-width:none;background:var(--card2);border-top:1px solid var(--line)">
            <span class="small muted" style="font-size:12px;white-space:nowrap">${T('Try asking:', 'জিজ্ঞেস করো:')}</span>
            <button class="chip click pill-btn" data-prompt="What happens during the Calvin Cycle in the stroma?">${T('What happens in the Calvin Cycle?', 'কেলভিন চক্রে কী ঘটে?')}</button>
            <button class="chip click pill-btn" data-prompt="Why is water split in photosystem II?">${T('Why is water split?', 'পানি কেন বিশ্লিষ্ট হয়?')}</button>
            <button class="chip click pill-btn" data-prompt="Explain difference between light and dark reactions.">${T('Light vs Dark reactions', 'আলোক বনাম অন্ধকার পর্যায়')}</button>
          </div>

          <!-- Input Footer -->
          <div style="padding:16px 20px;border-top:1px solid var(--line);background:var(--card)">
            <form id="tutor-input-form" class="row nowrap" style="gap:10px">
              <label class="btn ghost icon" title="${T('Upload diagram or problem photo', 'ছবি বা ডায়াগ্রাম আপলোড')}" style="cursor:pointer;flex:0 0 auto">
                ${I('upload', 18)}
                <input type="file" accept="image/*" class="sr-only" id="tutor-photo-up">
              </label>
              <button type="button" class="btn ghost icon" id="tutor-mic-btn" title="${T('Voice input (speech-to-text)', 'ভয়েস ইনপুট')}">
                ${I('mic', 18)}
              </button>
              <input type="text" id="tutor-msg-input" placeholder="${T('Ask about photosynthesis, chloroplasts, or ATP synthesis...', 'সালোকসংশ্লেষণ, ক্লোরোপ্লাস্ট বা ATP সম্পর্কে প্রশ্ন করো...')}" autocomplete="off" style="flex:1">
              <button type="submit" class="btn primary" id="tutor-send-btn" style="flex:0 0 auto">
                ${I('send', 16)} ${T('Send', 'পাঠাও')}
              </button>
            </form>
          </div>
        </div>

        <!-- Right Side Learning Context Panel -->
        <div class="col" style="gap:18px">
          <!-- Current Topic Card -->
          <div class="card">
            <div class="card-head">
              <h3>${I('bookOpen', 16)} ${T('Topic Context', 'পাঠের প্রাসঙ্গিকতা')}</h3>
              <span class="chip primary">NCTB Biology</span>
            </div>
            <b style="font-size:15px;display:block;margin-bottom:6px">Bioenergetics: Photosynthesis</b>
            <p class="small muted" style="margin-bottom:12px">
              Chapter 4 covers energy transformation in living cells, pigment absorption spectra, and photophosphorylation.
            </p>

            <div class="eyebrow" style="margin-bottom:8px">${T('Learning Objectives', 'শিখনফল')}</div>
            <ul class="clean small">
              <li>${I('checkCircle', 15)} <span>${T('Explain light-dependent reaction mechanisms', 'আলোক-নির্ভর পর্যায়ের প্রক্রিয়া ব্যাখ্যা')}</span></li>
              <li>${I('checkCircle', 15)} <span>${T('Trace electron flow through photosystems I & II', 'ফটোসিস্টেম I ও II-তে ইলেকট্রন প্রবাহ চিহ্নিতকরণ')}</span></li>
              <li>${I('checkCircle', 15)} <span>${T('Account for ATP & NADPH usage in Calvin cycle', 'কেলভিন চক্রে ATP ও NADPH-এর ব্যবহার বিশ্লেষণ')}</span></li>
            </ul>
          </div>

          <!-- Grounding & Explainability Card -->
          <div class="card">
            <div class="card-head">
              <h3>${I('shieldCheck', 16)} ${T('Grounding & Safety', 'নির্ভরযোগ্যতা ও সুরক্ষা')}</h3>
              <span class="chip ok">Live Audit</span>
            </div>
            <div class="col small" style="gap:10px">
              <div class="row between">
                <span class="muted">${T('Grounding Faithfulness Score', 'গ্রাউন্ডিং স্কোর')}</span>
                <b style="color:var(--ok)">98.4%</b>
              </div>
              ${D.bar(98.4, 'teal thin')}

              <div class="row between">
                <span class="muted">${T('Curriculum Source Citations', 'পাঠ্যসূত্র')}</span>
                <b>NCTB §4.2 · OpenStax §8.2</b>
              </div>

              <div class="row between">
                <span class="muted">${T('PII Redaction Engine', 'ব্যক্তিগত তথ্য সুরক্ষা')}</span>
                <span class="chip ok" style="padding:1px 6px;font-size:11px">${I('check', 12)} Active</span>
              </div>

              <div class="row between">
                <span class="muted">${T('Prompt Injection Shield', 'প্রম্পট ইনজেকশন ফিল্টার')}</span>
                <span class="chip ok" style="padding:1px 6px;font-size:11px">${I('check', 12)} Passed</span>
              </div>

              <div class="row between">
                <span class="muted">${T('Age-Appropriate Language', 'বয়সোপযোগী ভাষা')}</span>
                <span class="chip ok" style="padding:1px 6px;font-size:11px">${I('check', 12)} Verified</span>
              </div>
            </div>
          </div>

          <!-- Mastery Meter -->
          <div class="card">
            <div class="card-head">
              <h3>${I('target', 16)} ${T('Concept Mastery', 'ধারণাগত দক্ষতা')}</h3>
              <span class="chip gold">${D.n(82)}%</span>
            </div>
            ${D.bar(82, '')}
            <p class="small muted" style="margin-top:10px">
              ${T('4 of 5 concepts mastered in this chapter. Complete Feynman Teach-back to unlock the Bioenergetics Badge.', 'এই অধ্যায়ের ৫টির মধ্যে ৪টি ধারণা সম্পন্ন। ফাইনম্যান পদ্ধতিতে শেখালে বিশেষ ব্যাজ অর্জিত হবে।')}
            </p>
          </div>
        </div>
      </div>
    `;

    // Event listeners
    D.$$('#tutor-subj-select').forEach((s) => {
      s.onchange = (e) => {
        W.s = e.target.value;
        D.setParams({ s: W.s });
        renderAITeacherWorkspace(container);
      };
    });

    D.$$('[data-mode]').forEach((btn) => {
      btn.onclick = () => {
        W.m = btn.dataset.mode;
        D.setParams({ m: W.m });
        renderAITeacherWorkspace(container);
      };
    });

    D.$$('.tutor-cite-btn').forEach((b) => {
      b.onclick = () => D.showSource(b.dataset.cite);
    });

    D.$$('.tutor-tts-btn').forEach((b) => {
      b.onclick = () => {
        if ('speechSynthesis' in window) {
          const u = new SpeechSynthesisUtterance(b.dataset.tts);
          u.lang = D.state.lang === 'bn' ? 'bn-BD' : 'en-US';
          window.speechSynthesis.speak(u);
        } else {
          D.toast(T('Speech synthesis not supported in this browser.', 'স্পিচ সিন্থেসিস ব্রাউজারে সমর্থিত নয়।'));
        }
      };
    });

    D.$$('.pill-btn').forEach((p) => {
      p.onclick = () => {
        const inp = D.$('#tutor-msg-input');
        inp.value = p.dataset.prompt;
        inp.focus();
      };
    });

    const form = D.$('#tutor-input-form');
    if (form) {
      form.onsubmit = (e) => {
        e.preventDefault();
        const inp = D.$('#tutor-msg-input');
        const txt = inp.value.trim();
        if (!txt) return;

        // Push student message
        W.tutorChat.push({
          sender: 'user',
          text: { en: txt, bn: txt }
        });
        inp.value = '';

        // Add pedagogical AI response
        setTimeout(() => {
          W.tutorChat.push({
            sender: 'ai',
            text: {
              en: `Grounded in NCTB Biology Ch. 4: Regarding "${txt}", the light reactions split water at Photosystem II (P680), releasing electrons through the electron transport chain to generate ATP and NADPH, which enter the Calvin cycle.`,
              bn: `এনসিটিবি জীববিজ্ঞান অধ্যায় ৪ এর ভিত্তিতে: "${txt}" সম্পর্কিত মূল তথ্য হলো, ফটোসিস্টেম II-তে সৌরশক্তি দ্বারা পানি বিশ্লিষ্ট হয়ে ইলেকট্রন নির্গত হয় এবং এটি ইলেকট্রন ট্রান্সপোর্ট চেইনের মাধ্যমে ATP ও NADPH সংশ্লেষণ করে।`
            },
            method: TEACHING_MODES.find((m) => m.id === W.m).name.en,
            cite: 'bio-02'
          });
          D.addXP(15, T('AI Teacher interaction', 'AI শিক্ষকের সাথে আলোচনা'));
          renderAITeacherWorkspace(container);
          const stream = D.$('#tutor-chat-stream');
          if (stream) stream.scrollTop = stream.scrollHeight;
        }, 600);

        renderAITeacherWorkspace(container);
      };
    }
  }

  /* ==========================================================================
     MODULE 4: Learning Quest
     ========================================================================== */
  function renderLearningQuestPage(container) {
    const q = D.quest(W.s);
    const sub = D.subject(W.s);

    container.innerHTML = `
      <div class="row between" style="margin-bottom:24px;gap:16px;align-items:flex-end">
        <div>
          <div class="row nowrap" style="gap:8px;margin-bottom:6px">
            <span class="chip primary">${I('swords', 14)} Gamified STEM Quest</span>
            <span class="chip teal">${I('award', 14)} 21,450 Total XP</span>
            ${D.demoTag()}
          </div>
          <h1 style="font-size:clamp(24px, 2.8vw, 34px);margin:0">
            ${T('Your Learning Quest', 'তোমার লার্নিং কোয়েস্ট')}
          </h1>
          <p class="muted" style="margin:6px 0 0;font-size:14.5px">
            ${T('Turn textbook science into authentic real-world missions across Bangladesh: tackle dengue outbreaks, test contaminated rivers, and build flood-relief algorithms.', 'পাঠ্যবইয়ের বিজ্ঞানকে রূপ দাও বাস্তব মিশনে: ডেঙ্গু প্রতিরোধ, নদী দূষণ পরীক্ষা ও বন্যা ত্রাণের অ্যালগরিদম তৈরি।')}
          </p>
        </div>

        <div class="hud" id="hud">${D.refreshHUD ? '' : ''}</div>
      </div>

      <!-- Subject Cards Grid with Progress Indicators -->
      <div class="grid g4" style="margin-bottom:28px">
        ${D.SUBJECTS.slice(0, 4).map((s) => {
      const sq = D.quest(s.id);
      const sm = D.subjectMastery(s.id);
      const isAct = s.id === W.s;
      return `
            <div class="card hoverable ${isAct ? 'primary-edge' : ''}" data-qsubj="${s.id}" style="cursor:pointer;border-color:${isAct ? 'var(--primary)' : 'var(--line)'}">
              <div class="row between" style="margin-bottom:10px">
                <span class="ic-box ${isAct ? '' : 'teal'}">${I(s.icon, 18)}</span>
                <span class="chip ${isAct ? 'primary' : ''}">${D.n(sm)}% ${T('Mastery', 'দক্ষতা')}</span>
              </div>
              <b style="font-size:15px;display:block;margin-bottom:4px">${esc(tx(s.name))}</b>
              <div class="small muted" style="margin-bottom:12px;line-height:1.4">${esc(tx(s.topic))}</div>
              ${D.bar(sm, isAct ? '' : 'teal')}
              <div class="row between small muted" style="margin-top:8px">
                <span>Stage ${D.n(W.p)}/4</span>
                <span style="color:var(--primary);font-weight:700">${isAct ? T('Active', 'চলমান') : T('Select', 'বাছাই')} →</span>
              </div>
            </div>
          `;
    }).join('')}
      </div>

      <!-- Four Learning Stages Tabs -->
      <div class="tabs pills" style="margin-bottom:24px" id="quest-stage-pills">
        <button class="tab ${W.p === '1' ? 'active' : ''}" data-qp="1">${I('puzzle', 16)} 1. ${T('Concept Sandbox', 'ধারণা স্যান্ডবক্স')}</button>
        <button class="tab ${W.p === '2' ? 'active' : ''}" data-qp="2">${I('target', 16)} 2. ${T('Adaptive Practice Sprint', 'অনুশীলন স্প্রিন্ট')}</button>
        <button class="tab ${W.p === '3' ? 'active' : ''}" data-qp="3">${I('swords', 16)} 3. ${T('Real-world Challenge', 'বাস্তব চ্যালেঞ্জ')}</button>
        <button class="tab ${W.p === '4' ? 'active' : ''}" data-qp="4">${I('users', 16)} 4. ${T('Co-op League', 'কো-অপ লিগ')}</button>
      </div>

      <!-- Stage Interactive View Area -->
      <div class="bento" style="gap:24px">
        <div class="card s8" id="quest-interactive-stage" style="min-height:460px">
          <!-- Injected by stage renderer -->
        </div>

        <!-- Right Side Challenge Highlights & Achievements -->
        <div class="col s4" style="gap:20px">
          <!-- Featured Challenge 1: Dengue Prevention -->
          <div class="card primary-edge">
            <div class="row between" style="margin-bottom:8px">
              <span class="chip danger">${I('stethoscope', 13)} Biology Challenge</span>
              <span class="small muted">+120 XP</span>
            </div>
            <h4 style="font-size:15px;margin:0 0 6px">
              ${T('Dengue Vector Control & Kurigram Clinic Case', 'ডেঙ্গু প্রতিরোধ ও কুড়িগ্রাম ক্লিনিক কেস')}
            </h4>
            <p class="small muted" style="line-height:1.55;margin-bottom:12px">
              ${T('Diagnose CBC platelet counts and NS1 antigens for a 14-year-old patient during monsoon season. Advise community on Aedes mosquito breeding eradication.', 'বর্ষা মৌসুমে ১৪ বছর বয়সী রোগীর CBC ও NS1 অ্যান্টিজেন বিশ্লেষণ করে ডেঙ্গু শনাক্তকরণ এবং এডিস লার্ভা নির্মূলে পরামর্শ প্রদান।')}
            </p>
            <button class="btn sm primary" id="launch-dengue-btn">${I('play', 14)} ${T('Launch Challenge', 'চ্যালেঞ্জ শুরু')}</button>
          </div>

          <!-- Featured Challenge 2: Polluted River Water -->
          <div class="card teal-edge">
            <div class="row between" style="margin-bottom:8px">
              <span class="chip teal">${I('droplet', 13)} Chemistry Challenge</span>
              <span class="small muted">+100 XP</span>
            </div>
            <h4 style="font-size:15px;margin:0 0 6px">
              ${T('Polluted River Water Testing (Turag & Buriganga)', 'তুরাগ ও বুড়িগঙ্গার দূষিত পানি পরীক্ষা')}
            </h4>
            <p class="small muted" style="line-height:1.55;margin-bottom:12px">
              ${T('Perform titration calculations with 0.10 M NaOH on industrial runoff, assess pH drops and dissolved oxygen, and calculate lime neutralization requirements.', 'শিল্পবর্জ্যের পানিতে ০.১০ M NaOH দিয়ে টাইট্রেশন হিসাব, pH ও দ্রবীভূত অক্সিজেন (DO) মূল্যায়ন এবং চুন দিয়ে প্রশমন গণনা।')}
            </p>
            <button class="btn sm teal" id="launch-river-btn">${I('play', 14)} ${T('Launch Challenge', 'চ্যালেঞ্জ শুরু')}</button>
          </div>

          <!-- Quest Badges Showcase -->
          <div class="card">
            <div class="card-head">
              <h3>${I('award', 16)} ${T('Quest Badges', 'কোয়েস্ট ব্যাজ')}</h3>
              <span class="chip gold">${D.n(D.state.game.badges.length)} Unlocked</span>
            </div>
            <div class="row" style="gap:8px">
              ${D.state.game.badges.map((b) => `
                <span class="chip" title="${esc(tx(b.label))}">${I(b.icon || 'award', 13)} ${esc(tx(b.label))}</span>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;

    // Subject switcher
    D.$$('[data-qsubj]').forEach((b) => {
      b.onclick = () => {
        W.s = b.dataset.qsubj;
        D.setParams({ s: W.s });
        renderLearningQuestPage(container);
      };
    });

    // Stage pills
    D.$$('[data-qp]').forEach((b) => {
      b.onclick = () => {
        W.p = b.dataset.qp;
        D.setParams({ p: W.p });
        renderLearningQuestPage(container);
      };
    });

    // Launch shortcuts
    const dengBtn = D.$('#launch-dengue-btn');
    if (dengBtn) dengBtn.onclick = () => {
      W.s = 'bio';
      W.p = '3';
      D.setParams({ s: 'bio', p: '3' });
      renderLearningQuestPage(container);
    };

    const rivBtn = D.$('#launch-river-btn');
    if (rivBtn) rivBtn.onclick = () => {
      W.s = 'chem';
      W.p = '3';
      D.setParams({ s: 'chem', p: '3' });
      renderLearningQuestPage(container);
    };

    // Render inner stage
    const stageBox = D.$('#quest-interactive-stage');
    if (stageBox) {
      if (W.p === '1' && D.LABS && D.LABS[W.s]) D.LABS[W.s](stageBox, sub);
      else if (W.p === '2' && D.GAME && D.GAME.practice) D.GAME.practice(stageBox, sub);
      else if (W.p === '3' && D.GAME && D.GAME.boss) D.GAME.boss(stageBox, sub);
      else if (W.p === '4' && D.GAME && D.GAME.coop) D.GAME.coop(stageBox, sub);
      else if (D.LABS && D.LABS[W.s]) D.LABS[W.s](stageBox, sub);
    }
  }

  /* ==========================================================================
     MODULE 5: Career Navigator
     ========================================================================== */
  function renderCareerNavigatorPage(container) {
    if (D.TABS && D.TABS.career) {
      D.TABS.career(container);
    }
  }

  /* ==========================================================================
     MODULE 6: SkillBridge Micro-Internships
     ========================================================================== */
  function renderSkillBridgePage(container) {
    container.innerHTML = `
      <div class="row between" style="margin-bottom:24px;gap:16px;align-items:flex-end">
        <div>
          <div class="row nowrap" style="gap:8px;margin-bottom:6px">
            <span class="chip primary">${I('route', 14)} Applied Industry Skills</span>
            <span class="chip teal">${I('briefcase', 14)} 4 Micro-Internships</span>
          </div>
          <h1 style="font-size:clamp(24px, 2.8vw, 34px);margin:0">
            ${T('Build Skills Through Real Challenges', 'বাস্তব চ্যালেঞ্জের মাধ্যমে দক্ষতা অর্জন')}
          </h1>
          <p class="muted" style="margin:6px 0 0;font-size:14.5px">
            ${T('Connect classroom STEM learning with practical workplace tasks. Solve authentic briefs, pass the AI viva, and receive verifiable Skill Passports.', 'শ্রেণিকক্ষের বিজ্ঞানকে বাস্তব কর্মক্ষেত্রের কাজের সাথে সংযুক্ত করো। সমস্যা সমাধান করো, এআই ভাইভা পাস করো এবং আন্তর্জাতিক মানসম্পন্ন সনদ লাভ করো।')}
          </p>
        </div>
      </div>

      <!-- 4 Available Micro-Internship Cards -->
      <div class="grid g4" style="margin-bottom:32px">
        ${Object.entries(D.INTERNSHIPS).map(([k, it]) => {
      const has = D.state.passports.find((p) => p.skill === it.skill);
      return `
            <div class="card hoverable" style="display:flex;flex-direction:column;border-top:3px solid var(--primary)">
              <div class="row between" style="margin-bottom:12px">
                <span class="ic-box lg">${I(it.icon, 22)}</span>
                <span class="chip ${has ? 'ok' : 'primary'}">${has ? 'Completed' : 'Available'}</span>
              </div>
              <b style="font-size:16px;display:block;margin-bottom:6px">${esc(tx(it.title))}</b>
              <div class="small muted" style="margin-bottom:10px">${esc(tx(it.org))} · O*NET ${esc(it.onet)}</div>
              <p class="small muted grow" style="line-height:1.55;margin-bottom:16px">${esc(tx(it.brief)).slice(0, 110)}…</p>
              
              <div class="row between small" style="margin-bottom:14px;border-top:1px solid var(--line);padding-top:10px">
                <span><b>Skill:</b> ${it.skill}</span>
                <span><b>Duration:</b> 3-4 hrs</span>
              </div>

              <button class="btn ${has ? '' : 'primary'}" data-bridge-intern="${k}" style="width:100%;justify-content:center">
                ${has ? I('check', 15) + ' ' + T('Review / Retry', 'আবার পরীক্ষা') : I('play', 15) + ' ' + T('Start Challenge', 'চ্যালেঞ্জ শুরু')}
              </button>
            </div>
          `;
    }).join('')}
      </div>

      <!-- Task Workspace Preview Section -->
      <div class="card" style="padding:28px">
        <div class="card-head">
          <div>
            <div class="eyebrow">${T('Interactive Task Workspace Preview', 'টাস্ক ওয়ার্কস্পেস প্রিভিউ')}</div>
            <h3 style="font-size:20px;margin:4px 0">${T('Simulated Workplace Environment', 'সিমুলেটেড কর্মক্ষেত্র পরিবেশ')}</h3>
          </div>
          <span class="chip ok">${I('shieldCheck', 14)} Proctored Benchmark</span>
        </div>
        <p class="muted small" style="max-width:740px;line-height:1.6;margin-bottom:20px">
          ${T('Each micro-internship provides a live dataset or sample brief. You perform real data calculations or code logic, submit your solution for automated verification, and defend your method in a three-question oral AI viva.', 'প্রতিটি মাইক্রো-ইন্টার্নশিপ বাস্তব ডেটাসেট বা ব্রিফ দেয়। সমাধান যাচাই শেষে ৩টি মৌখিক প্রশ্নের এআই ভাইভায় উত্তীর্ণ হলে কিউআর-যাচাইযোগ্য সনদ ইস্যু হয়।')}
        </p>

        <div class="bento" style="gap:20px">
          <div class="s4 card flat tint" style="border:1px solid var(--line);padding:18px">
            <h4 style="margin:0 0 8px">${I('file', 16)} 1. Problem Brief & Raw Data</h4>
            <p class="small muted" style="margin:0">Authentic dataset extracted from genomic repositories, microfinance records, or water sensors.</p>
          </div>
          <div class="s4 card flat tint" style="border:1px solid var(--line);padding:18px">
            <h4 style="margin:0 0 8px">${I('terminal', 16)} 2. Calculation & Submission</h4>
            <p class="small muted" style="margin:0">Perform mathematical derivations, verify tolerances, and submit answers to the lead.</p>
          </div>
          <div class="s4 card flat tint" style="border:1px solid var(--line);padding:18px">
            <h4 style="margin:0 0 8px">${I('award', 16)} 3. AI Viva & Skill Passport</h4>
            <p class="small muted" style="margin:0">Defend your methodology during viva. Score 2/3 or higher to issue your digital credential.</p>
          </div>
        </div>
      </div>
    `;

    D.$$('[data-bridge-intern]').forEach((btn) => {
      btn.onclick = () => {
        const k = btn.dataset.bridgeIntern;
        if (D.TABS && D.TABS.career) {
          // Trigger internship modal
          window.D.wsGo('career');
        }
      };
    });
  }

  /* ==========================================================================
     MODULE 7: Skill Passport
     ========================================================================== */
  function renderSkillPassportPage(container) {
    const passports = D.state.passports;
    const p = passports[0] || D.SAMPLE_PASSPORT;

    container.innerHTML = `
      <div class="row between" style="margin-bottom:24px;gap:16px;align-items:flex-end">
        <div>
          <div class="row nowrap" style="gap:8px;margin-bottom:6px">
            <span class="chip primary">${I('idCard', 14)} Digital Credential Wallet</span>
            <span class="chip ok">${I('shieldCheck', 14)} Cryptographically Verified</span>
            ${D.demoTag()}
          </div>
          <h1 style="font-size:clamp(24px, 2.8vw, 34px);margin:0">
            ${T('Dishari Skill Passport', 'দিশারী স্কিল পাসপোর্ট')}
          </h1>
          <p class="muted" style="margin:6px 0 0;font-size:14.5px">
            ${T('Verifiable digital credentials proving competency in applied science and technical problem-solving. Shareable directly with employers and recruiters.', 'ব্যবহারিক বিজ্ঞান ও প্রযুক্তিগত দক্ষতা প্রমাণের নির্ভরযোগ্য ডিজিটাল সনদ। নিয়োগকর্তার কাছে সরাসরি উপস্থাপনযোগ্য।')}
          </p>
        </div>

        <div class="row" style="gap:10px">
          <button class="btn primary" id="cert-share-btn">${I('share', 15)} ${T('Share Credential', 'সনদ শেয়ার')}</button>
          <button class="btn" id="cert-download-btn">${I('download', 15)} ${T('Download Certificate', 'ডাউনলোড')}</button>
        </div>
      </div>

      <!-- Certificate Preview Container -->
      <div class="bento" style="gap:24px;align-items:flex-start">
        <!-- Visual Certificate Card (Left 8 cols) -->
        <div class="s8 passport-cert" id="passport-printable-card">
          <div class="row between" style="margin-bottom:20px;border-bottom:1px solid var(--line);padding-bottom:16px">
            <div class="row nowrap" style="gap:10px">
              <span class="brand-mark">${I('compass', 20)}</span>
              <div>
                <b style="font-size:18px;display:block">Dishari OS</b>
                <small class="muted" style="font-size:11px">National Workforce & Skills Registry</small>
              </div>
            </div>
            <div style="text-align:right">
              <span class="chip ok">${I('checkCircle', 13)} VERIFIED CREDENTIAL</span>
              <div class="small mono muted" style="margin-top:4px">BNQF Level 4 Aligned</div>
            </div>
          </div>

          <div style="text-align:center;padding:16px 0 24px">
            <div class="eyebrow" style="margin-bottom:6px">${T('Certificate of Competency', 'দক্ষতার সনদপত্র')}</div>
            <h2 style="font-size:28px;margin-bottom:8px">${esc(tx(p.title))}</h2>
            <p class="muted" style="margin:0">${T('This certifies that', 'প্রত্যয়ন করা যাচ্ছে যে')}</p>
            <div style="font-size:24px;font-weight:800;color:var(--primary);margin:10px 0">${esc(p.holder)}</div>
            <p class="small muted" style="max-width:540px;margin:0 auto;line-height:1.6">
              ${T('has demonstrated mastery in applied micro-internship tasks and successfully defended problem methodology in a proctored AI oral viva assessment.', 'বাস্তব সমস্যা সমাধান ও প্রোক্টর্ড এআই মৌখিক ভাইভায় সাফল্যের সাথে দক্ষতা প্রদর্শন করেছেন।')}
            </p>
          </div>

          <!-- Credential Details Grid -->
          <div class="grid g4" style="background:var(--card2);padding:16px;border-radius:12px;border:1px solid var(--line);margin-bottom:20px">
            <div>
              <div class="small muted">${T('Credential ID', 'সনদ আইডি')}</div>
              <b class="mono" style="font-size:12.5px">${esc(p.id)}</b>
            </div>
            <div>
              <div class="small muted">${T('O*NET Code', 'O*NET কোড')}</div>
              <b style="font-size:12.5px">${esc(p.onet)}</b>
            </div>
            <div>
              <div class="small muted">${T('Issue Date', 'ইস্যুর তারিখ')}</div>
              <b style="font-size:12.5px">${esc(p.issued)}</b>
            </div>
            <div>
              <div class="small muted">${T('AI Viva Score', 'AI ভাইভা স্কোর')}</div>
              <b style="font-size:12.5px;color:var(--ok)">${esc(p.viva || '3/3')} (94%)</b>
            </div>
          </div>

          <!-- Hash & Verification Area -->
          <div class="row between" style="align-items:flex-end">
            <div>
              <div class="small muted">SHA-256 Cryptographic Hash:</div>
              <code class="small mono" style="display:inline-block;margin-top:4px;word-break:break-all">e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855</code>
              <div class="small muted" style="margin-top:6px">Issued by: Dishari Education & Workforce Authority</div>
            </div>
            <div class="cert-qr" title="${T('Scan to verify credential authenticity', 'সনদ যাচাইয়ে স্ক্যান করুন')}">
              ${D.qrSVG ? D.qrSVG('https://dishari.os/verify/' + p.id, 96) : '<div style="width:96px;height:96px;background:#eee"></div>'}
            </div>
          </div>
        </div>

        <!-- Right Side Verification & Credential Details (4 cols) -->
        <div class="s4 col" style="gap:20px">
          <div class="card">
            <div class="card-head">
              <h3>${I('shieldCheck', 18)} ${T('Verification Status', 'সনদ যাচাই স্থিতি')}</h3>
              <span class="chip ok">Valid & Intact</span>
            </div>
            <p class="small muted" style="line-height:1.6;margin-bottom:14px">
              ${T('Anyone can scan this QR code or input the Credential ID into the Talent Marketplace to verify that this certificate has not been forged or altered.', 'যেকেউ এই কিউআর স্ক্যান করে সনদের সত্যতা যাচাই করতে পারবেন।')}
            </p>
            <button class="btn sm" onclick="window.D.wsGo('talent')">${I('search', 14)} ${T('Check in Recruiter Portal', 'রিক্রুটার পোর্টালে দেখুন')}</button>
          </div>

          <div class="card">
            <div class="card-head">
              <h3>${I('award', 18)} ${T('Earn More Passports', 'আরও সনদ অর্জন')}</h3>
            </div>
            <p class="small muted" style="line-height:1.6;margin-bottom:12px">
              Expand your employability portfolio by completing further micro-internships in Environmental Chemistry, FinTech math, and Health Data.
            </p>
            <button class="btn primary sm" onclick="window.D.wsGo('bridge')">${I('route', 14)} ${T('Browse Micro-Internships', 'মাইক্রো-ইন্টার্নশিপ')} →</button>
          </div>
        </div>
      </div>
    `;

    D.$('#cert-share-btn').onclick = () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        D.toast(T('Credential verification link copied to clipboard!', 'সনদ লিংক কপি হয়েছে!'));
      }
    };
    D.$('#cert-download-btn').onclick = () => window.print();
  }

  /* ==========================================================================
     MODULE 10: Settings Page
     ========================================================================== */
  function renderSettingsPage(container) {
    const curTh = (D.THEMES && D.THEMES.find((x) => x.id === (D.state.theme || 'light'))) || { id: 'light', name: { en: 'SaaS Indigo', bn: 'ইন্ডিগো লাইট' }, desc: { en: 'Default', bn: 'স্বাভাবিক' }, icon: 'sun', dot: '#3730A3' };
    container.innerHTML = `
      <div style="margin-bottom:28px">
        <h1 style="font-size:clamp(24px, 2.8vw, 34px);margin:0 0 6px">${T('Settings & Accessibility', 'সেটিংস ও অ্যাক্সেসিবিলিটি')}</h1>
        <p class="muted" style="margin:0">${T('Customize language, low-bandwidth mode, and learning preferences.', 'ভাষা, লো-ব্যান্ডউইথ মোড ও পড়াশোনার পছন্দ নির্ধারণ করুন।')}</p>
      </div>

      <div class="bento" style="gap:24px">
        <div class="card s7">
          <div class="card-head"><h3>${I('accessibility', 18)} ${T('Inclusion & Accessibility', 'অন্তর্ভুক্তি ও অ্যাক্সেসিবিলিটি')}</h3></div>
          <div class="col" style="gap:18px">
            <label class="switch">
              <input type="checkbox" id="set-lite-chk" ${D.state.lite ? 'checked' : ''}>
              <span class="track"></span>
              <div>
                <b>${T('2G Lite Mode (Low-Bandwidth Optimization)', '২জি লাইট মোড (স্বল্প ব্যান্ডউইথ)')}</b>
                <div class="small muted">${T('Disables heavy animations and gradients, using compressed system fonts for rural connectivity.', 'গ্রামীণ সংযোগের জন্য ভারী অ্যানিমেশন বন্ধ করে দ্রুত লোড করে।')}</div>
              </div>
            </label>

            <label class="switch">
              <input type="checkbox" id="set-dys-chk" ${D.state.dyslexia ? 'checked' : ''}>
              <span class="track"></span>
              <div>
                <b>${T('Dyslexia-Friendly Typography & Spacing', 'ডিসলেক্সিয়া-বান্ধব স্পেসিং')}</b>
                <div class="small muted">${T('Increases letter and line spacing for easier, fatigue-free reading.', 'পড়ার সুবিধার্থে অক্ষর ও লাইনের ব্যবধান বাড়ায়।')}</div>
              </div>
            </label>

            <div class="row between" style="align-items:center;padding:12px 0;border-top:1px solid var(--line)">
              <div>
                <b>${T('Platform Theme (5 Palettes Available)', 'প্ল্যাটফর্মের থিম (৫টি প্যালেট উপলব্ধ)')}</b>
                <div class="small muted">${T('Current palette: ', 'বর্তমান থিম: ')}<b>${esc(D.tx(curTh.name))}</b> · ${esc(D.tx(curTh.desc))}</div>
              </div>
              <button class="btn sm" id="set-theme-picker-btn">
                <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${curTh.dot};margin-right:4px"></span>
                ${I(curTh.icon, 14)} ${T('Choose Theme', 'থিম বাছুন')}
              </button>
            </div>
          </div>
        </div>

        <div class="card s5">
          <div class="card-head"><h3>${I('languages', 18)} ${T('Language Selection', 'ভাষা নির্বাচন')}</h3></div>
          <p class="small muted" style="margin-bottom:14px">${T('Current Language:', 'বর্তমান ভাষা:')} <b>${esc(D.langInfo().native)} (${esc(D.langInfo().name)})</b></p>
          <button class="btn primary" id="open-lang-modal-btn">${I('languages', 16)} ${T('Switch Language (8 Dialects)', 'ভাষা পরিবর্তন (৮টি ভাষা)')}</button>

          <hr>
          <div class="card-head"><h3>${I('lock', 18)} ${T('Data Privacy & PDPO 2025', 'উপাত্ত সুরক্ষা ও অধিকার')}</h3></div>
          <p class="small muted" style="line-height:1.6;margin-bottom:12px">
            Under Bangladesh Personal Data Protection Ordinance 2025, you own your learning data. Zero student data is ever used for AI model training.
          </p>
          <button class="btn" id="export-data-btn">${I('download', 14)} ${T('Export My Data (JSON)', 'আমার ডেটা ডাউনলোড')}</button>
        </div>
      </div>
    `;

    D.$('#set-lite-chk').onchange = (e) => {
      D.set({ lite: e.target.checked });
      D.applyPrefs();
      D.toast(e.target.checked ? '2G Lite Mode Enabled' : '2G Lite Mode Disabled');
    };
    D.$('#set-dys-chk').onchange = (e) => {
      D.set({ dyslexia: e.target.checked });
      D.applyPrefs();
    };
    const thPickBtn = D.$('#set-theme-picker-btn');
    if (thPickBtn) thPickBtn.onclick = () => D.openThemePicker();
    D.$('#open-lang-modal-btn').onclick = () => D.openLanguages();
    D.$('#export-data-btn').onclick = () => D.exportMyData();
  }
})();

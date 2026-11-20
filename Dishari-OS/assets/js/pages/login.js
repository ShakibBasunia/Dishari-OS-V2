/* Dishari OS - /login : Unified Login Dashboard & Role-Based Portal Gateway
   Student, Teacher, Admin, Parent, and Recruiter Portals
   Figma-inspired modern SaaS design with Deep Indigo (#3730A3), Coral (#FF5A36), and Teal (#0D9488)
*/
(function () {
  'use strict';
  const D = window.D;
  const { T, esc } = D;
  const I = (n, s) => D.icon(n, s);

  let activeTab = 'portals'; // 'portals' | 'custom'

  D.page('login', {
    title: { en: 'Portal Gateway & Login', bn: 'পোর্টাল গেটওয়ে ও লগইন' },
    render(el) {
      renderLoginPage(el);
    }
  });

  function renderLoginPage(el) {
    const curRole = D.state.role;
    const curUser = D.state.user;

    el.innerHTML = `
      <div style="max-width:1100px;margin:0 auto;padding:24px 16px 80px">
        <!-- Top Banner Header -->
        <div style="text-align:center;margin-bottom:36px">
          <div style="margin-bottom:12px">
            <span class="chip" style="background:var(--card);border:1px solid var(--line);border-radius:9999px;padding:6px 16px;font-size:12px;font-weight:700;letter-spacing:0.06em;color:var(--text);display:inline-flex;align-items:center;gap:8px">
              <span style="width:7px;height:7px;border-radius:50%;background:var(--coral)"></span>
              ${T('DISHARI UNIFIED ACCESS & IDENTITY', 'দিশারী সমন্বিত এক্সেস ও আইডেন্টিটি')}
            </span>
          </div>
          <h1 style="font-size:clamp(30px, 4vw, 44px);font-weight:850;margin:0 0 10px;letter-spacing:-0.03em;color:var(--text)">
            ${T('Select Your', 'আপনার')} <span class="coral-under">${T('Portal Gateway', 'পোর্টাল গেটওয়ে')}</span>
          </h1>
          <p style="font-size:15.5px;color:var(--muted);max-width:580px;margin:0 auto 24px;line-height:1.5">
            ${T('Instant access to role-based workspaces for learners, teachers, administrators, parents, and recruiters.', 'শিক্ষার্থী, শিক্ষক, প্রশাসক, অভিভাবক এবং নিয়োগকারীদের জন্য নির্ধারিত ওয়ার্কস্পেস।')}
          </p>

          <!-- Current Session Indicator if signed in -->
          ${curRole && curRole !== 'guest' ? `
            <div style="display:inline-flex;align-items:center;gap:12px;background:var(--bg);border:1px solid var(--line);padding:8px 18px;border-radius:9999px;margin-bottom:20px">
              <span style="font-size:13px;color:var(--muted)">${T('Current Session:', 'বর্তমান সেশন:')}</span>
              <span class="chip em" style="font-weight:700">${esc(curRole.toUpperCase())}</span>
              <span style="font-size:13.5px;font-weight:700;color:var(--text)">${esc(curUser ? curUser.name : curRole)}</span>
              <button class="btn sm ghost" id="login-signout" style="padding:2px 8px;font-size:11.5px">${T('Sign out', 'সাইন আউট')}</button>
            </div>
          ` : ''}

          <!-- Gateway Mode Switcher -->
          <div style="display:inline-flex;background:var(--card);padding:4px;border-radius:12px;border:1px solid var(--line);box-shadow:var(--shadow-sm)">
            <button class="btn sm ${activeTab === 'portals' ? 'primary' : 'ghost'}" id="tab-btn-portals" style="border-radius:8px">
              ${I('grid', 14)} ${T('Role Portals (1-Click Access)', 'রোল পোর্টাল (এক-ক্লিকে প্রবেশ)')}
            </button>
            <button class="btn sm ${activeTab === 'custom' ? 'primary' : 'ghost'}" id="tab-btn-custom" style="border-radius:8px">
              ${I('key', 14)} ${T('Account Sign In', 'অ্যাকাউন্টে সাইন ইন')}
            </button>
          </div>
        </div>

        <div id="login-view-container"></div>
      </div>
    `;

    const signoutBtn = D.$('#login-signout');
    if (signoutBtn) {
      signoutBtn.onclick = () => {
        D.logout();
        D.toast(T('Signed out successfully', 'সফলভাবে সাইন আউট হয়েছে'), 'info');
        renderLoginPage(el);
      };
    }

    const tPortals = D.$('#tab-btn-portals');
    const tCustom = D.$('#tab-btn-custom');
    if (tPortals && tCustom) {
      tPortals.onclick = () => { activeTab = 'portals'; renderTab(); };
      tCustom.onclick = () => { activeTab = 'custom'; renderTab(); };
    }

    function renderTab() {
      tPortals.className = `btn sm ${activeTab === 'portals' ? 'primary' : 'ghost'}`;
      tCustom.className = `btn sm ${activeTab === 'custom' ? 'primary' : 'ghost'}`;
      const c = D.$('#login-view-container');
      if (!c) return;

      if (activeTab === 'portals') {
        c.innerHTML = `
          <!-- 5 Role Portal Cards Grid -->
          <div class="grid g3" style="gap:20px;margin-bottom:28px">
            
            <!-- 1. Student Portal -->
            <div class="portal-gateway-card" style="border-top:4px solid var(--primary)">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
                <div class="figma-icon-box" style="background:rgba(55,48,163,0.1);color:var(--primary);margin-bottom:0">
                  ${I('graduation', 22)}
                </div>
                <span class="chip primary font-mono">PORTAL · 01</span>
              </div>
              <h3 style="font-size:19px;font-weight:800;color:var(--text);margin:0 0 6px">
                ${T('Student Portal', 'শিক্ষার্থী পোর্টাল')}
              </h3>
              <p style="font-size:13px;color:var(--muted);line-height:1.45;margin:0 0 16px">
                ${T('Bilingual AI Teacher, gamified STEM quests, Snap-to-Solve homework feedback, and verified digital skill passport.', 'দ্বিভাষিক AI শিক্ষক, গ্যামিফাইড কোয়েস্ট, স্ন্যাপ-টু-সলভ ও স্কিল পাসপোর্ট।')}
              </p>
              
              <div style="background:var(--bg);border-radius:12px;padding:12px 14px;border:1px solid var(--line);margin-bottom:18px;margin-top:auto">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
                  <div style="width:28px;height:28px;border-radius:50%;background:var(--primary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">AJ</div>
                  <div style="line-height:1.2">
                    <div style="font-size:13px;font-weight:700;color:var(--text)">Aurin Jahan</div>
                    <div style="font-size:11px;color:var(--muted)">stu-rp-0415 · HSC Science 2026</div>
                  </div>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--text2);margin-top:4px;border-top:1px dashed var(--line);padding-top:6px">
                  <span>${T('Institution:', 'প্রতিষ্ঠান:')} <b>Kurigram Char High</b></span>
                  <span style="color:var(--gold);font-weight:700">21-Day Streak</span>
                </div>
              </div>

              <button class="btn-pill btn-pill-dark" id="enter-student" style="width:100%;justify-content:center">
                ${T('Enter as Student', 'শিক্ষার্থী হিসেবে প্রবেশ')} &rarr;
              </button>
            </div>

            <!-- 2. Teacher Portal -->
            <div class="portal-gateway-card" style="border-top:4px solid var(--secondary)">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
                <div class="figma-icon-box" style="background:rgba(13,148,136,0.1);color:var(--secondary);margin-bottom:0">
                  ${I('teacher', 22)}
                </div>
                <span class="chip teal font-mono">PORTAL · 02</span>
              </div>
              <h3 style="font-size:19px;font-weight:800;color:var(--text);margin:0 0 6px">
                ${T('Teacher Co-Pilot', 'শিক্ষক কো-পাইলট')}
              </h3>
              <p style="font-size:13px;color:var(--muted);line-height:1.45;margin:0 0 16px">
                ${T('Generate NCTB curriculum-aligned lesson plans, creative questions (ক/খ/গ/ঘ) with rubrics, and track class misconceptions.', 'NCTB পাঠ পরিকল্পনা তৈরি, সৃজনশীল প্রশ্ন ও উত্তরপত্র এবং ভুল ধারণা বিশ্লেষণ।')}
              </p>
              
              <div style="background:var(--bg);border-radius:12px;padding:12px 14px;border:1px solid var(--line);margin-bottom:18px;margin-top:auto">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
                  <div style="width:28px;height:28px;border-radius:50%;background:var(--secondary);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">SA</div>
                  <div style="line-height:1.2">
                    <div style="font-size:13px;font-weight:700;color:var(--text)">Shahana Akter</div>
                    <div style="font-size:11px;color:var(--muted)">tch-ku-0090 · Senior Biology Educator</div>
                  </div>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--text2);margin-top:4px;border-top:1px dashed var(--line);padding-top:6px">
                  <span>${T('Role:', 'ভূমিকা:')} <b>Master Trainer</b></span>
                  <span style="color:var(--secondary);font-weight:700">48 Plans · 210 CQs</span>
                </div>
              </div>

              <button class="btn-pill" id="enter-teacher" style="width:100%;justify-content:center;background:var(--secondary);color:#fff;border:1px solid var(--secondary)">
                ${T('Enter as Teacher', 'শিক্ষক হিসেবে প্রবেশ')} &rarr;
              </button>
            </div>

            <!-- 3. Institutional Admin Portal -->
            <div class="portal-gateway-card" style="border-top:4px solid var(--coral)">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
                <div class="figma-icon-box" style="background:rgba(255,90,54,0.1);color:var(--coral);margin-bottom:0">
                  ${I('building', 22)}
                </div>
                <span class="chip gold font-mono">PORTAL · 03</span>
              </div>
              <h3 style="font-size:19px;font-weight:800;color:var(--text);margin:0 0 6px">
                ${T('Admin Governance', 'অ্যাডমিন কনসোল')}
              </h3>
              <p style="font-size:13px;color:var(--muted);line-height:1.45;margin:0 0 16px">
                ${T('Institutional oversight of 14,820 learners across 42 institutions, vector embeddings, safety guardrails, and audit logs.', '১৪,৮২০ শিক্ষার্থীর অগ্রগতি, ভেক্টর ইনডেক্সিং, AI গার্ডরেইল ও অডিট লগ ব্যবস্থাপনা।')}
              </p>
              
              <div style="background:var(--bg);border-radius:12px;padding:12px 14px;border:1px solid var(--line);margin-bottom:18px;margin-top:auto">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
                  <div style="width:28px;height:28px;border-radius:50%;background:var(--coral);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">FR</div>
                  <div style="line-height:1.2">
                    <div style="font-size:13px;font-weight:700;color:var(--text)">Farhana Rahman</div>
                    <div style="font-size:11px;color:var(--muted)">adm-ngo-007 · Program Director</div>
                  </div>
                </div>
                <div style="display:flex;justify-content:space-between;font-size:11.5px;color:var(--text2);margin-top:4px;border-top:1px dashed var(--line);padding-top:6px">
                  <span>Rangpur Consortium</span>
                  <span style="color:var(--coral);font-weight:700">Enterprise MFA</span>
                </div>
              </div>

              <button class="btn-pill btn-pill-coral" id="enter-admin" style="width:100%;justify-content:center">
                ${T('Enter as Admin', 'অ্যাডমিন হিসেবে প্রবেশ')} &rarr;
              </button>
            </div>

            <!-- 4. Parent Portal -->
            <div class="portal-gateway-card" style="border-top:4px solid #F59E0B">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
                <div class="figma-icon-box" style="background:rgba(245,158,11,0.1);color:#D97706;margin-bottom:0">
                  ${I('users', 22)}
                </div>
                <span class="chip font-mono">PORTAL · 04</span>
              </div>
              <h3 style="font-size:19px;font-weight:800;color:var(--text);margin:0 0 6px">
                ${T('Parent Portal', 'অভিভাবক পোর্টাল')}
              </h3>
              <p style="font-size:13px;color:var(--muted);line-height:1.45;margin:0 0 16px">
                ${T('Weekly child learning progress summaries delivered in simple Bangla, milestone alerts, and teacher-recommended home support.', 'সন্তানের সাপ্তাহিক অগ্রগতি বাংলা সারাংশ, অর্জন নোটিফিকেশন ও দিকনির্দেশনা।')}
              </p>
              
              <div style="background:var(--bg);border-radius:12px;padding:12px 14px;border:1px solid var(--line);margin-bottom:18px;margin-top:auto">
                <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:2px">
                  ${T('Guardian of Aurin Jahan', 'আউরিন জাহানের অভিভাবক')}
                </div>
                <div style="font-size:11.5px;color:var(--muted);line-height:1.4">
                  ${T('Weekly Bangla Report: 94% on Bioenergetics, 42 lessons completed.', 'সাপ্তাহিক রিপোর্ট: বায়োএনার্জেটিক্সে ৯৪% দক্ষতা।')}
                </div>
              </div>

              <button class="btn-pill btn-pill-white" id="enter-parent" style="width:100%;justify-content:center;border-color:#F59E0B;color:#D97706 !important">
                ${T('Enter as Parent', 'অভিভাবক হিসেবে প্রবেশ')} &rarr;
              </button>
            </div>

            <!-- 5. Recruiter / Employer Portal -->
            <div class="portal-gateway-card" style="border-top:4px solid #8B5CF6">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
                <div class="figma-icon-box" style="background:rgba(139,92,246,0.1);color:#8B5CF6;margin-bottom:0">
                  ${I('briefcase', 22)}
                </div>
                <span class="chip font-mono">PORTAL · 05</span>
              </div>
              <h3 style="font-size:19px;font-weight:800;color:var(--text);margin:0 0 6px">
                ${T('Talent Recruiter', 'নিয়োগকারী পোর্টাল')}
              </h3>
              <p style="font-size:13px;color:var(--muted);line-height:1.45;margin:0 0 16px">
                ${T('Bias-free blind search for verified workforce-ready talent, micro-internship evaluation, and cryptographic skill verification.', 'যাচাইকৃত যোগ্যতাসম্পন্ন কর্মী অনুসন্ধান, মাইক্রো-ইন্টার্নশিপ মূল্যায়ন ও নিয়োগ।')}
              </p>
              
              <div style="background:var(--bg);border-radius:12px;padding:12px 14px;border:1px solid var(--line);margin-bottom:18px;margin-top:auto">
                <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:2px">
                  NRB Technology Consortium
                </div>
                <div style="font-size:11.5px;color:var(--muted);line-height:1.4">
                  rec-ca-0102 · ${T('4,200 micro-interns ready for discovery', '৪,২০০ যাচাইকৃত প্রার্থী প্রস্তুত')}
                </div>
              </div>

              <button class="btn-pill btn-pill-white" id="enter-recruiter" style="width:100%;justify-content:center;border-color:#8B5CF6;color:#7C3AED !important">
                ${T('Enter as Recruiter', 'নিয়োগকারী হিসেবে প্রবেশ')} &rarr;
              </button>
            </div>

            <!-- 6. Sandbox Judge Explorer -->
            <div class="portal-gateway-card" style="border-top:4px solid var(--line2);background:var(--bg)">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px">
                <div class="figma-icon-box" style="background:var(--card);color:var(--text);margin-bottom:0">
                  ${I('compass', 22)}
                </div>
                <span class="chip font-mono">EXPLORER</span>
              </div>
              <h3 style="font-size:19px;font-weight:800;color:var(--text);margin:0 0 6px">
                ${T('Competition Judge Tour', 'বিচারক ট্যুর')}
              </h3>
              <p style="font-size:13px;color:var(--muted);line-height:1.45;margin:0 0 16px">
                ${T('Explore all 11 core modules, real-time live retrieval benchmarks, and UNESCO SDG 4 research alignment in guest mode.', 'সকল ১১টি মডিউল, লাইভ বেঞ্চমার্ক ও ইউনেস্কো SDG ৪ গবেষণা ভিত্তি পরীক্ষা করুন।')}
              </p>
              
              <div style="margin-top:auto;display:flex;gap:8px">
                <a href="${D.href('sdg4')}" data-link="sdg4" class="btn sm ghost" style="flex:1;text-align:center">SDG 4</a>
                <a href="${D.href('audit')}" data-link="audit" class="btn sm ghost" style="flex:1;text-align:center">Audit</a>
                <a href="${D.href('architecture')}" data-link="architecture" class="btn sm ghost" style="flex:1;text-align:center">Arch</a>
              </div>
            </div>

          </div>
        `;

        // Wire 1-Click Launchers
        D.$('#enter-student').onclick = () => {
          D.loginStudent();
          D.toast(T('Welcome, Aurin! Entering Student Workspace...', 'স্বাগতম আউরিন! স্টুডেন্ট ওয়ার্কস্পেসে প্রবেশ করা হচ্ছে...'), 'em');
          setTimeout(() => D.go('app'), 300);
        };

        D.$('#enter-teacher').onclick = () => {
          D.state.role = 'teacher';
          D.state.user = { id: 'tch-ku-0090', name: 'Shahana Akter', short: 'Shahana' };
          D.save();
          D.toast(T('Welcome, Shahana Akter! Opening Teacher Co-Pilot...', 'স্বাগতম শাহানা আক্তার! টিচার কো-পাইলট খোলা হচ্ছে...'), 'em');
          setTimeout(() => D.go('app', { tab: 'copilot' }), 300);
        };

        D.$('#enter-admin').onclick = () => {
          D.loginAdmin();
          D.toast(T('Welcome, Farhana Rahman! Launching Admin Console...', 'স্বাগতম ফারহানা রহমান! অ্যাডমিন কনসোল খোলা হচ্ছে...'), 'em');
          setTimeout(() => D.go('admin'), 300);
        };

        D.$('#enter-parent').onclick = () => {
          D.state.role = 'parent';
          D.state.user = { id: 'par-ku-0415', name: 'Parent of Aurin', short: 'Parent' };
          D.save();
          D.toast(T('Opening Parent Progress Snapshot in Bangla...', 'অভিভাবক ড্যাশবোর্ড খোলা হচ্ছে...'), 'em');
          setTimeout(() => D.go('app', { tab: 'copilot', sub: 'parent' }), 300);
        };

        D.$('#enter-recruiter').onclick = () => {
          D.state.role = 'recruiter';
          D.state.user = { id: 'rec-ca-0102', name: 'NRB Talent Partner', short: 'Recruiter' };
          D.save();
          D.toast(T('Opening Blind Talent Discovery Marketplace...', 'ট্যালেন্ট মার্কেটপ্লেস খোলা হচ্ছে...'), 'em');
          setTimeout(() => D.go('app', { tab: 'talent' }), 300);
        };
      } else {
        // Custom Account Sign In Form
        c.innerHTML = `
          <div style="max-width:440px;margin:0 auto;background:var(--card);border:1px solid var(--line);border-radius:20px;padding:32px;box-shadow:var(--shadow-sm)">
            <h3 style="font-size:20px;font-weight:800;color:var(--text);margin:0 0 6px">
              ${T('Account Credentials', 'অ্যাকাউন্ট তথ্য')}
            </h3>
            <p style="font-size:13px;color:var(--muted);margin:0 0 20px">
              ${T('Sign in using your mobile number, Student ID, or Institutional Single Sign-On.', 'মোবাইল নম্বর, শিক্ষার্থী আইডি বা প্রাতিষ্ঠানিক একাউন্ট দিয়ে সাইন ইন করুন।')}
            </p>

            <form id="custom-login-form" style="display:flex;flex-direction:column;gap:14px">
              <label class="field">
                <span style="font-size:12.5px;font-weight:700">${T('User Identifier / Mobile', 'ব্যবহারকারী আইডি / মোবাইল')}</span>
                <input type="text" id="login-id" placeholder="e.g. 01712345678 or stu-rp-0415" value="stu-rp-0415" required>
              </label>

              <label class="field">
                <span style="font-size:12.5px;font-weight:700">${T('Password / Security PIN', 'পাসওয়ার্ড / পিন')}</span>
                <input type="password" id="login-pass" value="••••••••" required>
              </label>

              <label class="field">
                <span style="font-size:12.5px;font-weight:700">${T('Target Portal Workspace', 'উদ্দিষ্ট পোর্টাল')}</span>
                <select id="login-role" style="padding:10px 12px;border-radius:10px">
                  <option value="student">Student Portal (Aurin Jahan - HSC Science)</option>
                  <option value="teacher">Teacher Portal (Shahana Akter - Biology)</option>
                  <option value="admin">Institutional Admin Console (Farhana Rahman)</option>
                  <option value="parent">Parent Portal (Bangla Progress Snapshot)</option>
                  <option value="recruiter">Talent Recruiter Portal (B2B)</option>
                </select>
              </label>

              <div style="display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--muted)">
                <label style="display:flex;align-items:center;gap:6px;cursor:pointer">
                  <input type="checkbox" checked>
                  <span>${T('Remember on this device', 'মনে রাখুন')}</span>
                </label>
                <a href="#" onclick="alert('Demo reset instructions sent to registered mobile.')" style="color:var(--primary);text-decoration:none">${T('Forgot PIN?', 'পিন ভুলে গেছেন?')}</a>
              </div>

              <button class="btn-pill btn-pill-dark" type="submit" style="width:100%;justify-content:center;margin-top:6px">
                ${I('unlock', 15)} ${T('Sign In to Workspace', 'ওয়ার্কস্পেসে প্রবেশ করুন')}
              </button>
            </form>
          </div>
        `;

        D.$('#custom-login-form').onsubmit = (e) => {
          e.preventDefault();
          const r = D.$('#login-role').value;
          if (r === 'student') {
            D.loginStudent();
            D.toast(T('Authenticated as Student! Redirecting...', 'শিক্ষার্থী হিসেবে সফলভাবে সাইন ইন হয়েছে!'), 'em');
            setTimeout(() => D.go('app'), 300);
          } else if (r === 'teacher') {
            D.state.role = 'teacher';
            D.state.user = { id: 'tch-ku-0090', name: 'Shahana Akter', short: 'Shahana' };
            D.save();
            D.toast(T('Authenticated as Teacher! Redirecting...', 'শিক্ষক হিসেবে সফলভাবে সাইন ইন হয়েছে!'), 'em');
            setTimeout(() => D.go('app', { tab: 'copilot' }), 300);
          } else if (r === 'admin') {
            D.loginAdmin();
            D.toast(T('Authenticated as Admin! Redirecting...', 'অ্যাডমিন হিসেবে সফলভাবে সাইন ইন হয়েছে!'), 'em');
            setTimeout(() => D.go('admin'), 300);
          } else if (r === 'parent') {
            D.state.role = 'parent';
            D.state.user = { id: 'par-ku-0415', name: 'Parent of Aurin', short: 'Parent' };
            D.save();
            D.toast(T('Authenticated as Parent! Redirecting...', 'অভিভাবক হিসেবে সফলভাবে সাইন ইন হয়েছে!'), 'em');
            setTimeout(() => D.go('app', { tab: 'copilot', sub: 'parent' }), 300);
          } else if (r === 'recruiter') {
            D.state.role = 'recruiter';
            D.state.user = { id: 'rec-ca-0102', name: 'NRB Talent Partner', short: 'Recruiter' };
            D.save();
            D.toast(T('Authenticated as Recruiter! Redirecting...', 'নিয়োগকারী হিসেবে সফলভাবে সাইন ইন হয়েছে!'), 'em');
            setTimeout(() => D.go('app', { tab: 'talent' }), 300);
          }
        };
      }
    }

    renderTab();
  }
})();

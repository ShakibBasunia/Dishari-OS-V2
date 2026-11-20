/* Dishari OS - application shell: header, theme switch, judge quick-switch bar, command palette,
   toasts, modal, drawer, onboarding tour, voice read-aloud and 2G Lite mode. */
(function () {
  'use strict';
  const D = window.D;
  const { T, esc } = D;
  const I = (n, s) => D.icon(n, s);

  D.NAV = [
    ['app', { en: 'Workspace', bn: 'ওয়ার্কস্পেস' }],
    ['login', { en: 'Portals / Login', bn: 'পোর্টাল / লগইন' }],
    ['admin', { en: 'Admin', bn: 'অ্যাডমিন' }],
    ['sdg4', { en: 'SDG 4 & Research', bn: 'SDG ৪ ও গবেষণা' }],
    ['architecture', { en: 'Architecture', bn: 'আর্কিটেকচার' }],
    ['data', { en: 'Data', bn: 'ডেটা' }],
    ['security', { en: 'Security', bn: 'নিরাপত্তা' }],
    ['audit', { en: 'Audit', bn: 'অডিট' }]
  ];

  const THEMES = [
    { id: 'light', name: { en: 'SaaS Indigo', bn: 'ইন্ডিগো লাইট' }, desc: { en: 'Clean modern daylight SaaS', bn: 'দিনের স্বাভাবিক আলো' }, icon: 'sun', dot: '#3730A3', bg: '#F8FAFC' },
    { id: 'dark', name: { en: 'Deep Slate', bn: 'স্লেট ডার্ক' }, desc: { en: 'Low-glare dark environment', bn: 'কম আলোর ডার্ক মোড' }, icon: 'moon', dot: '#6366F1', bg: '#0B0F19' },
    { id: 'sepia', name: { en: 'Warm Study', bn: 'উষ্ণ পাঠ' }, desc: { en: 'Paper parchment, easy on the eyes', bn: 'চোখের ক্লান্তিহীন বই পড়ার মোড' }, icon: 'book', dot: '#B45309', bg: '#FAF5EB' },
    { id: 'emerald', name: { en: 'STEM Forest', bn: 'সবুজ ল্যাব' }, desc: { en: 'Biology and nature lab green', bn: 'বিজ্ঞান ও জীববিদ্যা ল্যাব থিম' }, icon: 'award', dot: '#10B981', bg: '#061A14' },
    { id: 'midnight', name: { en: 'Midnight Navy', bn: 'রয়্যাল নেভি' }, desc: { en: 'AMOLED OLED deep pitch dark', bn: 'রয়্যাল ব্ল্যাক ও নিয়ন ইন্ডিগো' }, icon: 'shield', dot: '#818CF8', bg: '#030712' }
  ];
  D.THEMES = THEMES;

  const THEME_COLORS = {
    light: '#F8FAFC',
    dark: '#0B0F19',
    sepia: '#FAF5EB',
    emerald: '#061A14',
    midnight: '#030712'
  };

  function applyPrefs() {
    const h = document.documentElement;
    const th = D.state.theme || 'light';
    h.setAttribute('data-theme', th);
    h.setAttribute('lang', D.langInfo().bcp);
    h.setAttribute('data-script', (D.langInfo().script || '').toLowerCase().replace(' ', '-'));
    if (D.loadScriptFont) D.loadScriptFont();
    h.classList.toggle('lite', !!D.state.lite);
    h.classList.toggle('dyslexia', !!D.state.dyslexia);
    const mc = document.querySelector('meta[name="theme-color"]');
    if (mc) mc.setAttribute('content', THEME_COLORS[th] || '#F8FAFC');
    loadFonts();
  }
  D.applyPrefs = applyPrefs;

  let fontsLoaded = false;
  function loadFonts() {
    // Web fonts are skipped in 2G Lite mode (system fonts only).
    if (fontsLoaded || D.state.lite || window.DISHARI_NO_FONTS) return;
    fontsLoaded = true;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600&family=Hind+Siliguri:wght@400;500;600;700&display=swap';
    document.head.appendChild(l);
  }

  /* ---------------- Shell ---------------- */
  function shellHTML() {
    const cur = D.current().name;
    const isLanding = cur === '';
    const role = D.state.role === 'student'
      ? `<span class="chip em hide-sm">${I('user', 14)} ${esc(D.state.user ? D.state.user.short : 'Student')}</span>`
      : D.state.role === 'admin'
        ? `<span class="chip gold hide-sm">${I('shield', 14)} ${T('Admin', 'অ্যাডমিন')}</span>`
        : `<a class="btn sm primary hide-sm" href="${D.href('demo-user')}" data-link="demo-user">${T('Try the demo', 'ডেমো দেখুন')}</a>`;
    const curTh = THEMES.find((x) => x.id === (D.state.theme || 'light')) || THEMES[0];
    const themeControl = `
      <div class="row nowrap" style="gap:4px">
        <button class="btn sm ghost" id="theme-btn" title="${T('Platform theme: Choose from 5 palettes', 'থিম: ৫টি প্যালেট থেকে নির্বাচন করুন')}" aria-haspopup="dialog" aria-label="${T('Switch theme', 'থিম পরিবর্তন')}">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${curTh.dot};box-shadow:0 0 0 1.5px var(--line2);margin-right:4px"></span>
          ${I(curTh.icon, 15)} <span class="hide-sm">${esc(D.tx(curTh.name))}</span>
        </button>
        <button class="btn sm ghost icon hide-sm" id="theme-cycle-btn" title="${T('Quick cycle theme', 'দ্রুত থিম পরিবর্তন')}" aria-label="${T('Next theme', 'পরবর্তী থিম')}">${I('refresh', 13)}</button>
      </div>
    `;

    // Top navigation bar: Customized for landing page vs workspaces
    const navContent = isLanding ? `
      <nav class="nav" id="nav" aria-label="${T('Main', 'প্রধান')}">
        <a href="${D.href('')}#hero" class="active">${T('Home', 'হোম')}</a>
        <a href="${D.href('')}#features">${T('Features', 'ফিচার')}</a>
        <a href="${D.href('')}#how-it-works">${T('How It Works', 'কীভাবে কাজ করে')}</a>
        <a href="${D.href('')}#impact">${T('Impact', 'প্রভাব')}</a>
        <a href="${D.href('')}#about">${T('About', 'সম্পর্কে')}</a>
      </nav>
      <div class="tools">
        <button class="btn sm ghost" id="lang-btn" title="${T('Language', 'ভাষা')}" aria-haspopup="dialog" aria-label="${T('Switch language', 'ভাষা পরিবর্তন')}">
          ${I('languages', 16)} <span>${esc(D.langInfo().native)}</span>
        </button>
        ${themeControl}
        <a class="btn sm ghost hide-sm" href="${D.href('login')}" data-link="login">${T('Login', 'লগইন')}</a>
        <a class="btn sm primary" href="${D.href('app')}" data-link="app">${T('Get Started', 'শুরু করুন')}</a>
        <button class="btn sm ghost icon menu-btn" id="menu-btn" aria-label="Menu" aria-expanded="false">${I('menu', 18)}</button>
      </div>
    ` : `
      <nav class="nav" id="nav" aria-label="${T('Main', 'প্রধান')}">
        ${D.NAV.map(([r, l]) => `<a href="${D.href(r)}" data-link="${r}" class="${cur === r ? 'active' : ''}">${esc(D.tx(l))}</a>`).join('')}
      </nav>
      <div class="tools">
        <button class="btn sm ghost icon hide-sm" id="cmdk-btn" title="${T('Search and jump (Ctrl K)', 'খুঁজুন (Ctrl K)')}" aria-label="${T('Open command palette', 'কমান্ড প্যালেট খুলুন')}">${I('search', 17)}</button>
        <button class="btn sm ghost" id="lang-btn" title="${T('Language', 'ভাষা')}" aria-haspopup="dialog" aria-label="${T('Switch language', 'ভাষা পরিবর্তন')}">${I('languages', 16)} <span>${esc(D.langInfo().native)}</span></button>
        ${themeControl}
        <button class="btn sm ghost icon" id="a11y-btn" title="${T('Accessibility and low-bandwidth settings', 'অ্যাক্সেসিবিলিটি ও লো-ব্যান্ডউইথ')}" aria-label="${T('Accessibility settings', 'অ্যাক্সেসিবিলিটি')}">${I('accessibility', 17)}</button>
        ${role}
        <button class="btn sm ghost icon menu-btn" id="menu-btn" aria-label="Menu" aria-expanded="false">${I('menu', 18)}</button>
      </div>
    `;

    return `
<a class="skip" href="#main">${T('Skip to content', 'মূল অংশে যান')}</a>
<header class="topbar" role="banner">
  <div class="wrap">
    <a class="brand" href="${D.href('')}" data-link="" aria-label="Dishari OS home">
      <span class="brand-mark">${I('compass', 20)}</span>
      <span><b>Dishari OS</b><small>${T('Learning & Workforce OS', 'লার্নিং ও ওয়ার্কফোর্স OS')}</small></span>
    </a>
    ${navContent}
  </div>
</header>
<main id="main" class="wrap" tabindex="-1"></main>
<nav class="judgebar no-print ${D.state.judgeCollapsed ? 'collapsed' : ''}" id="judgebar" aria-label="${T('Judge quick switch', 'বিচারক দ্রুত সুইচ')}">
  <span class="lbl">${T('Judge views', 'বিচারক ভিউ')}</span>
  ${judgeLink('demo-user', 'graduation', T('Student', 'শিক্ষার্থী'))}
  ${judgeLink('app', 'teacher', T('Teacher', 'শিক্ষক'), { tab: 'copilot' })}
  ${judgeLink('demo-admin', 'building', T('Admin', 'অ্যাডমিন'))}
  ${judgeLink('app', 'briefcase', T('Recruiter', 'রিক্রুটার'), { tab: 'talent' })}
  ${judgeLink('sdg4', 'target', T('SDG 4', 'SDG ৪'), null, 'sdg4')}
  ${judgeLink('audit', 'shieldCheck', T('Audit', 'অডিট'), { run: '1' }, 'audit')}
  <button id="tour-btn" data-tour="tour" title="${T('Guided tour', 'গাইডেড ট্যুর')}">${I('help', 16)} ${T('Tour', 'ট্যুর')}</button>
  <button id="jb-toggle" title="${T('Collapse', 'ছোট করুন')}" aria-label="${T('Collapse judge bar', 'বার ছোট করুন')}">${I(D.state.judgeCollapsed ? 'chevronRight' : 'chevronLeft', 16)}</button>
</nav>
<div class="voicebar" id="voicebar" role="status"><span class="wave on" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><span id="voice-label">${T('Reading aloud', 'পড়ে শোনানো হচ্ছে')}</span><button class="btn sm" id="voice-stop">${T('Stop', 'থামাও')}</button></div>
<div class="toasts" id="toasts" aria-live="polite"></div>
<div class="drawer-backdrop" id="drawer-bd"></div>
<aside class="drawer" id="drawer" aria-hidden="true" aria-label="${T('Explainable AI panel', 'ব্যাখ্যাযোগ্য AI প্যানেল')}"></aside>
<div id="modal-root"></div>`;
  }
  function judgeLink(name, icon, label, params, tour) {
    const cur = D.current();
    let active = cur.name === name;
    if (params && params.tab) active = active && cur.params.get('tab') === params.tab;
    else if (name === 'app') active = false;
    return `<a href="${esc(D.href(name, params))}" data-link="${name}"${params ? ` data-params="${esc(new URLSearchParams(params).toString())}"` : ''} class="${active ? 'active' : ''}"${tour ? ` data-tour="${tour}"` : ''}>${I(icon, 15)} ${esc(label)}</a>`;
  }

  function setTheme(t) {
    D.set({ theme: t });
    applyPrefs();
    const curTh = THEMES.find((x) => x.id === t) || THEMES[0];
    const tb = D.$('#theme-btn');
    if (tb) {
      tb.innerHTML = `<span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${curTh.dot};box-shadow:0 0 0 1.5px var(--line2);margin-right:4px"></span>${I(curTh.icon, 15)} <span class="hide-sm">${esc(D.tx(curTh.name))}</span>`;
    }
  }
  D.setTheme = setTheme;

  function cycleTheme() {
    const cur = D.state.theme || 'light';
    const idx = THEMES.findIndex((x) => x.id === cur);
    const next = THEMES[(idx + 1) % THEMES.length];
    setTheme(next.id);
    D.toast(T('Theme', 'থিম') + ': ' + esc(D.tx(next.name)), '', next.icon);
    D.render(true);
  }
  D.cycleTheme = cycleTheme;

  function openThemePicker() {
    const cur = D.state.theme || 'light';
    D.modal(T('Choose Platform Theme', 'প্ল্যাটফর্মের থিম নির্বাচন'), `
      <div class="col" style="gap:14px" role="radiogroup" aria-label="${T('Themes', 'থিম সমূহ')}">
        <p class="muted small" style="margin:0 0 4px;line-height:1.5">
          ${T('Select your preferred study environment. All 5 palettes are designed for high accessibility, low eye strain, and readability.', 'আপনার পড়ার সুবিধাজনক থিম বেছে নিন। ৫টি থিমই আন্তর্জাতিক অ্যাক্সেসিবিলিটি ও চোখের আরামের জন্য ডিজাইন করা।')}
        </p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(260px, 1fr));gap:12px">
          ${THEMES.map((th) => {
      const isAct = th.id === cur;
      return `
              <button class="card flat selectable-card ${isAct ? 'selected' : ''}" data-theme-pick="${th.id}" role="radio" aria-checked="${isAct}" style="text-align:left;padding:14px;cursor:pointer;border:2px solid ${isAct ? 'var(--primary)' : 'var(--line)'};background:var(--card);transition:all .2s;position:relative;border-radius:12px">
                <div class="row between" style="margin-bottom:8px">
                  <div class="row nowrap" style="gap:8px;align-items:center">
                    <span style="display:inline-block;width:15px;height:15px;border-radius:50%;background:${th.dot};box-shadow:0 0 0 2px var(--card), 0 0 0 4px ${th.dot}44"></span>
                    <b style="font-size:15px">${esc(D.tx(th.name))}</b>
                  </div>
                  ${isAct ? `<span class="chip em" style="font-size:11px;padding:2px 8px">${I('check', 12)} ${T('Active', 'সক্রিয়')}</span>` : `<span class="muted small">${I(th.icon, 14)}</span>`}
                </div>
                <div class="small muted" style="margin-bottom:12px;line-height:1.4">${esc(D.tx(th.desc))}</div>
                <!-- Swatch Preview Bar -->
                <div class="row nowrap" style="gap:6px;padding:6px;background:${th.bg};border-radius:8px;border:1px solid rgba(120,120,120,0.2)">
                  <span style="flex:1;height:18px;border-radius:4px;background:${th.bg};border:1px solid rgba(0,0,0,0.1)" title="Background"></span>
                  <span style="flex:1;height:18px;border-radius:4px;background:${th.dot};box-shadow:0 1px 3px rgba(0,0,0,0.15)" title="Primary Accent"></span>
                  <span style="flex:1;height:18px;border-radius:4px;background:#0D9488" title="Teal Secondary"></span>
                  <span style="flex:1;height:18px;border-radius:4px;background:#FF5A36" title="Coral Accent"></span>
                </div>
              </button>
            `;
    }).join('')}
        </div>
      </div>
    `);
    D.$$('[data-theme-pick]').forEach((b) => {
      b.onclick = () => {
        setTheme(b.dataset.themePick);
        D.closeModal();
        D.toast(T('Theme updated', 'থিম পরিবর্তিত হয়েছে') + ': ' + esc(D.tx(THEMES.find(t => t.id === b.dataset.themePick).name)), '', 'sparkles');
        D.render(true);
      };
    });
  }
  D.openThemePicker = openThemePicker;

  function bindShell() {
    const langBtn = D.$('#lang-btn'); if (langBtn) langBtn.onclick = () => D.openLanguages();
    const thBtn = D.$('#theme-btn'); if (thBtn) thBtn.onclick = () => D.openThemePicker();
    const thCyc = D.$('#theme-cycle-btn'); if (thCyc) thCyc.onclick = () => D.cycleTheme();
    const a11y = D.$('#a11y-btn'); if (a11y) a11y.onclick = () => D.openSettings();
    const cmdk = D.$('#cmdk-btn'); if (cmdk) cmdk.onclick = () => D.palette();
    const tour = D.$('#tour-btn'); if (tour) tour.onclick = () => D.tour(0);
    const vStop = D.$('#voice-stop'); if (vStop) vStop.onclick = () => D.stopSpeak();
    const jbTog = D.$('#jb-toggle');
    if (jbTog) {
      jbTog.onclick = () => {
        D.set({ judgeCollapsed: !D.state.judgeCollapsed });
        D.$('#judgebar').classList.toggle('collapsed', D.state.judgeCollapsed);
        jbTog.innerHTML = I(D.state.judgeCollapsed ? 'chevronRight' : 'chevronLeft', 16);
      };
    }
    const mb = D.$('#menu-btn');
    if (mb) {
      mb.onclick = () => { const n = D.$('#nav'); n.classList.toggle('open'); mb.setAttribute('aria-expanded', n.classList.contains('open')); };
    }
    const drBd = D.$('#drawer-bd'); if (drBd) drBd.onclick = () => D.closeDrawer();
  }

  /* ---------------- Render ---------------- */
  let shellKey = '';
  D.render = (force) => {
    applyPrefs();
    const cur = D.current();
    const def = D.routes[cur.name] || D.routes['404'];
    const key = [cur.name, cur.params.get('tab'), D.state.lang, D.state.role].join('|');
    if (force || key !== shellKey || !D.$('#main')) {
      document.body.innerHTML = shellHTML();
      bindShell();
      shellKey = key;
    }
    const main = D.$('#main');
    main.innerHTML = '';
    const pageEl = document.createElement('div');
    pageEl.className = 'page';
    main.appendChild(pageEl);
    document.title = (def.title ? D.tx(def.title) + ' · ' : '') + 'Dishari OS';
    try { def.render(pageEl, cur.params); }
    catch (err) {
      console.error(err);
      pageEl.innerHTML = `<div class="card"><h3>${T('This view could not be displayed', 'এই অংশটি দেখানো যায়নি')}</h3><pre>${esc(err && err.stack || err)}</pre></div>`;
    }
    D.$$('#nav a').forEach((a) => a.classList.toggle('active', a.getAttribute('data-link') === cur.name));
  };

  /* ---------------- Toast ---------------- */
  D.toast = (msg, kind, icon) => {
    const box = D.$('#toasts');
    if (!box) return;
    const t = document.createElement('div');
    t.className = 'toast ' + (kind || '');
    t.innerHTML = I(icon || (kind === 'red' ? 'alert' : 'check'), 16) + `<span>${esc(msg)}</span>`;
    box.appendChild(t);
    while (box.children.length > 3) box.firstChild.remove();
    setTimeout(() => { t.style.opacity = '0'; t.style.transition = 'opacity .3s'; }, 2600);
    setTimeout(() => t.remove(), 3000);
  };
  D.confetti = () => { };

  /* ---------------- Modal ---------------- */
  D.modal = (title, bodyHTML, opts) => {
    const root = D.$('#modal-root');
    root.innerHTML = `<div class="modal-backdrop" id="mbd"><div class="modal ${opts && opts.cls || ''}" role="dialog" aria-modal="true" aria-label="${esc(title)}">
      ${title ? `<header><h3 style="margin:0">${esc(title)}</h3><button class="btn sm ghost icon" id="mclose" aria-label="Close">${I('x', 18)}</button></header>` : ''}
      <div class="body">${bodyHTML}</div></div></div>`;
    const close = () => { root.innerHTML = ''; document.removeEventListener('keydown', escKey); };
    const escKey = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', escKey);
    D.$('#mbd').addEventListener('click', (e) => { if (e.target.id === 'mbd') close(); });
    const c = D.$('#mclose'); if (c) c.onclick = close;
    D.closeModal = close;
    return root.querySelector('.modal');
  };

  /* ---------------- Drawer ---------------- */
  D.openDrawer = (html) => {
    const d = D.$('#drawer');
    d.innerHTML = html;
    d.classList.add('open');
    d.setAttribute('aria-hidden', 'false');
    D.$('#drawer-bd').classList.add('open');
    const c = d.querySelector('[data-close]');
    if (c) c.onclick = D.closeDrawer;
  };
  D.closeDrawer = () => {
    const d = D.$('#drawer');
    if (!d) return;
    d.classList.remove('open');
    d.setAttribute('aria-hidden', 'true');
    D.$('#drawer-bd').classList.remove('open');
  };
  D.drawerOpen = () => { const d = D.$('#drawer'); return d && d.classList.contains('open'); };
  D.closeBtn = () => `<button class="btn sm ghost icon" data-close aria-label="Close">${I('x', 18)}</button>`;

  /* ---------------- Settings / accessibility ---------------- */
  D.toggleLite = () => {
    D.set({ lite: !D.state.lite });
    applyPrefs();
    D.log('pref.lite', String(D.state.lite));
    D.toast(D.state.lite ? T('2G Lite on: no web fonts or animation', '২জি লাইট চালু: ওয়েব ফন্ট ও অ্যানিমেশন বন্ধ') : T('2G Lite off', '২জি লাইট বন্ধ'), '', 'signal');
    D.render(true);
  };
  D.pageWeight = () => {
    try {
      const nav = performance.getEntriesByType('navigation')[0];
      const res = performance.getEntriesByType('resource');
      let bytes = (nav && (nav.transferSize || nav.encodedBodySize)) || 0;
      res.forEach((r) => (bytes += r.transferSize || r.encodedBodySize || 0));
      return { kb: Math.round(bytes / 1024), count: res.length + 1 };
    } catch (e) { return { kb: 0, count: 0 }; }
  };
  D.openLanguages = () => {
    const cur = D.state.lang;
    D.modal(T('Choose your language', 'আপনার ভাষা বেছে নিন'), `
      <div class="col" style="gap:8px" role="radiogroup">
        ${D.LANGS.map((l) => `<button class="btn ${l.code === cur ? 'primary' : ''}" data-lang="${l.code}" role="radio" aria-checked="${l.code === cur}" style="justify-content:space-between;text-align:left"><span>${esc(l.native)}</span><span class="muted" style="font-size:12px">${esc(l.name)}${l.draft ? ' · ' + T('draft', 'খসড়া') : ''}</span></button>`).join('')}
        <p class="muted" style="font-size:12.5px;margin:6px 0 0">${T('Hindi covers the main interface. Chakma, Marma, Tripura, Santali and Garo are draft machine translations that fall back to Bangla where a phrase is missing. Native speakers should review them before classroom use.', 'হিন্দি মূল ইন্টারফেসে আছে। চাকমা, মারমা, ত্রিপুরা, সাঁওতালি ও গারো খসড়া যান্ত্রিক অনুবাদ; কোনো বাক্য না থাকলে বাংলা দেখাবে। শ্রেণিকক্ষে ব্যবহারের আগে মাতৃভাষী দিয়ে যাচাই করা উচিত।')}</p>
      </div>`);
    D.$$('[data-lang]').forEach((b) => { b.onclick = () => { D.set({ lang: b.dataset.lang }); D.log('pref.language', D.state.lang); D.closeModal(); D.render(true); }; });
  };
  D.openSettings = () => {
    const w = D.pageWeight();
    const curTh = THEMES.find((x) => x.id === (D.state.theme || 'light')) || THEMES[0];
    D.modal(T('Accessibility and preferences', 'অ্যাক্সেসিবিলিটি ও পছন্দ'), `
      <div class="col" style="gap:18px">
        ${sw('set-lang', D.state.lang === 'bn', T('Bangla interface', 'বাংলা ইন্টারফেস'), T('Lessons, games and tutor replies switch language.', 'পাঠ, গেম ও টিউটরের উত্তর বাংলায়।'))}
        <div class="row between" style="align-items:center;padding:4px 0">
          <div>
            <b style="font-weight:600">${T('Platform Theme (5 palettes)', 'প্ল্যাটফর্মের থিম (৫টি প্যালেট)')}</b>
            <div class="muted small">${T('Current: ', 'বর্তমান: ')}<b>${esc(D.tx(curTh.name))}</b> · ${esc(D.tx(curTh.desc))}</div>
          </div>
          <button class="btn sm" id="set-theme-picker-btn">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${curTh.dot};margin-right:4px"></span>
            ${I(curTh.icon, 14)} ${T('Change Theme', 'থিম নির্বাচন')}
          </button>
        </div>
        ${sw('set-lite', D.state.lite, T('2G Lite mode', '২জি লাইট মোড'), T('System fonts only, no animation. This session has transferred ', 'শুধু সিস্টেম ফন্ট, অ্যানিমেশন নেই। এই সেশনে ডাউনলোড ') + D.n(w.kb) + ' KB.')}
        ${sw('set-dys', D.state.dyslexia, T('Dyslexia-friendly reading', 'ডিসলেক্সিয়া-বান্ধব পড়া'), T('Wider letter, word and line spacing.', 'অক্ষর ও লাইনের মাঝে বেশি ফাঁকা।'))}
        ${sw('set-audio', D.state.audio, T('Read tutor replies aloud', 'টিউটরের উত্তর পড়ে শোনাও'), T('Uses the device speech engine, with a Bangla voice where installed.', 'ডিভাইসের স্পিচ ইঞ্জিন ব্যবহার করে।'))}
        <button class="btn sm" id="set-more-lang">${I('languages', 15)} ${T('More languages: Hindi, Chakma, Marma and others', 'আরও ভাষা: হিন্দি, চাকমা, মারমা ও অন্যান্য')}</button>
        <hr style="margin:0">
        <div class="row"><button class="btn sm" id="set-test">${I('volume', 15)} ${T('Test voice', 'ভয়েস পরীক্ষা')}</button><button class="btn sm" id="set-tour">${I('help', 15)} ${T('Replay tour', 'ট্যুর আবার দেখো')}</button><button class="btn sm ghost danger" id="set-reset">${I('refresh', 15)} ${T('Reset demo data', 'ডেমো ডেটা রিসেট')}</button></div>
      </div>`);
    const bind = (id, fn) => { const el = D.$('#' + id); if (el) el.onchange = (e) => fn(e.target.checked); };
    bind('set-lang', (v) => { D.set({ lang: v ? 'bn' : 'en' }); D.closeModal(); D.render(true); });
    const more = D.$('#set-more-lang'); if (more) more.onclick = () => { D.closeModal(); D.openLanguages(); };
    const thPick = D.$('#set-theme-picker-btn'); if (thPick) thPick.onclick = () => { D.closeModal(); D.openThemePicker(); };
    bind('set-lite', () => { D.closeModal(); D.toggleLite(); });
    bind('set-dys', (v) => { D.set({ dyslexia: v }); applyPrefs(); });
    bind('set-audio', (v) => { D.set({ audio: v }); });
    D.$('#set-test').onclick = () => D.speak(T('Hello. I am Dishari, your learning guide.', 'হ্যালো। আমি দিশারী, তোমার শেখার সঙ্গী।'));
    D.$('#set-tour').onclick = () => { D.closeModal(); D.tour(0); };
    D.$('#set-reset').onclick = () => { D.resetAll(); D.closeModal(); D.toast(T('Demo data reset', 'ডেমো ডেটা রিসেট হয়েছে'), '', 'refresh'); D.go(''); };
  };
  function sw(id, on, label, help) {
    return `<label class="switch" style="align-items:flex-start"><input type="checkbox" id="${id}" ${on ? 'checked' : ''}><span class="track" style="margin-top:2px"></span><span><b style="font-weight:600">${esc(label)}</b><br><span class="muted small">${esc(help)}</span></span></label>`;
  }

  /* ---------------- Voice read-aloud ---------------- */
  D.speak = (text, lang) => {
    if (!('speechSynthesis' in window)) { D.toast(T('Speech is not supported in this browser', 'এই ব্রাউজারে স্পিচ সমর্থিত নয়'), 'red'); return; }
    const clean = String(text).replace(/<[^>]+>/g, ' ').replace(/[*_#`]/g, '').replace(/\s+/g, ' ').trim();
    if (!clean) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    const want = lang || (/[ঀ-৿]/.test(clean) ? 'bn' : 'en');
    const v = speechSynthesis.getVoices().find((x) => x.lang && x.lang.toLowerCase().startsWith(want === 'bn' ? 'bn' : 'en'));
    u.lang = want === 'bn' ? 'bn-BD' : 'en-US';
    if (v) u.voice = v;
    u.rate = D.state.dyslexia ? 0.85 : 0.95;
    const bar = D.$('#voicebar');
    if (bar) bar.classList.add('on');
    const lbl = D.$('#voice-label');
    if (lbl) lbl.textContent = want === 'bn' && !v ? T('Reading (no Bangla voice installed, using default)', 'পড়ছে (বাংলা ভয়েস নেই)') : T('Reading aloud', 'পড়ে শোনানো হচ্ছে');
    u.onend = u.onerror = () => { if (bar) bar.classList.remove('on'); };
    speechSynthesis.speak(u);
  };
  D.stopSpeak = () => { try { speechSynthesis.cancel(); } catch (e) { /* ignore */ } const b = D.$('#voicebar'); if (b) b.classList.remove('on'); };

  /* ---------------- Command palette (Ctrl/Cmd + K) ---------------- */
  function commands() {
    const go = (r, p) => () => D.go(r, p);
    const nav = T('Go to', 'যাও'), ws = T('Workspace', 'ওয়ার্কস্পেস'), act = T('Action', 'অ্যাকশন'), sub = T('Subject', 'বিষয়');
    return [
      ['home', T('Home', 'হোম'), nav, go('')],
      ['layers', T('Workspace: AI tutor and labs', 'ওয়ার্কস্পেস: AI টিউটর ও ল্যাব'), nav, go('app')],
      ['graduation', T('Sign in as demo student (Aurin)', 'ডেমো শিক্ষার্থী (আউরিন)'), T('Demo', 'ডেমো'), go('demo-user')],
      ['building', T('Sign in as demo admin', 'ডেমো অ্যাডমিন'), T('Demo', 'ডেমো'), go('demo-admin')],
      ['teacher', T('Teacher Co-Pilot', 'শিক্ষক কো-পাইলট'), ws, go('app', { tab: 'copilot' })],
      ['camera', T('Snap-to-Solve', 'স্ন্যাপ-টু-সলভ'), ws, go('app', { tab: 'snap' })],
      ['compass', T('Career Bridge and Skill Passport', 'ক্যারিয়ার ব্রিজ ও পাসপোর্ট'), ws, go('app', { tab: 'career' })],
      ['briefcase', T('Talent Marketplace', 'ট্যালেন্ট মার্কেটপ্লেস'), ws, go('app', { tab: 'talent' })],
      ['dna', T('Biology lab', 'জীববিজ্ঞান ল্যাব'), sub, go('app', { s: 'bio' })],
      ['flask', T('Chemistry lab', 'রসায়ন ল্যাব'), sub, go('app', { s: 'chem' })],
      ['sigma', T('Mathematics lab', 'গণিত ল্যাব'), sub, go('app', { s: 'math' })],
      ['fn', T('Equations lab', 'সমীকরণ ল্যাব'), sub, go('app', { s: 'eq' })],
      ['code', T('ICT lab', 'আইসিটি ল্যাব'), sub, go('app', { s: 'ict' })],
      ['target', T('SDG 4 impact and research evidence', 'SDG ৪ ও গবেষণা'), nav, go('sdg4')],
      ['database', T('Data architecture', 'ডেটা আর্কিটেকচার'), nav, go('data')],
      ['lock', T('Security and privacy', 'নিরাপত্তা ও গোপনীয়তা'), nav, go('security')],
      ['network', T('System architecture', 'সিস্টেম আর্কিটেকচার'), nav, go('architecture')],
      ['shield', T('Admin console', 'অ্যাডমিন কনসোল'), nav, go('admin')],
      ['key', T('Portal Gateway & Login', 'পোর্টাল গেটওয়ে ও লগইন'), nav, go('login')],
      ['shieldCheck', T('Run the system audit', 'সিস্টেম অডিট চালাও'), act, go('audit', { run: '1' })],
      ['palette', T('Choose platform theme (5 palettes)', 'থিম নির্বাচন (৫টি থিম)'), act, () => D.openThemePicker()],
      ['refresh', T('Quick cycle to next theme', 'পরবর্তী থিমে যাও'), act, () => D.cycleTheme()],
      ['sun', T('Theme: SaaS Indigo (Light)', 'থিম: ইন্ডিগো লাইট'), act, () => setTheme('light')],
      ['moon', T('Theme: Deep Slate (Dark)', 'থিম: স্লেট ডার্ক'), act, () => setTheme('dark')],
      ['bookOpen', T('Theme: Warm Study (Sepia Paper)', 'থিম: উষ্ণ পাঠ (সেপিয়া)'), act, () => setTheme('sepia')],
      ['award', T('Theme: STEM Forest (Science Lab)', 'থিম: সবুজ ল্যাব (এমারেল্ড)'), act, () => setTheme('emerald')],
      ['compass', T('Theme: Midnight Navy (AMOLED)', 'থিম: মিডনাইট নেভি'), act, () => setTheme('midnight')],
      ['languages', T('Switch Bangla / English', 'বাংলা / ইংরেজি'), act, () => D.$('#lang-btn').click()],
      ['signal', T('Toggle 2G Lite mode', '২জি লাইট মোড'), act, () => D.toggleLite()],
      ['help', T('Start the guided tour', 'গাইডেড ট্যুর'), act, () => D.tour(0)],
      ['accessibility', T('Accessibility settings', 'অ্যাক্সেসিবিলিটি'), act, () => D.openSettings()]
    ];
  }
  D.palette = () => {
    const all = commands();
    const m = D.modal('', `<div class="palette"><input type="search" id="pal-q" placeholder="${T('Search pages and actions', 'পেজ ও অ্যাকশন খুঁজুন')}" aria-label="Command" autocomplete="off"><ul id="pal-list" role="listbox"></ul></div>`, { cls: 'palette' });
    m.querySelector('.body').style.padding = '0';
    let sel = 0, list = all;
    const draw = () => {
      D.$('#pal-list').innerHTML = list.map((c, i) => `<li role="option" data-i="${i}" class="${i === sel ? 'sel' : ''}" aria-selected="${i === sel}">${I(c[0], 17)}<span>${esc(c[1])}</span><span class="grp">${esc(c[2])}</span></li>`).join('') || `<li class="muted">${T('No matches', 'কিছু পাওয়া যায়নি')}</li>`;
      D.$$('#pal-list li[data-i]').forEach((li) => (li.onclick = () => run(+li.dataset.i)));
    };
    const run = (i) => { const c = list[i]; if (!c) return; D.closeModal(); c[3](); };
    const q = D.$('#pal-q');
    q.oninput = () => {
      const s = q.value.toLowerCase().trim();
      list = !s ? all : all.filter((c) => s.split(/\s+/).every((w) => (c[1] + ' ' + c[2]).toLowerCase().includes(w)));
      sel = 0; draw();
    };
    q.onkeydown = (e) => {
      if (e.key === 'ArrowDown') { sel = Math.min(list.length - 1, sel + 1); draw(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { sel = Math.max(0, sel - 1); draw(); e.preventDefault(); }
      else if (e.key === 'Enter') { run(sel); e.preventDefault(); }
    };
    draw();
    setTimeout(() => q.focus(), 30);
  };
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); D.palette(); }
  });

  /* ---------------- 30-second onboarding tour ---------------- */
  const TOUR = [
    { sel: '#mode-switcher', title: { en: 'Four ways the tutor can teach', bn: 'টিউটরের চারটি শেখানোর পদ্ধতি' }, body: { en: 'Switch between Socratic questioning, the Bloom mastery ladder, Feynman teach-back and step-by-step scaffolding. The topic stays the same; the pedagogy changes.', bn: 'সক্রেটিক, ব্লুম ল্যাডার, ফাইনম্যান ও স্ক্যাফোল্ডিং। বিষয় একই, শেখানোর ধরন ভিন্ন।' } },
    { sel: '#quest-bar', title: { en: 'A four-part learning quest', bn: 'চার পর্বের শেখার কোয়েস্ট' }, body: { en: 'Explore in a sandbox, practise with adaptive questions, apply it in a real-world boss battle, then work with a mixed team.', bn: 'স্যান্ডবক্সে অন্বেষণ, অ্যাডাপটিভ অনুশীলন, বাস্তব বস ব্যাটল, তারপর দলগত কাজ।' } },
    { sel: '#rag-btn', title: { en: 'Every answer shows its evidence', bn: 'প্রতিটি উত্তরের প্রমাণ' }, body: { en: 'Open the explainability panel to see the textbook passages used, a grounding score, the safety checks and the teaching decision.', bn: 'ব্যবহৃত পাঠ্যাংশ, গ্রাউন্ডিং স্কোর, নিরাপত্তা যাচাই ও শিক্ষণ সিদ্ধান্ত দেখুন।' } },
    { sel: '[data-tour="sdg4"]', title: { en: 'Research and SDG 4', bn: 'গবেষণা ও SDG ৪' }, body: { en: 'The learning science behind each feature, with sources and limitations, plus an impact calculator.', bn: 'প্রতিটি ফিচারের পেছনের গবেষণা, উৎস ও সীমাবদ্ধতাসহ।' } },
    { sel: '[data-tour="audit"]', title: { en: 'One-click audit', bn: 'এক-ক্লিক অডিট' }, body: { en: 'Runs 32 real checks on security, privacy, pedagogy, accessibility and hallucination safeguards, and produces a scorecard.', bn: '৩২টি বাস্তব পরীক্ষা চালিয়ে স্কোরকার্ড তৈরি করে।' } },
    { sel: '#cmdk-btn', title: { en: 'Find anything quickly', bn: 'দ্রুত খুঁজুন' }, body: { en: 'Press Ctrl + K (or Cmd + K) to jump to any page or action. The bar at the bottom switches between student, teacher, admin and recruiter views.', bn: 'Ctrl + K চেপে যেকোনো পেজে যান। নিচের বার দিয়ে ভিউ বদলান।' } }
  ];
  D.tour = async (i) => {
    if (i === 0 && D.current().name !== 'app') { D.go('app', { tab: 'learn' }); await D.sleep(450); }
    clearTour();
    if (i >= TOUR.length) { D.set({ tourDone: true }); D.log('tour.completed'); return; }
    const step = TOUR[i];
    let el = D.$(step.sel);
    if (el && el.offsetParent === null && step.sel === '#cmdk-btn') el = D.$('#lang-btn');
    const ring = document.createElement('div');
    ring.className = 'tour-ring';
    const card = document.createElement('div');
    card.className = 'tour-card';
    card.setAttribute('role', 'dialog');
    card.innerHTML = `<div class="eyebrow">${T('Guided tour', 'গাইডেড ট্যুর')} · ${D.n(i + 1)} / ${D.n(TOUR.length)}</div>
      <h3 style="margin:8px 0 6px">${esc(D.tx(step.title))}</h3><p class="muted" style="margin:0">${esc(D.tx(step.body))}</p>
      <div class="steps">${TOUR.map((_, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('')}</div>
      <div class="row between"><button class="btn sm ghost" id="tour-skip">${T('Skip tour', 'বাদ দাও')}</button>
      <div class="row">${i > 0 ? `<button class="btn sm" id="tour-prev" aria-label="Back">${I('chevronLeft', 16)}</button>` : ''}<button class="btn sm primary" id="tour-next">${i === TOUR.length - 1 ? T('Finish', 'শেষ') : T('Next', 'পরবর্তী')}</button></div></div>`;
    document.body.appendChild(ring);
    document.body.appendChild(card);
    const place = () => {
      if (el && el.getBoundingClientRect().width > 0) {
        const r = el.getBoundingClientRect();
        Object.assign(ring.style, { left: r.left - 6 + 'px', top: r.top - 6 + 'px', width: r.width + 12 + 'px', height: r.height + 12 + 'px', display: 'block' });
        const below = r.bottom + 14 + 220 < innerHeight;
        card.style.top = (below ? r.bottom + 14 : Math.max(12, r.top - 14 - card.offsetHeight)) + 'px';
        card.style.left = D.clamp(r.left, 12, innerWidth - card.offsetWidth - 12) + 'px';
      } else {
        ring.style.display = 'none';
        card.style.top = '30%'; card.style.left = 'calc(50% - 190px)';
      }
    };
    if (el) { el.scrollIntoView({ block: 'center', behavior: 'instant' }); await D.sleep(60); }
    place();
    setTimeout(place, 400);
    D._tourPlace = place;
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, { passive: true });
    D.$('#tour-next').onclick = () => D.tour(i + 1);
    D.$('#tour-skip').onclick = () => { clearTour(); D.set({ tourDone: true }); };
    const p = D.$('#tour-prev'); if (p) p.onclick = () => D.tour(i - 1);
    D.$('#tour-next').focus();
  };
  function clearTour() {
    D.$$('.tour-ring, .tour-card').forEach((n) => n.remove());
    if (D._tourPlace) { window.removeEventListener('resize', D._tourPlace); window.removeEventListener('scroll', D._tourPlace); }
  }
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && D.$('.tour-card')) { clearTour(); D.set({ tourDone: true }); } });

  /* ---------------- Shared small components ---------------- */
  D.demoTag = (txt) => `<span class="tag-demo" title="${T('Illustrative sample data, not a real-world measurement', 'নমুনা ডেটা, বাস্তব পরিমাপ নয়')}">${txt || T('Sample data', 'নমুনা ডেটা')}</span>`;
  D.liveTag = (txt) => `<span class="tag-live" title="${T('Computed live in your browser', 'আপনার ব্রাউজারে সরাসরি গণনা')}">${txt || T('Live', 'লাইভ')}</span>`;
  D.bar = (pct, cls) => `<div class="bar ${cls || ''}" role="progressbar" aria-valuenow="${Math.round(pct)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${D.clamp(pct, 0, 100)}%"></i></div>`;
  D.sectionHead = (eyebrow, title, sub) => `<header style="margin:0 0 32px;max-width:860px"><div class="eyebrow">${eyebrow}</div><h1 style="margin:10px 0 10px">${title}</h1>${sub ? `<p class="lead" style="margin:0">${sub}</p>` : ''}</header>`;
  D.fb = (ok, html) => `<div class="feedback ${ok === true ? 'ok' : ok === false ? 'no' : ''}">${I(ok === true ? 'checkCircle' : ok === false ? 'xCircle' : 'info', 18)}${html}</div>`;
  D.extLink = (url, label) => `<a href="${esc(url)}" target="_blank" rel="noopener" class="row nowrap" style="display:inline-flex;gap:5px">${esc(label)} ${I('external', 13)}</a>`;

  /* ---------------- Boot ---------------- */
  D.boot = () => {
    // Snapshot the loaded scripts before the shell replaces <body> (used by the /audit secret scan).
    D.SCRIPTS = Array.from(document.scripts).map((x) => ({ src: x.src, text: x.src ? '' : x.textContent }));
    applyPrefs();
    if (!D.routes['404']) D.page('404', { title: { en: 'Not found', bn: 'পাওয়া যায়নি' }, render: (el) => { el.innerHTML = `<div class="card"><h2>${T('Page not found', 'পেজ পাওয়া যায়নি')}</h2><p class="muted">${T('That address does not exist.', 'এই ঠিকানাটি নেই।')}</p>${D.a('', T('Go to home', 'হোমে যাও'), 'btn primary')}</div>`; } });
    D.render(true);
    if (!D.state.tourDone && !navigator.webdriver) setTimeout(() => { if (!D.state.tourDone && !D.$('.modal-backdrop')) D.tour(0); }, 1200);
    if ('serviceWorker' in navigator && location.protocol === 'https:' && !window.DISHARI_HASH) {
      navigator.serviceWorker.register(new URL('sw.js', document.baseURI).toString()).catch(() => { });
    }
  };
})();

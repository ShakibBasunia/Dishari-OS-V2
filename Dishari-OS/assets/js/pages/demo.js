/* Dishari OS, /demo-user (one-click student) and /demo-admin (one-click institutional admin) */
(function () {
  'use strict';
  const D = window.D;
  const { T, esc } = D;
  const tx = D.tx;

  D.page('demo-user', {
    title: { en: 'Demo student, Aurin Jahan', bn: 'ডেমো শিক্ষার্থী, আউরিন জাহান' },
    render(el) {
      if (D.state.role !== 'student') { D.loginStudent(); D.render(true); return; }
      const g = D.state.game, lp = D.levelProgress(g.xp), N = D.NUSRAT;
      const bossQ = D.quest('bio');
      const passports = D.state.passports;
      el.innerHTML = `
        <div class="banner em" style="margin-bottom:16px"><span>${T('Signed in instantly as the demo student. No password, no personal data, this profile is fictional.', 'ডেমো শিক্ষার্থী হিসেবে সাথে সাথে সাইন ইন। কোনো পাসওয়ার্ড বা ব্যক্তিগত তথ্য নেই, প্রোফাইলটি কাল্পনিক।')}</span>
          <span style="margin-left:auto" class="row">${D.a('app', '' + T('Continue learning →', 'শেখা চালিয়ে যাও →'), 'btn sm primary')}<button class="btn sm ghost" id="logout">${T('Sign out', 'সাইন আউট')}</button></span></div>
        <div class="bento">
          <div class="card s8">
            <div class="row nowrap" style="gap:16px">
              <div class="brand-mark" style="width:72px;height:72px;font-size:26px;border-radius:20px;flex:0 0 auto">${N.initials}</div>
              <div class="grow"><div class="eyebrow">${T('Student profile', 'শিক্ষার্থী প্রোফাইল')}</div><h2 style="margin:4px 0">${D.state.lang === 'bn' ? N.nameBn : N.name}</h2>
              <div class="muted">${esc(tx(N.role))} · ${esc(tx(N.place))}</div>
              <div class="row" style="margin-top:8px;gap:6px"><span class="chip gold">${T('Goal', 'লক্ষ্য')}: ${esc(tx(N.goal))}</span><span class="chip">${esc(tx(N.school))}</span><span class="chip">${T('Prefers Bangla + English', 'বাংলা + ইংরেজি পছন্দ')}</span></div></div>
            </div>
            <div class="grid g4" style="margin-top:18px">
              <div class="card flat tint"><div class="kpi">${D.n(lp.level)}</div><div class="small muted">${T('Level', 'লেভেল')} · ${D.n(lp.toNext)} XP ${T('to next', 'বাকি')}</div>${D.bar(lp.pct, 'gold')}</div>
              <div class="card flat tint"><div class="kpi">${D.n(g.xp)}</div><div class="small muted">${T('Total XP', 'মোট XP')}</div></div>
              <div class="card flat tint"><div class="kpi">${D.n(g.streak)}</div><div class="small muted">${T('day streak', 'দিনের ধারা')}</div></div>
              <div class="card flat tint"><div class="kpi">${D.n(g.gems)}</div><div class="small muted">${T('knowledge gems', 'জ্ঞান রত্ন')}</div></div>
            </div>
          </div>
          <div class="card s4"><div class="card-head"><h3>${T("Bloom's taxonomy radar", 'ব্লুম ট্যাক্সোনমি রাডার')}</h3></div><div style="display:grid;place-items:center">${D.radar(D.BLOOM.map(([, l]) => tx(l)), D.BLOOM.map(([k]) => D.state.bloom[k]), { size: 270 })}</div>
            <p class="small muted">${T('Strong recall and understanding; next growth zone is Evaluate → Create.', 'স্মরণ ও অনুধাবনে শক্তিশালী; পরবর্তী লক্ষ্য মূল্যায়ন → সৃষ্টি।')}</p></div>
          <div class="card s6 em-edge">
            <div class="card-head"><h3>${T('Active Boss Battle', 'চলমান বস ব্যাটল')}</h3><span class="chip danger">${T('Biology', 'জীববিজ্ঞান')}</span></div>
            <div class="boss-hp"><div class="boss-face">${D.icon(D.BOSSES.bio.face, 24)}</div><div><div class="row between small"><b>${esc(tx(D.BOSSES.bio.name))}</b><span>${D.n(100 - bossQ.p3)} HP ${T('left', 'বাকি')}</span></div>${D.bar(100 - bossQ.p3, 'red')}</div><span class="hearts">${D.icon('heart', 17)}${D.icon('heart', 17)}<span class="lost">${D.icon('heart', 17)}</span></span></div>
            <p class="small muted" style="margin-top:10px">${esc(tx(D.BOSSES.bio.story))}</p>
            ${D.a('app', '' + T('Resume battle', 'ব্যাটলে ফেরো'), 'btn gold', { s: 'bio', p: '3', tab: 'learn' })}
          </div>
          <div class="card s6">
            <div class="card-head"><h3>${T('Quest progress by subject', 'বিষয়ভিত্তিক অগ্রগতি')}</h3></div>
            ${D.SUBJECTS.map((s) => { const q = D.quest(s.id); return `<div style="margin-bottom:10px"><div class="row between small"><b>${D.icon(s.icon, 15)} ${esc(tx(s.name))}</b><span class="muted">${D.n(D.subjectMastery(s.id))}% ${T('mastery', 'দক্ষতা')}</span></div><div class="grid g4" style="gap:4px;margin-top:4px">${['p1', 'p2', 'p3', 'p4'].map((k) => D.bar(q[k], k === 'p3' ? 'gold' : '')).join('')}</div></div>`; }).join('')}
            <div class="small muted">${T('Bars: Sandbox · Practice · Boss · Co-op', 'বার: স্যান্ডবক্স · অনুশীলন · বস · কো-অপ')}</div>
          </div>
          <div class="card s7">
            <div class="card-head"><h3>${T('Verifiable Skill Passport', 'যাচাইযোগ্য স্কিল পাসপোর্ট')}</h3>${D.a('app', T('Earn more →', 'আরও অর্জন →'), 'btn sm', { tab: 'career' })}</div>
            <div id="pp"></div>
          </div>
          <div class="card s5">
            <div class="card-head"><h3>${T('Badges', 'ব্যাজ')}</h3><span class="chip">${D.n(g.badges.length)}</span></div>
            <div class="row" style="gap:6px">${g.badges.map((b) => `<span class="chip">${D.icon(b.icon || 'award', 14)} ${esc(tx(b.label))}</span>`).join('')}</div>
            <hr><div class="card-head"><h3>${T('Top career matches', 'শীর্ষ ক্যারিয়ার মিল')}</h3></div>
            ${D.careerMatches().slice(0, 3).map((m) => `<div style="margin-bottom:8px"><div class="row between small"><b>${esc(tx(m.c.name))}</b><span>${D.n(m.pct)}%</span></div>${D.bar(m.pct)}</div>`).join('')}
          </div>
        </div>`;
      D.$('#logout').onclick = () => { D.logout(); D.go(''); };
      (async () => { for (const p of passports) await D.passportHash(p); D.save(); const box = D.$('#pp'); if (box) box.innerHTML = passports.map((p) => D.passportCard(p)).join(''); })();
    }
  });

  D.page('demo-admin', {
    title: { en: 'Demo admin console', bn: 'ডেমো অ্যাডমিন কনসোল' },
    render(el) {
      if (D.state.role !== 'admin') { D.loginAdmin(); D.render(true); return; }
      D.renderAdmin(el, true);
    }
  });
})();

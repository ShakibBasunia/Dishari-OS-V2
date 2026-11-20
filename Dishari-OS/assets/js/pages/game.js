/* Dishari OS, Game Master Agent: Part 2 practice sprint, Part 3 boss battles, Part 4 co-op league */
(function () {
  'use strict';
  const D = window.D;
  const { T, esc } = D;
  D.GAME = {};
  const head = (part, title, sub, pct) => `<div style="margin-bottom:20px"><div class="row between"><div class="eyebrow">${T('Part', 'পর্ব')} ${D.n(part)}</div><span class="small ${pct >= 100 ? 'ok' : 'muted'}" id="part-pct">${D.n(Math.round(pct))}% ${T('complete', 'সম্পন্ন')}</span></div><h3 style="margin:8px 0 4px;font-size:18px">${title}</h3><p class="small muted" style="margin:0">${sub}</p></div>`;
  const tx = D.tx;
  const opt = (o) => (typeof o === 'string' ? o : tx(o));
  // deterministic shuffle so options are not always "A" (seeded per question)
  const order = (n, seed) => { const idx = Array.from({ length: n }, (_, i) => i); let s = seed * 9301 + 49297; for (let i = n - 1; i > 0; i--) { s = (s * 9301 + 49297) % 233280; const j = Math.floor((s / 233280) * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; } return idx; };
  D.order = order;

  /* ===================== Part 2: Guided Practice Arena ===================== */
  // Adaptive selection with a 1-parameter IRT (Rasch) ability estimate θ; difficulty b = d − 2.
  D.GAME.practice = (el, sub) => {
    const bank = D.PRACTICE[sub.id];
    const st = { theta: 0, asked: [], cur: null, answered: false, correct: 0, xp0: D.state.game.xp, showHint: false, n: 6 };
    const p = (theta, d) => 1 / (1 + Math.exp(-(theta - (d - 2))));
    const pick = () => { const left = bank.map((q, i) => i).filter((i) => !st.asked.includes(i)); left.sort((a, b) => Math.abs(bank[a].d - 2 - st.theta) - Math.abs(bank[b].d - 2 - st.theta)); return left[0]; };
    const next = () => { st.cur = pick(); st.answered = false; st.showHint = false; draw(); };
    const draw = () => {
      if (st.asked.length >= st.n || st.cur == null) return summary();
      const q = bank[st.cur];
      const ord = order(q.o.length, st.cur + 3);
      const g = D.state.game;
      el.innerHTML = head(2, T('Practice sprint', 'অনুশীলন স্প্রিন্ট'), T('Six adaptive questions that adjust to your level. Three correct in a row doubles your XP.', 'ছোট অ্যাডাপটিভ প্রশ্ন। পরপর ৩টি সঠিক = ২× XP।'), D.quest(sub.id).p2) + `
        <div class="row between" style="margin-bottom:10px">
          <div class="row" style="gap:6px">${Array.from({ length: st.n }).map((_, i) => `<span class="dot ${i < st.asked.length ? '' : 'gold'}" style="opacity:${i <= st.asked.length ? 1 : 0.35}"></span>`).join('')}<span class="small muted">${T('Question', 'প্রশ্ন')} ${D.n(st.asked.length + 1)}/${D.n(st.n)}</span></div>
          <div class="row" style="gap:6px"><span class="chip">${T('Difficulty', 'কাঠিন্য')} ${['', T('easy', 'সহজ'), T('medium', 'মাঝারি'), T('hard', 'কঠিন')][q.d]}</span><span class="chip ${g.combo >= 3 ? 'gold' : ''}">${D.icon('zap', 13)} ${g.combo >= 3 ? T('2× XP active', '২× XP সক্রিয়') : D.n(Math.max(0, 3 - g.combo)) + T(' more for 2× XP', 'টি বাকি ২× XP')}</span><span class="chip info" title="${T('Rasch ability estimate', 'সক্ষমতা অনুমান')}">θ ${st.theta.toFixed(2)}</span></div>
        </div>
        <div style="font-size:16px;font-weight:700;margin-bottom:12px;white-space:pre-wrap">${esc(tx(q.q))}</div>
        <div class="opts">${ord.map((k, i) => `<button class="opt" data-k="${k}" ${st.answered ? 'disabled' : ''}><span class="k">${'ABCD'[i]}</span><span>${esc(opt(q.o[k]))}</span></button>`).join('')}</div>
        <div class="row" style="margin-top:10px;gap:8px"><button class="btn sm" id="hint">${D.icon('lightbulb', 15)} ${T('Hint in Bangla and English', 'হিন্ট (বাংলা + ইংরেজি)')}</button><button class="btn sm ghost" id="src">${D.icon('bookOpen', 15)} ${T('Textbook source', 'পাঠ্যসূত্র')}</button></div>
        <div id="hint-box" class="feedback" style="display:${st.showHint ? '' : 'none'}">${D.icon('lightbulb', 16)}<b>বাংলা:</b> ${esc(q.hint.bn)}<br><span style="margin-left:26px"><b>English:</b> ${esc(q.hint.en)}</span></div>
        <div id="fb"></div>`;
      D.$$('[data-k]', el).forEach((b) => (b.onclick = () => answer(+b.dataset.k, b)));
      D.$('#hint').onclick = () => { st.showHint = true; D.$('#hint-box').style.display = ''; D.log('practice.hint', sub.id); };
      D.$('#src').onclick = () => showSource(q.cite);
    };
    const answer = (k, btn) => {
      if (st.answered) return;
      st.answered = true;
      const q = bank[st.cur];
      const ok = k === q.a;
      const pr = p(st.theta, q.d);
      st.theta = +(st.theta + (ok ? 0.8 * (1 - pr) : -0.8 * pr)).toFixed(3);
      st.asked.push(st.cur);
      D.answer(ok);
      if (ok) { st.correct++; D.addXP(10 + q.d * 5, T('Practice', 'অনুশীলন')); D.bumpBloom(q.d === 1 ? 'remember' : q.d === 2 ? 'understand' : 'apply', 2); }
      D.setQuest(sub.id, 'p2', (st.asked.length / st.n) * 100 * (0.5 + 0.5 * (st.correct / st.asked.length)));
      D.$$('.opt', el).forEach((b) => { b.disabled = true; if (+b.dataset.k === q.a) b.classList.add('right'); });
      if (!ok) btn.classList.add('wrong');
      D.$('#fb').innerHTML = `<div class="feedback ${ok ? 'ok' : 'no'}">${D.icon(ok ? 'checkCircle' : 'xCircle', 18)}<b>${ok ? T('Correct.', 'সঠিক।') : T('Not quite.', 'হয়নি।')}</b> ${esc(tx(q.why))} <div class="row" style="margin-top:8px"><button class="btn sm primary" id="nx">${st.asked.length >= st.n ? T('See results', 'ফলাফল') : T('Next question', 'পরের প্রশ্ন')}</button></div></div>`;
      D.$('#nx').onclick = next;
      D.$('#nx').focus();
      D.refreshHUD();
    };
    const summary = () => {
      const acc = Math.round((st.correct / Math.max(1, st.asked.length)) * 100);
      const xp = D.state.game.xp - st.xp0;
      if (acc >= 50) D.setQuest(sub.id, 'p2', Math.max(D.quest(sub.id).p2, acc >= 80 ? 100 : 75));
      if (acc === 100) D.award('flawless-' + sub.id, { en: 'Flawless Sprint: ' + sub.name.en, bn: 'নিখুঁত স্প্রিন্ট: ' + sub.name.bn }, '');
      D.refreshHUD();
      el.innerHTML = head(2, T('Sprint complete', 'স্প্রিন্ট শেষ'), T('Your adaptive estimate updates after every answer.', 'প্রতিটি উত্তরের পর অ্যাডাপটিভ অনুমান হালনাগাদ হয়।'), D.quest(sub.id).p2) + `
        <div class="grid g3" style="text-align:center"><div class="card flat tint">${D.ring(acc, { size: 96 })}<div class="small muted">${T('Accuracy', 'নির্ভুলতা')}</div></div>
        <div class="card flat tint"><div class="kpi">+${D.n(xp)}</div><div class="small muted">XP ${T('earned', 'অর্জিত')}</div></div>
        <div class="card flat tint"><div class="kpi">θ ${st.theta.toFixed(2)}</div><div class="small muted">${T('Ability estimate (Rasch)', 'সক্ষমতা অনুমান')}</div></div></div>
        <p class="small muted" style="margin-top:12px">${acc >= 80 ? T('You are ready for the real-world challenge.', 'তুমি বাস্তব চ্যালেঞ্জের জন্য প্রস্তুত।') : T('Tip: switch the tutor to Scaffolding mode for step-by-step support, then retry.', 'টিপ: টিউটরকে স্ক্যাফোল্ডিং মোডে নিয়ে আবার চেষ্টা করো।')}</p>
        <div class="row"><button class="btn primary" id="again">${T('New sprint', 'নতুন স্প্রিন্ট')}</button><button class="btn gold" id="toboss">${T('Go to the challenge', 'চ্যালেঞ্জে যাও')} ${D.icon('arrowRight', 15)}</button></div>`;
      D.$('#again').onclick = () => D.GAME.practice(el, sub);
      D.$('#toboss').onclick = () => { D.W.p = '3'; D.setParams({ p: '3' }); D.refreshHUD(); D.renderStage(); };
    };
    next();
  };

  function showSource(id) {
    const c = D.KB.find((x) => x.id === id);
    if (!c) return;
    D.openDrawer(`<header><div><div class="eyebrow">${T('Curriculum source', 'পাঠ্যসূত্র')}</div><h3 style="margin:4px 0 0">${esc(c.src)}</h3></div>${D.closeBtn()}</header>
      <div class="body"><div class="small gold" style="margin-bottom:8px">${esc(c.ref)}</div><p>${esc(tx({ en: c.en, bn: c.bn }))}</p><div class="small muted">${esc(c.lic)} · id ${esc(c.id)}</div>${c.url ? `<p style="margin-top:10px"><a href="${esc(c.url)}" target="_blank" rel="noopener">${T('Open source ', 'উৎস খোলো ')}</a></p>` : ''}</div>`);
  }
  D.showSource = showSource;

  /* ===================== Part 3: Real-World Boss Battle ===================== */
  D.GAME.boss = (el, sub) => {
    const B = D.BOSSES[sub.id];
    const st = { hp: 100, hearts: 3, stage: 0, fixed: new Set(), log: [], won: false, lost: false, sel: null };
    const total = sub.id === 'ict' ? Object.keys(B.bugs).length : B.stages.length;
    const dmg = 100 / total;
    // Resume an unfinished battle where the learner left off (damage already dealt is kept)
    const prior = D.quest(sub.id).p3;
    if (prior > 0 && prior < 100) {
      const done = Math.min(total - 1, Math.round(prior / dmg));
      st.hp = 100 - done * dmg;
      if (sub.id === 'ict') Object.keys(B.bugs).map(Number).sort((a, b) => a - b).slice(0, done).forEach((k) => st.fixed.add(k));
      else st.stage = done;
    }
    const frame = (body) => {
      el.innerHTML = head(3, esc(tx(B.name)), esc(tx(B.story)), D.quest(sub.id).p3) + `
        <div class="boss-hp" style="margin-bottom:12px"><div class="boss-face" id="bface">${D.icon(B.face, 24)}</div><div><div class="row between small"><span class="muted">${T('Challenge strength', 'চ্যালেঞ্জের শক্তি')}</span><span>${D.n(Math.round(st.hp))}%</span></div>${D.bar(st.hp, 'red')}</div><div class="hearts" aria-label="${D.n(st.hearts)} lives">${[0, 1, 2].map((k) => `<span class="${k < st.hearts ? '' : 'lost'}">${D.icon('heart', 18)}</span>`).join('')}</div></div>
        ${B.clues ? `<div class="clue small" style="margin-bottom:12px">${esc(tx(B.clues))}</div>` : ''}
        <div id="bbody">${body}</div><div id="bfb"></div>`;
    };
    const hit = (ok, why, cite) => {
      D.answer(ok);
      if (ok) { st.hp = Math.max(0, st.hp - dmg); D.addXP(30, T('Boss hit', 'বসে আঘাত')); const f = D.$('#bface'); if (f) { f.classList.remove('hit'); void f.offsetWidth; f.classList.add('hit'); } }
      else st.hearts--;
      D.setQuest(sub.id, 'p3', 100 - st.hp);
      if (st.hp <= 0.01) st.won = true;
      if (st.hearts <= 0) st.lost = true;
      D.refreshHUD();
      return `<div class="feedback ${ok ? 'ok' : 'no'}">${D.icon(ok ? 'checkCircle' : 'xCircle', 18)}<b>${ok ? T('Direct hit.', 'সফল আঘাত।') : T('Not this time. You lose a heart.', 'এবার হয়নি। একটি হৃদয় হারালে।')}</b> ${esc(tx(why))} ${cite ? `<button class="btn sm ghost" data-src="${cite}">${D.icon('bookOpen', 14)} ${T('Source', 'উৎস')}</button>` : ''}</div>`;
    };
    const end = () => {
      if (st.won) {
        D.setQuest(sub.id, 'p3', 100); D.addXP(120, T('Boss defeated', 'বস পরাজিত')); D.addGems(25);
        D.award('boss-' + sub.id, { en: 'Boss Slayer: ' + B.name.en, bn: 'বস জয়ী: ' + B.name.bn }, '');
        D.confetti(); D.log('game.boss_defeated', sub.id);
        frame(`<div style="text-align:center;padding:20px"><div class="ic-box lg" style="margin:0 auto 12px">${D.icon('trophy', 26)}</div><h2>${T('Victory!', 'বিজয়!')}</h2><p class="muted">${esc(tx(B.name))} ${T('defeated with', 'পরাজিত , ')} ${D.n(st.hearts)} ${T('heart(s) left. You applied classroom science to a real Bangladeshi problem.', 'টি হৃদয় বাকি। ক্লাসের বিজ্ঞান বাস্তব সমস্যায় প্রয়োগ করলে।')}</p><div class="row" style="justify-content:center"><button class="btn primary" id="replay">${T('Replay', 'আবার খেলো')}</button><button class="btn gold" id="tocoop">${T('Part 4: Co-op League', 'পর্ব ৪: কো-অপ লিগ')}</button></div></div>`);
        D.$('#replay').onclick = () => D.GAME.boss(el, sub);
        D.$('#tocoop').onclick = () => { D.W.p = '4'; D.setParams({ p: '4' }); D.refreshHUD(); D.renderStage(); };
      } else {
        frame(`<div style="text-align:center;padding:20px"><div class="ic-box lg gold" style="margin:0 auto 12px">${D.icon('shield', 26)}</div><h3>${T('Retreat & regroup', 'পিছু হটো ও প্রস্তুত হও')}</h3><p class="muted">${T('Out of hearts. Review the cited sources, practise in Part 2, then try again, bosses keep your damage progress.', 'হৃদয় শেষ। উৎস দেখে পর্ব ২-এ অনুশীলন করো, তারপর আবার চেষ্টা করো।')}</p><button class="btn primary" id="replay">${T('Try again', 'আবার চেষ্টা')}</button></div>`);
        D.$('#replay').onclick = () => D.GAME.boss(el, sub);
      }
    };
    const bindSrc = () => D.$$('[data-src]', el).forEach((b) => (b.onclick = () => showSource(b.dataset.src)));

    if (sub.id === 'ict') {
      const drawCode = (msg) => {
        frame(`<div class="small muted" style="margin-bottom:6px">${T('Bugs fixed', 'বাগ ঠিক')}: ${D.n(st.fixed.size)}/${D.n(total)} · ${T('click a line you think is broken', 'ভাঙা মনে হওয়া লাইনে ক্লিক করো')}</div>
          <div class="codebox" role="list">${B.code.map((l, i) => `<div class="ln ${st.fixed.has(i) ? 'fixed' : st.sel === i ? 'bug' : ''}" data-line="${i}" role="listitem" tabindex="0"><i>${i + 1}</i><code>${esc(st.fixed.has(i) ? B.bugs[i].o[B.bugs[i].a] : l)}</code></div>`).join('')}</div>
          <div id="fixer" style="margin-top:10px"></div>`);
        if (msg) D.$('#bfb').innerHTML = msg;
        bindSrc();
        D.$$('[data-line]', el).forEach((ln) => {
          const act = () => {
            const i = +ln.dataset.line;
            if (st.fixed.has(i)) return;
            if (!B.bugs[i]) { D.$('#bfb').innerHTML = `<div class="feedback">${T('Line', 'লাইন')} ${D.n(i + 1)} ${T('looks fine. Keep scanning, check loop ranges, colons and data types.', 'ঠিক আছে। লুপের রেঞ্জ, কোলন ও ডেটা টাইপ দেখো।')}</div>`; return; }
            st.sel = i;
            const bug = B.bugs[i];
            const ord = order(bug.o.length, i + 11);
            drawCode();
            D.$('#fixer').innerHTML = `<div class="small" style="font-weight:700;margin-bottom:6px">${T('Choose the fix for line', 'লাইনের সমাধান বেছে নাও')} ${D.n(i + 1)}</div><div class="opts">${ord.map((k, j) => `<button class="opt mono" data-fix="${k}"><span class="k">${'ABC'[j]}</span><span>${esc(bug.o[k])}</span></button>`).join('')}</div>`;
            D.$$('[data-fix]', el).forEach((b) => (b.onclick = () => {
              const ok = +b.dataset.fix === bug.a;
              const m = hit(ok, bug.why, bug.cite);
              if (ok) st.fixed.add(i);
              st.sel = null;
              if (st.won || st.lost) return end();
              drawCode(m);
            }));
          };
          ln.onclick = act;
          ln.onkeydown = (e) => { if (e.key === 'Enter') act(); };
        });
      };
      drawCode();
      return;
    }

    const drawStage = (msg) => {
      const s = B.stages[st.stage];
      const body = `<div class="small muted" style="margin-bottom:6px">${T('Stage', 'ধাপ')} ${D.n(st.stage + 1)}/${D.n(total)}</div>
        <div style="font-size:16px;font-weight:700;margin-bottom:10px">${esc(tx(s.q))}</div>
        ${s.o ? `<div class="opts">${order(s.o.length, st.stage + 5).map((k, i) => `<button class="opt" data-k="${k}"><span class="k">${'ABCD'[i]}</span><span>${esc(opt(s.o[k]))}</span></button>`).join('')}</div>`
          : `<form class="row nowrap" id="numf" style="gap:8px"><input type="text" inputmode="decimal" id="numv" placeholder="${T('Your answer', 'তোমার উত্তর')}" aria-label="answer"><span class="chip">${esc(s.unit || '')}</span><button class="btn primary" type="submit">${T('Strike', 'আঘাত')}</button></form>`}`;
      frame(body);
      if (msg) D.$('#bfb').innerHTML = msg;
      bindSrc();
      const after = (ok) => {
        const m = hit(ok, s.why, s.cite);
        if (ok) st.stage++;
        if (st.won || st.lost) return end();
        drawStage(m);
      };
      if (s.o) D.$$('[data-k]', el).forEach((b) => (b.onclick = () => after(+b.dataset.k === s.a)));
      else {
        D.$('#numf').onsubmit = (e) => { e.preventDefault(); const v = D.parseNum(D.$('#numv').value); if (isNaN(v)) return; after(Math.abs(v - s.num) <= s.tol); };
        setTimeout(() => { const i = D.$('#numv'); if (i) i.focus(); }, 30);
      }
    };
    drawStage();
  };

  /* ===================== Part 4: Peer Co-Op & Leaderboard ===================== */
  D.GAME.coop = (el, sub) => {
    const st = { view: 'district', goal: 500, team: 312 + (D.state.game.coop || 0), round: null };
    const draw = () => {
      const lb = D.LEADERBOARD.map((t) => Object.assign({}, t, { xp: t.mine ? t.xp + (D.state.game.coop || 0) * 40 : t.xp })).sort((a, b) => b.xp - a.xp);
      el.innerHTML = head(4, T('Co-op league', 'কো-অপ লিগ'), T('Mixed teams connect urban, rural, polytechnic and madrasah learners. Teams with 3+ institution types earn a +10% bridge bonus.', 'মিশ্র দলে শহর, গ্রাম, পলিটেকনিক ও মাদ্রাসার শিক্ষার্থী। ৩+ ধরনের প্রতিষ্ঠানের দলে +১০% সেতু বোনাস।'), D.quest(sub.id).p4) + `
        <div class="grid g2" style="align-items:start">
          <div class="card flat tint">
            <div class="row between"><b>Rangpur Rockets</b><span class="chip em">+10% ${T('bridge bonus', 'সেতু বোনাস')}</span></div>
            <div class="col" style="gap:6px;margin-top:10px">${D.TEAM.map((m) => `<div class="row between small"><span><b>${esc(m.n)}</b> <span class="muted">· ${esc(tx(m.t))}</span></span><span class="muted">${D.n(m.xp)}</span></div>`).join('')}</div>
            <hr>
            <div class="small"><b>${T('Weekly co-op mission', 'সাপ্তাহিক কো-অপ মিশন')}:</b> ${T('solve', 'সমাধান')} ${D.n(st.goal)} ${T('questions together vs Sylhet Tea-Garden Coders', 'টি প্রশ্ন একসাথে, প্রতিপক্ষ সিলেট টি-গার্ডেন কোডার্স')}</div>
            <div class="row nowrap small" style="margin-top:8px;gap:8px"><span style="width:70px">Rangpur</span>${D.bar((st.team / st.goal) * 100)}<span class="muted">${D.n(st.team)}/${D.n(st.goal)}</span></div>
            <div class="row nowrap small" style="margin-top:6px;gap:8px"><span style="width:70px">Sylhet</span>${D.bar((338 / st.goal) * 100, 'gold')}<span class="muted">${D.n(338)}/${D.n(st.goal)}</span></div>
            <div id="round" style="margin-top:12px"></div>
            <button class="btn primary" id="contrib" style="margin-top:8px">${T('Contribute a 3-question co-op round', '৩ প্রশ্নের কো-অপ রাউন্ডে অবদান রাখো')}</button>
          </div>
          <div>
            <div class="row between" style="margin-bottom:8px"><div class="tabs"><button class="tab ${st.view === 'district' ? 'active' : ''}" data-v="district">${T('District teams', 'জেলা দল')}</button><button class="tab ${st.view === 'type' ? 'active' : ''}" data-v="type">${T('By institution type', 'প্রতিষ্ঠান অনুযায়ী')}</button></div>${D.demoTag()}</div>
            ${st.view === 'district' ? `<div class="table-wrap"><table class="t"><thead><tr><th>#</th><th>${T('Team', 'দল')}</th><th>${T('District', 'জেলা')}</th><th class="num">XP</th></tr></thead><tbody>${lb.map((t, i) => `<tr style="${t.mine ? 'background:var(--em-soft)' : ''}"><td>${D.n(i + 1)}</td><td><b>${esc(t.name)}</b><div class="small muted">${esc(tx(t.type))}</div></td><td>${esc(t.district)}</td><td class="num">${D.n(t.xp)}</td></tr>`).join('')}</tbody></table></div>`
            : `<div class="col" style="gap:10px">${D.ADMIN.cohorts.map((c) => `<div><div class="row between small"><b>${esc(c.g)}</b><span class="muted">${T('completion', 'সম্পন্ন')} ${D.n(c.completion)}%</span></div>${D.bar(c.completion)}</div>`).join('')}<p class="small muted">${T('Equity view: the league highlights char/haor and madrasah teams so their gains are visible, not hidden behind urban averages.', 'সমতা দৃষ্টি: চর/হাওর ও মাদ্রাসা দলের অগ্রগতি আলাদা দেখানো হয়।')}</p></div>`}
          </div>
        </div>`;
      D.$$('[data-v]', el).forEach((b) => (b.onclick = () => { st.view = b.dataset.v; draw(); }));
      D.$('#contrib').onclick = () => startRound();
    };
    const startRound = () => {
      const pool = Object.keys(D.PRACTICE).flatMap((s) => D.PRACTICE[s].map((q, i) => ({ q, s, i })));
      const qs = [0, 1, 2].map(() => pool[Math.floor(Math.random() * pool.length)]);
      let i = 0, right = 0;
      const box = () => D.$('#round');
      const ask = () => {
        if (i >= 3) {
          D.state.game.coop = (D.state.game.coop || 0) + right; D.save();
          st.team = Math.min(st.goal, st.team + right * 4);
          D.addXP(right * 12 * 1.1, T('Co-op (+10% bridge)', 'কো-অপ (+১০%)'));
          D.setQuest(sub.id, 'p4', Math.min(100, D.quest(sub.id).p4 + 20));
          if (D.quest(sub.id).p4 >= 100) D.award('coop-' + sub.id, { en: 'Bridge Builder', bn: 'সেতু নির্মাতা' }, '');
          D.log('game.coop_round', right + '/3');
          D.toast(`${T('Team progress', 'দলের অগ্রগতি')} +${D.n(right * 4)}`);
          draw(); return;
        }
        const { q, s } = qs[i];
        const ord = order(q.o.length, i + 21);
        box().innerHTML = `<div class="small muted">${D.icon(D.subject(s).icon, 14)} ${esc(tx(D.subject(s).name))} · ${D.n(i + 1)}/3</div><div style="font-weight:700;margin:6px 0">${esc(tx(q.q))}</div><div class="opts">${ord.map((k, j) => `<button class="opt" data-k="${k}"><span class="k">${'ABCD'[j]}</span><span>${esc(opt(q.o[k]))}</span></button>`).join('')}</div>`;
        D.$$('[data-k]', box()).forEach((b) => (b.onclick = () => { const ok = +b.dataset.k === q.a; D.answer(ok); if (ok) right++; b.classList.add(ok ? 'right' : 'wrong'); setTimeout(() => { i++; ask(); }, 450); }));
      };
      D.$('#contrib').style.display = 'none';
      ask();
    };
    draw();
  };
})();

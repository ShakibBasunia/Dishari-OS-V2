/* Dishari OS, Part 1: Concept Discovery Sandboxes (one per subject) */
(function () {
  'use strict';
  const D = window.D;
  const { T, esc } = D;
  D.LABS = {};

  const head = (title, sub, pct) => `<div style="margin-bottom:20px"><div class="row between"><div class="eyebrow">${T('Part 1 · Concept sandbox', 'পর্ব ১ · ধারণা স্যান্ডবক্স')}</div><span class="small ${pct >= 100 ? 'ok' : 'muted'}" id="lab-pct">${D.n(Math.round(pct))}% ${T('complete', 'সম্পন্ন')}</span></div><h3 style="margin:8px 0 4px;font-size:18px">${title}</h3><p class="small muted" style="margin:0">${sub}</p></div>`;
  const setPct = (s, pct) => { D.setQuest(s, 'p1', pct); const c = D.$('#lab-pct'); if (c) { const v = D.quest(s).p1; c.textContent = D.n(Math.round(v)) + '% ' + T('complete', 'সম্পন্ন'); c.className = 'small ' + (v >= 100 ? 'ok' : 'muted'); } D.refreshHUD(); };

  /* Drag-and-drop with tap fallback (works on touch screens) */
  function dnd(root, onDrop) {
    let sel = null;
    D.$$('.dragchip', root).forEach((c) => {
      c.draggable = true;
      c.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', c.dataset.id); });
      c.addEventListener('click', () => { D.$$('.dragchip', root).forEach((x) => x.classList.remove('sel')); sel = c.dataset.id; c.classList.add('sel'); });
      c.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.click(); } });
      c.tabIndex = 0;
    });
    D.$$('.dropzone', root).forEach((z) => {
      z.addEventListener('dragover', (e) => { e.preventDefault(); z.classList.add('over'); });
      z.addEventListener('dragleave', () => z.classList.remove('over'));
      z.addEventListener('drop', (e) => { e.preventDefault(); z.classList.remove('over'); onDrop(e.dataTransfer.getData('text/plain'), z); });
      z.addEventListener('click', () => { if (sel) { onDrop(sel, z); sel = null; D.$$('.dragchip', root).forEach((x) => x.classList.remove('sel')); } });
      z.tabIndex = 0;
      z.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && sel) { e.preventDefault(); z.click(); } });
    });
  }

  /* ===================== Biology: cell organelle assembly ===================== */
  const ORG = [
    { id: 'nucleus', n: { en: 'Nucleus', bn: 'নিউক্লিয়াস' }, f: { en: 'Stores DNA and controls the cell', bn: 'DNA ধারণ ও কোষ নিয়ন্ত্রণ' }, x: 200, y: 130, r: 38, col: '#7c6cf0', why: { en: 'The nucleus holds the genetic instructions and directs protein synthesis.', bn: 'নিউক্লিয়াস জিনগত নির্দেশ ধারণ করে ও প্রোটিন সংশ্লেষণ নিয়ন্ত্রণ করে।' } },
    { id: 'mito', n: { en: 'Mitochondrion', bn: 'মাইটোকন্ড্রিয়া' }, f: { en: 'Aerobic respiration → most ATP', bn: 'সবাত শ্বসন → বেশিরভাগ ATP' }, x: 312, y: 92, r: 22, col: '#f0883e', why: { en: 'Cristae give a large surface for respiration enzymes; muscle cells have many.', bn: 'ক্রিস্টি শ্বসন এনজাইমের জন্য বড় তল দেয়; পেশিকোষে অনেক থাকে।' } },
    { id: 'ribo', n: { en: 'Ribosome', bn: 'রাইবোজোম' }, f: { en: 'Builds proteins from amino acids', bn: 'অ্যামিনো অ্যাসিড থেকে প্রোটিন তৈরি' }, x: 120, y: 205, r: 10, col: '#e5534b', why: { en: 'Ribosomes read mRNA and join amino acids into proteins.', bn: 'রাইবোজোম mRNA পড়ে অ্যামিনো অ্যাসিড জুড়ে প্রোটিন বানায়।' } },
    { id: 'golgi', n: { en: 'Golgi apparatus', bn: 'গলজি বস্তু' }, f: { en: 'Sorts & packages proteins into vesicles', bn: 'প্রোটিন বাছাই ও ভেসিকলে প্যাকেট' }, x: 300, y: 200, r: 24, col: '#2f9e8f', why: { en: 'The cell\'s "post office", modifies and ships proteins and lipids.', bn: 'কোষের "ডাকঘর", প্রোটিন ও লিপিড পরিবর্তন ও প্রেরণ করে।' } },
    { id: 'lyso', n: { en: 'Lysosome', bn: 'লাইসোজোম' }, f: { en: 'Digests waste & pathogens with enzymes', bn: 'এনজাইমে বর্জ্য ও জীবাণু হজম' }, x: 95, y: 110, r: 14, col: '#c9a227', why: { en: 'Lysosomes contain digestive enzymes, the cell\'s recycling centre.', bn: 'লাইসোজোমে পাচক এনজাইম, কোষের পুনর্ব্যবহার কেন্দ্র।' } },
    { id: 'rer', n: { en: 'Rough ER', bn: 'অমসৃণ ER' }, f: { en: 'Ribosome-studded; makes export proteins', bn: 'রাইবোজোমযুক্ত; রপ্তানি প্রোটিন তৈরি' }, x: 200, y: 222, r: 20, col: '#4c8ed9', why: { en: 'Rough ER folds and modifies proteins made by its attached ribosomes.', bn: 'অমসৃণ ER সংযুক্ত রাইবোজোমের প্রোটিন ভাঁজ ও পরিবর্তন করে।' } }
  ];
  D.LABS.bio = (el) => {
    const placed = new Set();
    const order = [3, 0, 5, 1, 4, 2].map((i) => ORG[i]);
    const draw = () => {
      el.innerHTML = head('' + T('Build-a-Cell: organelle assembly puzzle', 'কোষ গড়ো: অঙ্গাণু সংযোজন ধাঁধা'), T('Drag each organelle onto the job it performs (or tap a chip, then tap a slot). Correct placements light up inside the cell.', 'প্রতিটি অঙ্গাণুকে তার কাজের ঘরে টেনে নাও (বা চিপ ট্যাপ করে ঘর ট্যাপ করো)।'), D.quest('bio').p1) + `
        <div class="grid g2" style="align-items:start">
          <div>
            <svg viewBox="0 0 400 300" width="100%" role="img" aria-label="${T('Animal cell diagram', 'প্রাণীকোষের চিত্র')}" style="max-height:290px">
              <ellipse cx="200" cy="150" rx="185" ry="135" style="fill:color-mix(in srgb, var(--em) 8%, transparent);stroke:var(--em);stroke-width:3"/>
              <text x="200" y="295" text-anchor="middle" style="font-size:11px;fill:var(--muted)">${T('Cell membrane', 'কোষঝিল্লি')}</text>
              ${ORG.map((o) => placed.has(o.id)
                ? `<g><circle cx="${o.x}" cy="${o.y}" r="${o.r}" style="fill:${o.col};opacity:.85"/>${o.id === 'mito' ? `<path d="M${o.x - 14} ${o.y} q4 -8 8 0 t8 0 t8 0" style="fill:none;stroke:#fff;stroke-width:2"/>` : ''}<text x="${o.x}" y="${o.y + o.r + 13}" text-anchor="middle" style="font-size:11px;font-weight:700;fill:var(--text)">${esc(D.tx(o.n))}</text></g>`
                : `<circle cx="${o.x}" cy="${o.y}" r="${o.r}" style="fill:none;stroke:var(--muted);stroke-dasharray:4 4"/><text x="${o.x}" y="${o.y + 4}" text-anchor="middle" style="font-size:12px;fill:var(--muted)">?</text>`).join('')}
            </svg>
            <div class="row" style="gap:6px;margin-top:6px">${ORG.map((o) => `<span class="dragchip ${placed.has(o.id) ? 'used' : ''}" data-id="${o.id}" role="button" aria-label="${esc(D.tx(o.n))}">${esc(D.tx(o.n))}</span>`).join('')}</div>
          </div>
          <div class="col" style="gap:8px">${order.map((o) => `<div><div class="small" style="font-weight:700;margin-bottom:4px">${esc(D.tx(o.f))}</div><div class="dropzone ${placed.has(o.id) ? 'ok' : ''}" data-slot="${o.id}">${placed.has(o.id) ? D.icon('check', 16) + esc(D.tx(o.n)) : T('Drop organelle here', 'এখানে রাখো')}</div></div>`).join('')}</div>
        </div>
        <div id="bio-fb" class="feedback" style="${placed.size ? '' : 'display:none'}"></div>`;
      dnd(el, (id, zone) => {
        if (placed.has(id)) return;
        const o = ORG.find((x) => x.id === id);
        if (zone.dataset.slot === id) {
          placed.add(id); D.answer(true); D.addXP(10, D.tx(o.n));
          setPct('bio', Math.max(D.quest('bio').p1, (placed.size / ORG.length) * 100));
          draw();
          const fb = D.$('#bio-fb'); fb.style.display = ''; fb.className = 'feedback ok'; fb.innerHTML = `<b>${esc(D.tx(o.n))}</b>: ${esc(D.tx(o.why))}`;
          if (placed.size === ORG.length) { D.award('cell-architect', { en: 'Cell Architect', bn: 'কোষ স্থপতি' }, ''); D.addGems(10); D.confetti(); fb.innerHTML += `<br>${T('Cell complete! Now try Part 2 or ask the tutor why muscle cells need more mitochondria.', 'কোষ সম্পূর্ণ! এবার পর্ব ২ খেলো বা টিউটরকে জিজ্ঞেস করো।')}`; }
        } else {
          D.answer(false);
          zone.classList.add('bad'); setTimeout(() => zone.classList.remove('bad'), 400);
          const fb = D.$('#bio-fb'); fb.style.display = ''; fb.className = 'feedback no'; fb.innerHTML = `${esc(D.tx(o.n))} ${T('does not do that job. Hint:', 'এই কাজ করে না। ইঙ্গিত:')} ${esc(D.tx(o.f))}.`;
        }
      });
    };
    draw();
  };

  /* ===================== Chemistry: equation balancer ===================== */
  const RXN = [
    { id: 'h2o', name: 'H₂ + O₂ → H₂O', l: [{ f: 'H₂', a: { H: 2 } }, { f: 'O₂', a: { O: 2 } }], r: [{ f: 'H₂O', a: { H: 2, O: 1 } }], ans: [2, 1, 2] },
    { id: 'ch4', name: 'CH₄ + O₂ → CO₂ + H₂O', l: [{ f: 'CH₄', a: { C: 1, H: 4 } }, { f: 'O₂', a: { O: 2 } }], r: [{ f: 'CO₂', a: { C: 1, O: 2 } }, { f: 'H₂O', a: { H: 2, O: 1 } }], ans: [1, 2, 1, 2] },
    { id: 'fe', name: 'Fe + O₂ → Fe₂O₃', l: [{ f: 'Fe', a: { Fe: 1 } }, { f: 'O₂', a: { O: 2 } }], r: [{ f: 'Fe₂O₃', a: { Fe: 2, O: 3 } }], ans: [4, 3, 2] },
    { id: 'neut', name: 'NaOH + H₂SO₄ → Na₂SO₄ + H₂O', l: [{ f: 'NaOH', a: { Na: 1, O: 1, H: 1 } }, { f: 'H₂SO₄', a: { H: 2, S: 1, O: 4 } }], r: [{ f: 'Na₂SO₄', a: { Na: 2, S: 1, O: 4 } }, { f: 'H₂O', a: { H: 2, O: 1 } }], ans: [2, 1, 1, 2] }
  ];
  const ATOM_COL = { H: '#e6edf3', O: '#e5534b', C: '#57606a', Fe: '#c9a227', Na: '#a371f7', S: '#e3b341', Cl: '#3fb950' };
  D.LABS.chem = (el) => {
    let ri = 0;
    const solved = new Set();
    let co = RXN[0].l.concat(RXN[0].r).map(() => 1);
    const count = (side, coefs) => { const t = {}; side.forEach((m, i) => Object.entries(m.a).forEach(([k, v]) => (t[k] = (t[k] || 0) + v * coefs[i]))); return t; };
    const draw = () => {
      const R = RXN[ri];
      const nl = R.l.length;
      const L = count(R.l, co.slice(0, nl)), Rt = count(R.r, co.slice(nl));
      const els = Array.from(new Set(Object.keys(L).concat(Object.keys(Rt))));
      const balanced = els.every((e) => L[e] === Rt[e]);
      const species = R.l.concat(R.r);
      const mol = (m, c) => `<div style="display:flex;flex-wrap:wrap;gap:3px;justify-content:center;max-width:120px">${Array.from({ length: Math.min(c, 6) }).map(() => `<span style="display:inline-flex;gap:1px;padding:2px;border:1px solid var(--line);border-radius:8px">${Object.entries(m.a).flatMap(([k, v]) => Array.from({ length: v }).map(() => `<i title="${k}" style="width:9px;height:9px;border-radius:50%;background:${ATOM_COL[k] || '#999'};display:inline-block;border:1px solid rgba(0,0,0,.25)"></i>`)).join('')}</span>`).join('')}</div>`;
      el.innerHTML = head('' + T('Equation Balancer Sandbox', 'সমীকরণ সমতা স্যান্ডবক্স'), T('Change only the coefficients (big numbers). Watch atoms on both sides, matter is conserved.', 'শুধু সহগ বদলাও। উভয় পাশের পরমাণু দেখো, ভর সংরক্ষিত।'), D.quest('chem').p1) + `
        <div class="tabs" style="margin-bottom:12px">${RXN.map((r, i) => `<button class="tab ${i === ri ? 'active' : ''}" data-r="${i}">${solved.has(r.id) ? D.icon('check', 16) : ''}${esc(r.name)}</button>`).join('')}</div>
        <div class="row" style="justify-content:center;gap:10px;align-items:flex-start">
          ${species.map((m, i) => `${i === nl ? '<div class="formula" style="align-self:center">→</div>' : i > 0 ? '<div class="formula" style="align-self:center">+</div>' : ''}
            <div class="col" style="align-items:center;gap:6px"><div class="stepper"><button data-dec="${i}" aria-label="decrease">−</button><span>${D.n(co[i])}</span><button data-inc="${i}" aria-label="increase">+</button></div><div class="formula">${esc(m.f)}</div>${D.state.lite ? '' : mol(m, co[i])}</div>`).join('')}
        </div>
        <div class="table-wrap" style="margin-top:14px"><table class="t"><thead><tr><th>${T('Element', 'মৌল')}</th><th class="num">${T('Left', 'বাম')}</th><th class="num">${T('Right', 'ডান')}</th><th>${T('Status', 'অবস্থা')}</th></tr></thead><tbody>
          ${els.map((e) => `<tr><td><i style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${ATOM_COL[e]};margin-right:6px"></i>${e}</td><td class="num">${D.n(L[e] || 0)}</td><td class="num">${D.n(Rt[e] || 0)}</td><td>${L[e] === Rt[e] ? '<span class="ok">' + D.icon('check', 15) + '</span>' : '<span class="danger">≠</span>'}</td></tr>`).join('')}
        </tbody></table></div>
        <div class="feedback ${balanced ? 'ok' : ''}" style="margin-top:10px">${balanced ? `${T('Balanced!', 'সমতাকৃত!')} ${species.map((m, i) => (co[i] > 1 ? co[i] : '') + m.f).slice(0, nl).join(' + ')} → ${species.map((m, i) => (co[i] > 1 ? co[i] : '') + m.f).slice(nl).join(' + ')}${co.join() !== R.ans.join() ? T('(valid, but simplest whole-number ratio is', '(সঠিক, তবে সরলতম অনুপাত') + ' ' + R.ans.join(':') + ')' : ''}` : `${T('Not balanced yet. Tip: balance the element that appears in the fewest formulas first; leave O and H for last.', 'এখনও সমান নয়। টিপ: যে মৌল সবচেয়ে কম সংকেতে আছে তা আগে; O ও H শেষে।')}`}</div>
        <div class="card flat tint" style="margin-top:12px;padding:12px"><b>${T('Bonding corner', 'বন্ধন কোণ')}</b><div class="small muted" style="margin-top:4px">${T('Ionic: Na gives 1 electron to Cl → Na⁺ Cl⁻ (transfer). Covalent: O shares one electron pair with each H in H₂O (sharing). Coefficients change how many molecules; subscripts are fixed by bonding.', 'আয়নিক: Na একটি ইলেকট্রন Cl-কে দেয় → Na⁺ Cl⁻। সমযোজী: H₂O-তে O প্রতিটি H-এর সাথে এক জোড়া শেয়ার করে। সহগ অণুর সংখ্যা বদলায়; পাদাঙ্ক বন্ধনে নির্ধারিত।')}</div></div>`;
      D.$$('[data-r]', el).forEach((b) => (b.onclick = () => { ri = +b.dataset.r; co = RXN[ri].l.concat(RXN[ri].r).map(() => 1); draw(); }));
      D.$$('[data-inc]', el).forEach((b) => (b.onclick = () => { co[+b.dataset.inc] = Math.min(12, co[+b.dataset.inc] + 1); check(); }));
      D.$$('[data-dec]', el).forEach((b) => (b.onclick = () => { co[+b.dataset.dec] = Math.max(1, co[+b.dataset.dec] - 1); check(); }));
    };
    const check = () => {
      const R = RXN[ri];
      const nl = R.l.length;
      const L = count(R.l, co.slice(0, nl)), Rt = count(R.r, co.slice(nl));
      const ok = Object.keys(Object.assign({}, L, Rt)).every((e) => L[e] === Rt[e]);
      if (ok && !solved.has(R.id)) {
        solved.add(R.id); D.answer(true); D.addXP(25, T('Balanced', 'সমতাকৃত'));
        setPct('chem', Math.max(D.quest('chem').p1, (solved.size / RXN.length) * 100));
        if (solved.size === RXN.length) { D.award('balancer', { en: 'Equation Balancer', bn: 'সমীকরণ সমতাকারী' }, ''); D.confetti(); }
      }
      draw();
    };
    draw();
  };

  /* ===================== Mathematics: function curve + Riemann lab ===================== */
  D.LABS.math = (el) => {
    const st = { a: 1, b: 0, c: 1, n: 4, rule: 'left' };
    const missions = [
      { id: 'down', t: { en: 'Make the parabola open downward with its vertex at x = 2', bn: 'পরাবৃত্তকে নিচে খোলা করো, শীর্ষবিন্দু x = 2-এ' }, ok: () => st.a < 0 && Math.abs(-st.b / (2 * st.a) - 2) < 0.06 },
      { id: 'err', t: { en: 'Get the Riemann estimate within 1% of the exact area', bn: 'রিমান আসন্ন মান প্রকৃত ক্ষেত্রফলের ১%-এর মধ্যে আনো' }, ok: () => { const ex = exact(); return Math.abs(ex) > 0.01 && Math.abs(riemann() - ex) / Math.abs(ex) < 0.01; } },
      { id: 'area', t: { en: 'Find a curve whose exact area on [0, 2] is 14/3 ≈ 4.67', bn: '[0, 2]-এ প্রকৃত ক্ষেত্রফল ১৪/৩ ≈ ৪.৬৭ এমন বক্ররেখা খোঁজো' }, ok: () => Math.abs(exact() - 14 / 3) < 0.02 }
    ];
    const done = new Set();
    const f = (x) => st.a * x * x + st.b * x + st.c;
    const exact = () => st.a * 8 / 3 + st.b * 2 + st.c * 2; // ∫0^2
    const riemann = () => { const dx = 2 / st.n; let s = 0; for (let i = 0; i < st.n; i++) { const x = st.rule === 'left' ? i * dx : st.rule === 'right' ? (i + 1) * dx : (i + 0.5) * dx; s += f(x) * dx; } return s; };
    const plot = () => {
      const Wd = 420, H = 260, xmin = -1, xmax = 4;
      let ys = []; for (let i = 0; i <= 100; i++) ys.push(f(xmin + ((xmax - xmin) * i) / 100));
      const ymin = Math.min(-1, ...ys), ymax = Math.max(5, ...ys);
      const X = (x) => 30 + ((Wd - 40) * (x - xmin)) / (xmax - xmin), Y = (y) => 10 + ((H - 30) * (ymax - y)) / (ymax - ymin);
      let g = `<line x1="${X(xmin)}" x2="${X(xmax)}" y1="${Y(0)}" y2="${Y(0)}" style="stroke:var(--line2)"/><line x1="${X(0)}" x2="${X(0)}" y1="${Y(ymin)}" y2="${Y(ymax)}" style="stroke:var(--line2)"/>`;
      for (let x = -1; x <= 4; x++) g += `<text x="${X(x)}" y="${Y(0) + 13}" text-anchor="middle">${D.n(x)}</text>`;
      const dx = 2 / st.n;
      for (let i = 0; i < st.n; i++) { const x0 = i * dx, xs = st.rule === 'left' ? x0 : st.rule === 'right' ? x0 + dx : x0 + dx / 2, h = f(xs); g += `<rect x="${X(x0)}" y="${Math.min(Y(h), Y(0))}" width="${Math.max(0.5, X(x0 + dx) - X(x0))}" height="${Math.abs(Y(h) - Y(0))}" style="fill:color-mix(in srgb, var(--gold) 25%, transparent);stroke:var(--gold);stroke-width:1"/>`; }
      g += `<path d="${ys.map((y, i) => (i ? 'L' : 'M') + X(xmin + ((xmax - xmin) * i) / 100).toFixed(1) + ' ' + Y(y).toFixed(1)).join(' ')}" style="fill:none;stroke:var(--em);stroke-width:2.5"/>`;
      if (st.a !== 0) { const vx = -st.b / (2 * st.a); if (vx > xmin && vx < xmax) g += `<circle cx="${X(vx)}" cy="${Y(f(vx))}" r="5" style="fill:var(--danger)"/><text x="${X(vx) + 8}" y="${Y(f(vx)) - 6}" style="fill:var(--danger);font-weight:700">${T('vertex', 'শীর্ষ')} (${vx.toFixed(2)}, ${f(vx).toFixed(2)})</text>`; }
      return `<svg class="chart" viewBox="0 0 ${Wd} ${H}" width="100%" role="img" aria-label="Function plot">${g}</svg>`;
    };
    const dyn = () => {
      const ex = exact(), rs = riemann(), err = Math.abs(ex) > 1e-9 ? Math.abs(rs - ex) / Math.abs(ex) * 100 : 0;
      const disc = st.b * st.b - 4 * st.a * st.c;
      D.$('#m-plot', el).innerHTML = plot();
      D.$('#m-formula', el).textContent = `y = ${st.a.toFixed(2)}x² ${st.b >= 0 ? '+' : '−'} ${Math.abs(st.b).toFixed(2)}x ${st.c >= 0 ? '+' : '−'} ${Math.abs(st.c).toFixed(2)}`;
      ['a', 'b', 'c'].forEach((k) => (D.$('#v-' + k, el).textContent = st[k].toFixed(2)));
      D.$('#v-n', el).textContent = D.n(st.n);
      D.$('#m-table', el).innerHTML = `
              <tr><td>${T('Riemann estimate', 'রিমান আসন্ন মান')}</td><td class="num"><b>${rs.toFixed(4)}</b></td></tr>
              <tr><td>${T('Exact ∫₀² f(x) dx', 'প্রকৃত ∫₀² f(x) dx')}</td><td class="num"><b>${ex.toFixed(4)}</b></td></tr>
              <tr><td>${T('Error', 'ত্রুটি')}</td><td class="num ${err < 1 ? 'em' : 'gold'}">${err.toFixed(2)}%</td></tr>
              <tr><td>${T('Discriminant b² − 4ac', 'নিশ্চায়ক')}</td><td class="num">${disc.toFixed(2)} → ${disc > 0 ? T('2 roots', '২টি মূল') : disc === 0 ? T('1 root', '১টি মূল') : T('no real roots', 'বাস্তব মূল নেই')}</td></tr>`;
      D.$('#m-missions', el).innerHTML = `<b>${T('Missions', 'মিশন')}</b>` + missions.map((m) => `<div class="row nowrap small"><span>${done.has(m.id) ? D.icon('check', 16) : D.icon('dot', 16)}</span><span>${esc(D.tx(m.t))}</span></div>`).join('');
      D.$$('[data-rule]', el).forEach((b) => b.classList.toggle('active', b.dataset.rule === st.rule));
    };
    const draw = () => {
      el.innerHTML = head('' + T('Function Curve & Riemann Lab', 'ফাংশন বক্ররেখা ও রিমান ল্যাব'), T('Slide a, b, c to reshape y = ax² + bx + c; slide n to fill the area under it on [0, 2] with rectangles.', 'a, b, c বদলে y = ax² + bx + c-এর আকার বদলাও; n বাড়িয়ে [0, 2]-এ ক্ষেত্রফল ভরাট করো।'), D.quest('math').p1) + `
        <div class="grid g2" style="align-items:start">
          <div><div id="m-plot"></div><div class="formula" id="m-formula" style="text-align:center;margin-top:4px"></div></div>
          <div class="col" style="gap:10px">
            ${['a', 'b', 'c'].map((k) => `<label class="field">${k} = <b id="v-${k}"></b><input type="range" min="-3" max="3" step="0.05" value="${st[k]}" data-k="${k}"></label>`).join('')}
            <label class="field">n (${T('rectangles', 'আয়তক্ষেত্র')}) = <b id="v-n"></b><input type="range" min="1" max="200" step="1" value="${st.n}" data-k="n"></label>
            <div class="tabs">${['left', 'mid', 'right'].map((r) => `<button class="tab" data-rule="${r}">${{ left: T('Left', 'বাম'), mid: T('Midpoint', 'মধ্যবিন্দু'), right: T('Right', 'ডান') }[r]}</button>`).join('')}</div>
            <div class="table-wrap"><table class="t"><tbody id="m-table"></tbody></table></div>
          </div>
        </div>
        <div class="col" id="m-missions" style="gap:6px;margin-top:12px"></div>`;
      D.$$('input[data-k]', el).forEach((inp) => (inp.oninput = () => { const k = inp.dataset.k; st[k] = k === 'n' ? +inp.value : +(+inp.value).toFixed(2); missionCheck(); dyn(); }));
      D.$$('[data-rule]', el).forEach((b) => (b.onclick = () => { st.rule = b.dataset.rule; missionCheck(); dyn(); }));
      dyn();
    };
    const missionCheck = () => {
      missions.forEach((m) => { if (!done.has(m.id) && m.ok()) { done.add(m.id); D.answer(true); D.addXP(30, T('Mission', 'মিশন')); D.toast('' + D.tx(m.t)); setPct('math', Math.max(D.quest('math').p1, (done.size / missions.length) * 100)); if (done.size === missions.length) { D.award('curve-master', { en: 'Curve Master', bn: 'বক্ররেখা বিশারদ' }, ''); D.confetti(); } } });
    };
    draw();
  };

  /* ===================== Equations: algebraic transformation puzzle ===================== */
  const PUZ = [
    { goal: 's', start: 'v² = u² + 2as', steps: [{ op: '−u²', to: 'v² − u² = 2as' }, { op: '÷2a', to: '(v² − u²) / 2a = s' }, { op: 'swap', to: 's = (v² − u²) / 2a' }] },
    { goal: 't', start: 'v = u + at', steps: [{ op: '−u', to: 'v − u = at' }, { op: '÷a', to: '(v − u) / a = t' }, { op: 'swap', to: 't = (v − u) / a' }] },
    { goal: 'a', start: 'F = ma', steps: [{ op: '÷m', to: 'F / m = a' }, { op: 'swap', to: 'a = F / m' }] },
    { goal: 'h', start: 't = √(2h / g)', steps: [{ op: '²', to: 't² = 2h / g' }, { op: '×g', to: 'gt² = 2h' }, { op: '÷2', to: 'gt² / 2 = h' }, { op: 'swap', to: 'h = gt² / 2' }] }
  ];
  const OPS = ['−u²', '+u²', '−u', '÷2a', '×2a', '÷a', '÷m', '×m', '²', '√', '×g', '÷2', 'swap'];
  D.LABS.eq = (el) => {
    let pi = 0, k = 0;
    const solved = new Set();
    const hist = [];
    const draw = () => {
      const P = PUZ[pi];
      const cur = k === 0 ? P.start : P.steps[k - 1].to;
      const fin = k >= P.steps.length;
      el.innerHTML = head('' + T('Algebraic Transformation Puzzle', 'বীজগাণিতিক রূপান্তর ধাঁধা'), T('Apply the same operation to both sides until the target variable stands alone. Every move must keep the equation true.', 'উভয় পক্ষে একই প্রক্রিয়া করো যতক্ষণ না লক্ষ্য চলক একা থাকে।'), D.quest('eq').p1) + `
        <div class="tabs" style="margin-bottom:12px">${PUZ.map((p, i) => `<button class="tab ${i === pi ? 'active' : ''}" data-p="${i}">${solved.has(i) ? D.icon('check', 16) : ''}${T('Solve for', 'আলাদা করো')} ${p.goal}</button>`).join('')}</div>
        <div class="card flat tint" style="text-align:center;padding:22px"><div class="small muted">${T('Goal: isolate', 'লক্ষ্য: আলাদা করো')} <b class="gold">${PUZ[pi].goal}</b></div><div class="formula" style="font-size:30px;margin-top:8px" aria-live="polite">${esc(cur)}</div>${fin ? `<div class="em" style="margin-top:8px;font-weight:800">${T('Solved!', 'সমাধান!')}</div>` : ''}</div>
        <div class="small muted" style="margin:12px 0 6px">${T('Apply to BOTH sides:', 'উভয় পক্ষে প্রয়োগ করো:')}</div>
        <div class="row" style="gap:6px">${OPS.map((o) => `<button class="btn sm" data-op="${esc(o)}" ${fin ? 'disabled' : ''}>${o === 'swap' ? '' + T('swap sides', 'পক্ষ বদল') : o === '²' ? T('square both', 'উভয় বর্গ') : o === '√' ? '√ ' + T('both', 'উভয়') : esc(o)}</button>`).join('')}</div>
        <div id="eq-fb" class="feedback" style="display:none"></div>
        <div style="margin-top:12px"><b class="small">${T('Your derivation', 'তোমার ধাপসমূহ')}</b><ol class="small" style="margin:6px 0 0;padding-left:20px">${[P.start].concat(P.steps.slice(0, k).map((s) => s.to)).map((s, i) => `<li>${i ? '<span class="gold">[' + esc(P.steps[i - 1].op) + ']</span> ' : ''}<span class="mono">${esc(s)}</span></li>`).join('')}</ol></div>
        <button class="btn sm ghost" id="eq-reset" style="margin-top:8px">${T('Restart puzzle', 'আবার শুরু')}</button>`;
      D.$$('[data-p]', el).forEach((b) => (b.onclick = () => { pi = +b.dataset.p; k = 0; draw(); }));
      D.$('#eq-reset').onclick = () => { k = 0; draw(); };
      D.$$('[data-op]', el).forEach((b) => (b.onclick = () => {
        const P2 = PUZ[pi];
        const fb = () => D.$('#eq-fb');
        if (b.dataset.op === P2.steps[k].op) {
          k++; D.answer(true); D.addXP(10, T('Valid step', 'সঠিক ধাপ'));
          if (k >= P2.steps.length && !solved.has(pi)) { solved.add(pi); D.addXP(20, T('Puzzle solved', 'ধাঁধা সমাধান')); setPct('eq', Math.max(D.quest('eq').p1, (solved.size / PUZ.length) * 100)); if (solved.size === PUZ.length) { D.award('rearranger', { en: 'Formula Rearranger', bn: 'সূত্র পুনর্বিন্যাসকারী' }, ''); D.confetti(); } }
          draw();
        } else {
          D.answer(false);
          const f = fb(); f.style.display = ''; f.className = 'feedback no';
          f.innerHTML = `“${esc(b.dataset.op)}” ${T('is legal algebra, but it does not move', 'বৈধ বীজগণিত, তবে এটি')} <b>${P2.goal}</b> ${T('closer to standing alone. Ask: what is being done to', 'কে একা করে না। ভাবো:')} ${P2.goal} ${T('last? Undo that first.', '-এর উপর শেষে কী করা হয়েছে? আগে সেটি বাতিল করো।')}`;
        }
      }));
    };
    draw();
  };

  /* ===================== ICT: logic gates + Python block flow ===================== */
  const GATES = { AND: (a, b) => a & b, OR: (a, b) => a | b, XOR: (a, b) => a ^ b, NAND: (a, b) => 1 - (a & b), NOR: (a, b) => 1 - (a | b) };
  const CH = [
    { id: 'alarm', t: { en: 'Smart-classroom alarm: OUT = (A AND B) OR C', bn: 'স্মার্ট-ক্লাসরুম অ্যালার্ম: OUT = (A AND B) OR C' }, fn: (a, b, c) => (a & b) | c },
    { id: 'xor', t: { en: 'Door lock: OUT = (A XOR B) AND C', bn: 'দরজার তালা: OUT = (A XOR B) AND C' }, fn: (a, b, c) => (a ^ b) & c },
    { id: 'nor', t: { en: 'Pump control: OUT = NOT(A OR B) AND C', bn: 'পাম্প নিয়ন্ত্রণ: OUT = NOT(A OR B) AND C' }, fn: (a, b, c) => (1 - (a | b)) & c }
  ];
  const BLOCKS = ['total = 0', 'for i in range(1, n + 1):', '    total += i', 'print(total)'];
  D.LABS.ict = (el) => {
    const st = { A: 1, B: 0, C: 1, g1: 'NAND', g2: 'XOR', ch: 0, built: [], pool: [2, 0, 3, 1] };
    const solved = new Set();
    const out = (a, b, c) => GATES[st.g2](GATES[st.g1](a, b), c);
    const draw = () => {
      const o = out(st.A, st.B, st.C);
      const rows = [];
      for (let i = 0; i < 8; i++) { const a = (i >> 2) & 1, b = (i >> 1) & 1, c = i & 1; rows.push({ a, b, c, o: out(a, b, c), t: CH[st.ch].fn(a, b, c) }); }
      const match = rows.every((r) => r.o === r.t);
      const pct = ((solved.size / CH.length) * 70) + (st.pyDone ? 30 : 0);
      el.innerHTML = head('' + T('Logic-Gate Builder & Python Block Flow', 'লজিক গেট বিল্ডার ও Python ব্লক'), T('Choose gates so your circuit\'s truth table matches the challenge; then assemble a Python program from blocks.', 'চ্যালেঞ্জের সত্যক সারণি মেলাতে গেট বেছে নাও; তারপর ব্লক জুড়ে Python প্রোগ্রাম বানাও।'), D.quest('ict').p1) + `
        <div class="tabs" style="margin-bottom:10px">${CH.map((c, i) => `<button class="tab ${i === st.ch ? 'active' : ''}" data-ch="${i}">${solved.has(c.id) ? D.icon('check', 16) : ''}${esc(D.tx(c.t).split(':')[0])}</button>`).join('')}</div>
        <div class="banner" style="margin-bottom:10px">${esc(D.tx(CH[st.ch].t))}</div>
        <div class="grid g2" style="align-items:start">
          <div>
            <svg viewBox="0 0 400 190" width="100%" role="img" aria-label="Circuit">
              ${['A', 'B', 'C'].map((k, i) => `<g data-in="${k}" style="cursor:pointer"><rect x="10" y="${20 + i * 55}" width="46" height="34" rx="8" style="fill:${st[k] ? 'var(--em)' : 'var(--card3)'};stroke:var(--line2)"/><text x="33" y="${42 + i * 55}" text-anchor="middle" style="font-weight:800;fill:${st[k] ? 'var(--em-ink)' : 'var(--text)'};font-size:14px">${k}=${st[k]}</text></g>`).join('')}
              <path d="M56 37 H120 V60 M56 92 H120 V80" style="fill:none;stroke:var(--muted);stroke-width:2"/>
              <rect x="120" y="45" width="80" height="50" rx="10" style="fill:var(--card2);stroke:var(--gold);stroke-width:2"/><text x="160" y="75" text-anchor="middle" style="font-weight:800;fill:var(--gold);font-size:14px">${st.g1}</text>
              <path d="M200 70 H250 V100 M56 147 H250 V125" style="fill:none;stroke:var(--muted);stroke-width:2"/>
              <rect x="250" y="88" width="80" height="50" rx="10" style="fill:var(--card2);stroke:var(--gold);stroke-width:2"/><text x="290" y="118" text-anchor="middle" style="font-weight:800;fill:var(--gold);font-size:14px">${st.g2}</text>
              <path d="M330 113 H362" style="fill:none;stroke:var(--muted);stroke-width:2"/>
              <circle cx="376" cy="113" r="14" style="fill:${o ? 'var(--gold)' : 'var(--card3)'};stroke:var(--line2)"/><text x="376" y="118" text-anchor="middle" style="font-weight:900;font-size:13px;fill:${o ? '#1a1200' : 'var(--muted)'}">${o}</text>
            </svg>
            <div class="row" style="gap:8px;margin-top:6px"><label class="field" style="flex:1">${T('Gate 1 (A, B)', 'গেট ১ (A, B)')}<select data-g="g1">${Object.keys(GATES).map((g) => `<option ${g === st.g1 ? 'selected' : ''}>${g}</option>`).join('')}</select></label><label class="field" style="flex:1">${T('Gate 2 (G1, C)', 'গেট ২ (G1, C)')}<select data-g="g2">${Object.keys(GATES).map((g) => `<option ${g === st.g2 ? 'selected' : ''}>${g}</option>`).join('')}</select></label></div>
            <div class="small muted" style="margin-top:4px">${T('Tap A, B, C to toggle inputs.', 'ইনপুট বদলাতে A, B, C ট্যাপ করো।')}</div>
          </div>
          <div class="table-wrap"><table class="t"><thead><tr><th>A</th><th>B</th><th>C</th><th>${T('Yours', 'তোমার')}</th><th>${T('Target', 'লক্ষ্য')}</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${r.a}</td><td>${r.b}</td><td>${r.c}</td><td><b>${r.o}</b></td><td>${r.t} ${r.o === r.t ? '<span class="ok">' + D.icon('check', 15) + '</span>' : '<span class="danger">' + D.icon('x', 15) + '</span>'}</td></tr>`).join('')}</tbody></table></div>
        </div>
        <div class="feedback ${match ? 'ok' : ''}">${match ? D.icon('check', 16) + T('Truth tables match, circuit verified for all 8 input combinations!', 'সত্যক সারণি মিলেছে, ৮টি সমন্বয়েই যাচাইকৃত!') : '' + T('Rows marked still differ. Think: which gate makes the first stage behave like the bracket?', 'চিহ্নিত সারি এখনও ভিন্ন। ভাবো: বন্ধনীর মতো আচরণ কোন গেট দেয়?')}</div>
        <hr>
        <b>${T('Python block flow: sum 1…n', 'Python ব্লক: ১…n যোগফল')}</b>
        <div class="grid g2" style="margin-top:8px">
          <div><div class="small muted">${T('Tap blocks in the right order', 'সঠিক ক্রমে ব্লক ট্যাপ করো')}</div><div class="col" style="gap:6px;margin-top:6px">${st.pool.map((i) => `<button class="dragchip mono" style="text-align:left;white-space:pre" data-blk="${i}" ${st.built.includes(i) ? 'disabled' : ''}>${esc(BLOCKS[i])}</button>`).join('')}</div></div>
          <div><div class="small muted">${T('Your program', 'তোমার প্রোগ্রাম')} (n = 10)</div><div class="codebox" style="margin-top:6px;min-height:120px">${st.built.map((i, j) => `<div class="ln"><i>${j + 1}</i><code>${esc(BLOCKS[i])}</code></div>`).join('') || '<div class="small muted" style="padding:10px">…</div>'}</div>
          <div class="row" style="margin-top:8px"><button class="btn sm primary" id="py-run" ${st.built.length < 4 ? 'disabled' : ''}>${T('Run', 'চালাও')}</button><button class="btn sm ghost" id="py-clear"></button></div><pre id="py-out" style="margin-top:8px;display:${st.pyOut ? 'block' : 'none'}">${esc(st.pyOut || '')}</pre></div>
        </div>`;
      D.$$('[data-in]', el).forEach((g) => (g.onclick = () => { const k = g.dataset.in; st[k] = 1 - st[k]; draw(); }));
      D.$$('[data-g]', el).forEach((s) => (s.onchange = () => { st[s.dataset.g] = s.value; verify(); draw(); }));
      D.$$('[data-ch]', el).forEach((b) => (b.onclick = () => { st.ch = +b.dataset.ch; draw(); }));
      D.$$('[data-blk]', el).forEach((b) => (b.onclick = () => { st.built.push(+b.dataset.blk); draw(); }));
      D.$('#py-clear').onclick = () => { st.built = []; st.pyOut = ''; draw(); };
      D.$('#py-run').onclick = () => {
        const seq = st.built.join('');
        if (seq === '0123') { st.pyOut = '>>> 55\n# ' + T('Correct: range(1, n + 1) includes n.', 'সঠিক: range(1, n + 1)-এ n অন্তর্ভুক্ত।'); if (!st.pyDone) { st.pyDone = true; D.answer(true); D.addXP(30, 'Python'); } }
        else if (st.built[0] !== 0 && st.built.indexOf(0) > st.built.indexOf(2)) st.pyOut = "NameError: name 'total' is not defined\n# " + T('total must be created before the loop uses it.', 'লুপের আগে total তৈরি করতে হবে।');
        else if (st.built.indexOf(3) < st.built.indexOf(2)) st.pyOut = (st.built.indexOf(3) < st.built.indexOf(0) ? "NameError: name 'total' is not defined" : '>>> 0') + '\n# ' + T('print runs before the loop finishes adding.', 'লুপ শেষের আগেই print চলে।');
        else if (st.built.indexOf(2) < st.built.indexOf(1)) st.pyOut = 'IndentationError: unexpected indent\n# ' + T('The indented line must come after the for header.', 'ইনডেন্টেড লাইন for-এর পরে আসবে।');
        else st.pyOut = '>>> ?\n# ' + T('Check the order.', 'ক্রম দেখো।');
        if (seq !== '0123') D.answer(false);
        verify(); draw();
      };
    };
    const verify = () => {
      let ok = true;
      for (let i = 0; i < 8; i++) { const a = (i >> 2) & 1, b = (i >> 1) & 1, c = i & 1; if (out(a, b, c) !== CH[st.ch].fn(a, b, c)) ok = false; }
      if (ok && !solved.has(CH[st.ch].id)) { solved.add(CH[st.ch].id); D.answer(true); D.addXP(25, T('Circuit verified', 'সার্কিট যাচাই')); }
      const pct = ((solved.size / CH.length) * 70) + (st.pyDone ? 30 : 0);
      setPct('ict', Math.max(D.quest('ict').p1, pct));
      if (pct >= 100) D.award('logic-coder', { en: 'Logic & Loop Builder', bn: 'লজিক ও লুপ নির্মাতা' }, '');
    };
    draw();
  };
})();

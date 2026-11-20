/* Dishari OS, tiny theme-aware SVG chart kit (no dependencies). */
(function () {
  'use strict';
  const D = window.D;
  const esc = D.esc;
  const C = {
    em: 'var(--em)', gold: 'var(--gold)', info: 'var(--info)', danger: 'var(--danger)', violet: 'var(--violet)', muted: 'var(--muted)'
  };
  D.C = C;

  /* Radar (e.g. Bloom mastery), values 0..100 */
  D.radar = (labels, values, opts) => {
    opts = opts || {};
    const size = opts.size || 280, cx = size / 2, cy = size / 2, r = size / 2 - 42, n = labels.length;
    const pt = (i, v) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / n; return [cx + Math.cos(a) * r * v, cy + Math.sin(a) * r * v]; };
    let g = '';
    [0.25, 0.5, 0.75, 1].forEach((f) => { g += `<polygon points="${labels.map((_, i) => pt(i, f).join(',')).join(' ')}" style="fill:none;stroke:var(--line2)"/>`; });
    labels.forEach((_, i) => { const [x, y] = pt(i, 1); g += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" style="stroke:var(--line)"/>`; });
    const poly = values.map((v, i) => pt(i, Math.max(0.02, v / 100)).join(',')).join(' ');
    g += `<polygon points="${poly}" style="fill:color-mix(in srgb, var(--em) 22%, transparent);stroke:var(--em);stroke-width:2"/>`;
    values.forEach((v, i) => { const [x, y] = pt(i, Math.max(0.02, v / 100)); g += `<circle cx="${x}" cy="${y}" r="3.5" style="fill:var(--gold)"/>`; });
    labels.forEach((l, i) => {
      const [x, y] = pt(i, 1.2);
      g += `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" style="font-size:11.5px;font-weight:700;fill:var(--text2)">${esc(l)}</text>`;
      const [x2, y2] = pt(i, 1.2);
      g += `<text x="${x2}" y="${y2 + 13}" text-anchor="middle" style="font-size:10.5px;fill:var(--muted)">${D.n(Math.round(values[i]))}%</text>`;
    });
    return `<svg class="chart" viewBox="0 0 ${size} ${size}" width="100%" style="max-width:${size}px" role="img" aria-label="${esc(opts.label || 'Radar chart')}">${g}</svg>`;
  };

  /* Grouped vertical bars */
  D.bars = (cats, series, opts) => {
    opts = opts || {};
    const W = opts.w || 560, H = opts.h || 240, pl = 36, pb = 34, pt = 14, pr = 10;
    const max = opts.max || Math.max(...series.flatMap((s) => s.values)) * 1.1;
    const iw = W - pl - pr, ih = H - pt - pb;
    const gw = iw / cats.length, bw = Math.min(28, (gw * 0.72) / series.length);
    let g = '';
    for (let i = 0; i <= 4; i++) {
      const y = pt + ih - (ih * i) / 4;
      g += `<line x1="${pl}" x2="${W - pr}" y1="${y}" y2="${y}" style="stroke:var(--line)"/><text x="${pl - 6}" y="${y + 4}" text-anchor="end">${D.n(Math.round((max * i) / 4))}${opts.unit || ''}</text>`;
    }
    cats.forEach((c, i) => {
      const x0 = pl + gw * i + (gw - bw * series.length) / 2;
      series.forEach((s, j) => {
        const v = s.values[i], h = (ih * v) / max;
        g += `<rect x="${x0 + j * bw}" y="${pt + ih - h}" width="${bw - 3}" height="${Math.max(0, h)}" rx="4" style="fill:${s.color}"><title>${esc(s.name)}: ${v}${opts.unit || ''}</title></rect>`;
        if (opts.labels) g += `<text x="${x0 + j * bw + (bw - 3) / 2}" y="${pt + ih - h - 4}" text-anchor="middle" style="font-size:10px;fill:var(--text2)">${D.n(v)}</text>`;
      });
      g += `<text x="${pl + gw * i + gw / 2}" y="${H - 12}" text-anchor="middle">${esc(c)}</text>`;
    });
    const legend = `<div class="legend">${series.map((s) => `<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join('')}</div>`;
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(opts.label || 'Bar chart')}">${g}</svg>${legend}`;
  };

  /* Line chart */
  D.line = (xs, series, opts) => {
    opts = opts || {};
    const W = opts.w || 560, H = opts.h || 200, pl = 40, pb = 26, pt = 12, pr = 12;
    const all = series.flatMap((s) => s.values);
    const min = opts.min != null ? opts.min : Math.min(...all), max = opts.max != null ? opts.max : Math.max(...all);
    const iw = W - pl - pr, ih = H - pt - pb;
    const X = (i) => pl + (iw * i) / Math.max(1, xs.length - 1), Y = (v) => pt + ih - (ih * (v - min)) / (max - min || 1);
    let g = '';
    for (let i = 0; i <= 4; i++) { const v = min + ((max - min) * i) / 4, y = Y(v); g += `<line x1="${pl}" x2="${W - pr}" y1="${y}" y2="${y}" style="stroke:var(--line)"/><text x="${pl - 6}" y="${y + 4}" text-anchor="end">${D.n(+v.toFixed(opts.dp != null ? opts.dp : 1))}${opts.unit || ''}</text>`; }
    xs.forEach((x, i) => { if (i % Math.ceil(xs.length / 7) === 0 || i === xs.length - 1) g += `<text x="${X(i)}" y="${H - 8}" text-anchor="middle">${esc(x)}</text>`; });
    series.forEach((s) => {
      const d = s.values.map((v, i) => (i ? 'L' : 'M') + X(i).toFixed(1) + ' ' + Y(v).toFixed(1)).join(' ');
      if (s.fill) g += `<path d="${d} L ${X(s.values.length - 1)} ${pt + ih} L ${X(0)} ${pt + ih} Z" style="fill:color-mix(in srgb, ${s.color} 14%, transparent)"/>`;
      g += `<path d="${d}" style="fill:none;stroke:${s.color};stroke-width:2.2;stroke-linejoin:round;stroke-linecap:round${s.dash ? ';stroke-dasharray:5 4' : ''}"/>`;
      s.values.forEach((v, i) => { if (i === s.values.length - 1) g += `<circle cx="${X(i)}" cy="${Y(v)}" r="3.5" style="fill:${s.color}"/>`; });
    });
    const legend = series.length > 1 ? `<div class="legend">${series.map((s) => `<span><i style="background:${s.color}"></i>${esc(s.name)}</span>`).join('')}</div>` : '';
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${esc(opts.label || 'Line chart')}">${g}</svg>${legend}`;
  };

  /* Score ring */
  D.ring = (pct, opts) => {
    opts = opts || {};
    const s = opts.size || 120, r = s / 2 - 9, c = 2 * Math.PI * r, color = opts.color || (pct >= 85 ? 'var(--em)' : pct >= 65 ? 'var(--gold)' : 'var(--danger)');
    return `<svg viewBox="0 0 ${s} ${s}" width="${s}" height="${s}" role="img" aria-label="${Math.round(pct)}%"><circle cx="${s / 2}" cy="${s / 2}" r="${r}" style="fill:none;stroke:var(--card3);stroke-width:9"/><circle cx="${s / 2}" cy="${s / 2}" r="${r}" style="fill:none;stroke:${color};stroke-width:9;stroke-linecap:round;transition:stroke-dashoffset .8s ease" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - D.clamp(pct, 0, 100) / 100)}" transform="rotate(-90 ${s / 2} ${s / 2})"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="central" style="font-size:${s / 4.6}px;font-weight:800;fill:var(--text)">${D.n(Math.round(pct))}${opts.suffix != null ? opts.suffix : '%'}</text></svg>`;
  };

  /* Two normal curves shifted by effect size d (A/B efficacy visual) */
  D.normalShift = (d, opts) => {
    opts = opts || {};
    const W = opts.w || 600, H = opts.h || 230, pl = 14, pr = 14, pt = 16, pb = 30;
    const xmin = -3.5, xmax = 3.5 + Math.max(0, d);
    const iw = W - pl - pr, ih = H - pt - pb;
    const pdf = (x, m) => Math.exp(-0.5 * (x - m) * (x - m)) / Math.sqrt(2 * Math.PI);
    const X = (x) => pl + (iw * (x - xmin)) / (xmax - xmin), Y = (y) => pt + ih - (ih * y) / 0.42;
    const path = (m) => { let p = ''; for (let i = 0; i <= 160; i++) { const x = xmin + ((xmax - xmin) * i) / 160; p += (i ? 'L' : 'M') + X(x).toFixed(1) + ' ' + Y(pdf(x, m)).toFixed(1); } return p; };
    let g = `<line x1="${pl}" x2="${W - pr}" y1="${pt + ih}" y2="${pt + ih}" style="stroke:var(--line2)"/>`;
    g += `<path d="${path(0)} L ${X(xmax)} ${pt + ih} L ${X(xmin)} ${pt + ih} Z" style="fill:color-mix(in srgb, var(--muted) 18%, transparent);stroke:var(--muted);stroke-width:2"/>`;
    g += `<path d="${path(d)} L ${X(xmax)} ${pt + ih} L ${X(xmin)} ${pt + ih} Z" style="fill:color-mix(in srgb, var(--em) 20%, transparent);stroke:var(--em);stroke-width:2.4"/>`;
    g += `<line x1="${X(0)}" x2="${X(0)}" y1="${pt}" y2="${pt + ih}" style="stroke:var(--muted);stroke-dasharray:4 4"/>`;
    g += `<line x1="${X(d)}" x2="${X(d)}" y1="${pt}" y2="${pt + ih}" style="stroke:var(--em);stroke-dasharray:4 4"/>`;
    g += `<text x="${X(0) - 6}" y="${H - 10}" text-anchor="end">${esc(opts.a || 'Traditional mean')}</text>`;
    g += `<text x="${X(d) + 6}" y="${H - 10}" text-anchor="start" style="fill:var(--em);font-weight:700">${esc(opts.b || 'Dishari mean')}</text>`;
    return `<svg class="chart" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Effect size visual">${g}</svg>`;
  };
  // Standard normal CDF (for percentile of the average treated learner)
  D.phi = (z) => { const t = 1 / (1 + 0.2316419 * Math.abs(z)); const dd = 0.3989423 * Math.exp((-z * z) / 2); const p = dd * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return z > 0 ? 1 - p : p; };
})();

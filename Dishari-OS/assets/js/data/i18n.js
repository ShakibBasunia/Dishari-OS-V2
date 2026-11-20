/* Dishari OS, extra languages.
   1) D.I18N.<code> : hand-written dictionaries keyed by the English string used in T('English', 'বাংলা').
      Add or fix entries here; reviewed community translations should live in this file.
   2) Draft machine translation: for languages without an entry, missing phrases are sent to /api/translate
      (only when a server key exists), cached in localStorage and marked as draft in the language picker.
   Chakma, Marma, Tripura, Santali and Garo have no hand-written entries yet: contributions from native speakers are welcome. */
(function () {
  'use strict';
  const D = (window.D = window.D || {});
  D.I18N = D.I18N || {};

  D.I18N.hi = {
    'Workspace': 'वर्कस्पेस', 'SDG 4 & Research': 'SDG 4 और शोध', 'Architecture': 'आर्किटेक्चर', 'Data': 'डेटा',
    'Security': 'सुरक्षा', 'Admin': 'एडमिन', 'Pitch': 'पिच', 'Deck': 'डेक', 'Audit': 'ऑडिट', 'Main': 'मुख्य',
    'Language': 'भाषा', 'Switch language': 'भाषा बदलें', 'Choose your language': 'अपनी भाषा चुनें',
    'Light': 'लाइट', 'Dark': 'डार्क', 'Light theme': 'लाइट थीम', 'Dark theme': 'डार्क थीम', 'Theme': 'थीम',
    'Open command palette': 'कमांड पैलेट खोलें', 'Search and jump (Ctrl K)': 'खोजें (Ctrl K)',
    'Accessibility and preferences': 'सुलभता और पसंद', '2G Lite mode': '2G लाइट मोड',
    'Dyslexia-friendly reading': 'डिस्लेक्सिया-अनुकूल पठन', 'Wider letter, word and line spacing.': 'अक्षर, शब्द और पंक्ति के बीच ज़्यादा जगह।',
    'Read tutor replies aloud': 'ट्यूटर के जवाब पढ़कर सुनाएँ', 'Test voice': 'आवाज़ जाँचें',
    'Replay tour': 'टूर फिर से देखें', 'Reset demo data': 'डेमो डेटा रीसेट करें',
    'Offline engine': 'ऑफ़लाइन इंजन', 'Student profile': 'छात्र प्रोफ़ाइल'
  };

  /* ---- Script fonts, loaded only when the language needs them ---- */
  const FONTS = { Devanagari: 'Noto+Sans+Devanagari:wght@400;600', Chakma: 'Noto+Sans+Chakma', Burmese: 'Noto+Sans+Myanmar:wght@400;600', 'Ol Chiki': 'Noto+Sans+Ol+Chiki' };
  const loadedFonts = {};
  D.loadScriptFont = () => {
    const sc = D.langInfo().script;
    if (!sc || !FONTS[sc] || loadedFonts[sc] || D.state.lite || window.DISHARI_NO_FONTS) return;
    loadedFonts[sc] = true;
    const l = document.createElement('link');
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=' + FONTS[sc] + '&display=swap';
    document.head.appendChild(l);
  };

  /* ---- Draft machine translation (needs ANTHROPIC_API_KEY on the server) ---- */
  const MT_KEY = (c) => 'dishari.mt.' + c;
  const tried = {};
  let queue = {}, timer = null, available = null, rerender = null;

  function restore(code) {
    if (D.I18N[code] && D.I18N[code].__mt) return;
    const d = D.I18N[code] = D.I18N[code] || {};
    Object.defineProperty(d, '__mt', { value: true, enumerable: false });
    try { Object.assign(d, JSON.parse(localStorage.getItem(MT_KEY(code)) || '{}')); } catch (e) { /* storage unavailable */ }
  }

  D.mtNeed = (code, en) => {
    if (!code || code === 'en' || code === 'bn' || code === 'hi' || available === false) return;
    if (typeof en !== 'string' || en.length < 2 || en.length > 300 || !/[A-Za-z]{2}/.test(en)) return;
    restore(code);
    const k = code + '\u0000' + en;
    if (tried[k]) return;
    tried[k] = true;
    (queue[code] = queue[code] || []).push(en);
    if (!timer) timer = setTimeout(flush, 600);
  };

  async function flush() {
    timer = null;
    const q = queue; queue = {};
    for (const code of Object.keys(q)) {
      const strings = Array.from(new Set(q[code]));
      for (let i = 0; i < strings.length; i += 40) {
        const batch = strings.slice(i, i + 40);
        try {
          const r = await fetch('api/translate', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ lang: code, strings: batch }) });
          if (!r.ok) { if (r.status === 503) available = false; continue; }
          const j = await r.json();
          if (!Array.isArray(j.translations)) continue;
          restore(code);
          batch.forEach((en, n) => { if (j.translations[n]) D.I18N[code][en] = j.translations[n]; });
          try { localStorage.setItem(MT_KEY(code), JSON.stringify(D.I18N[code])); } catch (e) { /* ignore */ }
          clearTimeout(rerender);
          rerender = setTimeout(() => { if (D.state.lang === code) D.render(true); }, 300);
        } catch (e) { /* offline: keep fallback text */ }
      }
    }
  }
})();

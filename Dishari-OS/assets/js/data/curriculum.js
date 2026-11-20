/* Dishari OS, pedagogical content for the 5 STEM labs (from the NextEduAi prototype):
   tutor scripts for the 4 teaching models, practice arena, boss battles.
   Every item links to knowledge-base chunk ids (cite) for the explainability drawer. */
(function () {
  'use strict';
  const D = window.D;

  D.SUBJECTS = [
    { id: 'math', icon: 'sigma', name: { en: 'Mathematics', bn: 'গণিত' }, topic: { en: 'Definite integrals, area under a curve', bn: 'নির্দিষ্ট যোগজ, বক্ররেখার নিচের ক্ষেত্রফল' }, level: 'HSC', q: 'area under curve riemann integral antiderivative' },
    { id: 'eq', icon: 'fn', name: { en: 'Equations', bn: 'সমীকরণ' }, topic: { en: 'Motion equations & rearranging formulas', bn: 'গতির সমীকরণ ও সূত্র পুনর্বিন্যাস' }, level: 'SSC/HSC', q: 'motion equation v^2 u^2 2as force newton rearrange' },
    { id: 'bio', icon: 'microscope', name: { en: 'Biology', bn: 'জীববিজ্ঞান' }, topic: { en: 'Cell organelles & energy (mitochondria)', bn: 'কোষ অঙ্গাণু ও শক্তি (মাইটোকন্ড্রিয়া)' }, level: 'HSC', q: 'mitochondria atp energy organelle cell' },
    { id: 'chem', icon: 'flask', name: { en: 'Chemistry', bn: 'রসায়ন' }, topic: { en: 'Balancing equations & acid–base titration', bn: 'সমীকরণ সমতা ও অম্ল–ক্ষার টাইট্রেশন' }, level: 'HSC', q: 'balance equation coefficient subscript titration' },
    { id: 'ict', icon: 'code', name: { en: 'ICT', bn: 'আইসিটি' }, topic: { en: 'Logic gates & Python loops', bn: 'লজিক গেট ও Python লুপ' }, level: 'HSC', q: 'python for loop range logic gate' }
  ];
  D.subject = (id) => D.SUBJECTS.find((s) => s.id === id) || D.SUBJECTS[2];

  D.BLOOM = [
    ['remember', { en: 'Remember', bn: 'স্মরণ' }],
    ['understand', { en: 'Understand', bn: 'অনুধাবন' }],
    ['apply', { en: 'Apply', bn: 'প্রয়োগ' }],
    ['analyze', { en: 'Analyze', bn: 'বিশ্লেষণ' }],
    ['evaluate', { en: 'Evaluate', bn: 'মূল্যায়ন' }],
    ['create', { en: 'Create', bn: 'সৃষ্টি' }]
  ];

  const L = (en, bn) => ({ en, bn });

  /* ===================================================================== */
  /* Tutor scripts: socratic · bloom · feynman · scaffold                  */
  /* keys: array of groups; every group must match (any alternative).      */
  /* ===================================================================== */
  D.TUTOR = {
    math: {
      socratic: [
        { q: L('Picture the region under y = x² + 1 from x = 0 to x = 2. The top is curved, but which simple shape do you already know how to find the area of?', 'y = x² + 1 বক্ররেখার নিচে x = 0 থেকে x = 2 পর্যন্ত অঞ্চলটি কল্পনা করো। উপরটা বাঁকা, কিন্তু কোন সরল আকৃতির ক্ষেত্রফল তুমি ইতিমধ্যে বের করতে পারো?'),
          keys: [['rect', 'square', 'আয়ত', 'বর্গ']], nudge: L('Think of a shape with straight sides whose area is simply width × height.', 'এমন একটি আকৃতি ভাবো যার ক্ষেত্রফল শুধু দৈর্ঘ্য × প্রস্থ।'),
          affirm: L('Exactly, rectangles. So what if we filled the curved region with thin rectangles?', 'ঠিক, আয়তক্ষেত্র। তাহলে বাঁকা অঞ্চলটিকে সরু আয়তক্ষেত্র দিয়ে ভরাট করলে কেমন হয়?'), cite: ['math-01'] },
        { q: L('If we use 4 equal rectangles between 0 and 2, how wide is each one?', '0 থেকে 2-এর মধ্যে 4টি সমান আয়তক্ষেত্র নিলে প্রতিটির প্রস্থ কত?'),
          keys: [['0.5', '1/2', '½', '.5', 'half', 'অর্ধ']], nudge: L('The interval is 2 units long and you split it into 4 equal parts. What is 2 ÷ 4?', 'ব্যবধিটি ২ একক লম্বা, ৪ ভাগে ভাগ করছ। ২ ÷ ৪ = ?'),
          affirm: L('Right, Δx = 0.5. Each rectangle\'s area is f(xᵢ) × 0.5, add them up and you have a Riemann sum.', 'ঠিক, Δx = 0.5। প্রতিটি আয়তক্ষেত্রের ক্ষেত্রফল f(xᵢ) × 0.5, যোগ করলে রিমান সমষ্টি।'), cite: ['math-01'] },
        { q: L('The rectangles leave small gaps, so the sum is only an estimate. What could you change to make it closer to the true area?', 'আয়তক্ষেত্রগুলো ফাঁক রাখে, তাই যোগফল আসন্ন মান। প্রকৃত ক্ষেত্রফলের কাছাকাছি যেতে কী পরিবর্তন করবে?'),
          keys: [['more', 'increase', 'thinner', 'narrow', 'smaller', 'infinite', 'বেশি', 'বাড়া', 'সরু', 'ছোট']], nudge: L('Look at the gaps. Would narrower rectangles leave bigger or smaller gaps?', 'ফাঁকগুলো দেখো। আরও সরু আয়তক্ষেত্র নিলে ফাঁক বড় হবে না ছোট?'),
          affirm: L('Yes! As the number of rectangles n → ∞, the sum becomes the definite integral.', 'হ্যাঁ! আয়তক্ষেত্রের সংখ্যা n → ∞ হলে যোগফলই নির্দিষ্ট যোগজ।'), cite: ['math-01', 'math-02'] },
        { q: L('Shortcut: an antiderivative of x² + 1 is x³/3 + x. Using F(2) − F(0), what is the exact area?', 'শর্টকাট: x² + 1-এর প্রতিযোজিত x³/3 + x। F(2) − F(0) ব্যবহার করে সঠিক ক্ষেত্রফল কত?'),
          keys: [['14/3', '4.67', '4.66', '4.7']], nudge: L('F(2) = 8/3 + 2 and F(0) = 0. Subtract and write it as a fraction or decimal.', 'F(2) = 8/3 + 2 এবং F(0) = 0। বিয়োগ করে ভগ্নাংশ বা দশমিকে লেখো।'),
          affirm: L('14/3 ≈ 4.67 square units.', '১৪/৩ ≈ ৪.৬৭ বর্গ একক।'), cite: ['math-03'] }
      ],
      wrap: L('You discovered the definite integral yourself: rectangles → shrink the width → limit → F(b) − F(a). That chain of reasoning is what examiners reward in creative questions.', 'তুমি নিজেই নির্দিষ্ট যোগজ আবিষ্কার করলে: আয়তক্ষেত্র → প্রস্থ ছোট → সীমা → F(b) − F(a)।'),
      bloom: [
        { t: 'remember', q: L('What does ∫ₐᵇ f(x) dx represent geometrically?', '∫ₐᵇ f(x) dx জ্যামিতিকভাবে কী নির্দেশ করে?'), o: [L('The net signed area between f and the x-axis from a to b', 'a থেকে b পর্যন্ত f ও x-অক্ষের মধ্যবর্তী নিট চিহ্নযুক্ত ক্ষেত্রফল'), L('The slope of f at x = a', 'x = a-তে f-এর ঢাল'), L('The average of a and b', 'a ও b-এর গড়'), L('The length of the curve', 'বক্ররেখার দৈর্ঘ্য')], a: 0, cite: ['math-02'] },
        { t: 'understand', q: L('Why does a Riemann sum with more rectangles give a better estimate?', 'বেশি আয়তক্ষেত্রের রিমান সমষ্টি কেন ভালো আসন্ন মান দেয়?'), o: [L('The gaps between the rectangles and the curve shrink', 'আয়তক্ষেত্র ও বক্ররেখার মাঝের ফাঁক কমে যায়'), L('The rectangles become taller', 'আয়তক্ষেত্রগুলো লম্বা হয়'), L('The function itself changes', 'ফাংশনটি বদলে যায়'), L('The interval becomes longer', 'ব্যবধি লম্বা হয়')], a: 0, cite: ['math-01'] },
        { t: 'apply', q: L('Compute ∫₀³ 2x dx.', '∫₀³ 2x dx নির্ণয় করো।'), o: [L('9', '৯'), L('6', '৬'), L('3', '৩'), L('18', '১৮')], a: 0, cite: ['math-03'] },
        { t: 'analyze', q: L('For an increasing function, a LEFT Riemann sum will…', 'বর্ধমান ফাংশনের জন্য বাম রিমান সমষ্টি…'), o: [L('underestimate the area', 'ক্ষেত্রফল কম দেখাবে'), L('overestimate the area', 'বেশি দেখাবে'), L('always be exact', 'সবসময় নির্ভুল'), L('always be negative', 'সবসময় ঋণাত্মক')], a: 0, cite: ['math-01'] },
        { t: 'evaluate', q: L('Rafi says: "∫₋₁¹ x dx = 0, so there is no area between the curve and the axis." Judge his claim.', 'রাফি বলে: "∫₋₁¹ x dx = 0, তাই কোনো ক্ষেত্রফল নেই।" তার দাবি মূল্যায়ন করো।'), o: [L('Partly wrong, equal areas above and below cancel; the net area is 0 but the total area is 1', 'আংশিক ভুল, উপর-নিচের সমান ক্ষেত্রফল কাটাকাটি হয়; নিট ০ কিন্তু মোট ক্ষেত্রফল ১'), L('Correct, zero integral means zero area', 'সঠিক, শূন্য যোগজ মানে শূন্য ক্ষেত্রফল'), L('Wrong, the integral equals 2', 'ভুল, যোগজ ২'), L('Wrong, integrals cannot be zero', 'ভুল, যোগজ শূন্য হতে পারে না')], a: 0, cite: ['math-02'] },
        { t: 'create', q: L('Create a real-life problem from Bangladesh that needs a definite integral. Say what f(x) represents and what the limits are.', 'বাংলাদেশের বাস্তব জীবন থেকে একটি সমস্যা তৈরি করো যেখানে নির্দিষ্ট যোগজ লাগে। f(x) কী ও সীমা কী বলো।'), keys: [['rate', 'speed', 'flow', 'per', 'হার', 'বেগ', 'প্রবাহ'], ['from', 'between', 'to', 'থেকে', 'পর্যন্ত', 'hour', 'minute', 'km', 'ঘণ্টা']], cite: ['math-02'] }
      ],
      feynman: {
        prompt: L('Teach me! Explain what a definite integral measures, imagine I\'m a curious Class 8 student.', 'আমাকে শেখাও! নির্দিষ্ট যোগজ কী মাপে, ধরো আমি কৌতূহলী অষ্টম শ্রেণির ছাত্র।'),
        concepts: [
          { label: L('area', 'ক্ষেত্রফল'), keys: ['area', 'space', 'region', 'ক্ষেত্রফল', 'জায়গা'], follow: L('You said "integral"… but what is actually being measured, a length, an area, a speed?', 'তুমি বললে "যোগজ"… কিন্তু আসলে কী মাপা হচ্ছে, দৈর্ঘ্য, ক্ষেত্রফল, না বেগ?') },
          { label: L('adding small pieces', 'ছোট অংশ যোগ'), keys: ['rectangle', 'piece', 'strip', 'sum', 'add', 'slice', 'যোগ', 'টুকরো', 'আয়ত'], follow: L('Hmm, the top is curvy. How would you actually calculate the area of a curvy shape?', 'উপরটা তো বাঁকা। বাঁকা আকৃতির ক্ষেত্রফল কীভাবে হিসাব করবে?') },
          { label: L('limit / thinner pieces', 'সীমা / আরও সরু অংশ'), keys: ['more', 'thinner', 'smaller', 'infinite', 'limit', 'exact', 'বেশি', 'সরু', 'সীমা'], follow: L('But rectangles leave gaps, right? How do we get the EXACT answer, not an estimate?', 'আয়তক্ষেত্র তো ফাঁক রাখে। আসন্ন নয়, সঠিক মান কীভাবে পাব?') },
          { label: L('between limits a and b', 'a থেকে b সীমার মধ্যে'), keys: ['between', 'from', 'axis', 'limit', 'start', 'end', 'থেকে', 'পর্যন্ত', 'অক্ষ'], follow: L('Area between what and what? Where does the region start and stop?', 'কিসের মধ্যে ক্ষেত্রফল? অঞ্চলটি কোথায় শুরু আর কোথায় শেষ?') }
        ],
        jargon: ['antiderivative', 'riemann', 'integrand', 'infinitesimal', 'partition', 'summation', 'প্রতিযোজিত'],
        cite: ['math-01', 'math-02']
      },
      scaffold: {
        problem: L('Find ∫₀² (x² + 1) dx.', '∫₀² (x² + 1) dx নির্ণয় করো।'),
        steps: [
          { p: L('Step 1, What is an antiderivative of x²?', 'ধাপ ১, x²-এর প্রতিযোজিত কী?'), exact: ['x^3/3', 'x³/3', 'x3/3', '(x^3)/3', '1/3x^3', 'x**3/3', '(1/3)x^3', 'x^3÷3'],
            h: [L('Use the power rule.', 'ঘাত নিয়ম ব্যবহার করো।'), L('Raise the power by one and divide by the new power: x² → x^(2+1)/(2+1).', 'ঘাত এক বাড়িয়ে নতুন ঘাত দিয়ে ভাগ করো: x² → x^(2+1)/(2+1)।'), L('Answer: x³/3', 'উত্তর: x³/3')] },
          { p: L('Step 2, What is an antiderivative of 1?', 'ধাপ ২, 1-এর প্রতিযোজিত কী?'), exact: ['x', '1x'],
            h: [L('Which function has derivative 1?', 'কোন ফাংশনের অন্তরজ 1?'), L('d/dx of x is 1.', 'x-এর অন্তরজ 1।'), L('Answer: x', 'উত্তর: x')] },
          { p: L('Step 3, Evaluate F(2) = 2³/3 + 2 (decimal is fine).', 'ধাপ ৩, F(2) = 2³/3 + 2 নির্ণয় করো।'), num: 14 / 3, tol: 0.02,
            h: [L('2³ = 8.', '2³ = 8।'), L('8/3 ≈ 2.667, then add 2.', '8/3 ≈ 2.667, তারপর 2 যোগ করো।'), L('Answer: 14/3 ≈ 4.67', 'উত্তর: ১৪/৩ ≈ ৪.৬৭')] },
          { p: L('Step 4, Evaluate F(0).', 'ধাপ ৪, F(0) নির্ণয় করো।'), num: 0, tol: 0.001,
            h: [L('Put x = 0 into x³/3 + x.', 'x³/3 + x-এ x = 0 বসাও।'), L('0³/3 + 0', '0³/3 + 0'), L('Answer: 0', 'উত্তর: 0')] },
          { p: L('Step 5, Area = F(2) − F(0) = ?', 'ধাপ ৫, ক্ষেত্রফল = F(2) − F(0) = ?'), num: 14 / 3, tol: 0.02,
            h: [L('Subtract your two answers.', 'দুটি উত্তর বিয়োগ করো।'), L('4.67 − 0', '4.67 − 0'), L('Answer: 14/3 ≈ 4.67 square units', 'উত্তর: ১৪/৩ ≈ ৪.৬৭ বর্গ একক')] }
        ],
        cite: ['math-03']
      }
    },

    eq: {
      socratic: [
        { q: L('A bus starts from rest and speeds up to 20 m/s with acceleration 4 m/s². Before any formula, what is its starting velocity u?', 'একটি বাস স্থির অবস্থা থেকে 4 m/s² ত্বরণে 20 m/s বেগে পৌঁছায়। সূত্রের আগে বলো, আদিবেগ u কত?'),
          keys: [['0', 'zero', 'rest', 'শূন্য', 'স্থির']], nudge: L('"Starts from rest", how fast is something at rest?', '"স্থির অবস্থা থেকে", স্থির বস্তুর বেগ কত?'),
          affirm: L('Yes, u = 0. We know u, v = 20 and a = 4. We want distance s.', 'হ্যাঁ, u = 0। জানা: u, v = 20, a = 4; চাই সরণ s।'), cite: ['eq-01'] },
        { q: L('Which motion equation links u, v, a and s, with no time t in it?', 'কোন গতির সমীকরণে u, v, a ও s আছে কিন্তু সময় t নেই?'),
          keys: [['v^2', 'v²', 'v2', '2as', 'u^2', 'u²']], nudge: L('The three are v = u + at, s = ut + ½at², v² = u² + 2as. Which one has no t?', 'তিনটি: v = u + at, s = ut + ½at², v² = u² + 2as। কোনটিতে t নেই?'),
          affirm: L('v² = u² + 2as, perfect choice.', 'v² = u² + 2as, চমৎকার।'), cite: ['eq-01'] },
        { q: L('To get s alone, what is the first operation you would do to both sides of v² = u² + 2as?', 'v² = u² + 2as থেকে s আলাদা করতে উভয় পক্ষে প্রথমে কী করবে?'),
          keys: [['subtract', 'minus', '−u', '-u', 'take away', 'বিয়োগ']], nudge: L('u² is being ADDED on the right. What undoes addition?', 'ডান পাশে u² যোগ হয়েছে। যোগকে বাতিল করে কোন প্রক্রিয়া?'),
          affirm: L('Subtract u²: v² − u² = 2as. Then divide by 2a: s = (v² − u²)/(2a).', 'u² বিয়োগ: v² − u² = 2as। তারপর 2a দিয়ে ভাগ: s = (v² − u²)/(2a)।'), cite: ['eq-05'] },
        { q: L('Now substitute: s = (20² − 0²)/(2 × 4). How far does the bus travel?', 'এবার মান বসাও: s = (20² − 0²)/(2 × 4)। বাসটি কত দূর যায়?'),
          keys: [['50']], nudge: L('20² = 400 and 2 × 4 = 8. What is 400 ÷ 8?', '20² = 400, 2 × 4 = 8। 400 ÷ 8 = ?'), affirm: L('50 metres.', '৫০ মিটার।'), cite: ['eq-01'] }
      ],
      wrap: L('You chose the right equation, rearranged it and solved it, the exact three skills HSC creative questions test.', 'সঠিক সমীকরণ বাছাই, পুনর্বিন্যাস ও সমাধান, তিনটি দক্ষতাই তুমি দেখালে।'),
      bloom: [
        { t: 'remember', q: L('Which equation is Newton\'s second law?', 'নিউটনের দ্বিতীয় সূত্র কোনটি?'), o: [L('F = ma', 'F = ma'), L('W = mg', 'W = mg'), L('p = mv', 'p = mv'), L('v = u + at', 'v = u + at')], a: 0, cite: ['eq-02'] },
        { t: 'understand', q: L('The same force pushes a heavier rickshaw. Its acceleration…', 'একই বল ভারী রিকশায় প্রয়োগ করলে ত্বরণ…'), o: [L('decreases', 'কমে'), L('increases', 'বাড়ে'), L('stays the same', 'একই থাকে'), L('becomes zero', 'শূন্য হয়')], a: 0, cite: ['eq-02'] },
        { t: 'apply', q: L('Force needed to accelerate a 1200 kg car at 2 m/s²?', '1200 kg গাড়িকে 2 m/s² ত্বরণ দিতে কত বল লাগবে?'), o: [L('2400 N', '২৪০০ N'), L('600 N', '৬০০ N'), L('1202 N', '১২০২ N'), L('24 000 N', '২৪০০০ N')], a: 0, cite: ['eq-02'] },
        { t: 'analyze', q: L('A supply packet is released from a drone flying horizontally. Ignoring air resistance, which is true?', 'অনুভূমিকভাবে উড়ন্ত ড্রোন থেকে প্যাকেট ছাড়া হলো। বায়ুর বাধা উপেক্ষা করলে কোনটি সত্য?'), o: [L('Horizontal speed stays constant while vertical speed increases', 'অনুভূমিক বেগ ধ্রুব, উল্লম্ব বেগ বাড়ে'), L('Both speeds stay constant', 'দুটোই ধ্রুব'), L('It falls straight down', 'সোজা নিচে পড়ে'), L('Horizontal speed increases', 'অনুভূমিক বেগ বাড়ে')], a: 0, cite: ['eq-03'] },
        { t: 'evaluate', q: L('Mim rearranges v² = u² + 2as as s = v² − u²/2a. Evaluate her answer.', 'মিম লিখেছে s = v² − u²/2a। মূল্যায়ন করো।'), o: [L('Incorrect, brackets are needed: s = (v² − u²)/(2a)', 'ভুল, বন্ধনী লাগবে: s = (v² − u²)/(2a)'), L('Correct as written', 'যেমন আছে সঠিক'), L('Should be s = 2a/(v² − u²)', 's = 2a/(v² − u²) হবে'), L('Should be s = (v − u)/2a', 's = (v − u)/2a হবে')], a: 0, cite: ['eq-05'] },
        { t: 'create', q: L('Design an experiment using a phone stopwatch to estimate g with a falling object. Say what you measure and which equation you use.', 'ফোনের স্টপওয়াচ দিয়ে পড়ন্ত বস্তু ব্যবহার করে g নির্ণয়ের পরীক্ষা ডিজাইন করো। কী মাপবে ও কোন সমীকরণ ব্যবহার করবে বলো।'), keys: [['time', 'stopwatch', 'second', 'সময়', 'স্টপওয়াচ'], ['height', 'distance', 'metre', 'meter', 'উচ্চতা', 'দূরত্ব'], ['ut', '½', '1/2', 'gt', '2h', 's =', 's=', 'সমীকরণ', 'equation']], cite: ['eq-01', 'eq-03'] }
      ],
      feynman: {
        prompt: L('Teach me! What does F = ma really mean? Use an everyday example.', 'আমাকে শেখাও! F = ma আসলে কী বোঝায়? দৈনন্দিন উদাহরণ দিয়ে বলো।'),
        concepts: [
          { label: L('force = push or pull', 'বল = ধাক্কা বা টান'), keys: ['push', 'pull', 'force', 'ধাক্কা', 'টান', 'বল'], follow: L('What exactly is a "force"? Can I see one?', '"বল" আসলে কী? আমি কি এটা দেখতে পারি?') },
          { label: L('mass = how heavy', 'ভর = কতটা ভারী'), keys: ['mass', 'heavy', 'weight', 'kg', 'ভর', 'ভারী'], follow: L('Does it matter if the thing is heavy or light?', 'জিনিসটি ভারী না হালকা, তাতে কি কিছু যায় আসে?') },
          { label: L('acceleration = speeding up', 'ত্বরণ = বেগ বৃদ্ধি'), keys: ['accelerat', 'speed up', 'faster', 'change in speed', 'ত্বরণ', 'দ্রুত'], follow: L('What does the force actually DO to the object?', 'বল বস্তুটির সাথে আসলে কী করে?') },
          { label: L('relationship (more force → more acceleration)', 'সম্পর্ক (বেশি বল → বেশি ত্বরণ)'), keys: ['more force', 'bigger force', 'heavier', 'less', 'proportional', 'double', 'বেশি বল', 'কম'], follow: L('If I push twice as hard, what happens? And if the cart is twice as heavy?', 'দ্বিগুণ জোরে ধাক্কা দিলে কী হবে? আর গাড়ি দ্বিগুণ ভারী হলে?') }
        ],
        jargon: ['inertial', 'vector', 'kinematics', 'dynamics', 'resultant', 'newtonian'],
        cite: ['eq-02', 'eq-04']
      },
      scaffold: {
        problem: L('Make s the subject of v² = u² + 2as, then find s when u = 0, v = 20 m/s and a = 4 m/s².', 'v² = u² + 2as থেকে s-কে আলাদা করো, তারপর u = 0, v = 20 m/s, a = 4 m/s² হলে s নির্ণয় করো।'),
        steps: [
          { p: L('Step 1, Subtract u² from both sides. What is the left side now?', 'ধাপ ১, উভয় পক্ষ থেকে u² বিয়োগ করো। বাম পাশে কী থাকে?'), exact: ['v^2-u^2', 'v²-u²', 'v2-u2', 'v*v-u*u'],
            h: [L('Whatever you do to one side, do to the other.', 'এক পাশে যা করো, অন্য পাশেও তাই।'), L('The left side was v². Take away u².', 'বাম পাশে ছিল v²। u² বাদ দাও।'), L('Answer: v² − u²', 'উত্তর: v² − u²')] },
          { p: L('Step 2, Now v² − u² = 2as. Divide both sides by what to leave s alone?', 'ধাপ ২, v² − u² = 2as। s একা রাখতে উভয় পক্ষকে কী দিয়ে ভাগ করবে?'), exact: ['2a', '(2a)', '2*a', '2×a'],
            h: [L('s is being multiplied by something.', 's-কে কিছু দিয়ে গুণ করা হয়েছে।'), L('2as = (2a) × s', '2as = (2a) × s'), L('Answer: 2a', 'উত্তর: 2a')] },
          { p: L('Step 3, With the numbers, what is v² − u²?', 'ধাপ ৩, মান বসিয়ে v² − u² কত?'), num: 400, tol: 0.5,
            h: [L('v = 20, u = 0.', 'v = 20, u = 0।'), L('20² − 0²', '20² − 0²'), L('Answer: 400', 'উত্তর: ৪০০')] },
          { p: L('Step 4, What is 2a?', 'ধাপ ৪, 2a কত?'), num: 8, tol: 0.01,
            h: [L('a = 4.', 'a = 4।'), L('2 × 4', '2 × 4'), L('Answer: 8', 'উত্তর: ৮')] },
          { p: L('Step 5, So s = ? (metres)', 'ধাপ ৫, তাহলে s = ? (মিটার)'), num: 50, tol: 0.1,
            h: [L('Divide step 3 by step 4.', 'ধাপ ৩-কে ধাপ ৪ দিয়ে ভাগ করো।'), L('400 ÷ 8', '400 ÷ 8'), L('Answer: 50 m', 'উত্তর: ৫০ m')] }
        ],
        cite: ['eq-05', 'eq-01']
      }
    },

    bio: {
      socratic: [
        { q: L('Your leg muscles work non-stop during a football match. What does a muscle cell need a constant supply of to keep contracting?', 'ফুটবল খেলার সময় পায়ের পেশি অনবরত কাজ করে। সংকোচন চালিয়ে যেতে পেশিকোষের কিসের নিরবচ্ছিন্ন সরবরাহ দরকার?'),
          keys: [['energy', 'atp', 'fuel', 'শক্তি', 'এনার্জি']], nudge: L('When you run, you get tired and hungry. What is your body using up?', 'দৌড়ালে তুমি ক্লান্ত ও ক্ষুধার্ত হও। শরীর কী খরচ করছে?'),
          affirm: L('Yes, energy. But cells can\'t use food energy directly; they convert it first.', 'হ্যাঁ, শক্তি। তবে কোষ খাদ্যের শক্তি সরাসরি ব্যবহার করতে পারে না; আগে রূপান্তর করে।'), cite: ['bio-03'] },
        { q: L('Inside cells, energy is carried by a small molecule called the cell\'s "energy currency". Do you know its name?', 'কোষের ভেতরে শক্তি বহন করে একটি ছোট অণু, কোষের "শক্তি-মুদ্রা"। এর নাম জানো?'),
          keys: [['atp', 'adenosine', 'এটিপি']], nudge: L('It is a three-letter abbreviation that starts with "A".', 'এটি "A" দিয়ে শুরু হওয়া তিন অক্ষরের সংক্ষিপ্ত নাম।'),
          affirm: L('ATP! Now, where is most of it made?', 'ATP! এখন বলো, এর বেশিরভাগ কোথায় তৈরি হয়?'), cite: ['bio-01'] },
        { q: L('Which organelle produces most of the cell\'s ATP?', 'কোন অঙ্গাণু কোষের বেশিরভাগ ATP তৈরি করে?'),
          keys: [['mitochond', 'মাইটোকন্ড্রিয়া', 'মাইটোকনড্রিয়া']], nudge: L('Its nickname is "the powerhouse of the cell".', 'এর ডাকনাম "কোষের শক্তিঘর"।'),
          affirm: L('The mitochondrion, where aerobic respiration releases energy from glucose.', 'মাইটোকন্ড্রিয়া, যেখানে সবাত শ্বসনে গ্লুকোজ থেকে শক্তি মুক্ত হয়।'), cite: ['bio-07', 'bio-01'] },
        { q: L('So would a heart-muscle cell have MORE or FEWER mitochondria than a skin cell? Why?', 'তাহলে হৃৎপেশির কোষে ত্বকের কোষের চেয়ে মাইটোকন্ড্রিয়া বেশি না কম থাকবে? কেন?'),
          keys: [['more', 'many', 'বেশি', 'অনেক']], nudge: L('Which of the two cells works 24 hours a day without rest?', 'দুটির মধ্যে কোনটি দিনরাত বিশ্রামহীন কাজ করে?'),
          affirm: L('More, higher energy demand means more mitochondria.', 'বেশি, বেশি শক্তি-চাহিদা মানে বেশি মাইটোকন্ড্রিয়া।'), cite: ['bio-03'] }
      ],
      wrap: L('You reasoned from everyday experience to cell structure: energy demand → ATP → mitochondria → more mitochondria in active cells.', 'তুমি দৈনন্দিন অভিজ্ঞতা থেকে কোষের গঠনে পৌঁছালে: শক্তি-চাহিদা → ATP → মাইটোকন্ড্রিয়া → সক্রিয় কোষে বেশি মাইটোকন্ড্রিয়া।'),
      bloom: [
        { t: 'remember', q: L('Which organelle is the main site of ATP production?', 'ATP উৎপাদনের প্রধান স্থান কোন অঙ্গাণু?'), o: [L('Mitochondrion', 'মাইটোকন্ড্রিয়া'), L('Golgi apparatus', 'গলজি বস্তু'), L('Ribosome', 'রাইবোজোম'), L('Lysosome', 'লাইসোজোম')], a: 0, cite: ['bio-01'] },
        { t: 'understand', q: L('Why is the inner membrane of the mitochondrion folded into cristae?', 'মাইটোকন্ড্রিয়ার অন্তঃঝিল্লি কেন ক্রিস্টিতে ভাঁজ থাকে?'), o: [L('To increase surface area for respiration enzymes', 'শ্বসন এনজাইমের জন্য তলের ক্ষেত্রফল বাড়াতে'), L('To store DNA', 'DNA সঞ্চয়ে'), L('To make proteins', 'প্রোটিন তৈরিতে'), L('To digest waste', 'বর্জ্য হজমে')], a: 0, cite: ['bio-07'] },
        { t: 'apply', q: L('A plasma cell makes huge amounts of antibody protein for export. Which organelles will be most prominent?', 'একটি প্লাজমা কোষ রপ্তানির জন্য প্রচুর অ্যান্টিবডি প্রোটিন তৈরি করে। কোন অঙ্গাণু বেশি থাকবে?'), o: [L('Rough ER and Golgi apparatus', 'অমসৃণ ER ও গলজি বস্তু'), L('Lysosomes only', 'শুধু লাইসোজোম'), L('Chloroplasts', 'ক্লোরোপ্লাস্ট'), L('Large central vacuole', 'বড় কোষগহ্বর')], a: 0, cite: ['bio-02', 'bio-05'] },
        { t: 'analyze', q: L('Report: platelets 85,000/µL (low), WBC 3,200/µL (low), NS1 antigen positive. The pattern suggests…', 'রিপোর্ট: প্লাটিলেট ৮৫,০০০/µL (কম), WBC ৩,২০০/µL (কম), NS1 পজিটিভ। এটি নির্দেশ করে…'), o: [L('a viral infection such as dengue', 'ডেঙ্গুর মতো ভাইরাস সংক্রমণ'), L('a bacterial infection', 'ব্যাকটেরিয়া সংক্রমণ'), L('a completely normal blood report', 'স্বাভাবিক রিপোর্ট'), L('an allergy', 'অ্যালার্জি')], a: 0, cite: ['bio-06'] },
        { t: 'evaluate', q: L('A pharmacy shopkeeper recommends antibiotics for dengue. Evaluate the advice.', 'ফার্মেসির দোকানদার ডেঙ্গুতে অ্যান্টিবায়োটিক দিতে বলছেন। পরামর্শটি মূল্যায়ন করো।'), o: [L('Not appropriate, antibiotics act on bacteria, not viruses; see a doctor', 'সঠিক নয়, অ্যান্টিবায়োটিক ব্যাকটেরিয়ায় কাজ করে, ভাইরাসে নয়; ডাক্তার দেখাও'), L('Good advice for any fever', 'যেকোনো জ্বরে ভালো পরামর্শ'), L('Only if fever is above 39 °C', 'শুধু ৩৯°C এর বেশি জ্বরে'), L('Antibiotics raise platelets', 'অ্যান্টিবায়োটিক প্লাটিলেট বাড়ায়')], a: 0, cite: ['bio-06'] },
        { t: 'create', q: L('Design an analogy or model to teach organelle functions to a Class 6 student.', 'ষষ্ঠ শ্রেণির শিক্ষার্থীকে অঙ্গাণুর কাজ শেখাতে একটি উপমা বা মডেল তৈরি করো।'), keys: [['factory', 'city', 'school', 'office', 'kitchen', 'কারখানা', 'শহর', 'স্কুল'], ['mitochond', 'power', 'energy', 'শক্তি'], ['nucleus', 'boss', 'control', 'brain', 'নিউক্লিয়াস', 'প্রধান']], cite: ['bio-01', 'bio-02'] }
      ],
      feynman: {
        prompt: L('Teach me! Why do cells need mitochondria? Explain it simply, like you would to a younger sibling.', 'আমাকে শেখাও! কোষের মাইটোকন্ড্রিয়া কেন দরকার? ছোট ভাইবোনকে যেভাবে বলবে সেভাবে বলো।'),
        concepts: [
          { label: L('energy / ATP', 'শক্তি / ATP'), keys: ['energy', 'atp', 'power', 'শক্তি'], follow: L('Okay… but what does the mitochondrion actually GIVE the cell?', 'আচ্ছা… মাইটোকন্ড্রিয়া কোষকে আসলে কী দেয়?') },
          { label: L('food / glucose', 'খাদ্য / গ্লুকোজ'), keys: ['food', 'glucose', 'sugar', 'eat', 'খাদ্য', 'গ্লুকোজ', 'চিনি'], follow: L('Where does that energy come from in the first place? Does the cell make it from nothing?', 'শক্তিটা প্রথমে আসে কোথা থেকে? কোষ কি শূন্য থেকে বানায়?') },
          { label: L('oxygen / breathing', 'অক্সিজেন / শ্বাস'), keys: ['oxygen', 'breath', 'o2', 'অক্সিজেন', 'শ্বাস'], follow: L('Is there something we breathe in that the mitochondria need?', 'আমরা যা শ্বাসে নিই তার কিছু কি মাইটোকন্ড্রিয়ার দরকার?') },
          { label: L('an everyday example', 'দৈনন্দিন উদাহরণ'), keys: ['muscle', 'run', 'heart', 'like a', 'example', 'battery', 'factory', 'যেমন', 'দৌড়', 'পেশি', 'ব্যাটারি'], follow: L('Can you give me an example from real life? I learn better with examples!', 'বাস্তব জীবনের একটা উদাহরণ দাও না! উদাহরণে আমি ভালো বুঝি।') }
        ],
        jargon: ['oxidative', 'phosphorylation', 'electron transport', 'krebs', 'chemiosmosis', 'glycolysis', 'nadh'],
        cite: ['bio-01', 'bio-03', 'bio-07']
      },
      scaffold: {
        problem: L('Explain, step by step, how a sprinting athlete\'s muscle cell gets its energy.', 'ধাপে ধাপে ব্যাখ্যা করো: একজন দৌড়বিদের পেশিকোষ কীভাবে শক্তি পায়।'),
        steps: [
          { p: L('Step 1, Which molecule is the cell\'s energy currency?', 'ধাপ ১, কোষের শক্তি-মুদ্রা কোন অণু?'), keys: [['atp', 'এটিপি']], h: [L('It is used by every cell to power work.', 'প্রতিটি কোষ কাজে এটি ব্যবহার করে।'), L('Three letters: A _ _', 'তিন অক্ষর: A _ _'), L('Answer: ATP', 'উত্তর: ATP')] },
          { p: L('Step 2, Which organelle produces most ATP?', 'ধাপ ২, কোন অঙ্গাণু বেশিরভাগ ATP তৈরি করে?'), keys: [['mitochond', 'মাইটোকন্ড্রিয়া', 'মাইটোকনড্রিয়া']], h: [L('The "powerhouse".', '"শক্তিঘর"।'), L('Starts with "mito…"', '"মাইটো…" দিয়ে শুরু'), L('Answer: mitochondria', 'উত্তর: মাইটোকন্ড্রিয়া')] },
          { p: L('Step 3, Aerobic respiration uses glucose and which gas?', 'ধাপ ৩, সবাত শ্বসনে গ্লুকোজ ও কোন গ্যাস লাগে?'), keys: [['oxygen', 'o2', 'অক্সিজেন']], h: [L('"Aerobic" means "with air".', '"সবাত" মানে বায়ুর সাথে।'), L('The gas we breathe in.', 'যে গ্যাস আমরা শ্বাসে নিই।'), L('Answer: oxygen', 'উত্তর: অক্সিজেন')] },
          { p: L('Step 4, Name one waste product of respiration.', 'ধাপ ৪, শ্বসনের একটি বর্জ্য পদার্থের নাম বলো।'), keys: [['carbon dioxide', 'co2', 'water', 'h2o', 'পানি', 'কার্বন']], h: [L('We breathe it out.', 'আমরা এটি শ্বাসে ছাড়ি।'), L('C _ _ or H₂O', 'C _ _ বা H₂O'), L('Answer: carbon dioxide (or water)', 'উত্তর: কার্বন ডাই-অক্সাইড (বা পানি)')] },
          { p: L('Step 5, Do an athlete\'s muscle cells have more or fewer mitochondria than average?', 'ধাপ ৫, দৌড়বিদের পেশিকোষে মাইটোকন্ড্রিয়া বেশি না কম?'), keys: [['more', 'many', 'বেশি', 'অনেক']], h: [L('Think about energy demand.', 'শক্তি-চাহিদার কথা ভাবো।'), L('Training increases energy demand.', 'অনুশীলন শক্তি-চাহিদা বাড়ায়।'), L('Answer: more', 'উত্তর: বেশি')] }
        ],
        cite: ['bio-03', 'bio-01']
      }
    },

    chem: {
      socratic: [
        { q: L('Look at CH₄ + O₂ → CO₂ + H₂O. How many hydrogen atoms are in CH₄ on the left, and how many in one H₂O on the right?', 'CH₄ + O₂ → CO₂ + H₂O দেখো। বাম পাশে CH₄-এ কয়টি হাইড্রোজেন পরমাণু, আর ডান পাশে একটি H₂O-তে কয়টি?'),
          keys: [['4', 'four', 'চার'], ['2', 'two', 'দুই']], nudge: L('Read the small subscript numbers: CH₄ has a 4 on H; H₂O has a 2.', 'ছোট পাদাঙ্কগুলো পড়ো: CH₄-এ H-এর নিচে ৪, H₂O-তে ২।'),
          affirm: L('4 on the left, 2 on the right, unbalanced. Matter can\'t disappear, so we must fix it.', 'বামে ৪, ডানে ২, অসমান। পদার্থ হারিয়ে যেতে পারে না, তাই ঠিক করতে হবে।'), cite: ['chem-01'] },
        { q: L('Could we just change H₂O into H₄O to fix it? Why or why not?', 'H₂O-কে H₄O করে দিলেই কি সমাধান? কেন বা কেন নয়?'),
          keys: [['no', 'not', 'cannot', "can't", 'different', 'না', 'ভিন্ন']], nudge: L('Would H₄O still be water?', 'H₄O কি তখনও পানি থাকবে?'),
          affirm: L('Right, changing a subscript changes the substance. We change coefficients instead.', 'ঠিক, পাদাঙ্ক বদলালে পদার্থ বদলে যায়। তাই সহগ বদলাই।'), cite: ['chem-01'] },
        { q: L('So what coefficient should go in front of H₂O to balance hydrogen?', 'হাইড্রোজেন সমান করতে H₂O-এর সামনে কোন সহগ বসবে?'),
          keys: [['2', 'two', 'দুই']], nudge: L('Each H₂O has 2 H. How many H₂O give you 4 H?', 'প্রতিটি H₂O-তে ২টি H। কয়টি H₂O-তে ৪টি H হবে?'), affirm: L('2H₂O.', '2H₂O।'), cite: ['chem-01'] },
        { q: L('Now count oxygen on the right: CO₂ + 2H₂O. How many O₂ molecules do you need on the left?', 'এবার ডানে অক্সিজেন গোনো: CO₂ + 2H₂O। বামে কয়টি O₂ অণু লাগবে?'),
          keys: [['2', 'two', 'দুই']], nudge: L('Right side: 2 (in CO₂) + 2 (in 2H₂O) = 4 oxygen atoms. Each O₂ has 2.', 'ডানে: ২ (CO₂) + ২ (2H₂O) = ৪টি অক্সিজেন পরমাণু। প্রতিটি O₂-তে ২টি।'),
          affirm: L('CH₄ + 2O₂ → CO₂ + 2H₂O, balanced!', 'CH₄ + 2O₂ → CO₂ + 2H₂O, সমতাকৃত!'), cite: ['chem-01'] }
      ],
      wrap: L('You balanced methane combustion by reasoning about atoms, and you know why subscripts are off-limits.', 'পরমাণু গুনে তুমি মিথেন দহন সমতা করলে, আর জানলে কেন পাদাঙ্ক বদলানো যায় না।'),
      bloom: [
        { t: 'remember', q: L('What must be equal on both sides of a balanced equation?', 'সমতাকৃত সমীকরণের উভয় পাশে কী সমান হতে হবে?'), o: [L('The number of atoms of each element', 'প্রতিটি মৌলের পরমাণুর সংখ্যা'), L('The number of molecules', 'অণুর সংখ্যা'), L('The subscripts', 'পাদাঙ্ক'), L('The physical states', 'ভৌত অবস্থা')], a: 0, cite: ['chem-01'] },
        { t: 'understand', q: L('Why can\'t you change subscripts to balance an equation?', 'সমতা করতে কেন পাদাঙ্ক বদলানো যায় না?'), o: [L('It changes the identity of the substance', 'এতে পদার্থের পরিচয় বদলে যায়'), L('It makes the reaction slower', 'বিক্রিয়া ধীর হয়'), L('Subscripts must be even numbers', 'পাদাঙ্ক জোড় হতে হয়'), L('It is only a convention', 'এটি শুধু প্রথা')], a: 0, cite: ['chem-01'] },
        { t: 'apply', q: L('Balance: _H₂ + _O₂ → _H₂O', 'সমতা করো: _H₂ + _O₂ → _H₂O'), o: [L('2, 1, 2', '২, ১, ২'), L('1, 1, 1', '১, ১, ১'), L('2, 2, 1', '২, ২, ১'), L('1, 2, 2', '১, ২, ২')], a: 0, cite: ['chem-01'] },
        { t: 'analyze', q: L('25.0 mL of river water needs 20.0 mL of 0.10 M NaOH to neutralise its HCl. What is the HCl concentration?', '২৫.০ mL নদীর পানির HCl প্রশমনে ০.১০ M NaOH-এর ২০.০ mL লাগে। HCl-এর ঘনমাত্রা কত?'), o: [L('0.080 M', '০.০৮০ M'), L('0.125 M', '০.১২৫ M'), L('0.050 M', '০.০৫০ M'), L('0.80 M', '০.৮০ M')], a: 0, cite: ['chem-03'] },
        { t: 'evaluate', q: L('A factory says effluent at pH 3 is "only slightly more acidic" than pH 6. Evaluate.', 'একটি কারখানা বলছে pH ৩-এর বর্জ্য pH ৬-এর চেয়ে "সামান্য বেশি অম্লীয়"। মূল্যায়ন করো।'), o: [L('Misleading, pH 3 is 1000× more acidic than pH 6', 'বিভ্রান্তিকর, pH ৩, pH ৬-এর চেয়ে ১০০০ গুণ বেশি অম্লীয়'), L('Correct', 'সঠিক'), L('pH 3 is half as acidic', 'pH ৩ অর্ধেক অম্লীয়'), L('pH 3 is exactly 3× more acidic', 'ঠিক ৩ গুণ বেশি')], a: 0, cite: ['chem-07'] },
        { t: 'create', q: L('Propose a safe plan to neutralise an acidic spill in a river.', 'নদীতে অম্লীয় বর্জ্য নিরাপদে প্রশমনের একটি পরিকল্পনা প্রস্তাব করো।'), keys: [['base', 'lime', 'naoh', 'hydroxide', 'ক্ষার', 'চুন'], ['ph', 'measure', 'test', 'titrat', 'monitor', 'মাপ', 'পরীক্ষা'], ['slow', 'gradual', 'small', 'safety', 'careful', 'ধীরে', 'নিরাপদ', 'অল্প']], cite: ['chem-07', 'chem-02'] }
      ],
      feynman: {
        prompt: L('Teach me! What does "balancing a chemical equation" mean, and why must we do it?', 'আমাকে শেখাও! "রাসায়নিক সমীকরণ সমতা করা" মানে কী, আর কেন করতে হয়?'),
        concepts: [
          { label: L('atoms are counted', 'পরমাণু গণনা'), keys: ['atom', 'পরমাণু', 'element', 'মৌল'], follow: L('What exactly are we counting on each side?', 'প্রতিটি পাশে আমরা আসলে কী গুনছি?') },
          { label: L('same on both sides', 'উভয় পাশে সমান'), keys: ['same', 'equal', 'both side', 'left and right', 'সমান', 'উভয়'], follow: L('Do the two sides need to match in some way?', 'দুই পাশ কি কোনোভাবে মিলতে হবে?') },
          { label: L('matter is conserved', 'ভরের নিত্যতা'), keys: ['conserv', 'not created', 'destroyed', 'disappear', 'lost', 'নিত্যতা', 'হারায় না', 'ধ্বংস'], follow: L('But why? What would it mean if atoms vanished during a reaction?', 'কিন্তু কেন? বিক্রিয়ায় পরমাণু হারিয়ে গেলে কী বোঝাত?') },
          { label: L('change coefficients, not subscripts', 'সহগ বদলাও, পাদাঙ্ক নয়'), keys: ['coefficient', 'number in front', 'big number', 'not subscript', 'সহগ', 'সামনের সংখ্যা'], follow: L('How do we actually fix an unbalanced equation, which numbers can we change?', 'অসম সমীকরণ কীভাবে ঠিক করি, কোন সংখ্যা বদলানো যায়?') }
        ],
        jargon: ['stoichiometry', 'stoichiometric', 'molar', 'quantitative', 'reagent', 'yield'],
        cite: ['chem-01']
      },
      scaffold: {
        problem: L('Balance CH₄ + O₂ → CO₂ + H₂O.', 'CH₄ + O₂ → CO₂ + H₂O সমতা করো।'),
        steps: [
          { p: L('Step 1, Balance carbon first. Coefficient of CO₂?', 'ধাপ ১, প্রথমে কার্বন। CO₂-এর সহগ?'), num: 1, tol: 0, h: [L('Count C atoms on each side.', 'প্রতি পাশে C গোনো।'), L('1 C in CH₄.', 'CH₄-এ ১টি C।'), L('Answer: 1', 'উত্তর: ১')] },
          { p: L('Step 2, Balance hydrogen. Coefficient of H₂O?', 'ধাপ ২, হাইড্রোজেন। H₂O-এর সহগ?'), num: 2, tol: 0, h: [L('CH₄ has 4 H.', 'CH₄-এ ৪টি H।'), L('Each H₂O has 2 H.', 'প্রতিটি H₂O-তে ২টি H।'), L('Answer: 2', 'উত্তর: ২')] },
          { p: L('Step 3, Total oxygen atoms on the right now?', 'ধাপ ৩, এখন ডানে মোট অক্সিজেন পরমাণু?'), num: 4, tol: 0, h: [L('CO₂ + 2H₂O', 'CO₂ + 2H₂O'), L('2 + 2 × 1', '২ + ২ × ১'), L('Answer: 4', 'উত্তর: ৪')] },
          { p: L('Step 4, Coefficient of O₂?', 'ধাপ ৪, O₂-এর সহগ?'), num: 2, tol: 0, h: [L('Each O₂ has 2 atoms.', 'প্রতিটি O₂-তে ২টি পরমাণু।'), L('4 ÷ 2', '৪ ÷ ২'), L('Answer: 2', 'উত্তর: ২')] },
          { p: L('Step 5, Check: total atoms on EACH side of CH₄ + 2O₂ → CO₂ + 2H₂O?', 'ধাপ ৫, যাচাই: CH₄ + 2O₂ → CO₂ + 2H₂O-এর প্রতি পাশে মোট পরমাণু?'), num: 9, tol: 0, h: [L('Left: CH₄ (5) + 2O₂ (4).', 'বাম: CH₄ (৫) + 2O₂ (৪)।'), L('Right: CO₂ (3) + 2H₂O (6).', 'ডান: CO₂ (৩) + 2H₂O (৬)।'), L('Answer: 9', 'উত্তর: ৯')] }
        ],
        cite: ['chem-01']
      }
    },

    ict: {
      socratic: [
        { q: L('This code should add 1 to 10:\n  total = 0\n  for i in range(1, 10):\n      total += i\nWhich numbers do you think range(1, 10) produces?', 'এই কোড ১ থেকে ১০ যোগ করার কথা:\n  total = 0\n  for i in range(1, 10):\n      total += i\nrange(1, 10) কোন সংখ্যাগুলো দেয় বলে মনে হয়?'),
          keys: [['9']], nudge: L('Does range() include its stop value, or stop just before it?', 'range() কি stop মান অন্তর্ভুক্ত করে, নাকি তার ঠিক আগে থামে?'),
          affirm: L('1 to 9, the stop value 10 is excluded.', '১ থেকে ৯, stop মান ১০ বাদ যায়।'), cite: ['ict-03'] },
        { q: L('So what will print(total) actually show?', 'তাহলে print(total) আসলে কী দেখাবে?'),
          keys: [['45']], nudge: L('Add 1 + 2 + … + 9. (Hint: n(n+1)/2 with n = 9.)', '১ + ২ + … + ৯ যোগ করো। (n(n+1)/2, n = 9)'), affirm: L('45, not 55, a silent bug!', '৫৫ নয়, ৪৫, নীরব বাগ!'), cite: ['ict-03'] },
        { q: L('How would you change the range so that 10 is included?', '১০ অন্তর্ভুক্ত করতে range কীভাবে বদলাবে?'),
          keys: [['11']], nudge: L('The stop value must be one more than the last number you want.', 'stop মান শেষ কাঙ্ক্ষিত সংখ্যার চেয়ে এক বেশি হবে।'), affirm: L('range(1, 11).', 'range(1, 11)।'), cite: ['ict-03'] },
        { q: L('Programmers have a name for bugs that are wrong by exactly one. What is it?', 'ঠিক এক কম/বেশি হওয়ার বাগকে প্রোগ্রামাররা কী বলে?'),
          keys: [['off', 'boundary', 'অফ', 'one']], nudge: L('It is "____-by-one".', '"___-বাই-ওয়ান"।'), affirm: L('An off-by-one error, one of the most common bugs in the world.', 'অফ-বাই-ওয়ান ত্রুটি, বিশ্বের সবচেয়ে সাধারণ বাগগুলোর একটি।'), cite: ['ict-03'] }
      ],
      wrap: L('You debugged a loop by reasoning, not guessing: trace values → find the boundary → fix the stop value.', 'অনুমান নয়, যুক্তি দিয়ে লুপ ডিবাগ করলে: মান ট্রেস → সীমা খোঁজা → stop ঠিক করা।'),
      bloom: [
        { t: 'remember', q: L('Which gate outputs 1 only when all inputs are 1?', 'কোন গেট শুধু সব ইনপুট ১ হলেই ১ দেয়?'), o: [L('AND', 'AND'), L('OR', 'OR'), L('XOR', 'XOR'), L('NOT', 'NOT')], a: 0, cite: ['ict-01'] },
        { t: 'understand', q: L('What does range(2, 6) produce?', 'range(2, 6) কী দেয়?'), o: [L('2, 3, 4, 5', '২, ৩, ৪, ৫'), L('2, 3, 4, 5, 6', '২, ৩, ৪, ৫, ৬'), L('3, 4, 5, 6', '৩, ৪, ৫, ৬'), L('2, 4, 6', '২, ৪, ৬')], a: 0, cite: ['ict-03'] },
        { t: 'apply', q: L('Output?\n  x = 0\n  for i in range(3):\n      x += 2\n  print(x)', 'আউটপুট?\n  x = 0\n  for i in range(3):\n      x += 2\n  print(x)'), o: [L('6', '৬'), L('4', '৪'), L('3', '৩'), L('8', '৮')], a: 0, cite: ['ict-03'] },
        { t: 'analyze', q: L('A line reads: if average > 60   (no colon). What happens?', 'একটি লাইন: if average > 60 (কোলন নেই)। কী ঘটবে?'), o: [L('SyntaxError before the program runs', 'প্রোগ্রাম চলার আগেই SyntaxError'), L('It prints nothing', 'কিছু প্রিন্ট হয় না'), L('It runs normally', 'স্বাভাবিকভাবে চলে'), L('TypeError at the end', 'শেষে TypeError')], a: 0, cite: ['ict-04'] },
        { t: 'evaluate', q: L('Which single gate type is "universal" (can build any circuit)?', 'কোন একক গেট "সর্বজনীন" (যেকোনো সার্কিট বানাতে পারে)?'), o: [L('NAND', 'NAND'), L('AND', 'AND'), L('OR', 'OR'), L('XOR', 'XOR')], a: 0, cite: ['ict-01'] },
        { t: 'create', q: L('Write an algorithm (steps or pseudocode) for a rural clinic to flag every patient with temperature above 38 °C.', 'গ্রামীণ ক্লিনিকে ৩৮°C-এর বেশি জ্বরের রোগী চিহ্নিত করার অ্যালগরিদম (ধাপ বা সিউডোকোড) লেখো।'), keys: [['loop', 'for', 'each', 'every', 'প্রতিটি', 'লুপ'], ['if', '>', 'greater', '38', 'condition', 'শর্ত', 'বেশি'], ['print', 'flag', 'list', 'alert', 'append', 'mark', 'চিহ্নিত', 'তালিকা']], cite: ['ict-02', 'ict-04'] }
      ],
      feynman: {
        prompt: L('Teach me! What does a for-loop do? Explain it like you would to your grandmother.', 'আমাকে শেখাও! for-লুপ কী করে? দাদু-দিদাকে যেভাবে বোঝাবে সেভাবে বলো।'),
        concepts: [
          { label: L('repeats instructions', 'নির্দেশ পুনরাবৃত্তি'), keys: ['repeat', 'again', 'many times', 'over and over', 'বারবার', 'পুনরাবৃত্তি'], follow: L('So the computer does the same thing… once? Or more?', 'তাহলে কম্পিউটার একই কাজ… একবার করে? না বারবার?') },
          { label: L('goes through each item', 'প্রতিটি উপাদান একে একে'), keys: ['each', 'every', 'one by one', 'list', 'item', 'প্রতিটি', 'একে একে', 'তালিকা'], follow: L('Does it work on a list of things? How does it pick the next one?', 'এটা কি একটা তালিকার উপর কাজ করে? পরেরটা কীভাবে নেয়?') },
          { label: L('knows when to stop', 'কখন থামবে জানে'), keys: ['stop', 'end', 'how many', 'until', 'finish', 'range', 'থাম', 'শেষ', 'কতবার'], follow: L('Does it go on forever? How does it know when to stop?', 'এটা কি চিরকাল চলে? কখন থামবে কীভাবে জানে?') },
          { label: L('an everyday example', 'দৈনন্দিন উদাহরণ'), keys: ['like', 'example', 'imagine', 'counting', 'roll call', 'যেমন', 'ধরো', 'গোনা'], follow: L('Can you give me a real-life example? Like something at home or school?', 'বাস্তব উদাহরণ দাও, বাসা বা স্কুলের কিছু?') }
        ],
        jargon: ['iterate', 'iterable', 'iterator', 'increment', 'syntax', 'interpreter', 'sequence'],
        cite: ['ict-02', 'ict-03']
      },
      scaffold: {
        problem: L('Trace this code:\n  total = 0\n  for i in range(1, 5):\n      total += i\n  print(total)', 'এই কোড ট্রেস করো:\n  total = 0\n  for i in range(1, 5):\n      total += i\n  print(total)'),
        steps: [
          { p: L('Step 1, What is the FIRST value of i?', 'ধাপ ১, i-এর প্রথম মান কত?'), num: 1, tol: 0, h: [L('range(start, stop) begins at start.', 'range(start, stop) start থেকে শুরু।'), L('start = 1', 'start = 1'), L('Answer: 1', 'উত্তর: ১')] },
          { p: L('Step 2, What is the LAST value of i?', 'ধাপ ২, i-এর শেষ মান কত?'), num: 4, tol: 0, h: [L('The stop value is excluded.', 'stop মান বাদ যায়।'), L('stop − 1', 'stop − 1'), L('Answer: 4', 'উত্তর: ৪')] },
          { p: L('Step 3, What does print(total) show?', 'ধাপ ৩, print(total) কী দেখায়?'), num: 10, tol: 0, h: [L('Add every value of i.', 'i-এর সব মান যোগ করো।'), L('1 + 2 + 3 + 4', '১ + ২ + ৩ + ৪'), L('Answer: 10', 'উত্তর: ১০')] },
          { p: L('Step 4, To include 5, what should the new stop value be?', 'ধাপ ৪, ৫ অন্তর্ভুক্ত করতে নতুন stop মান কত?'), num: 6, tol: 0, h: [L('Stop must be one more than the last value.', 'stop শেষ মানের চেয়ে এক বেশি।'), L('5 + 1', '৫ + ১'), L('Answer: 6', 'উত্তর: ৬')] },
          { p: L('Step 5, New output?', 'ধাপ ৫, নতুন আউটপুট?'), num: 15, tol: 0, h: [L('Add 5 to the old total.', 'আগের মোটের সাথে ৫ যোগ।'), L('10 + 5', '১০ + ৫'), L('Answer: 15', 'উত্তর: ১৫')] }
        ],
        cite: ['ict-03']
      }
    }
  };

  /* ===================================================================== */
  /* Part 2, Practice Arena (adaptive MCQ, d = difficulty 1–3)            */
  /* ===================================================================== */
  const M = (d, q, o, a, hint, why, cite) => ({ d, q, o, a, hint, why, cite });
  D.PRACTICE = {
    math: [
      M(1, L('Width of each rectangle when [0, 4] is split into 8 parts?', '[0, 4]-কে ৮ ভাগে ভাগ করলে প্রতিটির প্রস্থ?'), ['0.5', '2', '8', '0.25'], 0, L('Δx = (b − a)/n', 'Δx = (b − a)/n'), L('(4 − 0)/8 = 0.5', '(৪ − ০)/৮ = ০.৫'), 'math-01'),
      M(1, L('An antiderivative of 3x² is…', '3x²-এর প্রতিযোজিত…'), ['x³', '6x', '3x³', 'x²'], 0, L('Power rule then multiply by 3.', 'ঘাত নিয়ম, তারপর ৩ দিয়ে গুণ।'), L('3 · x³/3 = x³', '3 · x³/3 = x³'), 'math-03'),
      M(2, L('∫₁³ 2 dx = ?', '∫₁³ 2 dx = ?'), ['4', '2', '6', '3'], 0, L('Area of a rectangle of height 2.', 'উচ্চতা ২-এর আয়তক্ষেত্র।'), L('2 × (3 − 1) = 4', '২ × (৩ − ১) = ৪'), 'math-02'),
      M(2, L('Vertex x-coordinate of y = −0.05x² + 2x + 20?', 'y = −0.05x² + 2x + 20-এর শীর্ষবিন্দুর x?'), ['20', '40', '−20', '10'], 0, L('x = −b/(2a)', 'x = −b/(2a)'), L('−2 / (2 × −0.05) = 20', '−২ / (২ × −০.০৫) = ২০'), 'math-04'),
      M(3, L('∫₀² (x² + 1) dx = ?', '∫₀² (x² + 1) dx = ?'), ['14/3', '10/3', '6', '8/3'], 0, L('F(x) = x³/3 + x', 'F(x) = x³/3 + x'), L('8/3 + 2 = 14/3', '৮/৩ + ২ = ১৪/৩'), 'math-03'),
      M(3, L('If the discriminant b² − 4ac < 0, the parabola…', 'নিশ্চায়ক b² − 4ac < 0 হলে পরাবৃত্ত…'), [L('does not cross the x-axis', 'x-অক্ষ ছেদ করে না'), L('touches it once', 'একবার স্পর্শ করে'), L('crosses it twice', 'দুইবার ছেদ করে'), L('is a straight line', 'সরলরেখা')], 0, L('Think about √(negative).', '√(ঋণাত্মক) ভাবো।'), L('No real roots → no x-intercepts.', 'বাস্তব মূল নেই → x-ছেদক নেই।'), 'math-04')
    ],
    eq: [
      M(1, L('Weight of a 50 kg student (g = 9.8 m/s²)?', '৫০ kg শিক্ষার্থীর ওজন (g = 9.8)?'), ['490 N', '50 N', '5.1 N', '59.8 N'], 0, L('W = mg', 'W = mg'), L('50 × 9.8 = 490 N', '৫০ × ৯.৮ = ৪৯০ N'), 'eq-04'),
      M(1, L('Momentum of a 2 kg ball at 3 m/s?', '৩ m/s বেগে ২ kg বলের ভরবেগ?'), ['6 kg·m/s', '1.5 kg·m/s', '5 kg·m/s', '9 kg·m/s'], 0, L('p = mv', 'p = mv'), L('2 × 3 = 6', '২ × ৩ = ৬'), 'eq-04'),
      M(2, L('v = u + at with u = 5, a = 2, t = 3. v = ?', 'u = 5, a = 2, t = 3 হলে v = ?'), ['11 m/s', '10 m/s', '30 m/s', '8 m/s'], 0, L('Substitute directly.', 'সরাসরি বসাও।'), L('5 + 2 × 3 = 11', '৫ + ২ × ৩ = ১১'), 'eq-01'),
      M(2, L('Make a the subject of F = ma.', 'F = ma থেকে a আলাদা করো।'), ['a = F/m', 'a = Fm', 'a = m/F', 'a = F − m'], 0, L('Divide both sides by m.', 'উভয় পক্ষকে m দিয়ে ভাগ।'), L('F/m = a', 'F/m = a'), 'eq-05'),
      M(3, L('Fall time from 45 m (g = 10 m/s²)?', '৪৫ m উচ্চতা থেকে পতনকাল (g = 10)?'), ['3 s', '4.5 s', '9 s', '2 s'], 0, L('t = √(2h/g)', 't = √(2h/g)'), L('√(90/10) = 3 s', '√(৯০/১০) = ৩ s'), 'eq-03'),
      M(3, L('Distance from rest to 20 m/s at 4 m/s²?', 'স্থির থেকে 4 m/s² ত্বরণে 20 m/s পর্যন্ত দূরত্ব?'), ['50 m', '80 m', '5 m', '100 m'], 0, L('s = (v² − u²)/(2a)', 's = (v² − u²)/(2a)'), L('400/8 = 50 m', '৪০০/৮ = ৫০ m'), 'eq-01')
    ],
    bio: [
      M(1, L('Which organelle contains the cell\'s DNA?', 'কোন অঙ্গাণুতে কোষের DNA থাকে?'), [L('Nucleus', 'নিউক্লিয়াস'), L('Golgi apparatus', 'গলজি বস্তু'), L('Lysosome', 'লাইসোজোম'), L('Vacuole', 'কোষগহ্বর')], 0, L('The control centre.', 'নিয়ন্ত্রণ কেন্দ্র।'), L('The nucleus stores DNA.', 'নিউক্লিয়াস DNA ধারণ করে।'), 'bio-01'),
      M(1, L('Ribosomes build…', 'রাইবোজোম তৈরি করে…'), [L('proteins', 'প্রোটিন'), L('lipids', 'লিপিড'), L('glucose', 'গ্লুকোজ'), L('DNA', 'DNA')], 0, L('Think "protein factories".', '"প্রোটিন কারখানা"।'), L('Ribosomes synthesise proteins.', 'রাইবোজোম প্রোটিন সংশ্লেষণ করে।'), 'bio-01'),
      M(2, L('Which organelle packages proteins into vesicles?', 'কোন অঙ্গাণু প্রোটিন ভেসিকলে প্যাকেট করে?'), [L('Golgi apparatus', 'গলজি বস্তু'), L('Mitochondrion', 'মাইটোকন্ড্রিয়া'), L('Nucleolus', 'নিউক্লিওলাস'), L('Chloroplast', 'ক্লোরোপ্লাস্ট')], 0, L('The cell\'s "post office".', 'কোষের "ডাকঘর"।'), L('Golgi sorts and packages.', 'গলজি বাছাই ও প্যাকেট করে।'), 'bio-02'),
      M(2, L('Products of aerobic respiration?', 'সবাত শ্বসনের উৎপাদ?'), [L('CO₂, water and ATP', 'CO₂, পানি ও ATP'), L('Glucose and O₂', 'গ্লুকোজ ও O₂'), L('Only ATP', 'শুধু ATP'), L('Lactic acid only', 'শুধু ল্যাকটিক অ্যাসিড')], 0, L('Glucose + O₂ → ?', 'গ্লুকোজ + O₂ → ?'), L('CO₂ + H₂O + ATP', 'CO₂ + H₂O + ATP'), 'bio-03'),
      M(3, L('Which cells kill virus-infected body cells in the adaptive response?', 'অর্জিত প্রতিরক্ষায় কোন কোষ ভাইরাস-আক্রান্ত দেহকোষ ধ্বংস করে?'), [L('Cytotoxic T cells', 'সাইটোটক্সিক T কোষ'), L('Red blood cells', 'লোহিত কণিকা'), L('Platelets', 'অণুচক্রিকা'), L('Plasma cells', 'প্লাজমা কোষ')], 0, L('CD8⁺', 'CD8⁺'), L('Cytotoxic (CD8⁺) T cells.', 'সাইটোটক্সিক (CD8⁺) T কোষ।'), 'bio-05'),
      M(3, L('Plasma cells develop from…', 'প্লাজমা কোষ তৈরি হয়…'), [L('B cells', 'B কোষ থেকে'), L('T cells', 'T কোষ থেকে'), L('neutrophils', 'নিউট্রোফিল থেকে'), L('platelets', 'অণুচক্রিকা থেকে')], 0, L('They secrete antibodies.', 'এরা অ্যান্টিবডি নিঃসরণ করে।'), L('B cells → plasma cells.', 'B কোষ → প্লাজমা কোষ।'), 'bio-05')
    ],
    chem: [
      M(1, L('What do you change when balancing an equation?', 'সমীকরণ সমতায় কী বদলাও?'), [L('Coefficients', 'সহগ'), L('Subscripts', 'পাদাঙ্ক'), L('Element symbols', 'মৌলের প্রতীক'), L('Arrows', 'তীর')], 0, L('Numbers in front.', 'সামনের সংখ্যা।'), L('Only coefficients.', 'শুধু সহগ।'), 'chem-01'),
      M(1, L('HCl + NaOH → ?', 'HCl + NaOH → ?'), ['NaCl + H₂O', 'NaH + ClOH', 'Na + HCl', 'NaOH + Cl₂'], 0, L('Acid + base → salt + water.', 'অম্ল + ক্ষার → লবণ + পানি।'), L('Neutralisation.', 'প্রশমন।'), 'chem-02'),
      M(2, L('Balance: _Fe + _O₂ → _Fe₂O₃', 'সমতা: _Fe + _O₂ → _Fe₂O₃'), ['4, 3, 2', '2, 3, 1', '4, 2, 2', '3, 2, 1'], 0, L('Start with O: 2 and 3 → LCM 6.', 'O দিয়ে শুরু: ২ ও ৩ → লসাগু ৬।'), L('4Fe + 3O₂ → 2Fe₂O₃', '4Fe + 3O₂ → 2Fe₂O₃'), 'chem-01'),
      M(2, L('Moles in 0.020 L of 0.10 M NaOH?', '০.০২০ L, ০.১০ M NaOH-এ মোল?'), ['0.0020 mol', '0.20 mol', '0.020 mol', '2.0 mol'], 0, L('n = M × V', 'n = M × V'), L('0.10 × 0.020 = 0.0020', '০.১০ × ০.০২০ = ০.০০২০'), 'chem-03'),
      M(3, L('Indicator suitable for strong acid–strong base titration?', 'শক্তিশালী অম্ল–ক্ষার টাইট্রেশনে উপযুক্ত নির্দেশক?'), [L('Phenolphthalein or bromothymol blue', 'ফেনলফথ্যালিন বা ব্রোমোথাইমল ব্লু'), L('Only litmus paper', 'শুধু লিটমাস'), L('Universal indicator only', 'শুধু ইউনিভার্সাল'), L('No indicator works', 'কোনোটি কাজ করে না')], 0, L('Sharp pH jump near 7.', '৭-এর কাছে pH হঠাৎ লাফ।'), L('Both change colour within the jump.', 'দুটোই লাফের মধ্যে রং বদলায়।'), 'chem-04'),
      M(3, L('Mass of 800 mol NaOH (M = 40 g/mol)?', '৮০০ মোল NaOH-এর ভর (M = 40)?'), ['32 kg', '3.2 kg', '20 kg', '320 kg'], 0, L('mass = n × M', 'ভর = n × M'), L('800 × 40 = 32 000 g', '৮০০ × ৪০ = ৩২০০০ g'), 'chem-06')
    ],
    ict: [
      M(1, L('OR gate output when A = 0, B = 1?', 'A = 0, B = 1 হলে OR গেটের আউটপুট?'), ['1', '0', 'undefined', '2'], 0, L('Any 1 → 1.', 'যেকোনো ১ → ১।'), L('OR = 1', 'OR = ১'), 'ict-01'),
      M(1, L('Which topology connects every node to a central switch?', 'কোন টপোলজিতে প্রতিটি নোড কেন্দ্রীয় সুইচে যুক্ত?'), [L('Star', 'স্টার'), L('Bus', 'বাস'), L('Ring', 'রিং'), L('Mesh', 'মেশ')], 0, L('Like a star\'s centre.', 'তারার কেন্দ্রের মতো।'), L('Star topology.', 'স্টার টপোলজি।'), 'ict-05'),
      M(2, L('len(range(0, 10, 2)) = ?', 'len(range(0, 10, 2)) = ?'), ['5', '10', '4', '6'], 0, L('0, 2, 4, 6, 8', '0, 2, 4, 6, 8'), L('Five values.', 'পাঁচটি মান।'), 'ict-03'),
      M(2, L('XOR output when A = 1, B = 1?', 'A = 1, B = 1 হলে XOR আউটপুট?'), ['0', '1', '2', 'undefined'], 0, L('XOR = 1 only when inputs differ.', 'ইনপুট ভিন্ন হলে XOR = ১।'), L('Same inputs → 0.', 'একই ইনপুট → ০।'), 'ict-01'),
      M(3, L('"Average: " + 52.5 raises…', '"Average: " + 52.5 কী ত্রুটি দেয়?'), ['TypeError', 'SyntaxError', 'NameError', 'No error'], 0, L('str + float', 'str + float'), L('Use str() or an f-string.', 'str() বা f-string ব্যবহার করো।'), 'ict-04'),
      M(3, L('What uniquely identifies each record in a table?', 'টেবিলে প্রতিটি রেকর্ড অনন্যভাবে চিহ্নিত করে কী?'), [L('Primary key', 'প্রাইমারি কি'), L('Foreign key', 'ফরেন কি'), L('Field name', 'ফিল্ডের নাম'), L('Index number in Excel', 'এক্সেলের সারি নম্বর')], 0, L('"Primary".', '"প্রাইমারি"।'), L('Primary key.', 'প্রাইমারি কি।'), 'ict-06')
    ]
  };

  /* ===================================================================== */
  /* Part 3, Real-world Boss Battles                                       */
  /* ===================================================================== */
  D.BOSSES = {
    bio: {
      name: L('The Fever Phantom', 'জ্বরের ভূত'), face: 'stethoscope',
      story: L('Upazila Health Complex, Kurigram. Rina (14) has had a high fever for 3 days with body aches. The doctor is busy, help the health assistant interpret the clues. (Educational simulation, not medical advice.)', 'উপজেলা স্বাস্থ্য কমপ্লেক্স, কুড়িগ্রাম। রিনা (১৪) ৩ দিন ধরে তীব্র জ্বর ও শরীর ব্যথায় ভুগছে। স্বাস্থ্য সহকারীকে সূত্রগুলো বুঝতে সাহায্য করো। (শিক্ষামূলক সিমুলেশন, চিকিৎসা পরামর্শ নয়।)'),
      clues: L('CBC: WBC 3,200/µL (normal 4,000–11,000) · Platelets 85,000/µL (normal 150,000–450,000) · Hematocrit rising · NS1 antigen: POSITIVE · Season: monsoon, Aedes larvae found nearby', 'CBC: WBC ৩,২০০/µL (স্বাভাবিক ৪,০০০–১১,০০০) · প্লাটিলেট ৮৫,০০০/µL (স্বাভাবিক ১,৫০,০০০–৪,৫০,০০০) · হেমাটোক্রিট বাড়ছে · NS1: পজিটিভ · ঋতু: বর্ষা, কাছে এডিস লার্ভা'),
      stages: [
        { q: L('What is the most likely cause?', 'সবচেয়ে সম্ভাব্য কারণ কী?'), o: [L('Dengue virus', 'ডেঙ্গু ভাইরাস'), L('Bacterial typhoid', 'ব্যাকটেরিয়াজনিত টাইফয়েড'), L('Food allergy', 'খাদ্য অ্যালার্জি'), L('Vitamin deficiency', 'ভিটামিনের অভাব')], a: 0, why: L('Low WBC + low platelets + positive NS1 in monsoon season point to dengue.', 'কম WBC + কম প্লাটিলেট + NS1 পজিটিভ + বর্ষা → ডেঙ্গু।'), cite: 'bio-06' },
        { q: L('Which fast, non-specific defence cells respond first and help cause fever?', 'কোন দ্রুত, অনির্দিষ্ট প্রতিরক্ষা কোষ প্রথমে সাড়া দেয় ও জ্বরে ভূমিকা রাখে?'), o: [L('Innate cells (macrophages, NK cells)', 'সহজাত কোষ (ম্যাক্রোফেজ, NK কোষ)'), L('Memory B cells', 'মেমোরি B কোষ'), L('Red blood cells', 'লোহিত কণিকা'), L('Platelets', 'অণুচক্রিকা')], a: 0, why: L('The innate response acts within hours; NK cells attack virus-infected cells.', 'সহজাত প্রতিরক্ষা ঘণ্টার মধ্যে কাজ করে; NK কোষ আক্রান্ত কোষে আক্রমণ করে।'), cite: 'bio-04' },
        { q: L('Which adaptive cells destroy Rina\'s virus-infected cells?', 'কোন অর্জিত প্রতিরক্ষা কোষ রিনার ভাইরাস-আক্রান্ত কোষ ধ্বংস করে?'), o: [L('Cytotoxic (CD8⁺) T cells', 'সাইটোটক্সিক (CD8⁺) T কোষ'), L('Helper T cells only', 'শুধু হেল্পার T কোষ'), L('Neutrophils only', 'শুধু নিউট্রোফিল'), L('Antibiotics', 'অ্যান্টিবায়োটিক')], a: 0, why: L('CD8⁺ T cells recognise and kill infected body cells.', 'CD8⁺ T কোষ আক্রান্ত দেহকোষ চিনে ধ্বংস করে।'), cite: 'bio-05' },
        { q: L('The family wants antibiotics from the pharmacy. Best response?', 'পরিবার ফার্মেসি থেকে অ্যান্টিবায়োটিক চায়। সেরা উত্তর?'), o: [L('Antibiotics don\'t act on viruses, get clinical care and watch warning signs', 'অ্যান্টিবায়োটিক ভাইরাসে কাজ করে না, চিকিৎসকের কাছে যাও ও সতর্কসংকেত লক্ষ্য রাখো'), L('Yes, start any antibiotic', 'হ্যাঁ, যেকোনো অ্যান্টিবায়োটিক'), L('Give aspirin and wait a week', 'অ্যাসপিরিন দিয়ে এক সপ্তাহ অপেক্ষা'), L('Nothing is needed', 'কিছুই লাগবে না')], a: 0, why: L('Dengue care is supportive and clinician-led; warning signs need urgent assessment.', 'ডেঙ্গুর চিকিৎসা সহায়ক ও চিকিৎসক-নির্দেশিত; সতর্কসংকেতে দ্রুত মূল্যায়ন দরকার।'), cite: 'bio-06' }
      ]
    },
    chem: {
      name: L('The Acid Serpent of the Turag', 'তুরাগের অম্ল-সর্প'), face: 'droplet',
      story: L('An industrial spill has turned a stretch of the Turag river acidic. Fish are dying. Your field kit: burette, 0.10 M NaOH, phenolphthalein. Neutralise the serpent!', 'একটি শিল্প-বর্জ্য তুরাগ নদীর একাংশ অম্লীয় করেছে। মাছ মরছে। তোমার কিট: ব্যুরেট, ০.১০ M NaOH, ফেনলফথ্যালিন। সর্পকে প্রশমিত করো!'),
      clues: L('Sample: 25.0 mL river water · pH 3.0 · Titrant: 0.10 M NaOH · Endpoint (faint pink) at 20.0 mL · Contaminated section ≈ 10,000 L', 'নমুনা: ২৫.০ mL নদীর পানি · pH ৩.০ · টাইট্রান্ট: ০.১০ M NaOH · প্রান্তবিন্দু (হালকা গোলাপি) ২০.০ mL · দূষিত অংশ ≈ ১০,০০০ L'),
      stages: [
        { q: L('Write the neutralisation reaction (assume the acid is HCl).', 'প্রশমন বিক্রিয়াটি লেখো (অম্ল HCl ধরো)।'), o: ['HCl + NaOH → NaCl + H₂O', 'HCl + NaOH → NaH + HClO', '2HCl + NaOH → NaCl₂ + H₂O', 'HCl + NaOH → Na + Cl + H₂O'], a: 0, why: L('Acid + base → salt + water, 1 : 1.', 'অম্ল + ক্ষার → লবণ + পানি, ১:১।'), cite: 'chem-02' },
        { q: L('Concentration of HCl in the river sample? (mol/L)', 'নমুনায় HCl-এর ঘনমাত্রা? (mol/L)'), num: 0.08, tol: 0.002, unit: 'M', why: L('M_acid = (0.10 × 20.0) / 25.0 = 0.080 M', 'M_acid = (০.১০ × ২০.০) / ২৫.০ = ০.০৮০ M'), cite: 'chem-03' },
        { q: L('Moles of NaOH needed to neutralise the 10,000 L section?', '১০,০০০ L অংশ প্রশমনে কত মোল NaOH লাগবে?'), num: 800, tol: 5, unit: 'mol', why: L('n = 0.080 mol/L × 10,000 L = 800 mol (1 : 1 ratio).', 'n = ০.০৮০ × ১০,০০০ = ৮০০ মোল (১:১)।'), cite: 'chem-03' },
        { q: L('Mass of NaOH in kilograms? (M = 40 g/mol)', 'NaOH-এর ভর কেজিতে? (M = 40 g/mol)'), num: 32, tol: 0.5, unit: 'kg', why: L('800 mol × 40 g/mol = 32,000 g = 32 kg. (Real plants often use cheaper lime, Ca(OH)₂, and add it gradually while monitoring pH.)', '৮০০ × ৪০ = ৩২,০০০ g = ৩২ kg। (বাস্তবে সস্তা চুন ধীরে ধীরে যোগ করে pH মাপা হয়।)'), cite: 'chem-06' }
      ]
    },
    math: {
      name: L('The Flood Cyclops', 'বন্যার একচোখা দানব'), face: 'drone',
      story: L('Floods have cut off a char village near Gaibandha. A relief drone follows the flight path y = −0.05x² + 2x + 20 (metres, x = horizontal distance from launch). Plan its mission.', 'গাইবান্ধার একটি চর গ্রাম বন্যায় বিচ্ছিন্ন। ত্রাণ ড্রোনের উড্ডয়নপথ y = −0.05x² + 2x + 20 (মিটার, x = উৎক্ষেপণ থেকে অনুভূমিক দূরত্ব)। মিশন পরিকল্পনা করো।'),
      clues: L('Path: y = −0.05x² + 2x + 20 · Launch platform height: 20 m · A 30 m mobile tower stands somewhere along the route', 'পথ: y = −0.05x² + 2x + 20 · উৎক্ষেপণ মঞ্চ ২০ m উঁচু · পথে কোথাও ৩০ m মোবাইল টাওয়ার'),
      stages: [
        { q: L('At what horizontal distance x is the drone highest? (m)', 'কোন অনুভূমিক দূরত্ব x-এ ড্রোন সর্বোচ্চ? (m)'), num: 20, tol: 0.1, unit: 'm', why: L('x = −b/(2a) = −2 / (2 × −0.05) = 20 m', 'x = −b/(2a) = −২ / (২ × −০.০৫) = ২০ m'), cite: 'math-04' },
        { q: L('What is the maximum height? (m)', 'সর্বোচ্চ উচ্চতা কত? (m)'), num: 40, tol: 0.1, unit: 'm', why: L('y(20) = −0.05(400) + 40 + 20 = 40 m, it clears the 30 m tower.', 'y(20) = −২০ + ৪০ + ২০ = ৪০ m, ৩০ m টাওয়ার পেরিয়ে যায়।'), cite: 'math-04' },
        { q: L('Where does the path reach ground level (y = 0, positive x)? (m, 1 decimal)', 'কোথায় পথ ভূমিতে (y = 0, ধনাত্মক x) পৌঁছায়? (m, ১ দশমিক)'), num: 48.3, tol: 0.3, unit: 'm', why: L('0.05x² − 2x − 20 = 0 → x = 20 + √800 ≈ 48.3 m', '0.05x² − 2x − 20 = 0 → x = 20 + √800 ≈ ৪৮.৩ m'), cite: 'math-04' },
        { q: L('Which statement about the path is TRUE?', 'পথ সম্পর্কে কোন উক্তি সত্য?'), o: [L('It is a downward-opening parabola because a < 0', 'a < 0 বলে এটি নিচে খোলা পরাবৃত্ত'), L('It is a straight line', 'এটি সরলরেখা'), L('It opens upward', 'উপরে খোলে'), L('It never comes down', 'কখনো নামে না')], a: 0, why: L('a = −0.05 < 0, so the vertex is a maximum.', 'a = −০.০৫ < ০, তাই শীর্ষবিন্দু সর্বোচ্চ।'), cite: 'math-04' }
      ]
    },
    eq: {
      name: L('The Storm Titan', 'ঝড়ের দৈত্য'), face: 'zap',
      story: L('The relief drone now flies level at 45 m with a horizontal speed of 12 m/s. It must drop a medicine box onto a flood shelter roof. Take g = 10 m/s² and ignore air resistance.', 'ত্রাণ ড্রোন এখন ৪৫ m উচ্চতায় ১২ m/s অনুভূমিক বেগে উড়ছে। ওষুধের বাক্স আশ্রয়কেন্দ্রের ছাদে ফেলতে হবে। g = 10 m/s², বায়ুর বাধা উপেক্ষা।'),
      clues: L('Height h = 45 m · Horizontal speed v₀ = 12 m/s · g = 10 m/s²', 'উচ্চতা h = ৪৫ m · অনুভূমিক বেগ v₀ = ১২ m/s · g = ১০ m/s²'),
      stages: [
        { q: L('How long does the box take to fall? (s)', 'বাক্সটি পড়তে কত সময় লাগবে? (s)'), num: 3, tol: 0.05, unit: 's', why: L('t = √(2h/g) = √(90/10) = 3 s', 't = √(2h/g) = √(৯০/১০) = ৩ s'), cite: 'eq-03' },
        { q: L('How far ahead of the target must the drone release it? (m)', 'লক্ষ্যের কত আগে ড্রোন বাক্স ছাড়বে? (m)'), num: 36, tol: 0.2, unit: 'm', why: L('x = v₀t = 12 × 3 = 36 m (horizontal speed is constant).', 'x = v₀t = ১২ × ৩ = ৩৬ m (অনুভূমিক বেগ ধ্রুব)।'), cite: 'eq-03' },
        { q: L('Vertical speed just before impact? (m/s)', 'ছাদে পড়ার ঠিক আগে উল্লম্ব বেগ? (m/s)'), num: 30, tol: 0.2, unit: 'm/s', why: L('v = u + at = 0 + 10 × 3 = 30 m/s', 'v = u + at = ০ + ১০ × ৩ = ৩০ m/s'), cite: 'eq-01' },
        { q: L('Which equation describes the box\'s trajectory?', 'বাক্সের গতিপথ কোন সমীকরণ?'), o: ['y = 45 − 10x²/288', 'y = 45 − 12x', 'y = 45x − 5x²', 'y = 10x²/288'], a: 0, why: L('y = h − g x²/(2v₀²) = 45 − 10x²/(2 × 144)', 'y = h − g x²/(2v₀²) = ৪৫ − ১০x²/(২ × ১৪৪)'), cite: 'eq-03' }
      ]
    },
    ict: {
      name: L('The Corrupted Code Golem', 'দূষিত কোডের গোলেম'), face: 'bug',
      story: L('A rural clinic\'s patient script crashed and the nurse can\'t see the average patient age. Click each buggy line, then choose the fix. Three bugs hide in 8 lines.', 'একটি গ্রামীণ ক্লিনিকের রোগী স্ক্রিপ্ট ক্র্যাশ করেছে। প্রতিটি বাগযুক্ত লাইনে ক্লিক করে ঠিক করো। ৮ লাইনে ৩টি বাগ।'),
      code: [
        'patients = load_records("clinic.csv")',
        'total = 0',
        'for i in range(1, len(patients)):',
        '    total = total + patients[i]["age"]',
        'average = total / len(patients)',
        'if average > 60',
        '    print("Elderly-care alert")',
        'print("Average age: " + average)'
      ],
      bugs: {
        2: { o: ['for i in range(len(patients)):', 'for i in range(1, len(patients) - 1):', 'for i in range(0, len(patients) + 1):'], a: 0, why: L('Indexes start at 0, starting at 1 skips the first patient (off-by-one).', 'ইনডেক্স ০ থেকে শুরু, ১ থেকে শুরু করলে প্রথম রোগী বাদ যায়।'), cite: 'ict-04' },
        5: { o: ['if average > 60:', 'if (average > 60)', 'if average => 60:'], a: 0, why: L('An if header must end with a colon.', 'if-এর শেষে কোলন লাগবে।'), cite: 'ict-04' },
        7: { o: ['print(f"Average age: {average:.1f}")', 'print("Average age: " + int)', 'print("Average age: ", + average)'], a: 0, why: L('str + float raises TypeError, use an f-string or str().', 'str + float → TypeError, f-string বা str() ব্যবহার করো।'), cite: 'ict-04' }
      }
    }
  };
})();

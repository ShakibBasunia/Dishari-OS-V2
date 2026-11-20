/* Dishari OS, demo personas & illustrative sample data.
   All people, schools and figures in this file are fictional or illustrative and are labelled
   "Sample data" in the UI. Real, sourced statistics live in D.FACTS with citations. */
(function () {
  'use strict';
  const D = window.D;
  const L = (en, bn) => ({ en, bn });

  /* ---------------- Sourced facts (shown with source links) ---------------- */
  D.FACTS = {
    secondary: { v: '9.4M', label: L('secondary-level students in Bangladesh; 6.5M of them in rural areas', 'মাধ্যমিক শিক্ষার্থী; এর ৬৫ লাখ গ্রামাঞ্চলে'), src: 'BANBEIS via Bonik Barta (2025)', url: 'https://en.bonikbarta.com/bangladesh/JhDMeK0yiyDtEmOZ' },
    dropout: { v: '14%', label: L('secondary dropout rate in 2025 (girls 14.5%), up from 9.9% in 2024', '২০২৫ সালে মাধ্যমিকে ঝরে পড়ার হার (মেয়েরা ১৪.৫%)'), src: 'BANBEIS Education Statistics 2025 via Daily Sun', url: 'https://www.daily-sun.com/bangladesh/904738' },
    tutoring: { v: '>75%', label: L('of surveyed students relied on private tutors or coaching centres', 'জরিপকৃত শিক্ষার্থী প্রাইভেট টিউটর বা কোচিং-নির্ভর'), src: 'CAMPE study via TBS News', url: 'https://www.tbsnews.net/bangladesh/education/cost-education-jumps-51-secondary-25-primary-students-study-819286' },
    neet: { v: '8.56M', label: L('young people aged 15–29 not in education, employment or training (NEET)', '১৫–২৯ বছর বয়সী শিক্ষা, কর্ম বা প্রশিক্ষণে নেই (NEET)'), src: 'BBS Quarterly LFS 2024, cited by SANEM via The Financial Express', url: 'https://thefinancialexpress.com.bd/youth-and-entrepreneurship/youth-support-in-bangladesh' },
    tertiaryUnemp: { v: '31.5%', label: L('of unemployed youth have completed tertiary education, the education-to-employment gap', 'বেকার যুবকের ৩১.৫% উচ্চশিক্ষিত, শিক্ষা থেকে কর্মসংস্থানের ফাঁক'), src: 'BBS Labour Force Survey 2023 via TBS News', url: 'https://www.tbsnews.net/bangladesh/194-million-youth-unemployed-bbs-survey-1025001' },
    notPrepared: { v: '30.8%', label: L('of surveyed youth said education prepared them "not at all" for the job market', 'জরিপকৃত যুবক বলেছেন শিক্ষা তাদের চাকরির জন্য "একেবারেই" প্রস্তুত করেনি'), src: 'SANEM & ActionAid youth survey (May 2025) via The Financial Express', url: 'https://thefinancialexpress.com.bd/youth-and-entrepreneurship/youth-support-in-bangladesh' },
    entrants: { v: '~2M', label: L('young people enter Bangladesh\'s labour force every year', 'তরুণ প্রতি বছর শ্রমবাজারে প্রবেশ করে'), src: 'ILO Global Employment Trends for Youth 2024 via Dhaka Tribune', url: 'https://www.dhakatribune.com/bangladesh/354506/report-bangladesh-other-south-asian-countries' },
    pdpo: { v: 'PDPO 2025', label: L('Bangladesh Personal Data Protection Ordinance, citizens own their personal data; explicit consent required', 'ব্যক্তিগত উপাত্ত সুরক্ষা অধ্যাদেশ, নাগরিক তার তথ্যের মালিক; স্পষ্ট সম্মতি প্রয়োজন'), src: 'Biometric Update (Nov 2025)', url: 'https://www.biometricupdate.com/202511/bangladesh-strengthens-data-security-in-preparation-for-data-exchange-digital-id' }
  };

  /* ---------------- Peer-reviewed research evidence ---------------- */
  D.RESEARCH = [
    { id: 'bloom', title: L('Bloom\'s 2-Sigma Problem', 'ব্লুমের ২-সিগমা সমস্যা'), cite: 'Bloom, B. S. (1984). The 2 Sigma Problem: The Search for Methods of Group Instruction as Effective as One-to-One Tutoring. Educational Researcher, 13(6), 4–16.', doi: 'https://doi.org/10.3102/0013189X013006004',
      finding: L('Students taught 1:1 with mastery learning scored about 2 standard deviations above conventional classes, the average tutored student outperformed ~98% of the control group.', '১:১ টিউটরিং ও মাস্টারি লার্নিং-এ শিক্ষার্থীরা প্রচলিত ক্লাসের চেয়ে প্রায় ২ স্ট্যান্ডার্ড ডেভিয়েশন এগিয়ে ছিল।'),
      caveat: L('Later meta-analyses find smaller but robust effects for computer tutors: VanLehn (2011) reported d ≈ 0.76 for step-based intelligent tutoring systems, close to human tutoring (d ≈ 0.79). We plan with these conservative numbers.', 'পরবর্তী মেটা-অ্যানালাইসিসে কম্পিউটার টিউটরের প্রভাব কম কিন্তু দৃঢ়: VanLehn (2011) d ≈ ০.৭৬। আমরা এই রক্ষণশীল মান ধরে পরিকল্পনা করি।'),
      feature: L('Adaptive tutor + Bloom ladder + mastery gating', 'অ্যাডাপটিভ টিউটর + ব্লুম ল্যাডার'), d: 0.76 },
    { id: 'protege', title: L('The Protégé Effect', 'প্রোটেজে ইফেক্ট'), cite: 'Chase, C. C., Chin, D. B., Oppezzo, M. A., & Schwartz, D. L. (2009). Teachable Agents and the Protégé Effect: Increasing the Effort Towards Learning. Journal of Science Education and Technology, 18(4), 334–352.', doi: 'https://doi.org/10.1007/s10956-009-9180-4',
      finding: L('Students put more effort into learning when they were teaching a computer agent than when learning for themselves, and learned more as a result.', 'কম্পিউটার এজেন্টকে শেখানোর সময় শিক্ষার্থীরা নিজের জন্য শেখার চেয়ে বেশি পরিশ্রম করেছে এবং বেশি শিখেছে।'),
      caveat: L('We do not use the popular "90% retention" figure, it comes from the "learning pyramid", which has no empirical basis.', 'জনপ্রিয় "৯০% মনে থাকে" সংখ্যাটি আমরা ব্যবহার করি না, এটি "লার্নিং পিরামিড" থেকে আসা, যার গবেষণাভিত্তি নেই।'),
      feature: L('Feynman "Teach-the-AI" mode', 'ফাইনম্যান "এআইকে শেখাও" মোড') },
    { id: 'rag', title: L('Retrieval-Augmented Generation', 'রিট্রিভাল-অগমেন্টেড জেনারেশন'), cite: 'Lewis, P. et al. (2020). Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. NeurIPS 33. · Shuster, K. et al. (2021). Retrieval Augmentation Reduces Hallucination in Conversation. Findings of EMNLP.', doi: 'https://arxiv.org/abs/2005.11401',
      finding: L('Conditioning generation on retrieved documents produces more specific and factual answers than a model\'s parametric memory alone, and substantially reduces hallucination in dialogue.', 'উদ্ধারকৃত নথির ভিত্তিতে উত্তর তৈরি করলে তা আরও নির্দিষ্ট ও তথ্যনিষ্ঠ হয় এবং হ্যালুসিনেশন উল্লেখযোগ্যভাবে কমে।'),
      caveat: L('RAG reduces but does not eliminate errors, so Dishari also refuses below a retrieval-confidence threshold and shows every source.', 'RAG ভুল কমায় কিন্তু শূন্য করে না, তাই দিশারী নিম্ন আত্মবিশ্বাসে উত্তর দেয় না এবং সব উৎস দেখায়।'),
      feature: L('Curriculum-grounded RAG + citation drawer', 'পাঠ্যক্রম-ভিত্তিক RAG + সাইটেশন') },
    { id: 'zpd', title: L('Zone of Proximal Development & Scaffolding', 'নিকটবর্তী বিকাশ অঞ্চল ও স্ক্যাফোল্ডিং'), cite: 'Vygotsky, L. S. (1978). Mind in Society. Harvard University Press. · Wood, D., Bruner, J. S., & Ross, G. (1976). The role of tutoring in problem solving. Journal of Child Psychology and Psychiatry, 17(2), 89–100.', doi: 'https://doi.org/10.1111/j.1469-7610.1976.tb00381.x',
      finding: L('Learners can solve problems just beyond their independent level when support is given and then gradually faded ("scaffolding").', 'সহায়তা পেলে শিক্ষার্থী নিজের সামর্থ্যের একটু উপরের সমস্যা সমাধান করতে পারে; ধীরে ধীরে সহায়তা কমানো হয়।'),
      caveat: L('Hint levels in Dishari fade automatically as consecutive correct steps accumulate.', 'পরপর সঠিক ধাপে দিশারীর হিন্ট স্বয়ংক্রিয়ভাবে কমে।'),
      feature: L('Scaffolding mode with fading hints', 'ফেডিং হিন্টসহ স্ক্যাফোল্ডিং') },
    { id: 'gamify', title: L('Gamification of Learning', 'শিক্ষায় গেমিফিকেশন'), cite: 'Sailer, M., & Homner, L. (2020). The Gamification of Learning: a Meta-analysis. Educational Psychology Review, 32(1), 77–112.', doi: 'https://doi.org/10.1007/s10648-019-09498-w',
      finding: L('Significant small positive effects on cognitive (g = .49), motivational (g = .36) and behavioural (g = .25) learning outcomes; game fiction and social interaction were important moderators.', 'জ্ঞানগত (g = .৪৯), প্রেরণাগত (g = .৩৬) ও আচরণগত (g = .২৫) ফলাফলে ছোট কিন্তু উল্লেখযোগ্য ইতিবাচক প্রভাব।'),
      caveat: L('Effects depend on design, so Dishari pairs game mechanics with real-world story (Boss Battles) and collaboration (Co-op), the moderators the meta-analysis highlights.', 'প্রভাব নকশার উপর নির্ভরশীল, তাই দিশারী বাস্তব গল্প (বস ব্যাটল) ও সহযোগিতা (কো-অপ) যুক্ত করে।'),
      feature: L('4-part Quest & Boss Arena', '৪-পর্বের কোয়েস্ট ও বস অ্যারেনা'), d: 0.49 }
  ];

  /* ---------------- Demo student: Aurin Jahan ---------------- */
  D.NUSRAT = {
    id: 'stu-rp-0415', name: 'Aurin Jahan', nameBn: 'আউরিন জাহান', short: 'Aurin',
    role: L('HSC Science · Aspiring Biomedical AI Engineer', 'এইচএসসি বিজ্ঞান · ভবিষ্যৎ বায়োমেডিকেল AI প্রকৌশলী'),
    place: L('Rangpur, Bangladesh', 'রংপুর, বাংলাদেশ'), school: L('Rangpur Govt. College (sample)', 'রংপুর সরকারি কলেজ (নমুনা)'),
    goal: L('Biomedical AI Engineer', 'বায়োমেডিকেল AI প্রকৌশলী'), initials: 'NJ'
  };
  D.loginStudent = () => {
    const s = D.state;
    s.role = 'student';
    s.user = { id: D.NUSRAT.id, name: D.NUSRAT.name, short: D.NUSRAT.short };
    s.game = Object.assign(s.game, {
      xp: Math.max(s.game.xp, 21450), streak: Math.max(s.game.streak, 21), gems: Math.max(s.game.gems, 340), bestCombo: Math.max(s.game.bestCombo, 9),
      quests: (() => { const seed = { bio: { p1: 100, p2: 100, p3: 50, p4: 60 }, chem: { p1: 100, p2: 80, p3: 0, p4: 40 }, math: { p1: 100, p2: 60, p3: 25, p4: 30 }, eq: { p1: 80, p2: 50, p3: 0, p4: 20 }, ict: { p1: 60, p2: 40, p3: 0, p4: 10 } }; const q = s.game.quests || {}; Object.keys(seed).forEach((k) => { const cur = q[k] || {}; ['p1', 'p2', 'p3', 'p4'].forEach((p) => { seed[k][p] = Math.max(seed[k][p], cur[p] || 0); }); }); return Object.assign({}, q, seed); })()
    });
    if (!s.game.badges.length) {
      s.game.badges = [
        { id: 'streak-21', label: L('21-day streak', '২১ দিনের ধারা'), icon: 'flame' },
        { id: 'cell-architect', label: L('Cell Architect', 'কোষ স্থপতি'), icon: 'award' },
        { id: 'balancer', label: L('Equation Balancer', 'সমীকরণ সমতাকারী'), icon: 'award' },
        { id: 'combo-9', label: L('Combo ×9', 'কম্বো ×৯'), icon: 'award' },
        { id: 'feynman-80', label: L('Feynman Clarity 80+', 'ফাইনম্যান স্পষ্টতা ৮০+'), icon: 'award' },
        { id: 'level-15', label: L('Reached Level 15', 'লেভেল ১৫'), icon: 'award' }
      ];
    }
    s.bloom = { remember: Math.max(s.bloom.remember, 92), understand: Math.max(s.bloom.understand, 84), apply: Math.max(s.bloom.apply, 76), analyze: Math.max(s.bloom.analyze, 63), evaluate: Math.max(s.bloom.evaluate, 51), create: Math.max(s.bloom.create, 38) };
    if (!s.passports.find((p) => p.skill === 'BIOINF-101')) s.passports.push(D.SAMPLE_PASSPORT);
    D.save();
    D.log('auth.demo_login', 'student:' + D.NUSRAT.id);
  };
  D.loginAdmin = () => {
    D.state.role = 'admin';
    D.state.user = { id: 'adm-ngo-007', name: 'Farhana Rahman', short: 'Farhana' };
    D.save();
    D.log('auth.demo_login', 'admin:adm-ngo-007');
  };
  D.logout = () => { D.log('auth.logout'); D.state.role = 'guest'; D.state.user = null; D.save(); };

  D.SAMPLE_PASSPORT = {
    id: 'DSP-2026-RP-0415-B1', holder: 'Aurin Jahan', holderId: 'stu-rp-0415', skill: 'BIOINF-101',
    title: L('Bioinformatics Data Analysis, Foundations', 'বায়োইনফরমেটিক্স ডেটা অ্যানালাইসিস, ভিত্তি'),
    level: 'Foundation', onet: '19-1029.01', issued: '2026-11-02', viva: '3/3', task: 'GC-content analysis', hash: ''
  };

  /* ---------------- Careers (O*NET-linked) ---------------- */
  D.CAREERS = [
    { id: 'bioinf', onet: '19-1029.01', chunk: 'car-01', name: L('Bioinformatics Scientist', 'বায়োইনফরমেটিক্স বিজ্ঞানী'), w: { bio: 0.4, chem: 0.15, math: 0.2, ict: 0.25 }, intern: 'gc' },
    { id: 'biomed', onet: '17-2031.00', chunk: 'car-03', name: L('Biomedical (AI) Engineer', 'বায়োমেডিকেল (AI) প্রকৌশলী'), w: { bio: 0.35, eq: 0.2, math: 0.2, ict: 0.25 }, intern: 'gc' },
    { id: 'data', onet: '15-2051.00', chunk: 'car-02', name: L('Data Scientist', 'ডেটা সায়েন্টিস্ট'), w: { math: 0.45, ict: 0.45, eq: 0.1 }, intern: 'clinic' },
    { id: 'env', onet: '19-2041.00', chunk: 'car-05', name: L('Environmental Scientist', 'পরিবেশ বিজ্ঞানী'), w: { chem: 0.5, bio: 0.3, math: 0.2 }, intern: 'river' },
    { id: 'quant', onet: '13-2099.01', chunk: 'car-06', name: L('FinTech Quant Analyst', 'ফিনটেক কোয়ান্ট অ্যানালিস্ট'), w: { math: 0.6, ict: 0.3, eq: 0.1 }, intern: 'emi' },
    { id: 'swe', onet: '15-1252.00', chunk: 'car-04', name: L('Software Developer', 'সফটওয়্যার ডেভেলপার'), w: { ict: 0.7, math: 0.3 }, intern: 'clinic' }
  ];

  /* ---------------- Day-in-the-life micro-internships ---------------- */
  D.INTERNSHIPS = {
    gc: { skill: 'BIOINF-101', title: L('Bioinformatics Data Analysis', 'বায়োইনফরমেটিক্স ডেটা অ্যানালাইসিস'), org: L('Sample brief · Genomics lab, Dhaka', 'নমুনা ব্রিফ · জিনোমিক্স ল্যাব, ঢাকা'), icon: 'dna', onet: '19-1029.01',
      brief: L('09:30, Your lead asks for the GC content of a dengue-virus gene fragment before a primer-design meeting. GC content = (G + C) ÷ total bases × 100. Higher GC content means the DNA strands bind more strongly.', '০৯:৩০, প্রাইমার ডিজাইন মিটিংয়ের আগে ডেঙ্গু ভাইরাস জিনের একটি অংশের GC কনটেন্ট দরকার। GC% = (G + C) ÷ মোট বেস × ১০০।'),
      data: 'ATGAATAACCAACGGAAAAAGGCGAAAAACACGCCTTTCAATATGCTGAAACGCGAGAGAAACCGCGTGTCGACTGTGCAACAGCTGACAAAGAGATTCTCACTTGGAATGCTGCAGGGACGAGGACCATTAAAACTGTTCATGGCCCTGGTGGCGTTCCTTCGTTTCCTAACAATCCCACCAACAGCAGGGATATTGAAGAGATGGGGAACAATTAAAAAATCAAAAGCTATTAATGTTTTGAGAGGGTTCAGGAAAGAGATTGGAAGGATGCTGAACATCTTGAATAGGAGACGCAGA',
      ask: L('What is the GC content (%) of this sequence? (1 decimal)', 'এই সিকোয়েন্সের GC কনটেন্ট (%) কত? (১ দশমিক)'), compute: (seq) => { const s = seq.toUpperCase(); const gc = (s.match(/[GC]/g) || []).length; return +((gc / s.length) * 100).toFixed(1); }, tol: 0.25,
      viva: [
        { q: L('GC content measures the share of which bases?', 'GC কনটেন্ট কোন বেসগুলোর অনুপাত?'), o: [L('Guanine and cytosine', 'গুয়ানিন ও সাইটোসিন'), L('Glucose and carbon', 'গ্লুকোজ ও কার্বন'), L('Adenine and thymine', 'অ্যাডেনিন ও থাইমিন'), L('All four bases', 'চারটিই')], a: 0 },
        { q: L('Why does higher GC content make DNA more stable?', 'বেশি GC কেন DNA-কে বেশি স্থিতিশীল করে?'), o: [L('G–C pairs form 3 hydrogen bonds vs 2 for A–T', 'G–C জোড়ে ৩টি হাইড্রোজেন বন্ধন, A–T-তে ২টি'), L('G and C are heavier', 'G ও C ভারী'), L('GC bases are rarer', 'GC বেস দুর্লভ'), L('It does not', 'করে না')], a: 0 },
        { q: L('Which tool would you use to analyse 10,000 sequences automatically?', '১০,০০০ সিকোয়েন্স স্বয়ংক্রিয় বিশ্লেষণে কী ব্যবহার করবে?'), o: [L('A Python loop / script', 'Python লুপ / স্ক্রিপ্ট'), L('A calculator', 'ক্যালকুলেটর'), L('Counting by hand', 'হাতে গোনা'), L('A microscope', 'অণুবীক্ষণ যন্ত্র')], a: 0 }
      ] },
    emi: { skill: 'FINQ-101', title: L('FinTech Algorithm Design', 'ফিনটেক অ্যালগরিদম ডিজাইন'), org: L('Sample brief · Mobile-money startup, Chattogram', 'নমুনা ব্রিফ · মোবাইল-মানি স্টার্টআপ, চট্টগ্রাম'), icon: 'banknote', onet: '13-2099.01',
      brief: L('11:00, A farmer applies for a ৳50,000 micro-loan over 12 months at 1% interest per month. The app must show a fair, fixed monthly instalment (EMI): EMI = P·r·(1+r)ⁿ / ((1+r)ⁿ − 1).', '১১:০০, একজন কৃষক ১২ মাসে মাসিক ১% সুদে ৳৫০,০০০ ঋণ চান। অ্যাপে ন্যায্য মাসিক কিস্তি (EMI) দেখাতে হবে।'),
      data: 'P = 50000 · r = 0.01 · n = 12', ask: L('Monthly EMI in taka? (nearest taka)', 'মাসিক কিস্তি কত টাকা? (নিকটতম টাকা)'), compute: () => { const P = 50000, r = 0.01, n = 12; return Math.round((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)); }, tol: 1.5,
      viva: [
        { q: L('Total amount repaid over 12 months is closest to…', '১২ মাসে মোট পরিশোধ প্রায়…'), o: ['৳53,309', '৳50,000', '৳56,000', '৳60,000'], a: 0 },
        { q: L('If the interest rate rises, the EMI…', 'সুদের হার বাড়লে কিস্তি…'), o: [L('increases', 'বাড়ে'), L('decreases', 'কমে'), L('stays the same', 'একই থাকে'), L('becomes zero', 'শূন্য হয়')], a: 0 },
        { q: L('Why show the total cost clearly to the farmer?', 'কৃষককে মোট খরচ স্পষ্ট দেখানো কেন জরুরি?'), o: [L('Fair, transparent lending and informed consent', 'ন্যায্য, স্বচ্ছ ঋণ ও অবহিত সম্মতি'), L('It is not important', 'জরুরি নয়'), L('To increase fees', 'ফি বাড়াতে'), L('To hide interest', 'সুদ লুকাতে')], a: 0 }
      ] },
    river: { skill: 'ENVCHEM-101', title: L('Environmental Monitoring Analyst', 'পরিবেশ পর্যবেক্ষণ বিশ্লেষক'), org: L('Sample brief · River-monitoring NGO, Gazipur', 'নমুনা ব্রিফ · নদী পর্যবেক্ষণ এনজিও, গাজীপুর'), icon: 'droplet', onet: '19-2041.00',
      brief: L('14:00, A 50.0 mL water sample needs 12.5 mL of 0.20 M NaOH to reach the phenolphthalein endpoint. Report the acid concentration (assume a 1:1 monoprotic acid).', '১৪:০০, ৫০.০ mL নমুনায় ০.২০ M NaOH-এর ১২.৫ mL লাগে। অম্লের ঘনমাত্রা জানাও (১:১ ধরো)।'),
      data: 'V_acid = 50.0 mL · M_base = 0.20 M · V_base = 12.5 mL', ask: L('Acid concentration in mol/L? (3 decimals)', 'অম্লের ঘনমাত্রা mol/L-এ? (৩ দশমিক)'), compute: () => +((0.2 * 12.5) / 50).toFixed(3), tol: 0.002,
      viva: [
        { q: L('At the equivalence point of a strong acid–strong base titration, pH ≈', 'শক্তিশালী অম্ল–ক্ষার টাইট্রেশনের সমতুল্য বিন্দুতে pH ≈'), o: ['7', '3', '10', '1'], a: 0 },
        { q: L('Why is lime often preferred over NaOH for large spills?', 'বড় দূষণে NaOH-এর চেয়ে চুন কেন পছন্দনীয়?'), o: [L('Cheaper and safer to handle at scale', 'সস্তা ও নিরাপদ'), L('It is acidic', 'এটি অম্লীয়'), L('It colours the water', 'পানি রঙিন করে'), L('It is illegal to use NaOH', 'NaOH নিষিদ্ধ')], a: 0 },
        { q: L('pH 4 is how many times more acidic than pH 6?', 'pH ৪, pH ৬-এর চেয়ে কতগুণ বেশি অম্লীয়?'), o: ['100×', '2×', '10×', '1000×'], a: 0 }
      ] },
    clinic: { skill: 'PYDATA-101', title: L('Health-Data Engineer (Python)', 'স্বাস্থ্য-ডেটা ইঞ্জিনিয়ার (Python)'), org: L('Sample brief · Community clinic network, Sunamganj', 'নমুনা ব্রিফ · কমিউনিটি ক্লিনিক নেটওয়ার্ক, সুনামগঞ্জ'), icon: 'stethoscope', onet: '15-1252.00',
      brief: L('16:30, Write logic to count patients with temperature above 38.0 °C in today\'s triage list so the nurse can prioritise them.', '১৬:৩০, আজকের তালিকায় ৩৮.০°C-এর বেশি জ্বরের রোগী গুনে নার্সকে অগ্রাধিকার দিতে সাহায্য করো।'),
      data: '[37.2, 38.6, 39.1, 36.9, 38.0, 40.2, 37.8, 38.4, 36.5, 39.7, 37.0, 38.1]', ask: L('How many temperatures are strictly greater than 38.0?', '৩৮.০-এর চেয়ে বেশি কয়টি তাপমাত্রা?'), compute: (s) => JSON.parse(s).filter((t) => t > 38.0).length, tol: 0,
      viva: [
        { q: L('Which Python expression counts values above 38?', 'কোন Python এক্সপ্রেশন ৩৮-এর বেশি মান গোনে?'), o: ['sum(1 for t in temps if t > 38)', 'len(temps) > 38', 'count(temps, 38)', 'temps.count(>38)'], a: 0 },
        { q: L('Is 38.0 included by "t > 38.0"?', '"t > 38.0"-এ কি 38.0 অন্তর্ভুক্ত?'), o: [L('No, strictly greater', 'না, কঠোরভাবে বড়'), L('Yes', 'হ্যাঁ'), L('Only in Python 2', 'শুধু Python 2-এ'), L('Randomly', 'এলোমেলোভাবে')], a: 0 },
        { q: L('Before sharing this data with a district dashboard, you should…', 'জেলা ড্যাশবোর্ডে শেয়ারের আগে তোমার উচিত…'), o: [L('Remove names / IDs and aggregate', 'নাম/আইডি সরিয়ে সমষ্টিগত করা'), L('Post it on social media', 'সোশ্যাল মিডিয়ায় দেওয়া'), L('Email the raw file to everyone', 'সবাইকে কাঁচা ফাইল ইমেইল'), L('Nothing, it is fine', 'কিছু না')], a: 0 }
      ] }
  };

  /* ---------------- Snap-to-Solve samples ---------------- */
  D.SNAPS = [
    { id: 'calc', subject: 'math', title: L('Calculus, integration by parts', 'ক্যালকুলাস, অংশায়ন'), student: 'Arif, HSC (sample)',
      lines: ['∫ x cos x dx', 'u = x ,  dv = cos x dx', 'du = dx ,  v = sin x', '= x sin x − ∫ sin x dx', '= x sin x − (cos x) + C', '= x sin x − cos x + C'],
      err: 4, tag: L('Sign error in a standard antiderivative', 'আদর্শ প্রতিযোজিতে চিহ্নের ভুল'),
      explain: L('Line 5 uses ∫ sin x dx = cos x. The correct result is ∫ sin x dx = −cos x, so −∫ sin x dx = +cos x. The final answer should be x sin x + cos x + C. Lines 1–4 are correct, your integration-by-parts setup is good!', 'লাইন ৫-এ ∫ sin x dx = cos x লেখা হয়েছে। সঠিক হলো ∫ sin x dx = −cos x, তাই −∫ sin x dx = +cos x। চূড়ান্ত উত্তর x sin x + cos x + C। লাইন ১–৪ সঠিক!'),
      fix: 'x sin x + cos x + C', cite: 'math-05',
      drills: [
        { q: L('∫ sin x dx = ?', '∫ sin x dx = ?'), o: ['−cos x + C', 'cos x + C', 'sin x + C', '−sin x + C'], a: 0 },
        { q: L('d/dx (cos x) = ?', 'd/dx (cos x) = ?'), o: ['−sin x', 'sin x', 'cos x', '−cos x'], a: 0 },
        { q: L('∫ x sin x dx = ?', '∫ x sin x dx = ?'), o: ['−x cos x + sin x + C', 'x cos x − sin x + C', 'x sin x + cos x + C', '−x sin x + C'], a: 0 }
      ] },
    { id: 'chem', subject: 'chem', title: L('Chemistry, balancing Al + O₂', 'রসায়ন, Al + O₂ সমতা'), student: 'Sumaiya, SSC (sample)',
      lines: ['Al + O₂ → Al₂O₃', 'Al: 1 left, 2 right  →  2Al', 'O: 2 left, 3 right', '2Al + O₃ → Al₂O₃', 'Balanced '],
      err: 3, tag: L('Changed a subscript instead of a coefficient', 'সহগের বদলে পাদাঙ্ক বদলানো'),
      explain: L('Line 4 changes O₂ into O₃, that is ozone, a different substance! Only coefficients may change. Use the LCM of 2 and 3 (= 6) for oxygen: 4Al + 3O₂ → 2Al₂O₃.', 'লাইন ৪-এ O₂-কে O₃ করা হয়েছে, সেটা ওজোন, ভিন্ন পদার্থ! শুধু সহগ বদলানো যায়। অক্সিজেনের জন্য ২ ও ৩-এর লসাগু ৬: 4Al + 3O₂ → 2Al₂O₃।'),
      fix: '4Al + 3O₂ → 2Al₂O₃', cite: 'chem-01',
      drills: [
        { q: L('Balance: _Na + _Cl₂ → _NaCl', 'সমতা: _Na + _Cl₂ → _NaCl'), o: ['2, 1, 2', '1, 1, 1', '1, 2, 1', '2, 2, 2'], a: 0 },
        { q: L('Balance: _Fe + _O₂ → _Fe₂O₃', 'সমতা: _Fe + _O₂ → _Fe₂O₃'), o: ['4, 3, 2', '2, 3, 1', '3, 2, 1', '4, 2, 2'], a: 0 },
        { q: L('Changing H₂O to H₂O₂ while balancing…', 'সমতার সময় H₂O-কে H₂O₂ করলে…'), o: [L('creates hydrogen peroxide, not allowed', 'হাইড্রোজেন পারক্সাইড হয়, অনুমোদিত নয়'), L('is fine', 'ঠিক আছে'), L('is the preferred method', 'পছন্দের পদ্ধতি'), L('only works for water', 'শুধু পানিতে চলে')], a: 0 }
      ] },
    { id: 'py', subject: 'ict', title: L('Python, sum of 1 to 10', 'Python, ১ থেকে ১০ যোগফল'), student: 'Tanvir, Polytechnic (sample)',
      lines: ['total = 0', 'for i in range(1, 10):', '    total += i', 'print(total)   # expected 55', '>>> 45'],
      err: 1, tag: L('Off-by-one: range() excludes its stop value', 'অফ-বাই-ওয়ান: range() stop বাদ দেয়'),
      explain: L('Line 2 stops at 9 because range(1, 10) excludes 10, so the program prints 45 instead of 55. Fix: for i in range(1, 11):', 'লাইন ২-এ range(1, 10) ১০ বাদ দেয়, তাই ৫৫-এর বদলে ৪৫ আসে। সমাধান: for i in range(1, 11):'),
      fix: 'for i in range(1, 11):', cite: 'ict-03',
      drills: [
        { q: L('range(0, 5) produces how many numbers?', 'range(0, 5) কয়টি সংখ্যা দেয়?'), o: ['5', '6', '4', '0'], a: 0 },
        { q: L('To print 1…100 you need…', '১…১০০ প্রিন্ট করতে লাগবে…'), o: ['range(1, 101)', 'range(1, 100)', 'range(100)', 'range(0, 100)'], a: 0 },
        { q: L('sum(range(1, 11)) = ?', 'sum(range(1, 11)) = ?'), o: ['55', '45', '66', '10'], a: 0 }
      ] },
    { id: 'bio', subject: 'bio', title: L('Biology, Photosynthesis Light Reactions', 'জীববিজ্ঞান, সালোকসংশ্লেষণ আলোক পর্যায়'), student: 'Tasnim, Madrasah Alim (sample)',
      lines: [
        'Photosynthesis: Chloroplast Thylakoid & Stroma',
        '1. Light reaction occurs in thylakoid membrane',
        '2. Photolysis: 2H₂O → 4H⁺ + 4e⁻ + O₂ (released)',
        '3. Electron transport chain synthesizes ATP + NADPH',
        '4. Dark reaction (Calvin cycle) produces C₁₂H₂₂O₁₁ (sucrose)'
      ],
      err: 4, tag: L('Incorrect primary carbohydrate product of Calvin cycle', 'কেলভিন চক্রের প্রাথমিক জৈব শর্করায় ভুল'),
      explain: L('Line 5 states the Calvin cycle produces sucrose (C₁₂H₂₂O₁₁). In reality, carbon fixation in the stroma directly synthesizes triose phosphate / G3P which forms glucose (C₆H₁₂O₆). Sucrose is synthesized later in the cytoplasm for phloem translocation!', 'লাইন ৫-এ কেলভিন চক্রে সরাসরি সুক্রোজ (C₁₂H₂₂O₁₁) তৈরির কথা বলা হয়েছে। প্রকৃতপক্ষে স্ট্রোমাতে কার্বন বিজারণে প্রথমে ট্রায়োজ ফসফেট (G3P) থেকে গ্লুকোজ (C₆H₁₂O₆) তৈরি হয়। পরিবহনযোগ্য সুক্রোজ পরবর্তীতে সাইটোপ্লাজমে সংশ্লেষিত হয়!'),
      fix: 'Stroma: Calvin cycle fixes CO₂ to produce glucose (C₆H₁₂O₆ via G3P)', cite: 'bio-02',
      drills: [
        { q: L('Where does the light-dependent reaction of photosynthesis occur?', 'সালোকসংশ্লেষণের আলোক-নির্ভর বিক্রিয়া কোথায় ঘটে?'), o: [L('Thylakoid membrane of chloroplast', 'ক্লোরোপ্লাস্টের থাইলাকয়েড মেমব্রেন'), L('Stroma of chloroplast', 'ক্লোরোপ্লাস্টের স্ট্রোমা'), L('Mitochondrial matrix', 'মাইটোকন্ড্রিয়া ম্যাট্রিক্স'), L('Cytoplasm', 'সাইটোপ্লাজম')], a: 0 },
        { q: L('Which primary sugar is directly synthesized from Calvin cycle G3P intermediates?', 'কেলভিন চক্রের G3P অন্তর্বর্তী ধাপ থেকে সরাসরি কোন শর্করা সংশ্লেষিত হয়?'), o: ['Glucose (C₆H₁₂O₆)', 'Sucrose (C₁₂H₂₂O₁₁)', 'Starch', 'Cellulose'], a: 0 },
        { q: L('During photolysis of water in Photosystem II, what is released as a byproduct?', 'ফটোসিস্টেম ২-এ পানির সালোক-বিভাজনে উপজাত হিসেবে কী নির্গত হয়?'), o: ['Oxygen (O₂)', 'Carbon dioxide (CO₂)', 'Methane (CH₄)', 'Ozone (O₃)'], a: 0 }
      ] }
  ];

  /* ---------------- Co-op leaderboard (sample) ---------------- */
  D.LEADERBOARD = [
    { name: 'Rangpur Rockets', type: L('Mixed: college + madrasah + polytechnic', 'মিশ্র: কলেজ + মাদ্রাসা + পলিটেকনিক'), district: 'Rangpur', xp: 182400, members: 5, mine: true },
    { name: 'Sylhet Tea-Garden Coders', type: L('Rural school + urban college', 'গ্রামীণ স্কুল + শহুরে কলেজ'), district: 'Sylhet', xp: 179950, members: 5 },
    { name: 'Kurigram Char Scholars', type: L('Char-area schools (rural)', 'চর এলাকার স্কুল'), district: 'Kurigram', xp: 171320, members: 4 },
    { name: 'Bogura Polytechnic Volts', type: L('Polytechnic institute', 'পলিটেকনিক ইনস্টিটিউট'), district: 'Bogura', xp: 166010, members: 5 },
    { name: 'Chattogram Dakhil Stars', type: L('Madrasah (Dakhil/Alim)', 'মাদ্রাসা (দাখিল/আলিম)'), district: 'Chattogram', xp: 158770, members: 5 },
    { name: 'Dhaka Mirpur Mavericks', type: L('Urban college', 'শহুরে কলেজ'), district: 'Dhaka', xp: 151200, members: 5 },
    { name: 'Khulna Sundarban Squad', type: L('Rural + urban mixed', 'গ্রামীণ + শহুরে'), district: 'Khulna', xp: 147680, members: 4 }
  ];
  D.TEAM = [
    { n: 'Aurin (you)', t: L('HSC Science · Rangpur', 'এইচএসসি বিজ্ঞান · রংপুর'), xp: 41200 },
    { n: 'Abdullah', t: L('Alim (madrasah) · Gaibandha', 'আলিম (মাদ্রাসা) · গাইবান্ধা'), xp: 38650 },
    { n: 'Moushumi', t: L('Polytechnic (Computer) · Rangpur', 'পলিটেকনিক (কম্পিউটার) · রংপুর'), xp: 36900 },
    { n: 'Jibon', t: L('SSC · Char school, Kurigram', 'এসএসসি · চর স্কুল, কুড়িগ্রাম'), xp: 33150 },
    { n: 'Priya', t: L('HSC · Nilphamari', 'এইচএসসি · নীলফামারী'), xp: 32500 }
  ];

  /* ---------------- Talent marketplace (anonymised, sample) ---------------- */
  D.TALENT = [
    { id: 'BD-RP-0415', region: 'Rangpur', track: 'HSC Science', skills: ['BIOINF-101', 'Python', 'Cell biology'], readiness: 82, passports: 2, consent: true, langs: 'বাংলা, English' },
    { id: 'BD-SY-1102', region: 'Sylhet', track: 'Polytechnic (Computer)', skills: ['PYDATA-101', 'SQL', 'Logic design'], readiness: 88, passports: 3, consent: true, langs: 'বাংলা, English' },
    { id: 'BD-KU-0733', region: 'Kurigram', track: 'Alim (madrasah) Science', skills: ['FINQ-101', 'Algebra', 'Excel'], readiness: 74, passports: 1, consent: true, langs: 'বাংলা, English, Arabic' },
    { id: 'BD-CT-2290', region: 'Chattogram', track: 'HSC Science', skills: ['ENVCHEM-101', 'Titration', 'Data viz'], readiness: 79, passports: 2, consent: false, langs: 'বাংলা, English' },
    { id: 'BD-BO-0561', region: 'Bogura', track: 'Polytechnic (Electrical)', skills: ['Logic gates', 'Python', 'IoT basics'], readiness: 71, passports: 1, consent: true, langs: 'বাংলা' },
    { id: 'BD-DH-3381', region: 'Dhaka', track: 'HSC Science', skills: ['PYDATA-101', 'BIOINF-101', 'Statistics'], readiness: 91, passports: 4, consent: true, langs: 'বাংলা, English' }
  ];
  D.ROLES_OPEN = [
    { t: L('Junior Data Annotator (Bangla health text)', 'জুনিয়র ডেটা অ্যানোটেটর (বাংলা স্বাস্থ্য টেক্সট)'), org: 'Global health-AI lab (sample)', mode: L('Remote · part-time', 'রিমোট · খণ্ডকালীন'), need: ['BIOINF-101'] },
    { t: L('Python Data Intern', 'Python ডেটা ইন্টার্ন'), org: 'NRB-founded SaaS, Toronto (sample)', mode: L('Remote · 3 months', 'রিমোট · ৩ মাস'), need: ['PYDATA-101'] },
    { t: L('Field Water-Quality Assistant', 'মাঠপর্যায়ে পানির মান সহকারী'), org: 'Environmental NGO, Gazipur (sample)', mode: L('On-site', 'অন-সাইট'), need: ['ENVCHEM-101'] },
    { t: L('FinTech QA Analyst (EMI logic)', 'ফিনটেক QA অ্যানালিস্ট'), org: 'Mobile-money startup (sample)', mode: L('Hybrid', 'হাইব্রিড'), need: ['FINQ-101'] }
  ];

  /* ---------------- Admin sample data ---------------- */
  D.ADMIN = {
    org: L('Rangpur Division Learning Consortium (sample NGO + 42 schools)', 'রংপুর বিভাগ লার্নিং কনসোর্টিয়াম (নমুনা)'),
    docs: [
      { t: 'NCTB HSC Biology 1st Paper', lang: 'bn', chunks: 412, status: 'licence-pending', model: 'multilingual-e5-large', v: '2025 ed.' },
      { t: 'NCTB HSC Chemistry 1st & 2nd Paper', lang: 'bn', chunks: 655, status: 'licence-pending', model: 'multilingual-e5-large', v: '2025 ed.' },
      { t: 'NCTB HSC ICT', lang: 'bn/en', chunks: 298, status: 'licence-pending', model: 'multilingual-e5-large', v: '2025 ed.' },
      { t: 'OpenStax Biology 2e', lang: 'en', chunks: 1840, status: 'indexed', model: 'multilingual-e5-large', v: '2e' },
      { t: 'OpenStax Chemistry 2e', lang: 'en', chunks: 1622, status: 'indexed', model: 'multilingual-e5-large', v: '2e' },
      { t: 'OpenStax College Physics 2e', lang: 'en', chunks: 1710, status: 'indexed', model: 'multilingual-e5-large', v: '2e' },
      { t: 'OpenStax Calculus Vol. 1', lang: 'en', chunks: 1205, status: 'indexed', model: 'multilingual-e5-large', v: '1' },
      { t: 'O*NET 28 occupations & skills', lang: 'en', chunks: 923, status: 'indexed', model: 'multilingual-e5-large', v: '28.x' }
    ],
    users: [
      { id: 'stu-rp-0415', n: 'Aurin Jahan', r: 'student', org: 'Rangpur Govt. College', last: '2 min ago', mfa: false },
      { id: 'tch-rp-0021', n: 'Md. Kamrul Hasan', r: 'teacher', org: 'Rangpur Govt. College', last: '1 h ago', mfa: true },
      { id: 'par-rp-0415', n: 'Rokeya Begum', r: 'parent', org: '-', last: 'yesterday', mfa: false },
      { id: 'adm-ngo-007', n: 'Farhana Rahman', r: 'admin', org: 'Consortium', last: 'now', mfa: true },
      { id: 'rec-ca-0102', n: 'Recruiter (Toronto)', r: 'recruiter', org: 'NRB SaaS (sample)', last: '3 d ago', mfa: true },
      { id: 'tch-ku-0090', n: 'Shahana Akter', r: 'teacher', org: 'Kurigram Char High School', last: '20 min ago', mfa: true }
    ],
    // 14-day grounding & latency telemetry (sample)
    telemetry: Array.from({ length: 14 }, (_, i) => ({ d: i, grounded: [97.1, 97.8, 98.2, 98.0, 98.6, 98.9, 99.1, 98.7, 99.0, 99.2, 99.4, 99.3, 99.5, 99.4][i], refusals: [3.1, 2.8, 2.6, 2.7, 2.4, 2.2, 2.1, 2.3, 2.0, 1.9, 1.8, 1.9, 1.7, 1.8][i], p95: [1.9, 1.8, 1.8, 1.7, 1.6, 1.6, 1.5, 1.6, 1.5, 1.4, 1.4, 1.4, 1.3, 1.3][i] })),
    cohorts: [
      { g: 'Urban colleges', n: 3120, mastery: 71, completion: 78, ready: 41 },
      { g: 'Rural schools', n: 4870, mastery: 64, completion: 72, ready: 33 },
      { g: 'Char / haor areas', n: 1260, mastery: 58, completion: 66, ready: 24 },
      { g: 'Madrasah (Dakhil/Alim)', n: 2340, mastery: 61, completion: 70, ready: 29 },
      { g: 'Polytechnic', n: 1980, mastery: 67, completion: 74, ready: 45 }
    ],
    gender: { girls: { n: 7010, mastery: 66, completion: 75 }, boys: { n: 6560, mastery: 64, completion: 71 } }
  };
})();

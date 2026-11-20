# Dishari OS

**From classroom to global career.** A bilingual, curriculum-grounded AI learning and workforce platform built for the International AI Builders Congress 2026, LearnSphere AI domain (Education, Skills and Workforce Transformation), aligned with UN Sustainable Development Goal 4: Quality Education.

Dishari (দিশারী, "the one who shows the way") is an AI tutor that teaches with four research-based methods, turns the NCTB science curriculum into real-world challenges, and converts what a learner masters into a skill credential that employers can verify. It is designed first for rural, madrasah and polytechnic learners, works in Bangla, English, netive language like Chakma, saotal Ect and runs on a 2G connection.

> Project presentation: open [`docs/presentation/index.html`](docs/presentation/index.html) in a browser.

---

## Contents

1. [The problem](#the-problem)
2. [What Dishari does](#what-dishari-does)
3. [How it meets the Congress requirements](#how-it-meets-the-congress-requirements)
4. [Getting started](#getting-started)
5. [Project structure](#project-structure)
6. [Architecture](#architecture)
7. [Configuration](#configuration)
8. [Testing](#testing)
9. [Data, privacy and honesty](#data-privacy-and-honesty)
10. [Team](#team)
11. [Acknowledgements](#acknowledgements)

---

## The problem

| Indicator | Figure | Source |
|---|---|---|
| Secondary-level students in Bangladesh | 9.4 million, 6.5 million of them rural | BANBEIS, via Bonik Barta (2025) |
| Students relying on private tutors or coaching | more than 75% of those surveyed | CAMPE study, via TBS News |
| Secondary dropout rate, 2025 | 14% (girls 14.5%), up from 9.9% in 2024 | BANBEIS Education Statistics 2025, via Daily Sun |
| Young people (15 to 29) not in education, employment or training | 8.56 million | BBS Quarterly LFS 2024, cited by SANEM |
| Unemployed youth who completed tertiary education | 31.5% | BBS Labour Force Survey 2023 |

Good tutoring is expensive and concentrated in cities, generic chatbots can invent facts, and school results do not tell employers what a young person can actually do. Dishari addresses all three in one product.

## What Dishari does

Dishari unifies the five LearnSphere pillars in a single learning journey: learn a concept, apply it, prove it, and be found for it.

| Pillar | What the learner experiences |
|---|---|
| **AI Teacher** | A tutor with four switchable teaching methods: Socratic questioning, Bloom's mastery ladder, Feynman teach-back, and scaffolding with fading hints. Every reply cites NCTB or OpenStax passages and shows a grounding score. |
| **Career Navigator** | Mastery is mapped to real occupations (O\*NET codes) through a concept, skill and job graph, with the biggest skill gap highlighted. |
| **SkillBridge** | Short "day in the life" work tasks: bioinformatics analysis, a fair micro-loan calculation, river-water testing, clinic data processing. |
| **Workforce Ready** | A three-question AI viva issues a Skill Passport with a QR code that recomputes an integrity hash when scanned. |
| **Talent Marketplace** | Employers search verified skills with identity hidden by default; contact details are shared only with the learner's consent. |

Supporting features:

- **Four-part learning quest** in Mathematics, Equations, Biology, Chemistry and ICT: concept sandbox, adaptive practice sprint, real-world challenge (a dengue case, a polluted river, a flood-relief drone, a broken clinic script) and a co-op league for mixed urban, rural, madrasah and polytechnic teams.
- **Snap-to-Solve:** finds the exact line of a mistake in handwritten work and prescribes three targeted drills.
- **Teacher and Parent Co-Pilot:** generates NCTB-format creative questions and MCQs with answer keys, shows class misconceptions, and writes a Bangla progress summary for parents.
- **Explainable AI panel:** for every tutor turn, the retrieved sources, grounding score, safety checks and teaching decision.
- **Retrieval:** BM25 over bilingual chunks, each indexed with a contextual header (subject, source, chapter reference); a query-rewriting step maps everyday words to curriculum terms; a corrective retry runs when the first pass is weak; BM25 candidates are reranked by reciprocal-rank fusion with a local character n-gram similarity (not neural embeddings). Out-of-scope questions are still declined. Gold set: 30 questions, hit@1 100% (`node scripts/test.mjs`).
- **Inclusion:** one-click Bangla, English and others laguage  light, dark and others themes, 2G Lite mode, read-aloud and dyslexia-friendly spacing.
- **More languages:** Hindi covers the main interface. Chakma, Marma, Kokborok (Tripura), Santali and Garo are draft machine translations (needs `ANTHROPIC_API_KEY`), labelled as drafts and falling back to Bangla where a phrase is missing. Native-speaker review is planned before classroom use. Hand-written dictionaries go in `public/assets/js/data/i18n.js`.

## How it meets the Congress requirements

### LearnSphere challenge areas

| Challenge area | Required capability | Where it is in Dishari |
|---|---|---|
| AI Teacher | Profiling, adaptive difficulty, curriculum RAG | Four teaching modes, Rasch-based adaptive practice, cited retrieval (`/app`) |
| Career Navigator | Skills graph, labour-market data, matching | O\*NET-linked career matches and knowledge graph (`/app?tab=career`, `/data`) |
| SkillBridge / Workforce Ready | Applied skills, verified outcomes | Micro-internships, AI viva, Skill Passport |
| Global Talent | Matching verified talent to opportunity | Consent-first talent marketplace (`/app?tab=talent`) |

### Required public routes (Section 10.8)

| Route | Purpose |
|---|---|
| `/app` | Main learning workspace |
| `/demo-user` | One-click demo student (Aurin Jahan, Rangpur) |
| `/demo-admin` | One-click demo institutional admin |
| `/admin` | Curriculum, telemetry, cohorts, roles and guardrails |
| `/data` | Data sources, pipeline, lineage, schema, knowledge graph |
| `/security` | Authentication, privacy, compliance alignment, responsible AI |
| `/architecture` | Interactive multi-agent system diagram with a live request trace |
| `/presentation` | 180-second pitch storyboard with a rehearsal timer |
| `/pitchdeck` | Ten-slide investor deck |
| `/audit` | One-click live audit (32 checks) with exportable scorecard |
| `/sdg4` | SDG 4 alignment, research evidence, equity and impact calculator |

### Team judging framework (Section 11)

| Criterion (20 points each) | Evidence in the product |
|---|---|
| Innovation and AI-native design | Policy engine plus language-model verbaliser; teach-the-AI mode; vision mistake analysis; verifiable credentials |
| Technical excellence and architecture | Six-agent design, hybrid retrieval, offline-first PWA, serverless API, Postgres schema with row-level security |
| Business value and commercial viability | Freemium for learners, paid tiers for schools, NGOs and recruiters (`/pitchdeck`) |
| Global scalability and real-world impact | Bangla-first, 2G Lite, multi-curriculum chunk schema, ROI calculator (`/sdg4`) |
| Responsible AI, data sovereignty and presentation | Grounding threshold, PII redaction, injection defence, consent, in-country data plan, audit (`/security`, `/audit`) |

The full alignment, including the 180-second preliminary format and the Section 15 responsible-AI commitments, is explained in the [project presentation](docs/presentation/index.html).

## Getting started

The short version:

```bash
git clone https://github.com/<your-org>/dishari-os.git
cd dishari-os
npx serve public          # or: python3 -m http.server 5173 --directory public
```

Open the address shown in the terminal. No install step and no dependencies are needed.

## Project structure

```
dishari-os/
├── public/                     The website (this folder is what gets deployed)
│   ├── index.html              Home page (generated)
│   ├── app/ admin/ audit/ ...  One folder per route so links work on any static host (generated)
│   ├── assets/
│   │   ├── css/dishari.css     Design system: light and dark themes, layout, components
│   │   └── js/
│   │       ├── core/           Router, state, bilingual text, app shell, tour, palette
│   │       ├── components/     Icons, charts, QR code generator
│   │       ├── data/           Curriculum knowledge base, lessons, demo data
│   │       ├── engine/         Retrieval and safety (rag.js), teaching policies (tutor.js)
│   │       └── pages/          One file per route or workspace area
│   ├── sw.js                   Offline cache (service worker)
│   └── manifest.webmanifest    Installable app settings
├── api/                        Serverless functions (Vercel)
│   ├── tutor.js                Language-model rephrasing with server-side safety checks
│   └── autopsy.js              Reads uploaded photos of student work
├── supabase/schema.sql         Production database: tenancy, consent, curriculum vectors, RLS, audit log
├── scripts/
│   ├── shell.html              HTML template for every page
│   ├── build.mjs               Generates route folders and a single-file offline version
│   └── test.mjs                Retrieval and safety unit checks
├── docs/
│   ├── presentation/           Interactive project presentation
│   ├── ARCHITECTURE.md         Technical overview for developers
│   └── MASTER_PROMPT.md        The brief this build implements
├── README.md
├── SETUP.md
├── package.json
└── vercel.json                 Hosting settings and security headers
```

## Architecture

Dishari separates *what to teach* from *how to say it*. A deterministic pedagogy policy engine decides every tutor turn (advance, give a hint, decline, score), so behaviour is auditable and works offline. When a server key is configured, a language model only rephrases that decision using the same cited passages, and the server rejects any rephrasing that is less grounded than the original.

```
Client (web, PWA, voice, 2G Lite)
  └─ API gateway and auth (Vercel functions, Supabase Auth, rate limits, CSP)
      └─ Multi-agent orchestrator
          ├─ Pedagogy agent        ├─ Game master agent     ├─ Vision autopsy agent
          ├─ Teacher co-pilot agent ├─ Career graph agent    └─ Guardian (safety) agent
      └─ Knowledge layer (Postgres, pgvector, full-text search, concept-skill-job graph)
  Cross-cutting: PII redaction, injection filter, grounding threshold, audit log
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and the `/architecture` route for detail.

## Configuration

The app runs fully without configuration. Optional environment variables for the Vercel deployment:

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Enables the language-model rephrasing (`/api/tutor`) and photo analysis (`/api/autopsy`). Kept on the server only. |
| `DISHARI_MODEL` | Model override (default `claude-sonnet-5-5`). |
| `DISHARI_VISION_MODEL` | Model override for photo analysis. |

## Testing

```bash
node scripts/test.mjs
```

Checks retrieval accuracy on a 30-question bilingual gold set, out-of-scope refusal, PII redaction, prompt-injection blocking and the grounding metric. The `/audit` route runs 32 further checks against the live application in the browser.

## Data, privacy and honesty

- Numbers labelled **Sample data** in the interface are illustrative. Numbers labelled **Live** are computed in the browser. External statistics link to their sources.
- Research findings are quoted from the original papers with their limitations. Popular but unsupported figures (such as the "90% retention" learning pyramid) are deliberately not used. The efficacy chart is a projection from published effect sizes, not a trial result; a randomised pilot is planned.
- NCTB passages in the demo index are short summaries written by the team that point to chapters. Full-text use requires a licence from NCTB.
- Compliance is described as *designed to align* with Bangladesh's Personal Data Protection Ordinance 2025, GDPR, COPPA and UNICEF guidance. A formal impact assessment is on the roadmap.
- All people, schools and employers in the demo are fictional.

## Team

| Role | Name |
|---|---|
| Team leader / coordinator | Shohedozzaman Basunia |
| Business analyst / data scientist | Mahfuza Maisha |
| UI/UX / frontend developer | Mahfuza Maisha |
| Backend / data engineer | Mujahida Joynab |
| Presentation / communication lead | Tanisha Chowdhury |
| NRB / global advisor | |

## Acknowledgements

- Curriculum references: [OpenStax](https://openstax.org) (CC BY 4.0) and the National Curriculum and Textbook Board, Bangladesh.
- Occupation data: [O\*NET](https://www.onetonline.org) by USDOL/ETA (CC BY 4.0).
- Icon geometry follows [Lucide](https://lucide.dev) conventions (ISC licence).
- Typefaces: Inter, Source Serif 4 and Hind Siliguri via Google Fonts (SIL Open Font Licence).

No licence has been chosen for this repository yet; until the team adds one, all rights are reserved by the authors.

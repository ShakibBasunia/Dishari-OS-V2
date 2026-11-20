# Architecture overview

This document is for developers joining the project. For the product overview see the [README](../README.md); for a guided explanation see the [presentation](presentation/index.html).

## Design principles

1. **Pedagogy decides, the language model only speaks.** Every tutor turn is decided by a deterministic policy (`engine/tutor.js`). This makes behaviour testable, explainable and available offline. The optional language model rephrases the decision and cannot change it.
2. **No answer without a source.** Free questions are answered only when retrieval confidence passes an admin-set threshold. Otherwise the tutor declines and routes the question to a teacher.
3. **Runs anywhere.** The front end has no dependencies and no required build step. Every route has its own folder so it works on any static host, and a single-file version runs from disk.
4. **Bilingual by construction.** Every string is written as `T('English', 'বাংলা')` or `{ en, bn }`.

## Runtime layers

| Layer | Responsibility | Files |
|---|---|---|
| Client | Router, state, shell, pages, offline cache | `public/assets/js/core`, `pages`, `public/sw.js` |
| Retrieval and safety | Bilingual BM25, grounding score, PII redaction, injection and safety filters, gold-set evaluation | `public/assets/js/engine/rag.js` (shared with the server) |
| Pedagogy agent | Socratic, Bloom, Feynman and scaffolding policies, explanation trace | `public/assets/js/engine/tutor.js` |
| Game master | Sandboxes, adaptive practice (Rasch), challenges, co-op | `pages/labs.js`, `pages/game.js` |
| Co-pilot, vision, career | Question generation, Snap-to-Solve, career graph, Skill Passport | `pages/tools.js`, `api/autopsy.js` |
| Server | Language-model rephrasing with server-side guardrails, rate limiting | `api/tutor.js`, `api/_lib.js` |
| Data (production) | Tenancy, consent, curriculum vectors, knowledge graph, passports, audit log, RLS | `supabase/schema.sql` |

## Request flow for one tutor turn

1. The learner types an answer or question.
2. PII is redacted; the injection filter and safety router run (`rag.js`).
3. If it is a free question, retrieval runs and the tutor answers with a citation or declines below the threshold.
4. Otherwise the active teaching policy evaluates the answer and decides the next move.
5. A trace (sources, grounding, checks, decision) is stored for the explainability panel.
6. If `/api/tutor` is configured, the server re-checks safety, rephrases with only validated sources, and rejects a rephrasing that lowers grounding.

## State

Demo state is kept in `localStorage` under `dishari.os.v2` (theme, language, XP, mastery, passports, audit log). Production replaces this with the Supabase tables in `supabase/schema.sql`, protected by row-level security.

## Adding a page

1. Create `public/assets/js/pages/<name>.js` and register it with `D.page('<name>', { title, render(el, params) { ... } })`.
2. Add a `<script>` tag in `scripts/shell.html`, and the route name to `ROUTES` in `scripts/build.mjs`.
3. Run `node scripts/build.mjs`.

## Adding a subject or lesson

Add knowledge-base chunks to `data/kb.js` (with source, section and licence), then the subject entry, tutor scripts, practice items and challenge in `data/curriculum.js`, and a sandbox in `pages/labs.js`. Run `node scripts/test.mjs` and the `/audit` page to confirm every citation resolves.

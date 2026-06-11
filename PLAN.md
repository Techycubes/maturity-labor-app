# Development Plan — Maturity-Labor Complexity App

A phased build plan from research through production deployment.

---

## Phase 1 — Research & Content

> Goal: Assemble the academic foundation. Every question, score threshold, and recommendation must trace back to a citable source before any code is written.

### Ivy League Source Collection
- [ ] Pull and annotate Harvard Center on the Developing Child reports on executive function by age band (6–10, 11–14, 15–18, 19–25)
- [ ] Pull Yale Child Study Center papers on emotional regulation benchmarks and school-to-work readiness
- [ ] Pull Princeton Bendheim-Thoman Center data on adolescent labor participation rates and outcome correlations
- [ ] Pull Cornell ILR School guidelines on developmentally appropriate work tasks and maximum safe hours by age
- [ ] Pull Columbia Mailman longitudinal studies on early work experience and academic/mental health outcomes
- [ ] Pull Penn Annenberg benchmarks for cognitive decision-making capacity across adolescence

### Content Mapping
- [ ] Define the five maturity dimensions: Cognitive, Emotional, Social, Physical, Executive Function
- [ ] Map each dimension to specific research findings and age-referenced milestone markers
- [ ] Establish five work-readiness tiers: Exploratory (6–8), Foundational (9–11), Developmental (12–14), Transitional (15–18), Professional (19–25)
- [ ] Write plain-language descriptions of each tier suitable for the target age range (6–25)
- [ ] Draft 60–80 assessment questions covering all five dimensions across all five tiers
- [ ] Assign each question a dimension tag, age-band filter, and weighted score value
- [ ] Define score band thresholds (low / developing / on-track / advanced) per dimension per age band
- [ ] Compile a list of recommended job types, weekly hour caps, and workplace complexity levels per tier
- [ ] Document every source as a structured citation (author, year, institution, URL, key finding)

---

## Phase 2 — Data Layer

> Goal: Encode all research content into typed, validated JSON files and build a deterministic scoring algorithm.

### JSON Data Files
- [ ] Create `src/data/questions.json` — array of question objects with fields: `id`, `text`, `dimension`, `ageBands`, `weight`, `options` (4-point Likert scale)
- [ ] Create `src/data/stages.json` — array of tier objects with fields: `id`, `name`, `ageRange`, `description`, `milestones` (per dimension), `workProfile` (job types, maxHours, complexity)
- [ ] Create `src/data/resources.json` — array of citation objects with fields: `id`, `institution`, `authors`, `year`, `title`, `url`, `keyFinding`, `dimensions` (tags)
- [ ] Create `src/data/recommendations.json` — lookup table mapping `[tier][dimension][scoreBand]` → recommendation text and linked resource IDs

### Scoring Algorithm
- [ ] Create `src/utils/filterQuestions.js` — filters `questions.json` to the subset relevant for a given age
- [ ] Create `src/utils/scoreAssessment.js` — computes weighted dimension scores from raw answers, normalizes to 0–100 per dimension
- [ ] Create `src/utils/resolveStage.js` — maps composite score + age to the correct work-readiness tier
- [ ] Create `src/utils/buildReport.js` — assembles the full result object: dimension scores, tier, recommendations array, and citation list
- [ ] Write unit tests for each utility covering edge cases (minimum age, maximum age, all-low scores, all-high scores, mixed profiles)
- [ ] Validate all JSON files against hand-computed expected outputs for 5 representative user profiles

---

## Phase 3 — UI Components

> Goal: Build every user-facing component as a self-contained, prop-driven module before wiring them into pages.

### Assessment Flow
- [ ] `AgeGate` — entry screen with age input (slider + manual entry), validates range 6–25, routes to correct question set
- [ ] `QuizShell` — stateful wrapper managing current question index, answer accumulation, and progress tracking
- [ ] `QuestionCard` — renders a single question with animated 4-option response buttons, keyboard-accessible
- [ ] `ProgressBar` — displays completion percentage, updates on each answer
- [ ] `QuizNavigation` — back / next controls with disabled states, skip option for optional questions

### Results Display
- [ ] `ScoreCard` — displays overall tier badge, tier name, age-adjusted description, and a plain-language summary paragraph
- [ ] `DimensionRow` — single row showing dimension name, score bar (0–100), score band label, and tooltip with what the score means
- [ ] `ScoreBreakdown` — stacks five `DimensionRow` components with a section header
- [ ] `MaturityChart` — Recharts `RadarChart` visualizing all five dimension scores; responsive container; accessible color palette
- [ ] `TrendBar` — Recharts `BarChart` comparing the user's dimension scores against age-band averages from the research data
- [ ] `RecommendationCard` — displays a single recommendation with its dimension tag, priority level, and linked citation
- [ ] `RecommendationList` — renders sorted `RecommendationCard` stack, grouped by dimension
- [ ] `CitationDrawer` — collapsible panel listing all research sources referenced in the current report with formatted citations

### Shared / Utility Components
- [ ] `Button` — primary, secondary, and ghost variants with consistent focus styles
- [ ] `Badge` — tier label chip with tier-specific color tokens
- [ ] `Tooltip` — accessible hover/focus tooltip for dimension labels and score bands
- [ ] `Modal` — generic accessible modal for onboarding explainer and source detail views
- [ ] `LoadingSpinner` — shown during scoring computation and any async operations
- [ ] `ErrorBoundary` — catches render errors, displays a friendly fallback with a restart option

### Page Assembly
- [ ] `HomePage` — hero section, brief explainer, age-band overview cards, CTA to begin assessment
- [ ] `AssessmentPage` — mounts `QuizShell` with the filtered question set for the entered age
- [ ] `ResultsPage` — composes `ScoreCard`, `MaturityChart`, `TrendBar`, `ScoreBreakdown`, `RecommendationList`, and `CitationDrawer`
- [ ] `AboutPage` — institution logos, research methodology overview, FAQ accordion
- [ ] Wire client-side routing between all pages using React Router (or file-based routing if migrating to a meta-framework)

---

## Phase 4 — Backend

> Goal: Move scoring logic server-side so the weighting rubric and raw thresholds are never exposed to the client.

### Vercel Serverless Functions
- [ ] Create `api/score.js` — POST endpoint accepting `{ age, answers }`, returns full report object; input validation with descriptive error messages
- [ ] Port `scoreAssessment.js`, `resolveStage.js`, and `buildReport.js` into the serverless function bundle
- [ ] Add rate limiting header (`X-RateLimit-*`) to prevent abuse — 20 requests per IP per hour
- [ ] Return structured error responses (`{ error: { code, message } }`) for invalid input, out-of-range age, and malformed answer arrays
- [ ] Add a `/api/health` GET endpoint returning `{ status: "ok", version }` for uptime monitoring

### Client Integration
- [ ] Create `src/hooks/useScoring.js` — custom hook that POSTs answers to `/api/score`, manages loading / error / result state
- [ ] Replace any client-side scoring calls in `ResultsPage` with `useScoring`
- [ ] Handle network errors and timeout gracefully with a retry prompt in the UI
- [ ] Add request/response logging in development mode only (stripped from production build via `import.meta.env`)

### Security
- [ ] Validate `age` is an integer between 6 and 25 server-side
- [ ] Validate `answers` array length matches the expected question count for the given age band
- [ ] Sanitize all string fields; reject requests with unexpected keys
- [ ] Set `Content-Security-Policy`, `X-Frame-Options`, and `X-Content-Type-Options` response headers

---

## Phase 5 — Styling & Animations

> Goal: Apply a cohesive visual identity and add motion that reinforces comprehension without creating distraction.

### Tailwind Design Tokens
- [ ] Define a custom color palette in `tailwind.config.js`: five dimension colors, five tier accent colors, neutral scale, and semantic tokens (surface, border, text-primary, text-muted)
- [ ] Define typography scale: display, heading, body, caption, and label sizes using a humanist sans-serif pairing
- [ ] Define spacing, border-radius, and shadow tokens to ensure visual consistency across all components
- [ ] Add a dark mode variant using Tailwind's `class` strategy; respect `prefers-color-scheme` on first load

### Framer Motion Animations
- [ ] `QuestionCard` — exit left / enter right slide transition between questions; duration 250ms ease-out
- [ ] `ProgressBar` — spring-based width animation on each answer; stiffness 200, damping 30
- [ ] `ScoreCard` — fade-up entrance on results load with 40px Y offset; staggered children delay
- [ ] `DimensionRow` score bars — animate width from 0 to final value on mount; stagger 80ms per row
- [ ] `MaturityChart` — fade-in with a 300ms delay after score bars complete
- [ ] `RecommendationCard` — staggered fade-up entrance; each card delayed 60ms from the previous
- [ ] `CitationDrawer` — height-based expand/collapse using `AnimatePresence` and `layout` prop
- [ ] `AgeGate` → `AssessmentPage` transition — full-page crossfade using `AnimatePresence` at the router level
- [ ] `AssessmentPage` → `ResultsPage` transition — slide-up reveal over 400ms

### Polish & Accessibility
- [ ] Audit all color combinations for WCAG AA contrast (4.5:1 for normal text, 3:1 for large text)
- [ ] Ensure all interactive elements have visible focus rings styled with the primary brand color
- [ ] Add `prefers-reduced-motion` media query check; disable or simplify all Framer Motion variants when set
- [ ] Test layout at 320px, 375px, 768px, 1024px, and 1440px breakpoints
- [ ] Add skeleton loading states for `MaturityChart` and `RecommendationList` during API response wait
- [ ] Final visual QA pass: spacing consistency, icon alignment, truncation behavior on long recommendation text

---

## Phase 6 — Deployment

> Goal: Ship to production on Vercel with a clean CI pipeline, environment hygiene, and a launch checklist.

### Repository Setup
- [ ] Initialize GitHub repository `maturity-labor-app` under the target organization or personal account
- [ ] Push initial commit with all source files; confirm `.gitignore` excludes `node_modules`, `.env*`, and `.vercel`
- [ ] Create `main` branch as the protected production branch (require PR + passing checks to merge)
- [ ] Create `develop` branch as the integration branch for feature work
- [ ] Add branch protection rules: no force-push to `main`, require linear history

### Vercel Configuration
- [ ] Connect GitHub repository to Vercel project via the Vercel dashboard
- [ ] Set production branch to `main`; set preview deployments to trigger on all pull requests
- [ ] Confirm `vercel.json` routes: SPA fallback (`/*` → `/index.html`) and `/api/*` → serverless functions
- [ ] Add environment variables in Vercel dashboard for any secrets (API keys, rate-limit config); never commit `.env` files
- [ ] Set Node.js runtime version in `vercel.json` to match local development version

### CI / Quality Gates
- [ ] Add GitHub Actions workflow `.github/workflows/ci.yml` — runs on every PR to `main` and `develop`
- [ ] CI steps: `npm ci` → `npm run lint` → `npm run test` → `npm run build`
- [ ] Block PR merge if any CI step fails
- [ ] Add Vercel GitHub integration so preview URL is posted as a PR comment automatically

### Pre-Launch Checklist
- [ ] Run Lighthouse audit on production build; target scores: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 90
- [ ] Verify all five dimension scores and all five age-band tier assignments render correctly in production
- [ ] Test the full assessment flow end-to-end on iOS Safari, Android Chrome, and desktop Firefox
- [ ] Confirm `/api/score` rate limiting is active in production
- [ ] Confirm `/api/health` returns `200 OK`
- [ ] Set custom domain (if applicable) and verify SSL certificate is provisioned
- [ ] Add `<meta>` OG tags and `<title>` to `index.html` for social sharing previews
- [ ] Submit sitemap to Google Search Console
- [ ] Tag the initial release `v1.0.0` in GitHub and publish release notes

---

## Progress Summary

| Phase | Status | Tasks |
|---|---|---|
| Phase 1 — Research & Content | Not started | 18 tasks |
| Phase 2 — Data Layer | Not started | 12 tasks |
| Phase 3 — UI Components | Not started | 24 tasks |
| Phase 4 — Backend | Not started | 14 tasks |
| Phase 5 — Styling & Animations | Not started | 20 tasks |
| Phase 6 — Deployment | Not started | 18 tasks |
| **Total** | | **106 tasks** |

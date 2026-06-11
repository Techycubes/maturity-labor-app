# Project Structure — Maturity-Labor Complexity App

This document describes every folder and file in the project and its purpose.

---

```
maturity-labor-app/
├── api/
│   ├── health.js
│   └── score.js
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   └── hero.png
│   ├── components/
│   ├── data/
│   │   ├── questions.json
│   │   ├── resources.json
│   │   └── stages.json
│   ├── lib/
│   │   └── scoring.js
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
├── PLAN.md
├── README.md
├── STRUCTURE.md
├── index.html
├── package.json
└── vercel.json
```

---

## `api/`

Vercel serverless functions. Each file becomes a deployed endpoint at `/api/<filename>`.
Vercel detects this folder automatically — no extra configuration is needed.

### `api/score.js`
**Route:** `POST /api/score`

The primary scoring endpoint. Accepts `{ age, answers }` in the request body, validates input,
delegates computation to `src/lib/scoring.js`, and returns a full report object:

```json
{
  "age": 15,
  "ageBand": "15-18",
  "stage": "transitional",
  "composite": 72,
  "dimensionScores": { "cognitive": 80, "emotional": 65, ... },
  "scoreBands": { "cognitive": "advanced", "emotional": "on-track", ... }
}
```

Includes rate limiting (20 req / IP / hour), input sanitization, and security response headers.

### `api/health.js`
**Route:** `GET /api/health`

Lightweight uptime check. Returns `{ status: "ok", version }`. Used by Vercel and any external
monitoring service to confirm the deployment is live.

---

## `public/`

Static assets served directly by Vite at the root path (`/`). Files here are **not** processed by
the bundler — they are copied as-is to the build output.

| File | Purpose |
|---|---|
| `favicon.svg` | Browser tab icon |
| `icons.svg` | SVG sprite sheet for UI icons used across components |

---

## `src/`

All application source code. Vite processes everything here.

---

### `src/assets/`

Images and SVGs that **are** processed by the bundler (hashed filenames, optimized output).
Import them directly in JSX: `import hero from './assets/hero.png'`.

| File | Purpose |
|---|---|
| `hero.png` | Hero section illustration on the Home page |

---

### `src/components/`

Reusable, prop-driven UI components. Each file exports a single default component.
Components here have no awareness of routing or global state — they receive everything via props.

| File (planned) | Purpose |
|---|---|
| `Quiz.jsx` | Stateful assessment shell managing question flow, answer accumulation, and progress |
| `ScoreCard.jsx` | Displays the user's tier badge, stage name, and plain-language summary |
| `MaturityChart.jsx` | Recharts `RadarChart` visualizing the five dimension scores |
| `Recommendations.jsx` | Renders a sorted list of research-backed recommendation cards |

---

### `src/data/`

Static JSON data files. These are the single source of truth for all content in the app.
They are imported directly into components and serverless functions — no database required.

#### `questions.json`
Array of assessment question objects. Each question has:
- `id` — unique stable identifier (e.g. `"q001"`)
- `text` — the question string shown to the user
- `dimension` — one of `cognitive | emotional | social | physical | executive_function`
- `ageBands` — array of age-band ids this question applies to (e.g. `["12-14", "15-18"]`)
- `weight` — multiplier applied during scoring (default `1.0`; higher = more influential)
- `options` — array of `{ value, label }` objects (4-point Likert scale, values 1–4)

#### `stages.json`
Array of five work-readiness stage objects, one per age band:

| Stage | Age Range |
|---|---|
| Exploratory | 6–8 |
| Foundational | 9–11 |
| Developmental | 12–14 |
| Transitional | 15–18 |
| Professional | 19–25 |

Each stage includes developmental milestones per dimension and a `workProfile`
with recommended job types, maximum weekly hours, and required supervision level.

#### `resources.json`
Array of structured academic citations from the six Ivy League institutions.
Each resource includes `institution`, `department`, `authors`, `year`, `title`, `url`,
`keyFinding`, and `dimensions` (which scoring dimensions the finding applies to).
The `ScoreCard` and `Recommendations` components use these to display citations inline.

---

### `src/lib/`

Pure utility modules — no React, no side effects. These can be imported in both
browser components and the Vercel serverless function without modification.

#### `scoring.js`
Exports six functions:

| Function | Description |
|---|---|
| `resolveAgeBand(age)` | Maps an integer age to its age-band id, or `null` if out of range |
| `filterQuestions(questions, ageBand)` | Returns the subset of questions applicable for a given age band |
| `calculateMaturityScore(questions, answers)` | Computes a weighted 0–100 score per dimension from raw answer values |
| `resolveScoreBand(score)` | Converts a 0–100 score to a named band: `low / developing / on-track / advanced` |
| `compositeScore(dimensionScores)` | Averages all non-null dimension scores into a single 0–100 number |
| `buildReport(age, questions, answers)` | Orchestrates all of the above and returns the full report object |

---

### `src/pages/`

Route-level components. Each file maps to one URL in the app.
Pages compose components from `src/components/` and call hooks for data fetching.

| File (planned) | Route | Purpose |
|---|---|---|
| `Home.jsx` | `/` | Hero section, age-band overview cards, CTA to begin assessment |
| `Results.jsx` | `/results` | Full report: ScoreCard, MaturityChart, Recommendations, citations |

---

### `src/App.jsx`

Root component. Owns the router, top-level layout shell, and any global providers
(theme context, error boundary). Renders the correct page component for each route.

### `src/main.jsx`

React entry point. Mounts `<App />` into the `#root` div in `index.html`.
This is the file Vite uses as its bundle entry point.

---

## Root Files

| File | Purpose |
|---|---|
| `index.html` | HTML shell. Vite injects the bundled JS here. Contains `<div id="root">` and meta tags. |
| `package.json` | npm dependencies and scripts (`dev`, `build`, `preview`, `lint`). |
| `vercel.json` | Vercel deployment config: SPA routing fallback and serverless function settings. |
| `vite.config.js` | Vite build configuration: React plugin, path aliases, build output options. |
| `tailwind.config.js` | Tailwind design tokens: custom colors, typography scale, dark mode strategy. |
| `eslint.config.js` | ESLint rules for React + React Hooks. |
| `README.md` | Project overview, feature list, tech stack, getting started guide, research sources. |
| `PLAN.md` | Phased development plan with per-task checkboxes across six phases. |
| `STRUCTURE.md` | This file. Explains every folder and file in the project. |

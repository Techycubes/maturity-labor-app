# Maturity-Labor Complexity App

An interactive web application that helps young people aged 6–25 understand their developmental maturity and determine when to start working, grounded in Ivy League developmental psychology research.

---

## Project Overview

The Maturity-Labor Complexity App guides users through a research-backed assessment that maps cognitive, emotional, and physical developmental milestones to age-appropriate work readiness. By answering a short set of questions, users receive a personalized maturity profile and evidence-based recommendations on work complexity, hours, and environment suited to their developmental stage.

The app draws on longitudinal studies and developmental frameworks published by Harvard, Yale, Princeton, Cornell, Columbia, and Penn to ensure every recommendation reflects current academic consensus — not opinion.

---

## Features

- **Age-adaptive assessment** — questions and scoring adjust dynamically for ages 6–25
- **Maturity dimension scoring** — evaluates cognitive, emotional, social, and physical readiness across five tiers
- **Work readiness profile** — generates a personalized report with recommended job types, weekly hours, and workplace complexity
- **Interactive data visualizations** — radar and bar charts display maturity scores across developmental dimensions
- **Animated guided flow** — smooth page transitions and micro-animations reduce assessment friction
- **Research citations** — every recommendation links back to the underlying Ivy League study
- **Mobile-first responsive design** — optimized for phones, tablets, and desktops
- **No account required** — fully anonymous; no data is stored or transmitted

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [React 19](https://react.dev) |
| Build tool | [Vite 8](https://vitejs.dev) |
| Styling | [Tailwind CSS](https://tailwindcss.com) |
| Animations | [Framer Motion](https://www.framer.com/motion/) |
| Charts | [Recharts](https://recharts.org) |
| Deployment | [Vercel](https://vercel.com) |

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/maturity-labor-app.git
cd maturity-labor-app

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server with HMR |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

### Deployment

The project is pre-configured for Vercel. Push to your connected branch and Vercel will build and deploy automatically. A `vercel.json` is included at the project root for custom routing and build settings.

---

## Project Structure

```
maturity-labor-app/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/           # Static images and SVGs
│   ├── components/       # Reusable UI components
│   ├── pages/            # Route-level page components
│   ├── data/             # Assessment questions and scoring rubrics
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Scoring algorithms and helpers
│   ├── App.jsx           # Root component and routing
│   └── main.jsx          # React entry point
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── vercel.json
```

---

## Research Sources

The assessment rubrics, developmental milestones, and work-readiness thresholds are derived from peer-reviewed research published by the following institutions:

| Institution | Research Area |
|---|---|
| **Harvard University** — Center on the Developing Child | Executive function development, stress response systems, and brain architecture in children and adolescents |
| **Yale University** — Child Study Center | Emotional regulation, social cognition, and school-to-work transition frameworks |
| **Princeton University** — Bendheim-Thoman Center for Research on Child Wellbeing | Socioeconomic influences on adolescent labor participation and long-term outcomes |
| **Cornell University** — ILR School | Adolescent labor standards, developmental appropriateness of work tasks, and occupational health |
| **Columbia University** — Mailman School of Public Health | Longitudinal effects of early work experience on academic achievement and mental health |
| **University of Pennsylvania** — Annenberg Public Policy Center | Media literacy, decision-making capacity, and cognitive readiness benchmarks across adolescence |

---

## License

MIT

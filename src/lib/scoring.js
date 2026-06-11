import stages from "../data/stages.json";

const DOMAIN_WEIGHTS = {
  emotional: 0.35,
  cognitive: 0.35,
  social: 0.2,
  physical: 0.1,
};

// Age adjustment factors derived from the Harvard Center on the Developing
// Child milestone model: respondents are scored against age-appropriate
// developmental expectations rather than a fixed adult benchmark, so younger
// users receive a proportionally larger adjustment.
const AGE_ADJUSTMENTS = [
  { min: 6, max: 8, factor: 1.3 },
  { min: 9, max: 12, factor: 1.18 },
  { min: 13, max: 17, factor: 1.08 },
  { min: 18, max: 22, factor: 1.02 },
  { min: 23, max: 25, factor: 1.0 },
];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function ageAdjustmentFactor(age) {
  const band = AGE_ADJUSTMENTS.find((b) => age >= b.min && age <= b.max);
  return band ? band.factor : 1.0;
}

/**
 * Computes a 0–100 maturity score from quiz responses using weighted domain
 * scoring (emotional 35%, cognitive 35%, social 20%, physical 10%) with an
 * age adjustment factor per the Harvard developmental milestone model.
 *
 * @param {number} age - Respondent age (6–25)
 * @param {Array<{id: string, domain: string, value: number}>} responses
 * @returns {number} - Integer score, 0–100
 */
export function calculateMaturityScore(age, responses) {
  if (!Array.isArray(responses) || responses.length === 0) return 0;

  const domainTotals = {};
  const domainCounts = {};

  responses.forEach(({ domain, value }) => {
    if (!(domain in DOMAIN_WEIGHTS)) return;
    const v = Number(value);
    if (!Number.isFinite(v)) return;
    domainTotals[domain] = (domainTotals[domain] ?? 0) + clamp(v, 0, 100);
    domainCounts[domain] = (domainCounts[domain] ?? 0) + 1;
  });

  // Weighted average across the domains that actually have answers, with
  // weights renormalized so missing domains don't drag the score down.
  let weightedSum = 0;
  let weightUsed = 0;

  Object.keys(domainTotals).forEach((domain) => {
    const domainAverage = domainTotals[domain] / domainCounts[domain];
    weightedSum += domainAverage * DOMAIN_WEIGHTS[domain];
    weightUsed += DOMAIN_WEIGHTS[domain];
  });

  if (weightUsed === 0) return 0;

  const baseScore = weightedSum / weightUsed;
  const adjusted = baseScore * ageAdjustmentFactor(age);

  return Math.round(clamp(adjusted, 0, 100));
}

/**
 * Computes an average 0–100 score for each of the four domains, used to
 * render the domain-breakdown bar chart on the Results view. Domains with
 * no answers default to 0 so all four always appear on the chart.
 *
 * @param {Array<{domain: string, value: number}>} responses
 * @returns {{emotional: number, cognitive: number, social: number, physical: number}}
 */
export function calculateDomainScores(responses) {
  const totals = {};
  const counts = {};

  if (Array.isArray(responses)) {
    responses.forEach(({ domain, value }) => {
      if (!(domain in DOMAIN_WEIGHTS)) return;
      const v = Number(value);
      if (!Number.isFinite(v)) return;
      totals[domain] = (totals[domain] ?? 0) + clamp(v, 0, 100);
      counts[domain] = (counts[domain] ?? 0) + 1;
    });
  }

  const result = {};
  Object.keys(DOMAIN_WEIGHTS).forEach((domain) => {
    result[domain] = counts[domain]
      ? Math.round(totals[domain] / counts[domain])
      : 0;
  });

  return result;
}

/**
<<<<<<< HEAD
 * Translates a score into an age-aware interpretation shown on the Results
 * view, so the same number reads differently for a child than for an adult.
 *
 * @param {number} score - 0–100 maturity score
 * @param {number} age - Respondent age (6–25)
 * @returns {{band: string, message: string}}
 */
export function getScoreInterpretation(score, age) {
  const isChild = age <= 12;
  const isTeen = age >= 13 && age <= 17;

  if (score >= 80) {
    return {
      band: "advanced",
      message: isChild
        ? `For a ${age}-year-old, these answers show maturity well ahead of typical developmental expectations. Keep nurturing it — and protect plenty of time for unstructured play.`
        : isTeen
          ? `At ${age}, you're showing maturity ahead of most of your peers. You're likely ready for more responsibility than your age alone suggests.`
          : `At ${age}, your self-regulation and readiness signals are strong across the board. You're well positioned for high-responsibility work.`,
    };
  }
  if (score >= 60) {
    return {
      band: "on-track",
      message: isChild
        ? `These answers are right where research expects a ${age}-year-old to be. Development is on track — the tips below are how to keep it that way.`
        : isTeen
          ? `At ${age}, you're developing on schedule. The areas in the chart below show where a little focused effort will pay off most.`
          : `At ${age}, you're broadly on track. Look at your lowest domain below — that's the highest-leverage place to invest.`,
    };
  }
  if (score >= 40) {
    return {
      band: "developing",
      message: isChild
        ? `A ${age}-year-old is still building these skills, and that's completely normal. The tips below are the best-researched ways to support that growth.`
        : isTeen
          ? `At ${age}, some of these skills are still under construction — which is exactly what brain research predicts. The chart below shows where to focus first.`
          : `At ${age}, a few foundational skills could use deliberate attention before taking on high-stakes responsibilities. Start with your lowest domain below.`,
    };
  }
  return {
    band: "emerging",
    message: isChild
      ? `These skills are just beginning to emerge, which is expected at ${age}. Supportive structure from adults matters more than anything else right now.`
      : `These answers suggest the foundations are still forming. That's workable at ${age} — the tips below are ordered by impact, so start at the top.`,
  };
}

/**
=======
>>>>>>> ef163329e9d9168b9ab62c8a5e5f307988d799fe
 * Resolves the developmental stage for an age and assembles the
 * recommendation payload for the Results view.
 *
 * @param {number} score - 0–100 maturity score from calculateMaturityScore
 * @param {number} age - Respondent age (6–25)
 * @returns {{
 *   stage: Object,
 *   score: number,
 *   tips: string[],
 *   workTypes: string[],
 *   workReadinessLevel: string
 * }}
 */
export function getStageAndRecommendations(score, age) {
  const stage = stages.find(
    (s) => age >= s.ageRange.min && age <= s.ageRange.max
  );

  if (!stage) {
    throw new RangeError(`Age ${age} is outside the supported range of 6–25.`);
  }

  return {
    stage,
    score,
    tips: stage.childhoodMaximizationTips.slice(0, 5),
    workTypes: stage.suggestedWorkTypes.slice(0, 3),
    workReadinessLevel: stage.workReadinessLevel,
  };
}

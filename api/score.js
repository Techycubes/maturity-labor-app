import {
  calculateMaturityScore,
  calculateDomainScores,
  getStageAndRecommendations,
} from "../src/lib/scoring.js";

const VALID_DOMAINS = new Set(["emotional", "cognitive", "social", "physical"]);

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 20;
const requestLog = new Map();

function isRateLimited(ip) {
  const now = Date.now();
  const entry = requestLog.get(ip) ?? { count: 0, windowStart: now };

  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    requestLog.set(ip, { count: 1, windowStart: now });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;

  entry.count += 1;
  requestLog.set(ip, entry);
  return false;
}

function jsonError(res, status, code, message) {
  return res.status(status).json({ error: { code, message } });
}

export default function handler(req, res) {
  res.setHeader("Content-Security-Policy", "default-src 'none'");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "POST") {
    return jsonError(res, 405, "METHOD_NOT_ALLOWED", "Only POST requests are accepted.");
  }

  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ?? req.socket?.remoteAddress ?? "unknown";

  if (isRateLimited(ip)) {
    res.setHeader("X-RateLimit-Limit", RATE_LIMIT_MAX);
    res.setHeader("X-RateLimit-Remaining", 0);
    return jsonError(res, 429, "RATE_LIMITED", "Too many requests. Please try again later.");
  }

  const { age, responses } = req.body ?? {};

  if (age == null || responses == null) {
    return jsonError(res, 400, "MISSING_FIELDS", "Request body must include 'age' and 'responses'.");
  }

  const parsedAge = Number(age);
  if (!Number.isInteger(parsedAge) || parsedAge < 6 || parsedAge > 25) {
    return jsonError(res, 400, "INVALID_AGE", "age must be an integer between 6 and 25.");
  }

  if (!Array.isArray(responses) || responses.length === 0) {
    return jsonError(res, 400, "INVALID_RESPONSES", "responses must be a non-empty array of { id, domain, value } objects.");
  }

  for (const response of responses) {
    if (typeof response !== "object" || response === null) {
      return jsonError(res, 400, "INVALID_RESPONSE_ITEM", "Each response must be an object.");
    }
    if (typeof response.id !== "string") {
      return jsonError(res, 400, "INVALID_RESPONSE_ID", "Each response must have a string 'id'.");
    }
    if (!VALID_DOMAINS.has(response.domain)) {
      return jsonError(res, 400, "INVALID_DOMAIN", `Unknown domain in response ${response.id}.`);
    }
    const value = Number(response.value);
    if (!Number.isFinite(value) || value < 0 || value > 100) {
      return jsonError(res, 400, "INVALID_ANSWER_VALUE", `Value for ${response.id} must be a number between 0 and 100.`);
    }
  }

  try {
    const score = calculateMaturityScore(parsedAge, responses);
    const report = getStageAndRecommendations(score, parsedAge);
    const domainScores = calculateDomainScores(responses);
    return res.status(200).json({ age: parsedAge, domainScores, ...report });
  } catch (err) {
    if (err instanceof RangeError) {
      return jsonError(res, 400, "OUT_OF_RANGE", err.message);
    }
    console.error("[/api/score]", err);
    return jsonError(res, 500, "INTERNAL_ERROR", "Something went wrong. Please try again.");
  }
}

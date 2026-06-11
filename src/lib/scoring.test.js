import { describe, it, expect } from "vitest";
import {
  calculateMaturityScore,
  calculateDomainScores,
  getStageAndRecommendations,
  getScoreInterpretation,
} from "./scoring.js";
import questions from "../data/questions.json";
import stages from "../data/stages.json";

const r = (domain, value) => ({ id: `t-${domain}-${value}`, domain, value });

describe("calculateMaturityScore", () => {
  it("returns 100 for perfect answers in every domain (clamped despite age boost)", () => {
    const responses = [
      r("emotional", 100),
      r("cognitive", 100),
      r("social", 100),
      r("physical", 100),
    ];
    // base 100 × 1.08 (age 16) = 108 → clamped to 100
    expect(calculateMaturityScore(16, responses)).toBe(100);
  });

  it("matches the hand-computed weighted average for age 10", () => {
    const responses = [
      r("emotional", 67),
      r("cognitive", 33),
      r("social", 100),
      r("physical", 0),
    ];
    // 0.35·67 + 0.35·33 + 0.20·100 + 0.10·0 = 55; 55 × 1.18 = 64.9 → 65
    expect(calculateMaturityScore(10, responses)).toBe(65);
  });

  it("renormalizes weights when domains are missing", () => {
    const responses = [r("emotional", 80), r("cognitive", 40)];
    // (0.35·80 + 0.35·40) / 0.70 = 60; age 24 factor 1.0 → 60
    expect(calculateMaturityScore(24, responses)).toBe(60);
  });

  it("averages multiple answers within the same domain", () => {
    const responses = [r("emotional", 100), r("emotional", 0)];
    // domain avg 50, only domain present → 50; age 25 factor 1.0
    expect(calculateMaturityScore(25, responses)).toBe(50);
  });

  it("applies the strongest age adjustment to the youngest band", () => {
    const responses = [r("emotional", 50)];
    // 50 × 1.30 = 65 at age 6 vs 50 × 1.0 at age 25
    expect(calculateMaturityScore(6, responses)).toBe(65);
    expect(calculateMaturityScore(25, responses)).toBe(50);
  });

  it("never exceeds 100 or drops below 0", () => {
    expect(calculateMaturityScore(6, [r("emotional", 100)])).toBe(100);
    expect(calculateMaturityScore(25, [r("emotional", 0)])).toBe(0);
  });

  it("returns 0 for empty, missing, or entirely invalid responses", () => {
    expect(calculateMaturityScore(15, [])).toBe(0);
    expect(calculateMaturityScore(15, undefined)).toBe(0);
    expect(calculateMaturityScore(15, [r("nonsense", 90)])).toBe(0);
    expect(
      calculateMaturityScore(15, [{ id: "x", domain: "emotional", value: "abc" }])
    ).toBe(0);
  });

  it("clamps out-of-range answer values instead of letting them skew the score", () => {
    // 500 clamps to 100, -50 clamps to 0 → emotional avg 50 → age 25 → 50
    const responses = [r("emotional", 500), r("emotional", -50)];
    expect(calculateMaturityScore(25, responses)).toBe(50);
  });
});

describe("calculateDomainScores", () => {
  it("averages per domain and zero-fills missing domains", () => {
    const responses = [r("emotional", 100), r("emotional", 0), r("social", 67)];
    expect(calculateDomainScores(responses)).toEqual({
      emotional: 50,
      cognitive: 0,
      social: 67,
      physical: 0,
    });
  });

  it("returns all zeros for empty input", () => {
    expect(calculateDomainScores([])).toEqual({
      emotional: 0,
      cognitive: 0,
      social: 0,
      physical: 0,
    });
  });
});

describe("getStageAndRecommendations", () => {
  it.each([
    [6, "early_childhood"],
    [8, "early_childhood"],
    [9, "middle_childhood"],
    [12, "middle_childhood"],
    [13, "adolescence"],
    [17, "adolescence"],
    [18, "emerging_adulthood"],
    [22, "emerging_adulthood"],
    [23, "young_adult"],
    [25, "young_adult"],
  ])("maps age %i to stage %s (boundary-exact)", (age, stageId) => {
    expect(getStageAndRecommendations(70, age).stage.id).toBe(stageId);
  });

  it("throws RangeError for ages outside 6–25", () => {
    expect(() => getStageAndRecommendations(70, 5)).toThrow(RangeError);
    expect(() => getStageAndRecommendations(70, 26)).toThrow(RangeError);
  });

  it("returns at most 5 tips and exactly 3 work types", () => {
    const result = getStageAndRecommendations(70, 15);
    expect(result.tips.length).toBeLessThanOrEqual(5);
    expect(result.workTypes).toHaveLength(3);
    expect(result.score).toBe(70);
    expect(["low", "medium", "high"]).toContain(result.workReadinessLevel);
  });
});

describe("getScoreInterpretation", () => {
  it.each([
    [95, "advanced"],
    [80, "advanced"],
    [79, "on-track"],
    [60, "on-track"],
    [59, "developing"],
    [40, "developing"],
    [39, "emerging"],
    [0, "emerging"],
  ])("score %i falls in the %s band", (score, band) => {
    expect(getScoreInterpretation(score, 15).band).toBe(band);
  });

  it("personalizes the message with the respondent's age", () => {
    for (const age of [7, 15, 24]) {
      expect(getScoreInterpretation(85, age).message).toContain(String(age));
    }
  });

  it("gives a child and an adult different messages for the same score", () => {
    expect(getScoreInterpretation(85, 7).message).not.toBe(
      getScoreInterpretation(85, 24).message
    );
  });
});

describe("data integrity: questions.json", () => {
  const VALID_DOMAINS = ["emotional", "cognitive", "social", "physical"];

  it("every question is well-formed", () => {
    for (const q of questions) {
      expect(q.id).toMatch(/^q\d+$/);
      expect(VALID_DOMAINS).toContain(q.domain);
      expect(q.ageRange.min).toBeGreaterThanOrEqual(6);
      expect(q.ageRange.max).toBeLessThanOrEqual(25);
      expect(q.options).toHaveLength(4);
      for (const opt of q.options) {
        expect(opt.value).toBeGreaterThanOrEqual(0);
        expect(opt.value).toBeLessThanOrEqual(100);
        expect(typeof opt.label).toBe("string");
      }
    }
  });

  it("has no duplicate question ids", () => {
    const ids = questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every age from 6 to 25 gets at least one question in every domain", () => {
    for (let age = 6; age <= 25; age++) {
      const eligible = questions.filter(
        (q) => age >= q.ageRange.min && age <= q.ageRange.max
      );
      for (const domain of VALID_DOMAINS) {
        const count = eligible.filter((q) => q.domain === domain).length;
        expect(count, `age ${age}, domain ${domain}`).toBeGreaterThan(0);
      }
    }
  });
});

describe("data integrity: stages.json", () => {
  it("covers every age 6–25 exactly once with no gaps or overlaps", () => {
    for (let age = 6; age <= 25; age++) {
      const matches = stages.filter(
        (s) => age >= s.ageRange.min && age <= s.ageRange.max
      );
      expect(matches, `age ${age}`).toHaveLength(1);
    }
  });

  it("every stage has the fields the Results view renders", () => {
    for (const s of stages) {
      expect(s.label).toBeTruthy();
      expect(s.description).toBeTruthy();
      expect(s.childhoodMaximizationTips.length).toBeGreaterThanOrEqual(5);
      expect(s.suggestedWorkTypes.length).toBeGreaterThanOrEqual(3);
      expect(["low", "medium", "high"]).toContain(s.workReadinessLevel);
      expect(s.researchNote.citation).toBeTruthy();
      expect(s.researchNote.institution).toBeTruthy();
      expect(s.researchNote.url).toMatch(/^https:\/\//);
    }
  });
});

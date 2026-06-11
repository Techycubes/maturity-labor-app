import { describe, it, expect } from "vitest";
import handler from "./score.js";

function mockRes() {
  const res = {
    statusCode: null,
    body: null,
    headers: {},
    setHeader(key, value) {
      this.headers[key] = value;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
      return this;
    },
  };
  return res;
}

let ipCounter = 0;
function mockReq({ method = "POST", body } = {}) {
  // Unique IP per request so the in-memory rate limiter never trips in tests
  ipCounter += 1;
  return {
    method,
    body,
    headers: { "x-forwarded-for": `10.0.0.${ipCounter}` },
    socket: { remoteAddress: `10.0.0.${ipCounter}` },
  };
}

const validResponses = [
  { id: "q001", domain: "emotional", value: 67 },
  { id: "q005", domain: "cognitive", value: 100 },
  { id: "q009", domain: "social", value: 33 },
  { id: "q013", domain: "physical", value: 67 },
];

describe("POST /api/score", () => {
  it("rejects non-POST methods with 405", () => {
    const res = mockRes();
    handler(mockReq({ method: "GET" }), res);
    expect(res.statusCode).toBe(405);
    expect(res.body.error.code).toBe("METHOD_NOT_ALLOWED");
  });

  it("rejects a missing body with 400", () => {
    const res = mockRes();
    handler(mockReq({ body: undefined }), res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error.code).toBe("MISSING_FIELDS");
  });

  it.each([5, 26, 14.5, "abc"])("rejects invalid age %s", (age) => {
    const res = mockRes();
    handler(mockReq({ body: { age, responses: validResponses } }), res);
    expect(res.statusCode).toBe(400);
    expect(res.body.error.code).toBe("INVALID_AGE");
  });

  it("rejects an unknown domain", () => {
    const res = mockRes();
    handler(
      mockReq({
        body: {
          age: 15,
          responses: [{ id: "q001", domain: "telepathy", value: 50 }],
        },
      }),
      res
    );
    expect(res.statusCode).toBe(400);
    expect(res.body.error.code).toBe("INVALID_DOMAIN");
  });

  it("rejects out-of-range answer values", () => {
    const res = mockRes();
    handler(
      mockReq({
        body: {
          age: 15,
          responses: [{ id: "q001", domain: "emotional", value: 250 }],
        },
      }),
      res
    );
    expect(res.statusCode).toBe(400);
    expect(res.body.error.code).toBe("INVALID_ANSWER_VALUE");
  });

  it("returns a complete, correctly scored report for valid input", () => {
    const res = mockRes();
    handler(mockReq({ body: { age: 15, responses: validResponses } }), res);

    expect(res.statusCode).toBe(200);
    // 0.35·67 + 0.35·100 + 0.20·33 + 0.10·67 = 71.75; × 1.08 = 77.49 → 77
    expect(res.body.score).toBe(77);
    expect(res.body.age).toBe(15);
    expect(res.body.stage.id).toBe("adolescence");
    expect(res.body.workReadinessLevel).toBe("medium");
    expect(res.body.tips).toHaveLength(5);
    expect(res.body.workTypes).toHaveLength(3);
    expect(res.body.domainScores).toEqual({
      emotional: 67,
      cognitive: 100,
      social: 33,
      physical: 67,
    });
  });

  it("sets security headers on every response", () => {
    const res = mockRes();
    handler(mockReq({ body: { age: 15, responses: validResponses } }), res);
    expect(res.headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(res.headers["X-Frame-Options"]).toBe("DENY");
  });
});

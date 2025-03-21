const request = require("supertest");
const app = require("../src/index");

// Mock browser service
jest.mock("../src/services/browser", () => ({
  connect: jest.fn().mockImplementation(() =>
    Promise.resolve({
      newPage: jest.fn().mockImplementation(() =>
        Promise.resolve({
          goto: jest.fn(),
          waitForSelector: jest.fn(),
          $eval: jest.fn(),
          click: jest.fn(),
          keyboard: {
            press: jest.fn(),
          },
          type: jest.fn(),
          evaluate: jest
            .fn()
            .mockImplementation(() => Promise.resolve("Mock content")),
          on: jest.fn(),
        })
      ),
      close: jest.fn(),
      on: jest.fn(),
    })
  ),
  disconnect: jest.fn(),
}));

describe("Crypto Endpoint", () => {
  it("should return 401 when no API key is provided", async () => {
    const response = await request(app).post("/api/crypto");
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Authentication failed");
  });

  it("should return 401 with invalid API key", async () => {
    const response = await request(app)
      .post("/api/crypto")
      .set("X-API-Key", "invalid-key");
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe("Authentication failed");
  });

  it("should accept valid request with API key", async () => {
    // Using a key from config
    const response = await request(app)
      .post("/api/crypto")
      .set("X-API-Key", "test-key-1")
      .send({ electricityCost: "0.05" });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body).toHaveProperty("content");
    expect(response.body.parameters.electricityCost).toBe("0.05");
  });
});

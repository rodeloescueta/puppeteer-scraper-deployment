const request = require("supertest");
const app = require("../src/index");

describe("Health Endpoint", () => {
  it("should return status 200 and ok message", async () => {
    const response = await request(app).get("/health");
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body).toHaveProperty("uptime");
    expect(response.body).toHaveProperty("timestamp");
  });
});

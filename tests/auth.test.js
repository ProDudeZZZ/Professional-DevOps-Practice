const request = require("supertest");
const app = require("../index");

describe("Auth Integration Tests", () => {
  it("✅ should signup a new user", async () => {
    const email = `test${Date.now()}@gmail.com`;
    const res = await request(app)
      .post("/auth/signup")
      .send({ name: "test", email, password: "123456" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "User created successfully");
  });

  it("✅ should login and return JWT", async () => {
    const email = `login${Date.now()}@gmail.com`;
    await request(app)
      .post("/auth/signup")
      .send({ name: "test", email, password: "123456" });

    const res = await request(app).post("/auth/login").send({
      email,
      password: "123456",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("❌ should fail login with wrong password", async () => {
    const email = `wrongpass${Date.now()}@gmail.com`;
    await request(app)
      .post("/auth/signup")
      .send({ name: "test2", email, password: "123456" });

    const res = await request(app).post("/auth/login").send({
      email,
      password: "wrong",
    });

    expect(res.statusCode).toBe(401);
  });

  it("❌ should reject request without token", async () => {
    const res = await request(app).get("/todos");
    expect(res.statusCode).toBe(401);
  });

  it("❌ should reject request with invalid token", async () => {
    const res = await request(app)
      .get("/todos")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.statusCode).toBe(403);
  });
});

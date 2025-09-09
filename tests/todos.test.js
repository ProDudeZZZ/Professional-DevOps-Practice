const request = require("supertest");
const app = require("../index");

describe("Todos Integration Tests", () => {
  let token;
  let todoId;

  beforeEach(async () => {
    // Use a unique email every test run to avoid duplicate-user error
    const email = `user${Date.now()}@test.com`;

    // Register user
    await request(app)
      .post("/auth/signup")
      .send({ name: "test", email, password: "123456" });

    // Login to get token
    const res = await request(app)
      .post("/auth/login")
      .send({ email, password: "123456" });

    token = res.body.token; // ✅ now token is always valid
  });

  it("✅ should create a todo with valid token", async () => {
    const res = await request(app)
      .post("/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Todo", description: "Testing" });

    expect(res.statusCode).toBe(201);
    expect(res.body.todo).toHaveProperty("title", "Test Todo");
    todoId = res.body.todo._id;
  });

  it("❌ should fail to create todo without token", async () => {
    const res = await request(app)
      .post("/todos")
      .send({ title: "No Token", description: "Fail" });

    expect(res.statusCode).toBe(401);
  });

  it("✅ should fetch only user’s todos", async () => {
    await request(app)
      .post("/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "User Todo", description: "Testing" });

    const res = await request(app)
      .get("/todos")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.todos.length).toBe(1);
    expect(res.body.todos[0].title).toBe("User Todo");
  });

  it("✅ should update todo if owner", async () => {
    const createRes = await request(app)
      .post("/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Old Title", description: "Testing" });

    todoId = createRes.body.todo._id;

    const updateRes = await request(app)
      .put(`/todos/${todoId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Title", description: "Updated" });

    expect(updateRes.statusCode).toBe(200);
    expect(updateRes.body.updatedTodo.title).toBe("Updated Title");
  });

  it("✅ should delete todo if owner", async () => {
    const createRes = await request(app)
      .post("/todos")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Delete Me", description: "Testing" });

    todoId = createRes.body.todo._id;

    const deleteRes = await request(app)
      .delete(`/todos/${todoId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteRes.statusCode).toBe(200);
    expect(deleteRes.body).toHaveProperty("msg", "Todo Deleted successfully");
  });
});

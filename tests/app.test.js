const request = require("supertest");
const app = require('../index');


test('First API Test', async () => { 
    let res = await request(app).get("/test");
    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe("working...");
 })
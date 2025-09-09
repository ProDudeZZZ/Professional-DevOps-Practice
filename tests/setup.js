const mongoose = require("mongoose");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(process.env.MONGO_URI);
  console.log("Connected To DB In Jest Config");
});

afterAll(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
  await mongoose.connection.close();
  console.log("Collections cleared and connection closed");
});

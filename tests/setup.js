const mongoose = require("mongoose");
require("dotenv").config();

beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected To DB In Jest Config");
  } catch (error) {
    console.log("Unable to connect DB", error);
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    // connected
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
    await mongoose.connection.close();
    console.log("Collections cleared and connection closed");
  }
});

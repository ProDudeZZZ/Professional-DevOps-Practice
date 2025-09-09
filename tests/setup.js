const mongoose = require('mongoose');

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI)
    console.log(process.env.MONGO_URI);
    console.log("Connected To DB In Jest Config");  
});


afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  console.log("DB Deleted and connection closed");
});
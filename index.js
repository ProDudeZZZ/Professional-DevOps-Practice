require("dotenv").config({
    path: process.env.NODE_ENV==="test" ? "./.env.testing" : "./.env"
});

const express = require("express");
const connectToDB = require("./config/db");
const userRouter = require("./routes/user.routes");
const todoRouter = require("./routes/todo.routes");
require("dotenv").config();

const app = express();

// console.log(process.env.MONGO_URI);

app.use(express.json());
connectToDB();

app.get("/test", (req, res) => {
  res.json({ msg: "working..." });
});

app.use("/auth", userRouter);
app.use("/todos", todoRouter);

app.use((req, res) => {
  res.status(404).json({ msg: "page not found" });
});

module.exports = app;

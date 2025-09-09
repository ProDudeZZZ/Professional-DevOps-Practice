const express = require("express");
const bcrypt = require("bcryptjs");
const UserModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();
const salt = bcrypt.genSaltSync(10);

// Register User
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email or password missing" });
    }

    // Check for duplicate email
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Email already exists, please login" });
    }

    const hash = bcrypt.hashSync(password, salt);
    const user = await UserModel.create({ name, email, password: hash });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
  }
});

// Login User
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ error: "Unauthorized user, Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, name: user.name, email: user.email },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ msg: "Login success", token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
  }
});

module.exports = router;
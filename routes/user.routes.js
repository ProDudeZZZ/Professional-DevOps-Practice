const express = require('express');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/user.model');
var jwt = require("jsonwebtoken");
require('dotenv').config();

const router = express.Router();
const salt = bcrypt.genSaltSync(10);

// Register User
router.post('/signup', async(req, res) => {
    try {
        let { name, email, password } = req.body;

        let isExist = await UserModel.findOne({email});
        if(isExist){
            return res.status(400).json({error: "Email already exist, please login"})
        }

        if (!name || !email || !password) {
          return res
            .status(400)
            .json({ error: "name, email or password missing" });
        }

        let hash = bcrypt.hashSync(password, salt);

        let user = await UserModel.create({name, email, password: hash})
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Something went wrong, please try again later"});
    }
})

// Login User
router.post('/login', async(req, res) => {
    let {email, password} = req.body;
    try {
        let user = await UserModel.findOne({email});
        if(!user) {
            return res.status(404).json({error: "User not found"});
        }

        let hash = user.password;

        let isMatch = await bcrypt.compare(password, hash);
        if(!isMatch){
            return res.status(401).json({error: "Unauthorized user, Invalid email or password"});
        }

        let token = jwt.sign({id: user._id, name: user.name, email: user.email}, process.env.JWT_SECRET_KEY, {expiresIn: "1h"});

        res.status(200).json({msg: "Login success", token});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Something went wrong, please try again later"});
    }
})

module.exports = router;
const express = require('express');
const User = require('../models/auth');
const bcrypt = require('bcrypt');
const router = express.Router();
const JWT = require("jsonwebtoken")
const userAuthMiddleware = require("../middleware/userAuthMiddleware");
require('dotenv').config();


router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ message: "User not found." });
      }
  const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials." });
      }
  const {password:_, phone:__, gender:___, email:____ , profileImage:_____ ,  name:_______ , ...userData} = user.toObject();
  let token = JWT.sign({id : user._id} , process.env.JWT_SECRET , {expiresIn:"1h"})

      res.status(200).json({ message: "Login successful", userId: user._id , user: userData , token });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Server Error" });
    }
  });

  router.get("/get-user/:id", userAuthMiddleware ,async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select("-password"); 
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error("Get User Error:", error);
      res.status(500).json({ message: "Server Error" });
    }
  });
  


  router.put("/updateUser/:id", userAuthMiddleware ,  async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, gender } = req.body;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, email, phone, gender },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user", error });
    }
  });

  module.exports = router;

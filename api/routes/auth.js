import express from "express";
import User from "../models/User";

const router = express.Router();

//REGISTER
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  const user = await newUser.save();
  res.status(201).json(user);
});

module.exports = router;

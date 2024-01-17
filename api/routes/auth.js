import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt"

const router = express.Router();

//REGISTER
router.post("/register", async (req, res) => {
  const saltRounds = 10;
  const Password = req.body.password;
  let Hash;
  bcrypt.hash(Password, saltRounds, async (err, hash) => {
    if(err) console.log(err)
    else Hash = hash
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: Hash,
    });
  })
  const user = await newUser.save();
  res.status(201).json(user);
});

//LOGIN

router.post("/login", async (req, res)=>{
  const userInDB = await User.findOne({email:req.body.email});
  const Password = req.body.password;
  !userInDB && res.status(404).json("Wrong Password or Username");
  bcrypt.compare(Password, userInDB.password, async (err, result) => {
    err && res.status(500).json("Error while fetching data");
    !result && res.status(401).json("Wrong Password or Username");
    res.status(200).json(userInDB);
  });

})

export default router;

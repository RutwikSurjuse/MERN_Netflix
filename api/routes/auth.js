import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";

const router = express.Router();

//REGISTER
router.post("/register", async (req, res) => {
  try{
  const saltRounds = 10;
  console.log(req.body)
  const Password = req.body.password;
  const userInDB = await User.findOne({email:req.body.email});
  if(userInDB && userInDB.username === req.body.username) {
    res.status(400).send("User already exists, please Log in!")
    return;
  }
  bcrypt.hash(Password, saltRounds, async (err, hash) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash,
    });
    try {
      const fullUser = await newUser.save();
      const [user, password] = {...fullUser, password}
      console.log("User successfully registered")
      res.status(201).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
      return;
    }
  });
}catch(err){
  console.log(err)
}});


//LOGIN

router.post("/login", async (req, res)=>{
  const userInDB = await User.findOne({email:req.body.email});
  if(!userInDB) {
    res.status(404).json("User does not exist, please register first!");
    return;
  }
  const Password = req.body.password;
  bcrypt.compare(Password, userInDB.password, async (err, result) => {
    if(err) {
      res.status(500).json("Error while fetching data");
      return;
    }
    if(!result) res.status(401).json("Wrong Password or Username");
    else {
      const {password, ...user} = userInDB._doc;
      res.status(200).json(user);
      console.log("User successfully Logged In")
    }
  });
})

export default router;

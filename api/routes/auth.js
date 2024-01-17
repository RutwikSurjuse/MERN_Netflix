import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt"

const app = express();
app.use(express.json());
const router = express.Router();

//REGISTER
router.post("/register", async (req, res) => {
  try{
  const saltRounds = 10;
  console.log(req.body)
  const Password = req.body.password;
  bcrypt.hash(Password, saltRounds, async (err, hash) => {
    if (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hash, // Use the hashed password here
    });

    try {
      const user = await newUser.save();
      res.status(201).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  });
}catch(err){
  console.log(err)
}});


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

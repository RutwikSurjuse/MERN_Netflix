import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";

const app = express();
const port = 3000;

dotenv.config();
app.use("/api/auth", authRoute);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connection with DB successful");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

const express = require("express");
const app = express();
const userRouter = require("./routes/userRoutes");
const todoRouter = require("./routes/todoRoutes");
const mongoose = require("mongoose");
app.use(express.json());
const expressCache = require("cache-express");
require('dotenv').config();
const dbuser = process.env.DB
const pwd = process.env.PWD
app.use("/users", userRouter);

app.use("/todo", todoRouter);

mongoose
  .connect(
    `mongodb+srv://${dbuser}:${pwd}@cluster0.qjxhv.mongodb.net/todoapp?retryWrites=true&w=majority&appName=Cluster0`
  )
  // .connect("mongodb://127.0.0.1:27017/todoapp")
  .then(() => {
    app.listen(8081, () => {
      console.log("Server Started");
    });
  })
  .catch((error) => {
    console.log(error);
  });

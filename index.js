const express = require("express");
const app = express();
const userRouter = require("./routes/userRoutes");
const todoRouter = require("./routes/todoRoutes");
const mongoose = require("mongoose");
app.use(express.json());
const expressCache = require("cache-express");
require('dotenv').config();
const DBUSER = process.env.DBUSER
const PWD = process.env.PWD
const PORT = process.env.PORT || 8080;
const usr = encodeURIComponent(DBUSER)
const pwd = encodeURIComponent(PWD)
app.use("/users", userRouter);
app.use("/todo", todoRouter);
console.log(usr,pwd)
mongoose
  .connect(
    `mongodb+srv://${usr}:${pwd}@cluster0.qjxhv.mongodb.net/todoapp?retryWrites=true&w=majority&appName=Cluster0`
  )
  // .connect("mongodb://127.0.0.1:27017/todoapp")
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Started on ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

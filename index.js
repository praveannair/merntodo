const express = require("express");
const cors = require("cors")
const app = express();
const userRouter = require("./routes/userRoutes");
const todoRouter = require("./routes/todoRoutes");
const mongoose = require("mongoose");
app.use(express.json());
const expressCache = require("cache-express");
require('dotenv').config();
const DBUSER = process.env.DBUSER
const PASS = process.env.PASS
const PORT = process.env.PORT || 8080;
const usr = encodeURIComponent(DBUSER)
const pwd = encodeURIComponent(PASS)
app.use("/users", userRouter);
app.use("/todo", todoRouter);
app.use(cors())
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

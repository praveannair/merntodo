const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const SECRET_KEY = "APIKEY";
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
mongoose.connect("mongodb://127.0.0.1:27017/todoapp1");
const cors = require("cors");

app.use(cors());

app.use(express.json());

const userSchema = mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, required: true },
  },
  { timestamps: true }
);
const userModel = mongoose.model("User", userSchema);

const todoSchema = mongoose.Schema(
  {
    task: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
const todoModel = mongoose.model("todos", todoSchema);

const auth = (req, res, next) => {
  let token = req.headers.authorization;
  if (token) {
    try {
      token = token.split(" ")[1];
      let user = jwt.verify(token, SECRET_KEY);
      req.userId = user.id;
      req.role = user.role;
      next();
    } catch (err) {
      res.status(400).json({ message: "Something Went Wrong" });
    }
  } else {
    res.status(400).json({ message: "Invalid User" });
  }
};

app.get("/", auth, async (req, res) => {
  if (req.role !== "admin") {
    res.status(400).json({ message: "Unauthorized Access" });
  } else {
    const tasks = await todoModel.find({ userId: req.userId });
    console.log(tasks)
    res.status(200).json(tasks);
  }
});

app.delete("/delete/:id", auth, async (req, res) => {
  if (req.role !== "admin") {
    res.status(400).json({ message: "Unauthorized Access" });
  } else {
    const tasks = await todoModel.findByIdAndDelete({ _id: req.params.id });
    res.status(200).json(tasks);
  }
});
app.post("/signup", async (req, res) => {
  const { username, password, email, role } = req.body;
  const existingUser = await userModel.findOne({ email: email });
  if (existingUser) {
    return res.status(400).json({ message: "User Already Exist" });
  } else {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await userModel.create({
      username: username,
      password: hashedPassword,
      email: email,
      role: role,
    });

    const token = jwt.sign(
      { email: result.email, role: result.role, id: result._id },
      SECRET_KEY
    );
    res.status(201).json({ user: result, token: token });
  }
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await userModel.findOne({ email: email });
  if (!existingUser) {
    return res.status(400).json({ message: "User not found" });
  }

  matchPassword = await bcrypt.compare(password, existingUser.password);
  if (!matchPassword) {
    return res.status(400).json({ message: "Invalid Password" });
  }

  const token = jwt.sign(
    {
      email: existingUser.email,
      role: existingUser.role,
      id: existingUser._id,
    },
    SECRET_KEY
  );

  // res.status(201).json({ user: existingUser, token: token });
  res.status(201).json({ token: token });
});

app.post("/todo", auth, async (req, res) => {
 
  const { task } = req.body;
  const newTodo = new todoModel({
    task: task,
    userId: req.userId,
  });
  await newTodo.save();
  res.status(201).json(newTodo);
});

app.listen(8081, () => {
  console.log("Server Started");
});

const todoModel = require("../models/todoModel");
// const filter = require("profanity-filter")

const filter = require("profanity-filter");
filter.addWord("slang");
filter.addWord("bad");
console.log(filter.clean("This is a bad slang"));

const createTask = async (req, res) => {
  // console.log(req.role);
  // if (req.role !== "admin") {
  //   return res.status(400).json({ message: "Unauthorized Access" });
  // }
  const { task } = req.body;

  const newTodo = new todoModel({
    task: task,
    userId: req.userId,
  });
  try {
    if (req.role !== "admin") {
      return res.status(200).json({ message: "Unauthorized Access" });
    }
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const deleteTask = async (req, res) => {
  const id = req.params.id;
  try {
    const task = await todoModel.findByIdAndDelete(id);
    res.status(200).json(task);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Somethong went Wrong" });
  }
};

const updateTask = async (req, res) => {
  const id = req.params.id;
  const { task } = req.body;
  const newTask = {
    task: task,
    userId: req.userId,
  };
  try {
    await todoModel.findByIdAndUpdate(id, newTask, { new: true });
    res.status(200).json(newTask);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await todoModel.find({ userId: req.userId });
    res.status(200).json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { createTask, deleteTask, updateTask, getTasks };

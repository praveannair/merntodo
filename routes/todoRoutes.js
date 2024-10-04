const express = require("express");
const {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} = require("../controllers/todoController");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const todoRouter = express.Router();

todoRouter.get("/", auth, getTasks);

todoRouter.post("/", auth, createTask);

todoRouter.delete("/:id", auth, deleteTask);

todoRouter.put("/:id", auth, updateTask);

module.exports = todoRouter;

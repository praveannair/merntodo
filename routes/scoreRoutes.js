const express = require("express");
const {
  getScore,
  updateScore,
} = require("../controllers/scoreController");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const scoreRouter = express.Router();

scoreRouter.get("/", auth, getScore);

scoreRouter.post("/", auth, updateScore);

module.exports = scoreRouter;

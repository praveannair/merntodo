const express = require("express");
const {
  getScore,
  updateScore,
  getPosition,
} = require("../controllers/scoreController");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/authorize");
const scoreRouter = express.Router();

scoreRouter.get("/", auth, getScore);

scoreRouter.get("/position", auth, getPosition);

scoreRouter.post("/", auth, updateScore);

module.exports = scoreRouter;

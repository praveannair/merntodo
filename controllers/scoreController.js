const scoreModel = require("../models/scoreModel");

const updateScore = async (req, res) => {
  const newTask = {
    userId: req.userId,
  };
  try {
    // await scoreModel.findByIdAndUpdate(id, newTask, {
    await scoreModel.updateOne(
      { userId: req.userId },
      { $inc: { score: 1 } },
      {
        new: true,
        upsert: true,
      }
    );
    const score = await scoreModel.findOne(
      { userId: req.userId },
      { _id: 0, score: 1 }
    );
    res.status(200).json(score);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getScore = async (req, res) => {
  try {
    const score = await scoreModel.findOne(
      { userId: req.userId },
      { _id: 0, score: 1 }
    );
    if (score.length === 0) res.status(200).json({ score: 0 });
    else res.status(200).json(score);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

const getPosition = async (req, res) => {
  try {
    // const position = await scoreModel.find({},{ _id: 0, userId:1,score: 1 }).sort({score:-1});

    const position = await scoreModel.aggregate([
      { $sort: { score: -1 } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          pipeline: [{ $project: { username: 1, email: 1, _id: 0 } }],
          as: "user",
        },
      },
    ]);

    res.status(200).json(position);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { getScore, updateScore, getPosition };

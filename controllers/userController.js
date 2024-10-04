const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
SECRET_KEY = "helloworld";

const signup = async (req, res) => {
  const { username, password, email, role } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User Already Exist" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = await userModel.create({
        username: username,
        password: hashedPassword,
        email: email,
        role:role,
      });

      const token = jwt.sign(
        { email: result.email, role:result.role, id: result._id },
        SECRET_KEY
      );
      res.status(201).json({ user: result, token: token });
    }
  } catch (error) {
    console.log(error);
    res.status(500), json({ message: "Something went wrong" });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email: email });
    if (!existingUser) {
      return res.status(400).json({ message: "User not found" });
    }

    matchPassword = await bcrypt.compare(password, existingUser.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = jwt.sign(
      { email: existingUser.email, role:existingUser.role, id: existingUser._id },
      SECRET_KEY
    );

    res.status(201).json({ user: existingUser, token: token });
  } catch (error) {
    console.log(error);
    res.status(500), json({ message: "Something went wrong" });
  }
};

module.exports = { signup, signin };

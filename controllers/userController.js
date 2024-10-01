const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.userSignup = async (req, res, next) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log("i was here", name, email, password);

  try {
    const createdUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ email }, "privateKey090");
    res.cookie("token", token);

    // Exclude the password field before sending the response
    const userResponse = { ...createdUser._doc };
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.logout = async (req, res, next) => {
  res.cookie("token", "");
  res.send("logged out");
};

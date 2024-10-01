const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.userSignup = async (req, res, next) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const createdUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    // Exclude the password field before sending the response
    const userResponse = { ...createdUser._doc };
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

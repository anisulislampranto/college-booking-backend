const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { oauth2Client } = require("../utils/googleClient");
const College = require("../models/college");
const JWT_SECRET = process.env.JWT_SECRET;

const createToken = (_id, email) => {
  return jwt.sign({ _id, email }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

exports.isLoggedIn = async (req, res, next) => {
  if (!req.cookies || !req.cookies.token) {
    res.json({ message: "You Must be logged in" });
  } else {
    const data = jwt.verify(req.cookies.token, JWT_SECRET);
    req.user = data;
    next();
  }
};

/* GET Google Authentication API. */
exports.googleAuth = async (req, res, next) => {
  const code = req.query.code;

  try {
    const googleRes = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(googleRes.tokens);

    const userRes = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    const data = await userRes.json();

    const { email, name, picture } = data;

    let user = await userModel.findOne({ email }).populate("colleges");

    if (!user) {
      user = await userModel.create({
        name,
        email,
        image: picture,
      });
    }

    const token = createToken(user._id);

    res.cookie("token", token).status(200).json({
      message: "success",
      token,
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      throw Error("All fields are required!!!");
    }

    const user = await userModel.findOne({ email });

    if (user) {
      return res.json({ message: "Already have an account." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createToken(createdUser._id, email);

    // Exclude the password field before sending the response
    const userResponse = { ...createdUser._doc, token };
    delete userResponse.password;

    res.status(201).json({
      message: "Signed Up successfully!",
      data: userResponse,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      throw Error("All fields are required!!!");
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Incorrect Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw Error("Incorrect password");
    }

    const colleges = await College.find({ students: user._id });

    const token = createToken(user._id, user.email);

    const userResponse = {
      _id: user.id,
      email: user.email,
      name: user.name,
      colleges,
      token,
    };

    res.status(200).json({
      message: "Logged In successfully!",
      data: userResponse,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

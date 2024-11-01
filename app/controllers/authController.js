const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const { oauth2Client } = require("../utils/googleClient");
const College = require("../models/college");
const { createToken } = require("../utils/createToken");

/* GET Google Authentication API. */
exports.googleAuth = async (req, res, next) => {
  const code = req.query.code;
  const type = req.query.type;

  try {
    const googleRes = await oauth2Client.getToken(code);

    oauth2Client.setCredentials(googleRes.tokens);

    const userRes = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
    );
    const data = await userRes.json();

    const { email, name, picture } = data;

    let user = await User.findOne({ email })
      .populate({
        path: "colleges.college",
        model: "College",
        populate: [
          { path: "events", model: "Event" },
          { path: "researches", model: "Research" },
          { path: "sports", model: "Sport" },
        ],
      })
      .populate({
        path: "colleges.subject",
        model: "Subject",
      });

    // If user does not exist, create a new user
    if (!user) {
      user = await User.create({
        type,
        name,
        email,
        image: picture,
      });

      console.log("createdUser", user);
    }

    const token = createToken(user._id, user.email);

    res.cookie("token", token).status(200).json({
      message: "success",
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

exports.signup = async (req, res, next) => {
  const { name, email, password, type } = req.body;

  try {
    if (!name || !email || !password) {
      throw Error("All fields are required!!!");
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(403).json({ message: "Already have an account." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
      type,
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

    const user = await User.findOne({ email })
      .populate({
        path: "colleges.college",
        model: "College",
        populate: [
          { path: "events", model: "Event" },
          { path: "researches", model: "Research" },
          { path: "sports", model: "Sport" },
        ],
      })
      .populate({
        path: "colleges.subject",
        model: "Subject",
      });

    if (!user) {
      return res.status(404).json({ message: "Incorrect Email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw Error("Incorrect password");
    }

    let colleges;

    if (user.type === "student") {
      colleges = await College.find({ students: user._id })
        .populate("events")
        .populate("researches")
        .populate("sports")
        .populate("students");
    }

    if (user.type === "collegeAdmin") {
      colleges = await College.find({ admin: user._id })
        .populate("events")
        .populate("researches")
        .populate("sports")
        .populate("students");
    }

    const token = createToken(user._id, user.email);

    const userResponse = {
      _id: user.id,
      email: user.email,
      name: user.name,
      type: user.type,
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

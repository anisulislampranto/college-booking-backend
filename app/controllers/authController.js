const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { oauth2Client } = require("../utils/googleClient");
const College = require("../models/college");
const JWT_SECRET = process.env.JWT_SECRET;

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

      console.log("user inside", user);
    }

    const { _id } = user;
    const token = jwt.sign({ _id, email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

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

  // Find user by email
  const user = await userModel.findOne({ email });
  if (user) {
    return res.json({ message: "Already have an account." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const createdUser = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ email, name }, JWT_SECRET);
    res.cookie("token", token);

    // Exclude the password field before sending the response
    const userResponse = { ...createdUser._doc, token };
    delete userResponse.password;

    console.log("user created", userResponse);

    res.json(userResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    // Compare password
    bcrypt.compare(password, user.password, async function (err, isMatch) {
      if (err) {
        return res
          .status(500)
          .json({ error: "Error while comparing passwords" });
      }

      if (isMatch) {
        // Generate JWT if password matches
        const token = jwt.sign(
          { userId: user._id, email: user.email },
          JWT_SECRET,
          { expiresIn: "1h" } // Token expiration time
        );

        // Find colleges where the students array includes the user ID
        const colleges = await College.find({
          students: user._id,
        });

        console.log("colleges", colleges);

        // Create user response without sending sensitive info
        const userResponse = {
          _id: user.id,
          email: user.email,
          name: user.name,
          colleges, // Include the colleges the user is part of
          token,
        };

        return res.cookie("token", token).status(200).json(userResponse);
      } else {
        // Passwords do not match
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

exports.logout = async (req, res, next) => {
  res.cookie("token", "");
  res.send("logged out");
};

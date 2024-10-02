const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

exports.isLoggedIn = async (req, res, next) => {
  if (!req.cookies || !req.cookies.token) {
    res.send("You Must be logged in");
  } else {
    const data = jwt.verify(req.cookies.token, JWT_SECRET);
    req.user = data;
    next();
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
    bcrypt.compare(password, user.password, function (err, isMatch) {
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

        // Create user response without sending sensitive info
        const userResponse = {
          email: user.email,
          name: user.name, // assuming user has a name
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

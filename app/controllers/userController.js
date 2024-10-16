const User = require("../models/userModel");
const College = require("../models/college");
const bcrypt = require("bcrypt");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    res.status(201).json({ message: "Fetched All Users", data: users });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUser = async (req, res, next) => {
  const { address, dateOfBirth, email, name, phoneNumber, college, subject } =
    req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        address,
        dateOfBirth,
        email,
        name,
        phoneNumber,
        $addToSet: {
          colleges: {
            subject: subject,
            college: college,
          },
        },
        ...(req?.file?.path && { image: req?.file?.path }),
      },
      { new: true, runValidators: true }
    )
      .populate({
        path: "colleges.college",
        model: "College",
      })
      .populate({
        path: "colleges.subject",
        model: "Subject",
      });
    console.log("updatedUser", updatedUser);

    const updatedCollege = await College.findByIdAndUpdate(
      college,
      {
        $addToSet: {
          students: {
            subject: subject,
            student: updatedUser._id,
          },
        },
      },
      { new: true, runValidators: true }
    );

    console.log("updatedCollege", updatedCollege);

    res.json({ data: updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateMe = async (req, res, next) => {
  const { name, address, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        address,
        password: hashedPassword,
      },
      { new: true, runValidators: true }
    );

    if (!this.updateUser) {
      return res.status(404).json({ error: "College not found" });
    }

    const userResponse = { ...updatedUser._doc };
    delete userResponse.password;

    res.json(userResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("Colleges");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("user", user);

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

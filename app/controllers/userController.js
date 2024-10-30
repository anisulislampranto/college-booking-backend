const User = require("../models/userModel");
const College = require("../models/college");
const bcrypt = require("bcrypt");

exports.getMe = async (req, res, next) => {
  try {
    // Assuming your authentication middleware sets req.user with the authenticated user
    const userId = req.user._id; // or however you access the user ID
    const user = await User.findById(userId)
      .select("-password")
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
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ data: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getUsers = async (req, res, next) => {
  const { collegeId } = req.query;

  try {
    let users;

    if (collegeId) {
      users = await User.find({
        colleges: { $elemMatch: { college: collegeId } },
      });
    } else {
      users = await User.find();
    }

    res.status(200).json({ message: "Fetched Users", data: users });
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
        name,
        email,
        address,
        dateOfBirth,
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

    res.json({ data: updatedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateMe = async (req, res, next) => {
  const { name, address, password, dateOfBirth, phoneNumber } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        address,
        phoneNumber,
        dateOfBirth,
        password: hashedPassword,
      },
      { new: true }
    ).populate({
      path: "colleges.college",
      model: "College",
      populate: [
        { path: "events", model: "Event" },
        { path: "researches", model: "Research" },
        { path: "sports", model: "Sport" },
      ],
    });

    if (!this.updateUser) {
      return res.status(404).json({ error: "College not found" });
    }

    const userResponse = { ...updatedUser._doc };

    delete userResponse.password;

    res.json({ data: userResponse });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// exports.getMe = async (req, res, next) => {
//   try {
//     const user = await User.findById(req.params.id).populate("Colleges");

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     console.log("user", user);

//     res.json({ data: user });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const User = require("../models/userModel");
const College = require("../models/college");

exports.updateUser = async (req, res, next) => {
  const { address, dateOfBirth, email, name, phoneNumber, college } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        address,
        dateOfBirth,
        email,
        name,
        phoneNumber,
        $addToSet: { colleges: college },
        ...(req?.file?.path && { image: req?.file?.path }),
      },
      { new: true, runValidators: true }
    ).populate("colleges");

    const updatedCollege = await College.findByIdAndUpdate(
      college,
      {
        $addToSet: { students: updatedUser._id },
      },
      { new: true, runValidators: true }
    );

    if (!this.updateUser) {
      return res.status(404).json({ error: "College not found" });
    }

    res.json(updatedUser);
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

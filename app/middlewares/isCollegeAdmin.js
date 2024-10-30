const College = require("../models/college");
const User = require("../models/userModel");

const isCollegeAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);

    // Check if user exists and has type 'collegeAdmin'
    if (!user || user.type !== "collegeAdmin") {
      return res.status(403).json({
        status: "fail",
        message: "Unauthorized: Admin access required",
      });
    }

    // Check if a college has this user as an admin
    const collegeAdmin = await College.findOne({ admin: user._id });

    if (!collegeAdmin) {
      return res.status(403).json({
        status: "fail",
        message: "Unauthorized: No college associated with this admin",
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Server error: Unable to verify admin status",
    });
  }
};

module.exports = isCollegeAdmin;

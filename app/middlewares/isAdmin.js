const User = require("../models/userModel");

const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user);

    if (!user || user.type !== "admin") {
      return res.status(403).json({
        status: "fail",
        message: "Unauthorized: Admin access required",
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

module.exports = isAdmin;

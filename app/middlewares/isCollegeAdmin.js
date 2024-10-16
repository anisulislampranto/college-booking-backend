const College = require("../models/college");

exports.isCollegeAdmin = async (req, res, next) => {
  const { user, college } = req.body;

  try {
    const collegeData = await College.findOne({ _id: college });

    if (collegeData.admin.equals(new ObjectId(user))) {
      next();
    } else {
      res.status(403).json({
        message: "Only College Admin can do this operation",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

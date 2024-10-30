const Research = require("../models/research");
const College = require("../models/college");
const { ObjectId } = require("mongodb");

exports.getResearches = async (req, res, next) => {
  try {
    const researches = await Research.find()
      .populate("participants")
      .populate("college");

    res.status(201).json({
      status: "success",
      researches,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// exports.getResearch = async (req, res, next) => {
//   console.log("req.params.id ", req.params.id);

//   try {
//     const research = Research.findOne({ _id: req.params.id });

//     console.log("research", research);

//     res.status(201).json({
//       status: "success",
//       research,
//     });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

exports.createResearch = async (req, res, next) => {
  const { user, name, description, college, participants } = req.body;

  try {
    const collegeData = await College.findOne({ _id: college });

    if (collegeData?.admin.equals(new ObjectId(user))) {
      const createdResearch = await Research.create({
        name,
        description,
        college,
        participants,
        ...(req?.file?.path && { image: req?.file?.path }),
      });

      const updatedCollegeWithEvent = await College.findByIdAndUpdate(
        college,
        {
          $addToSet: { researches: createdResearch._id },
        },
        { new: true }
      );

      console.log("updatedCollegeWithEvent", updatedCollegeWithEvent);

      res.status(201).json({
        message: "Research Created Successfully",
        data: createdResearch,
      });
    } else {
      res.status(403).json({
        message: "Only College Admin can do this operation",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteResearches = async (req, res, next) => {
  try {
    const result = await Research.deleteMany({});

    res.status(200).json({
      status: "success",
      message: `${result.deletedCount} Researches deleted successfully.`,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.deleteResearch = async (req, res, next) => {
  try {
    const result = await Research.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({
        status: "fail",
        message: "Research not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Research deleted successfully.",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

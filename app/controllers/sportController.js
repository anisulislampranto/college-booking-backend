const Sport = require("../models/sport");
const College = require("../models/college");
const { ObjectId } = require("mongodb");

exports.getSports = async (req, res, next) => {
  try {
    const sports = await Sport.find();
    res.status(201).json({
      status: "success",
      sports,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getSport = async (req, res, next) => {
  try {
    const sport = Sport.findOne({ _id: req.params.id });

    res.status(201).json({
      status: "success",
      sport,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createSport = async (req, res, next) => {
  const { user, name, description, college } = req.body;
  const { path } = req.file;

  if (!user) {
    res.status(403).json({ message: "You Are not allowed to create Event" });
  }

  try {
    const collegeData = await College.findOne({ _id: college });

    if (collegeData.admin.equals(new ObjectId(user))) {
      const createdSport = await Sport.create({
        name,
        description,
        college,
        image: path,
      });

      const updatedCollegeWithEvent = await College.findByIdAndUpdate(
        college,
        {
          $addToSet: { sports: createdSport._id },
        },
        { new: true }
      );

      console.log("updatedCollegeWithEvent", updatedCollegeWithEvent);

      res
        .status(201)
        .json({ message: "Sport Created Successfully", data: createdSport });
    } else {
      res.status(403).json({
        message: "Only College Admin can create event for the college",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateSport = async (req, res, next) => {
  const { name, description, colleges } = req.body;

  try {
    const updatedSport = await Sport.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        colleges,
        ...(req?.file?.path && { image: req?.file?.path }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedSport) {
      return res.status(404).json({ error: "Sport not found" });
    }

    res.json(updatedSport);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteSport = async (req, res, next) => {
  try {
    const result = await Sport.findByIdAndDelete(req.params.id);

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

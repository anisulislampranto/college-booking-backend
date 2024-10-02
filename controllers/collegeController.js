const College = require("../models/college");

exports.getAllColleges = async (req, res, next) => {
  const colleges = await College.find()
    .populate("events")
    .populate("researches");

  res.status(201).json({
    status: "success",
    colleges,
  });
};

exports.getCollege = async (req, res, next) => {
  try {
    const college = College.findOne({ _id: req.params.id })
      .populate("events")
      .populate("researches");

    res.json(college);
    res.json(createdCollege);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createCollege = async (req, res, next) => {
  const { name, admissionDate, events, researches, sports, rating } = req.body;
  const { path } = req.file;

  try {
    const createdCollege = await College.create({
      rating,
      sports,
      researches,
      events,
      admissionDate,
      name,
      image: path,
    });
    res.json(createdCollege);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCollege = async (req, res, next) => {
  const { name, admissionDate, events, researches, sports, rating } = req.body;

  try {
    const updatedCollege = await College.findByIdAndUpdate(
      req.params.id,
      {
        name,
        admissionDate,
        events,
        researches,
        sports,
        rating,
        ...(req?.file?.path && { image: req?.file?.path }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedCollege) {
      return res.status(404).json({ error: "College not found" });
    }

    res.json(updatedCollege);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

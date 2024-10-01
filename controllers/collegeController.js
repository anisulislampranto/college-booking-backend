const College = require("../models/college");

exports.getAllColleges = async (req, res, next) => {
  const colleges = await College.find();
  res.status(201).json({
    status: "success",
    colleges,
  });
};

exports.getCollege = async (req, res, next) => {
  try {
    const college = College.findOne({ _id: req.params.id });

    res.json(college);
    res.json(createdCollege);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createCollege = async (req, res, next) => {
  const { name } = req.body;
  const { path } = req.file;

  try {
    const createdCollege = await College.create({ name: name, image: path });

    res.json(createdCollege);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

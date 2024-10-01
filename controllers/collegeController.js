const College = require("../models/college");

exports.getAllColleges = async (req, res, next) => {
  const colleges = await College.find();
  res.status(201).json({
    status: "success",
    colleges,
  });
};

exports.createCollege = async (req, res, next) => {
  const { name } = req.body;

  console.log("req.file", req.file);

  try {
    const createdCollege = await College.create({ name: name });
    res.json(createdCollege);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

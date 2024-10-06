const Subject = require("../models/subject");

exports.getSubjects = async (req, res, next) => {
  try {
    const createdSubject = await Subject.find();

    res.json({ data: createdSubject });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createSubject = async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const createdSubject = await Subject.create({ name, description });

    res.status(201).json({ message: "Subject Created", data: createdSubject });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

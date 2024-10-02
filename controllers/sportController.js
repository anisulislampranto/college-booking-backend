const Sport = require("../models/sport");

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
  const { name, description } = req.body;
  const { path } = req.file;

  try {
    const createdEvent = await Sport.create({
      name,
      description,
      image: path,
    });

    res.json(createdEvent);
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

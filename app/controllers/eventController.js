const Event = require("../models/event");

exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find();
    res.status(201).json({
      status: "success",
      events,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const event = Event.findOne({ _id: req.params.id });

    res.status(201).json({
      status: "success",
      event,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createEvent = async (req, res, next) => {
  const { name, date, description, college } = req.body;
  const { path } = req.file;

  try {
    const createdEvent = await Event.create({
      name,
      date,
      description,
      college,
      image: path,
    });

    res.json(createdEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

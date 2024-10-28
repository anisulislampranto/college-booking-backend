const Event = require("../models/event");
const College = require("../models/college");
const { ObjectId } = require("mongodb");

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
  const { user, name, date, description, college } = req.body;
  const { path } = req.file;

  if (!user) {
    res.status(403).json({ message: "You Are not allowed to create Event" });
  }

  try {
    const collegeData = await College.findOne({ _id: college });

    if (collegeData.admin.equals(new ObjectId(user))) {
      const createdEvent = await Event.create({
        name,
        date,
        description,
        college,
        image: path,
      });

      const updatedCollegeWithEvent = await College.findByIdAndUpdate(
        college,
        {
          $addToSet: { events: createdEvent._id },
        },
        { new: true }
      );

      console.log("updatedCollegeWithEvent", updatedCollegeWithEvent);

      res
        .status(201)
        .json({ message: "Event Created Successfully", data: createdEvent });
    } else {
      res.status(403).json({
        message: "Only College Admin can create event for the college",
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteEvents = async (req, res, next) => {
  try {
    const result = await Event.deleteMany({});

    res.status(200).json({
      status: "success",
      message: `${result.deletedCount} Events deleted successfully.`,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

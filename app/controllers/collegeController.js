const College = require("../models/college");

exports.getAllColleges = async (req, res, next) => {
  try {
    const { limit, search } = req.query;

    // Build the query object
    let query = {};

    // If search query exists, perform a case-insensitive search on the 'name' field
    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // Perform the database query with optional search and populate related fields
    const colleges = await College.find(query)
      .populate("events")
      .populate("researches")
      .populate("sports")
      .limit(limit ? parseInt(limit) : null); // Limit the number of results if 'limit' is provided

    res.status(200).json({
      status: "success",
      colleges,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getCollege = async (req, res, next) => {
  try {
    // Await the result of the query
    const college = await College.findOne({
      _id: req.params.id,
    })
      .populate("events")
      .populate("researches")
      .populate("sports");

    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }

    res.json(college);
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
  const { name, admissionDate, events, researches, sports, rating, students } =
    req.body;

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
        students,
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

const College = require("../models/college");
const User = require("../models/userModel");

exports.createCollege = async (req, res, next) => {
  const { name, admissionDate, admin } = req.body;

  console.log("admin", admin);

  try {
    const today = new Date();
    const selectedDate = new Date(admissionDate);
    if (selectedDate < today.setHours(0, 0, 0, 0)) {
      throw Error("Admission date cannot be in the past");
    }

    const adminWithColleges = await User.findOne({ _id: admin }).populate(
      "colleges"
    );

    console.log("adminWithColleges", adminWithColleges);

    const createdCollege = await College.create({
      name,
      admissionDate,
      admin,
      ...(req?.file?.path && { image: req?.file?.path }),
    });

    const updatedUser = await User.findByIdAndUpdate(
      admin,
      {
        $addToSet: {
          colleges: {
            college: createdCollege._id,
          },
        },
      },
      { new: true }
    );

    console.log("updatedUser", updatedUser);

    res
      .status(201)
      .json({ message: "College Created Successfully", data: createdCollege });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllColleges = async (req, res, next) => {
  try {
    const { limit, page, search, status } = req.query;

    // Build the query object
    let query = {};

    // If search query exists, perform a case-insensitive search on the 'name' field
    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    if (status) {
      query.status = status;
    }

    const limitValue = limit ? parseInt(limit) : 10;
    const pageValue = page ? parseInt(page) : 1;
    const skip = (pageValue - 1) * limitValue;

    const colleges = await College.find(query)
      .populate("events")
      .populate("researches")
      .populate("sports")
      .populate("students")
      .sort({ admissionDate: 1 })
      .skip(skip)
      .limit(limitValue);

    const totalColleges = await College.countDocuments(query);

    res.status(200).json({
      status: "success",
      colleges,
      totalColleges,
      totalPages: Math.ceil(totalColleges / limitValue),
      currentPage: pageValue,
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
      .populate("sports")
      .populate({
        path: "students.student",
        model: "User",
      })
      .populate({
        path: "students.subject",
        model: "Subject",
      });

    if (!college) {
      return res.status(404).json({ error: "College not found" });
    }

    res.json(college);
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

exports.deleteColleges = async (req, res, next) => {
  try {
    const result = await College.deleteMany({});

    res.status(200).json({
      status: "success",
      message: `${result.deletedCount} colleges deleted successfully.`,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.deleteCollege = async (req, res, next) => {
  console.log("req.params", req.params);

  try {
    const { id } = req.params;
    const result = await College.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({
        status: "fail",
        message: "College not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "College deleted successfully.",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.approveCollege = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await College.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({
        status: "fail",
        message: "College not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "College approved successfully.",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

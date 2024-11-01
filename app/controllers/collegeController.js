const College = require("../models/college");
const User = require("../models/userModel");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCollege = async (req, res, next) => {
  const { name, admissionDate, admin } = req.body;

  try {
    const today = new Date();
    const selectedDate = new Date(admissionDate);
    if (selectedDate < today.setHours(0, 0, 0, 0)) {
      throw Error("Admission date cannot be in the past");
    }

    const adminWithColleges = await User.findOne({ _id: admin }).populate(
      "colleges"
    );

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
    let query = {
      isDeleted: false,
    };

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

exports.deleteCollege = async (req, res) => {
  try {
    const { id } = req.params;

    const college = await College.findById(id);
    if (!college) {
      return res.status(404).json({
        status: "fail",
        message: "College not found.",
      });
    }

    // Move college to recycle bin
    college.isDeleted = true;
    college.deletedAt = new Date();
    college.status = "deleted";
    await college.save();

    res.status(200).json({
      status: "success",
      message: "College moved to recycle bin.",
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

exports.deletedColleges = async (req, res, next) => {
  try {
    const deletedColleges = await College.find({ isDeleted: true });

    res.status(200).json({
      status: "success",
      data: deletedColleges,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.restoreCollege = async (req, res, next) => {
  try {
    const { id } = req.params;

    const college = await College.findById(id);
    if (!college || !college.isDeleted) {
      return res.status(404).json({
        status: "fail",
        message: "College not found or is not in the recycle bin.",
      });
    }

    college.isDeleted = false;
    college.deletedAt = null;
    college.status = "pending";
    await college.save();

    res.status(200).json({
      status: "success",
      message: "College restored successfully.",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.myColleges = async (req, res, next) => {
  // const { collegeIds } = req.body;
  console.log("req.body", req.body);

  try {
    // const colleges = await College.find({ _id: { $in: collegeIds } })
    //   .populate("events")
    //   .populate("researches")
    //   .populate("sports")
    //   .populate({
    //     path: "students.student",
    //     model: "User",
    //   })
    //   .populate({
    //     path: "students.subject",
    //     model: "Subject",
    //   });
    // console.log("colleges", colleges);
    // res.status(200).json({ data: colleges });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getCollegeStudents = async (req, res, next) => {
  const { collegeId, status } = req.query;

  try {
    // Find the college and populate the students field
    const college = await College.findById(collegeId)
      .populate({
        path: "students.student",
        model: "User",
      })
      .populate({
        path: "students.subject",
        model: "Subject",
      });

    // console.log("college", college);

    if (!college) {
      return res.status(404).json({ message: "College not found" });
    }

    // Filter students by status if provided
    const students = college.students.filter((studentObj) => {
      return status ? studentObj.status === status : true;
    });

    res.status(200).json({ message: "Fetched Students", data: students });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.approveStudent = async (req, res, next) => {
  const { studentId } = req.params;
  const { collegeId } = req.body;

  try {
    const college = await College.findOneAndUpdate(
      {
        _id: collegeId,
        "students.student": studentId,
        "students.status": "admissionPending",
      },
      {
        $set: { "students.$.status": "approved" },
      },
      { new: true }
    );

    console.log("collegeeeee", college);

    if (!college) {
      return res.status(404).json({
        message:
          "Student not found or already approved in the specified college.",
      });
    }

    res.status(200).json({ message: "Student approved successfully", college });
  } catch (error) {
    console.error("Error approving student:", error);
    res.status(500).json({ message: "Error approving student" });
  }
};

exports.admissionFeePayment = async (req, res, next) => {
  console.log("stripe", process.env.STRIPE_SECRET_KEY);

  try {
    const { amount, collegeId, studentId } = req.body;
    console.log("req.body", req.body);

    if (!amount || !collegeId || !studentId) {
      throw new Error("Required fields are missing in the request body.");
    }

    // Confirm that STRIPE_SECRET_KEY is set
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key is not defined.");
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "College Booking Fee" },
            unit_amount: amount * 100, // Convert amount to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
    });

    console.log("session", session);

    const transactionId = session.id; // Use session ID as the transaction ID
    const updatedCollege = await College.updateOne(
      { _id: collegeId, "students.student": studentId },
      {
        $set: {
          "students.$.paymentStatus.status": "paid",
          "students.$.paymentStatus.transactionId": transactionId,
        },
      },
      { new: true }
    );

    console.log("updatedCollege", updatedCollege);

    res.status(200).json({ message: "Payment Success", data: session });
  } catch (error) {
    console.error("Error in admissionFeePayment:", error.message);
    // Send the error message to the client
    res.status(500).json({
      error: "Failed to process payment",
      message: error.message, // Include detailed error for debugging
    });
  }
};

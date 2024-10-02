const Review = require("../models/review");

exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find().populate([
      { path: "College", strictPopulate: false },
    ]);
    res.status(201).json({
      status: "success",
      reviews,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createReview = async (req, res, next) => {
  const { collegeId, userId, reviewText, rating } = req.body;

  try {
    const reviews = await Review.create({
      collegeId,
      userId,
      reviewText,
      rating,
    });

    console.log("reviews", reviews);

    res.status(201).json({
      status: "success",
      reviews,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

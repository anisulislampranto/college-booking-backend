const Review = require("../models/review");
const College = require("../models/college");

exports.getReviews = async (req, res, next) => {
  try {
    // Fetch reviews and populate college and user fields
    const reviews = await Review.find()
      .populate("collegeId", "name image") // Fetch only relevant fields from the college model
      .populate("userId", "name email"); // Fetch only relevant fields from the user model

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
    // Step 1: Create the review
    const newReview = await Review.create({
      collegeId,
      userId,
      reviewText,
      rating,
    });

    // Step 2: Populate the newly created review (fetch it back from DB and populate)
    const populatedReview = await Review.findById(newReview._id)
      .populate("collegeId", "name image")
      .populate("userId", "name email");

    // Step 3: Find the college by id and update the reviews array with the review id
    await College.findByIdAndUpdate(
      collegeId,
      { $push: { reviews: newReview._id } }, // Add review ID to the reviews array in College
      { new: true, useFindAndModify: false }
    );

    // Step 4: Send the response with the populated review
    res.status(201).json({
      status: "success",
      review: populatedReview, // Return the review with populated fields
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const express = require("express");
const {
  getReviews,
  createReview,
  deleteReviews,
} = require("../controllers/reviewController");

const router = express.Router();

router.get("/", getReviews);
router.post("/create", createReview);
router.get("/delete", deleteReviews);

module.exports = router;

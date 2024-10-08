const express = require("express");
const { getReviews, createReview } = require("../controllers/reviewController");

const router = express.Router();

router.get("/", getReviews);
router.post("/create", createReview);

module.exports = router;

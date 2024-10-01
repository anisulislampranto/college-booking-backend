const express = require("express");
const {
  getAllColleges,
  createCollege,
} = require("../controllers/collegeController");

const router = express.Router();

router.get("/", getAllColleges);
router.post("/create", createCollege);

module.exports = router;

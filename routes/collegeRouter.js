const express = require("express");
const {
  getAllColleges,
  createCollege,
} = require("../controllers/collegeController");
const upload = require("../config/multerConfig");

const router = express.Router();

router.get("/", getAllColleges);
router.post("/create", upload.single("image"), createCollege);

module.exports = router;

const express = require("express");
const {
  getAllColleges,
  createCollege,
  getCollege,
} = require("../controllers/collegeController");
const upload = require("../config/multerConfig");

const router = express.Router();

router.get("/", getAllColleges);
router.get("/:id", getCollege);
router.post("/create", upload.single("image"), createCollege);

module.exports = router;

const express = require("express");
const {
  getAllColleges,
  createCollege,
  getCollege,
  // updateCollege,
} = require("../controllers/collegeController");
const upload = require("../config/multerconfig");

const router = express.Router();

router.get("/", getAllColleges);
router.get("/:id", getCollege);
router.post("/create", upload.single("image"), createCollege);
// router.patch("/update/:id", upload.single("image"), updateCollege);

module.exports = router;

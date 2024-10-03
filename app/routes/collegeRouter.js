const express = require("express");
const {
  getAllColleges,
  createCollege,
  getCollege,
  updateCollege,
} = require("../controllers/collegeController");
const { isLoggedIn } = require("../controllers/authController");
const upload = require("../config/multerConfig");

const router = express.Router();

router.get("/", getAllColleges);
router.get("/:id", getCollege);
router.post("/create", isLoggedIn, upload.single("image"), createCollege);
router.patch("/update/:id", upload.single("image"), updateCollege);

module.exports = router;
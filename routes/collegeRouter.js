const express = require("express");
const {
  getAllColleges,
  createCollege,
  getCollege,
  updateCollege,
} = require("../controllers/collegeController");
const upload = require("../config/multerConfig");
const { isLoggedIn } = require("../controllers/authController");

const router = express.Router();

router.get("/", getAllColleges);
router.get("/:id", isLoggedIn, getCollege);
router.post("/create", isLoggedIn, upload.single("image"), createCollege);
router.patch("/update/:id", upload.single("image"), updateCollege);

module.exports = router;

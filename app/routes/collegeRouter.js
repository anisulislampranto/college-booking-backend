const express = require("express");
const {
  getAllColleges,
  createCollege,
  getCollege,
  deleteColleges,
  // updateCollege,
} = require("../controllers/collegeController");
const upload = require("../config/multerconfig");
const { isLoggedIn } = require("../middlewares/isLoggedIn");

const router = express.Router();

router.get("/", getAllColleges);
router.get("/delete", deleteColleges);
router.get("/:id", getCollege);
router.post("/create", isLoggedIn, upload.single("image"), createCollege);
// router.patch("/update/:id", upload.single("image"), updateCollege);

module.exports = router;

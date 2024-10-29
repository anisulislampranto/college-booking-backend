const express = require("express");
const {
  getAllColleges,
  createCollege,
  getCollege,
  deleteColleges,
  deleteCollege,
  // updateCollege,
} = require("../controllers/collegeController");
const upload = require("../config/multerconfig");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router.get("/", getAllColleges);
router.get("/delete", deleteColleges);
router.delete("/delete/:id", isLoggedIn, isAdmin, deleteCollege);
router.get("/:id", getCollege);
router.post("/create", isLoggedIn, upload.single("image"), createCollege);
// router.patch("/update/:id", upload.single("image"), updateCollege);

module.exports = router;

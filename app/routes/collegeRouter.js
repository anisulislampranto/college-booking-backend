const express = require("express");
const {
  getAllColleges,
  createCollege,
  getCollege,
  deleteColleges,
  deleteCollege,
  approveCollege,
  deletedColleges,
  restoreCollege,
  myColleges,
  getCollegeStudents,
  approveStudent,
  // updateCollege,
} = require("../controllers/collegeController");
const upload = require("../config/multerconfig");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const isAdmin = require("../middlewares/isAdmin");

const router = express.Router();

router.get("/", getAllColleges);
router.get("/students", getCollegeStudents);
router.patch("/approve/:studentId", approveStudent);
router.patch("/my-college", isLoggedIn, myColleges);
// router.get("/delete", deleteColleges);
router.delete("/delete/:id", isLoggedIn, isAdmin, deleteCollege);
router.get("/recycle-bin", isLoggedIn, deletedColleges);
router.post("/restore/:id", isLoggedIn, isAdmin, restoreCollege);
router.patch("/approve/:id", isLoggedIn, isAdmin, approveCollege);
router.get("/:id", getCollege);
router.post("/create", isLoggedIn, upload.single("image"), createCollege);
// router.patch("/update/:id", upload.single("image"), updateCollege);

module.exports = router;

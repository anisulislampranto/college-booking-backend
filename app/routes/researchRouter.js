const express = require("express");
const {
  getResearches,
  createResearch,
  deleteResearches,
  deleteResearch,
} = require("../controllers/researchController");
const upload = require("../config/multerconfig");
const { isLoggedIn } = require("../middlewares/isLoggedIn");

const router = express.Router();

router.get("/", getResearches);
// router.get("/delete", deleteResearches);
router.delete("/delete/:id", deleteResearch);
// router.post("/:id", getResearch);
router.post("/create", isLoggedIn, upload.single("image"), createResearch);

module.exports = router;

const express = require("express");
const {
  getResearches,
  createResearch,
} = require("../controllers/researchController");
const upload = require("../config/multerconfig");

const router = express.Router();

router.get("/", getResearches);
// router.post("/:id", getResearch);
router.post("/create", upload.single("image"), createResearch);

module.exports = router;

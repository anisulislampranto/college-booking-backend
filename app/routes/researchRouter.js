const express = require("express");
const {
  getResearches,
  getResearch,
  createResearch,
} = require("../controllers/researchController");
const upload = require("../config/multerConfig");

const router = express.Router();

router.get("/", getResearches);
router.get("/:id", getResearch);
router.post("/create", upload.single("image"), createResearch);

module.exports = router;

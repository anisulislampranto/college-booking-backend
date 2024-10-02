const express = require("express");
const {
  getEvent,
  createEvent,
  getEvents,
} = require("../controllers/eventController");
const upload = require("../config/multerConfig");
const {
  getResearches,
  getResearch,
  createResearch,
} = require("../controllers/researchController");

const router = express.Router();

router.get("/", getResearches);
router.get("/:id", getResearch);
router.post("/create", upload.single("image"), createResearch);

module.exports = router;

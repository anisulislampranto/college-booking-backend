const express = require("express");
const {
  getEvent,
  createEvent,
  getEvents,
} = require("../controllers/eventController");
const upload = require("../config/multerconfig");

const router = express.Router();

router.get("/", getEvents);
router.get("/:id", getEvent);
router.post("/create", upload.single("image"), createEvent);

module.exports = router;

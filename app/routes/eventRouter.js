const express = require("express");
const {
  getEvent,
  createEvent,
  getEvents,
  deleteEvents,
  deleteEvent,
} = require("../controllers/eventController");
const upload = require("../config/multerconfig");

const router = express.Router();

router.get("/", getEvents);
router.get("/delete", deleteEvents);
router.get("/delete/:id", deleteEvent);
router.get("/:id", getEvent);
router.post("/create", upload.single("image"), createEvent);

module.exports = router;

const express = require("express");
const {
  getEvent,
  // createEvent,
  getEvents,
} = require("../controllers/eventController");
// const upload = require("../config/multerConfig");

const router = express.Router();

router.get("/", getEvents);
router.get("/:id", getEvent);
// router.post("/create", upload.single("image"), createEvent);

module.exports = router;

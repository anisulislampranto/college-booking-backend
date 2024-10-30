const express = require("express");
const {
  getEvent,
  createEvent,
  getEvents,
  deleteEvents,
  deleteEvent,
} = require("../controllers/eventController");
const upload = require("../config/multerconfig");
const { isLoggedIn } = require("../middlewares/isLoggedIn");
const isCollegeAdmin = require("../middlewares/isCollegeAdmin");

const router = express.Router();

router.get("/", getEvents);
router.get("/delete", deleteEvents);
router.delete("/delete/:id", isLoggedIn, isCollegeAdmin, deleteEvent);
router.get("/:id", getEvent);
router.post("/create", upload.single("image"), createEvent);

module.exports = router;

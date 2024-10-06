const express = require("express");
const {
  createSubject,
  getSubjects,
} = require("../controllers/subjectController");

const router = express.Router();

router.get("/", getSubjects);
router.post("/create", createSubject);

module.exports = router;

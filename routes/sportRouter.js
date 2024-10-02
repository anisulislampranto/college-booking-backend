const express = require("express");
const upload = require("../config/multerConfig");
const {
  getSports,
  getSport,
  createSport,
  updateSport,
} = require("../controllers/sportController");

const router = express.Router();

router.get("/", getSports);
router.get("/:id", getSport);
router.post("/create", upload.single("image"), createSport);
router.patch("/update/:id", upload.single("image"), updateSport);

module.exports = router;

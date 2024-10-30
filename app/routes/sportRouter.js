const express = require("express");
const {
  getSports,
  getSport,
  createSport,
  deleteSport,
  // updateSport,
} = require("../controllers/sportController");
const upload = require("../config/multerconfig");

const router = express.Router();

router.get("/", getSports);
router.get("/:id", getSport);
router.post("/create", upload.single("image"), createSport);
router.delete("/delete/:id", upload.single("image"), deleteSport);
// router.patch("/update/:id", upload.single("image"), updateSport);

module.exports = router;

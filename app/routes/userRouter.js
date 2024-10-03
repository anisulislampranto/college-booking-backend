const express = require("express");
// const upload = require("../config/multerConfig");
const {
  getMe,
  updateMe,
  updateUser,
} = require("../controllers/userController");

const router = express.Router();

// router.get("/:id", getUser);
router.post("/me/:id", getMe);
router.patch("/update/:id", updateUser);
router.patch("/update/me/:id", updateMe);
// router.get("/login", signup);
// router.get("/logout", signup);
// router.get("/reset-password", signup);

module.exports = router;

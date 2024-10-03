const express = require("express");
const {
  updateUser,
  getMe,
  updateMe,
} = require("../controllers/userController");
const upload = require("../config/multerConfig");

const router = express.Router();

// router.get("/:id", getUser);
router.post("/me/:id", getMe);
router.patch("/update/:id", upload.single("image"), updateUser);
router.patch("/update/me/:id", upload.single("image"), updateMe);
// router.get("/login", signup);
// router.get("/logout", signup);
// router.get("/reset-password", signup);

module.exports = router;

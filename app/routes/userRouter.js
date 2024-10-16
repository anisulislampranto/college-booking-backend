const express = require("express");
// const upload = require("../config/multerConfig");
const {
  getMe,
  updateMe,
  updateUser,
  getUsers,
} = require("../controllers/userController");
const { isLoggedIn } = require("../middlewares/isLoggedIn");

const router = express.Router();

router.get("/", isLoggedIn, getUsers);
router.post("/me/:id", getMe);
router.patch("/update/:id", updateUser);
router.patch("/update/me/:id", updateMe);
// router.get("/login", signup);
// router.get("/logout", signup);
// router.get("/reset-password", signup);

module.exports = router;

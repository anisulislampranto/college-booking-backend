const express = require("express");
const {
  login,
  logout,
  signup,
  googleAuth,
} = require("../controllers/authController");

const router = express.Router();

router.get("/google", googleAuth);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;

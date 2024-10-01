const express = require("express");
const { userSignup, logout } = require("../controllers/userController");

const router = express.Router();

router.post("/signup", userSignup);
router.post("/logout", logout);
// router.get("/:id", getUser);
// router.get("/login", signup);
// router.get("/logout", signup);
// router.get("/reset-password", signup);

module.exports = router;

const express = require("express");
const { userSignup } = require("../controllers/userController");

const router = express.Router();

router.post("/signup", userSignup);
// router.get("/:id", getUser);
// router.get("/login", signup);
// router.get("/logout", signup);
// router.get("/reset-password", signup);

module.exports = router;

const express = require("express");

const router = express.Router();

router.get("/:id", getUser);
// router.get("/login", signup);
// router.get("/logout", signup);
// router.get("/reset-password", signup);

module.exports = router;

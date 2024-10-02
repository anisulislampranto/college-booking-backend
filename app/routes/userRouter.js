const express = require("express");
const { updateUser, getMe } = require("../controllers/userController");
const upload = require("../config/multerConfig");

const router = express.Router();

// router.get("/:id", getUser);
router.post("/me/:id", getMe);
router.patch("/update/:id", upload.single("image"), updateUser);
// router.get("/login", signup);
// router.get("/logout", signup);
// router.get("/reset-password", signup);

module.exports = router;

// const upload = require("../config/multerConfig");
const { uploadImage, getImages } = require("../controllers/galleryController");
const express = require("express");

const router = express.Router();

router.get("/", getImages);
// router.post("/create", upload.single("image"), uploadImage);

module.exports = router;

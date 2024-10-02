const Gallery = require("../models/gallery");

exports.uploadImage = async (req, res, next) => {
  const { college } = req.body;
  const { path } = req.file;

  try {
    const uploadedImage = await Gallery.create({
      college,
      image: path,
    });
    res.json(uploadedImage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getImages = async (req, res, next) => {
  try {
    const uploadedImage = await Gallery.find().populate("college");
    res.json(uploadedImage);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

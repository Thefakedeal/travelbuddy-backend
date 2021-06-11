const router = require("express").Router();
const upload = require("../helpers/multer");
const { userAuthHandler } = require("../middlewares");
const Image = require("../model/Image");
const path = require("path");
const { unlink } = require("fs");
const Place = require("../model/Place");
const { body, param, check, validationResult } = require("express-validator");
const mongoose = require('mongoose')

const isValidObjectId = param("id").custom((value) => {
  const isValid = mongoose.Types.ObjectId.isValid(value);
  if (!isValid) throw new Error("Invalid ID");
  return isValid;
});
 
const placeExists = body("placeID").custom((value) => {
  const isValid = mongoose.Types.ObjectId.isValid(value);
  if (!isValid) throw new Error("Invalid ID");
  return Place.findById(value).then((place) => {
    if (!place) {
      return Promise.reject("Place Doesnt Exist");
    }
    return true;
  });
});

const photoUpload = upload.array("images", 5);

const filesRequired = check("images")
  .custom((value, { req }) => {
    if (req.files.length > 0) return true;

    return false;
  })
  .withMessage("Images are required");

router.post(
  "/",
  userAuthHandler,
  photoUpload,
  placeExists,
  filesRequired,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const uploadedImages = req.files;

      const images = uploadedImages.map((img) => {
        return {
          user: req.user.id,
          image: `/images/${img.filename}`,
          place: req.body.placeID,
        };
      });
      Image.insertMany(images);
      res.json({ message: "images Saved" });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/:id",
  isValidObjectId,
  userAuthHandler,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const image = await Image.findByIdAndDelete(req.params.id);
      if (!image) return res.sendStatus(404);
      if (image.user.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "You aren't allowed to do that." });
      }
      unlink(path.join("static", image.image), (err) => {
        if (err) return next(err);
        return res.json({ message: "File Deleted" });
      });
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/:id/flag",
  isValidObjectId,
  userAuthHandler,
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const image = await Image.findById(req.params.id);
      if (!image) return res.sendStatus(404);
      image.flagged = true;
      await image.save();
      return res.json({ message: "Image was Flagged" });
    } catch (err) {
      next(err);
    }
  }
);
module.exports = router;

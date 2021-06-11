const express = require("express");

const router = express.Router();
const Review = require("../model/Review");
const { userAuthHandler } = require("../middlewares");
const { remove } = require("../helpers/objects");
const Place = require("../model/Place");
const { body, param, validationResult } = require("express-validator");
const mongoose = require("mongoose");

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

router.post("/", userAuthHandler, placeExists, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const review = await Review.findOneAndUpdate(
      { place: req.body.placeID, user: req.user._id },
      {
        comment: req.body.comment,
        stars: Math.floor(req.body.stars),
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );
    res.json(remove(review.toJSON(), ["flagged"]));
  } catch (err) {
    next(err);
  }
});

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

      const review = await Review.findById(req.params.id);
      if (!review) return res.sendStatus(404);

      if (review.user.toString() == req.user.id) {
        await review.delete();
        return res.status(203).json({ message: "Review Deleted" });
      }
      return res.status(403).json({ message: "Not Allowed" });
    } catch (err) {
      next(err);
    }
  }
);

router.post("/:id/flag", isValidObjectId, userAuthHandler, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const review = await Review.findById(req.params.id);
    if (!review) return res.sendStatus(404);

    review.flagged = true;
    review.save();
    res.json({ message: "Review Flagged" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

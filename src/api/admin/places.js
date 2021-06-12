const router = require("express").Router();
const Place = require("../../model/Place");
const Review = require('../../model/Review');
const ImageModel = require('../../model/Image');


const { param, validationResult } = require("express-validator");
const mongoose = require('mongoose')

const isValidObjectId = param("id").custom((value) => {
  const isValid = mongoose.Types.ObjectId.isValid(value);
  if (!isValid) throw new Error("Invalid ID");
  return isValid;
});

router.get("/", async (req, res, next) => {
  try {
    const query = Place.find({});
    if(req.query.name){
      query.where('name').regex(req.query.name)
    }
    const places = await query.exec();
    res.json(places);
  } catch (err) {
    next(err);
  }
});

router.get("/flagged", async (req, res, next) => {
  try {
    const query = Place.find({ flagged: true });
    if(req.query.name){
      query.where('name').regex(req.query.name)
    }
    const places = await query.exec();
    res.json(places);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", isValidObjectId, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const place = await Place.findById(req.params.id).populate(
      "user",
      "-password"
    );
    if (!place) res.sendStatus(404);
    res.json(place);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.delete("/:id", isValidObjectId, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const place = await Place.findById(req.params.id);
    if (!place) res.sendStatus(404);
    await place.delete();
    res.json(place);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/reviews", isValidObjectId, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const reviews = await Review.find({
      place: req.params.id,
    }).populate("user", "-password");
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/images", isValidObjectId, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const images = await ImageModel.find({
      place: req.params.id,
    }).populate("user", "-password");
    res.json(images);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

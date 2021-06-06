const router = require("express").Router();
const Place = require("../../model/Place");
const Review = require('../../model/Review');
const ImageModel = require('../../model/Image');

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

router.get("/:id", async (req, res) => {
  try {
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

router.delete("/:id", async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) res.sendStatus(404);
    await place.delete();
    res.json(place);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/reviews", async (req, res, next) => {
  try {
    const reviews = await Review.find({
      place: req.params.id,
    }).populate("user", "-password");
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/images", async (req, res, next) => {
  try {
    const images = await ImageModel.find({
      place: req.params.id,
    }).populate("user", "-password");
    res.json(images);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

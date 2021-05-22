const router = require('express').Router();
const Place = require('../model/Place');
const upload = require('../helpers/multer');
const { userAuthHandler } = require('../middlewares');

router.get('/', async (req, res) => {
  try {
    const places = await Place.find({
      lat: {
        $gte: req.query.minLat,
        $lte: req.query.minLat,
      },
      lon: {
        $gte: req.query.minLon,
        $lte: req.query.minLon,
      },
    });
    res.json(places);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    res.json(place);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.get('/:id/nearby', async (req, res, next) => {
  try {
    const place = await Place.findById(req.params.id);
    const minLat = place.lat - 0.1;
    const maxLat = parseFloat(place.lat) + 0.1;
    const minLon = place.lon - 0.1;
    const maxLon = parseFloat(place.lon) + 0.1;
    const places = await Place.find({
      lat: {
        $gte: minLat,
        $lte: maxLat,
      },
      lon: {
        $gte: minLon,
        $lte: maxLon,
      },
    });
    res.json(places);
  } catch (err) {
    next(err);
  }
});

const featuredUpload = upload.single('featured_image');

router.post('/', userAuthHandler, featuredUpload, async (req, res) => {
  try {
    const featuredImage = req.file;
    const place = new Place();
    place.name = req.body.name;
    place.lat = req.body.lat;
    place.lon = req.body.lon;
    place.description = req.body.description;
    if (featuredImage) {
      place.featured_image = `/images/${featuredImage.filename}`;
    }
    place.user = req.user._id;
    const placeDoc = await place.save();
    res.json(placeDoc);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put('/:id', userAuthHandler, featuredUpload, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    // Allow Update only of place belongs to user
    if (place.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You aren't allowed to do that." });
    }

    const featured_image = req.file;
    if (featured_image) {
      req.body.featured_image = `/images/${featured_image.filename}`;
    }

    await Place.updateOne({ _id: req.params.id }, { $set: { ...req.body } });

    res.json(place);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.delete('/:id', userAuthHandler, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (place.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You aren't allowed to do that." });
    }

    await place.delete();
    res.json(place);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;

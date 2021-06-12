const router = require("express").Router();
const Place = require("../model/Place");
const Review = require("../model/Review");
const ImageModel = require("../model/Image");
const upload = require("../helpers/multer");
const { userAuthHandler } = require("../middlewares");
const { slice, remove } = require("../helpers/objects");
const {query, param, check, validationResult} = require('express-validator');
const mongoose = require('mongoose')

const isValidObjectId = param('id').custom((value)=>{
  const isValid = mongoose.Types.ObjectId.isValid(value);
  if(!isValid) throw new Error("Invalid ID");
  return isValid;
})

const validLat = query('lat').isFloat({min:-90,max:90});
const validLon = query('lon').isFloat({min:-180,max:180})

router.get("/", validLat,validLon,
async (req, res,next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const placeQuery = Place.find(
      {
        location: {
          $geoWithin: { $centerSphere: [ [ req.query.lon, req.query.lat ], (10/6378) ] }
          }
      },
      { flagged: 0 }
    );
    if(req.query.name){
      placeQuery.where('name',{$regex: req.query.name, $options: 'i'})
    }
    const places = await placeQuery.exec();
    res.json(places);
  } catch (err) {
    next(err)
  }
});

router.get("/user", userAuthHandler, async (req, res, next) => {
  try {
    const places = await Place.find({
      user: req.user.id,
    });
    res.json(places);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", 
isValidObjectId,
async (req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) res.status(400).json({errors: errors.array()});
    const place = await Place.findById(req.params.id, { flagged: 0 });
    if (!place) res.sendStatus(404);
    res.json(place);
  } catch (err) {
    res.status(404).send(err);
  }
});

router.get("/:id/nearby", 
isValidObjectId
,async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) res.status(400).json({errors: errors.array()});
    const place = await Place.findById(req.params.id, { flagged: 0 });
    if (!place) res.sendStatus(404);
    
    const places = await Place.find({
      location: {
        $near: {
          type: "Point",
          coordinates: place.location.coordinates
        },
        $maxDistance: 10000,
        $minDistance: 0
      },
      _id: {
        $ne: place._id
      }
    });
    res.json(places);
  } catch (err) {
    next(err);
  }
});

const featuredUpload = upload.single("featured_image");
const fileRequired = check('featured_upload').custom((value,{req})=>{
  if(req.file) return true
  
  return false;
}).withMessage("This is a required field. And must be an image.")
router.post("/", validLat, validLon, 
  userAuthHandler, featuredUpload, fileRequired,
  async (req, res,next) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) res.status(400).json({errors: errors.array()});

    const featuredImage = req.file;
    const place = new Place();
    place.name = req.body.name;
    place.location = {
      type: "Point",
      coordinates: [req.body.lon, req.body.lat]
    }
    // place.lat = req.body.lat;
    // place.lon = req.body.lon;
    place.description = req.body.description;
    if (featuredImage) {
      place.featured_image = `/images/${featuredImage.filename}`;
    }
    place.user = req.user._id;
    const placeDoc = await place.save();
    res.json(remove(placeDoc.toJSON(), ["flagged"]));
  } catch (err) {
    next(err)
  }
});

router.put("/:id", isValidObjectId, validLat.optional(), validLon.optional(),
 userAuthHandler, featuredUpload, async (req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) res.status(400).json({errors: errors.array()});

    const place = await Place.findById(req.params.id, { flagged: 0 });
    if (!place) res.sendStatus(404);
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

    if(req.body.lat && req.body.lon){
      req.body.location = {
        type: "Point",
        coordinates: [req.body.lon,req.body.lat]
      }
    }
    const payload = slice(req.body, ["name","featured_image","location", "description"]);
    const newPlace = await Place.updateOne(
      { _id: req.params.id },
      { $set: { ...payload } }
    );
    res.json(newPlace);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.delete("/:id", isValidObjectId, userAuthHandler, async (req, res) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) res.status(400).json({errors: errors.array()});

    const place = await Place.findById(req.params.id, { flagged: 0 });
    if (!place) res.sendStatus(404);

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

router.post("/:id/flag", isValidObjectId ,userAuthHandler, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) res.status(400).json({errors: errors.array()});

    const place = await Place.findById(req.params.id, { flagged: 0 });
    if (!place) res.sendStatus(404);
    place.flagged = true;
    const updatedPlace = await place.save();
    res.json({ message: "Place is Flagged" });
  } catch (err) {
    next(err);
  }
});

router.get("/:id/reviews",isValidObjectId, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) res.status(400).json({errors: errors.array()});

    const place = await Place.findById(req.params.id, { flagged: 0 });
    if (!place) res.sendStatus(404);
    const reviews = await Review.find(
      {
        place: req.params.id,
      },
      { flagged: 0 }
    ).populate("user", "-password");
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/review/user", isValidObjectId, userAuthHandler, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) res.status(400).json({errors: errors.array()});

    const place = await Place.findById(req.params.id, { flagged: 0 });
    if (!place) res.status(404).json({message: "No Reviews"});
    const review = await Review.findOne(
      {
        place: req.params.id,
        user: req.user.id,
      },
      { flagged: 0 }
    ).populate("user", "-password");
    if (!review) res.sendStatus(404);
    res.json(review);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/images", isValidObjectId ,async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) res.status(400).json({errors: errors.array()});

    const place = await Place.findById(req.params.id, { flagged: 0 });
    if (!place) res.sendStatus(404);
    const images = await ImageModel.find(
      {
        place: req.params.id,
      },
      {
        flagged: 0,
      },
      {}
    ).populate("user", "-password");
    res.json(images);
  } catch (err) {
    return next(err);
  }
});

router.get("/:id/images/user", isValidObjectId ,userAuthHandler, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if(!errors.isEmpty()) res.status(400).json({errors: errors.array()});
    
    const place = await Place.findById(req.params.id, { flagged: 0 });
    if (!place) res.sendStatus(404);
    const images = await ImageModel.find(
      {
        place: req.params.id,
        user: req.user.id,
      },
      {
        flagged: 0,
      },
      {}
    ).populate("user", "-password");
    res.json(images);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

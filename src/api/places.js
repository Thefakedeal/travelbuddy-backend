const router = require("express").Router();
const Place = require("../model/Place");
const Review = require("../model/Review");
const upload = require("../helpers/multer");
const { userAuthHandler } = require("../middlewares");

router.get("/", async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    res.json(place);
  } catch (err) {
    res.status(404).send(err);
  }
});

const featuredUpload = upload.single("featured_image");

router.post("/", userAuthHandler, featuredUpload, async (req, res) => {
  try {
    const place = new Place();
    place.name = req.body.name;
    place.lat = req.body.lat;
    place.lon = req.body.lon;
    place.description = req.body.description;
    place.featured_image = req.file.path;
    place.user = req.user._id;
    const placeDoc = await place.save();
    res.json(placeDoc);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put("/:id", userAuthHandler, featuredUpload, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    //Allow Update only of place belongs to user
    if (place.user.toString() !== req.user.id){
      return res
        .status(403)
        .json({ message: "You aren't allowed to do that." });
    }
        
    const featured_image = req.file;
    if (featured_image) {
      req.body.featured_image = featured_image.path;
    }
    
    await Place.updateOne(
      { _id: req.params.id },
      { $set: { ...req.body } }
    );

    res.json(place);
  } catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
});

router.delete("/:id",userAuthHandler, async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);

    if (place.user.toString() !== req.user.id)
      return res
        .status(403)
        .json({ message: "You aren't allowed to do that." });

    await place.delete()
    res.json(place);

  } catch (err) {
    res.status(400).json(err);
  }
});


module.exports = router;

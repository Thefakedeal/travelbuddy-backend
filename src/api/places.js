const router = require("express").Router();
const Place = require("../model/Place");
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.send(err);
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

router.post("/", async (req, res) => {
  try {
    const place = new Place();
    place.name = req.body.name;
    place.lat = req.body.lat;
    place.lon = req.body.lon;
    place.description = req.body.description;
    const placeDoc = await place.save();
    res.json(placeDoc);
  } catch (err) {
    res.send(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const place = await Place.updateOne(
      { _id: req.params.id },
      { $set: { ...req.body } }
    );
    res.json(place);
  } catch (err) {
    res.json(err);
  }
});

router.delete("/:id",async (req,res)=>{
  try{
    const place = await Place.findByIdAndDelete(req.params.id);
    res.json(place)
  }catch(err){
    res.json(err)
  }
})
module.exports = router;

const express = require("express");
const router = express.Router();
const Review = require("../model/Review");
const { userAuthHandler } = require("../middlewares");

router.get("/", async (req, res, next) => {
  try {
    const placeID = req.query.placeID;
    const reviews = await Review.find({
      place: placeID,
    }).populate("user", "-password");
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

router.post("/", userAuthHandler, async (req, res, next) => {
  try {
    const review = await Review.findOneAndUpdate(
      { place: req.body.placeID, user: req.user._id },
      {
        comment: req.body.comment,
        stars: Math.floor(req.body.stars),
      },
      {
        new: true,
        upsert: true,
        runValidators:true,
        
      }
    );
    res.json(review);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', userAuthHandler, async (req,res,next)=>{
    try{
        const review = await Review.findById(req.params.id);
        if(review.user.toString() == req.user.id ){
            await review.delete();
            return res.status(203).json({message: "Review Deleted"});
        }
        return res.status(403).json({message: "Not Allowed"});
    }catch(err){
        next(err);
    }
})

module.exports = router;

const express = require('express');

const router = express.Router();
const Review = require('../model/Review');
const { userAuthHandler } = require('../middlewares');
const { remove } = require('../helpers/objects');

router.get('/', async (req, res, next) => {
  try {
    const { placeID } = req.query;
    const reviews = await Review.find({
      place: placeID,
    },{flagged: 0}).populate('user', '-password');
    res.json(reviews);
  } catch (err) {
    next(err);
  }
});

router.post('/', userAuthHandler, async (req, res, next) => {
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
        runValidators: true,

      }
    );
    res.json(remove(review.toJSON(),['flagged']));
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', userAuthHandler, async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review.user.toString() == req.user.id) {
      await review.delete();
      return res.status(203).json({ message: 'Review Deleted' });
    }
    return res.status(403).json({ message: 'Not Allowed' });
  } catch (err) {
    next(err);
  }
});

router.post(':id/flag',userAuthHandler, async(req,res)=>{
  try{
    const review = await Review.findById(req.params.id);
    review.flagged = true;
    review.save();
    res.json({message: "Review Flagged"});
  }catch(err){
    next(err);
  }
})

module.exports = router;

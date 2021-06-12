const router = require('express').Router();
const Review = require('../../model/Review');

const { param, validationResult } = require("express-validator");
const mongoose = require('mongoose')

const isValidObjectId = param("id").custom((value) => {
  const isValid = mongoose.Types.ObjectId.isValid(value);
  if (!isValid) throw new Error("Invalid ID");
  return isValid;
});


router.get('/', async(req,res,next)=>{
    try{
        const reviews = await Review.find({}).populate("user","-password");
        res.json({data: reviews});
    }catch(err){
        next(err)
    }
})

router.get('/flagged', async(req,res,next)=>{
    try{
        const reviews = await Review.find({flagged: true}).populate("user","-password");
        res.json({data: reviews});

    }catch(err){
        next(err)
    }
})


router.get('/:id', isValidObjectId, async(req,res,next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const review = await Review.findById(req.params.id).populate("user","-password");
        if(!review) return res.sendStatus(404);
        res.json(review);
    }catch(err){
        next(err)
    }
})


router.delete('/:id', isValidObjectId, async(req,res,next)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const review= await Review.findByIdAndDelete(req.params.id);
        if(!review) return res.sendStatus(404);
        return res.status(203).json({message: "Review Deleted"});
    }catch(err){
        next(err)
    }
})

module.exports = router;
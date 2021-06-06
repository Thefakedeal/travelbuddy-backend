const router = require('express').Router();
const Review = require('../../model/Review');


router.get('/flagged', async(req,res,next)=>{
    try{
        const reviews = await Review.find({flagged: true}).populate("user","-password");
        res.json(reviews);
    }catch(err){
        next(err)
    }
})


router.get('/:id', async(req,res,next)=>{
    try{
        const review = await Review.findById(req.params.id).populate("user","-password");
        res.json(review);
    }catch(err){
        next(err)
    }
})


router.delete('/:id', async(req,res,next)=>{
    try{
        await Review.findByIdAndDelete(req.params.id)
        return res.status(203).json({message: "Review Deleted"});
    }catch(err){
        next(err)
    }
})

module.exports = router;
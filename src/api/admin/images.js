const router = require('express').Router();
const Image = require('../../model/Image');


router.get('/flagged', async(req,res,next)=>{
    try{
        const images = await Image.find({flagged: true}).populate("user","-password");
        res.json(images);
    }catch(err){
        next(err)
    }
})


router.get('/:id', async(req,res,next)=>{
    try{
        const image = await Image.findById(req.params.id).populate("user","-password");
        res.json(image);
    }catch(err){
        next(err)
    }
})


router.delete('/:id', async(req,res,next)=>{
    try{
        await Image.findByIdAndDelete(req.params.id)
        return res.status(203).json({message: "Review Deleted"});
    }catch(err){
        next(err)
    }
})

module.exports = router;
const router = require('express').Router();
const Image = require('../../model/Image');
const path = require('path')
const { unlink } = require('fs')
const { param, validationResult } = require("express-validator");
const mongoose = require('mongoose')

const isValidObjectId = param("id").custom((value) => {
  const isValid = mongoose.Types.ObjectId.isValid(value);
  if (!isValid) throw new Error("Invalid ID");
  return isValid;
});


router.get('/', async(req,res,next)=>{
    try{
        const images = await Image.find({}).populate("user","-password");
        res.json(images);
    }catch(err){
        next(err)
    }
})


router.get('/flagged', async(req,res,next)=>{
    try{
        const images = await Image.find({flagged: true}).populate("user","-password");
        res.json(images);
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

        const image = await Image.findById(req.params.id).populate("user","-password");
        if(!image) return res.sendStatus(404);
        res.json(image);
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

        const image = await Image.findByIdAndDelete(req.params.id)
        if(!image) return res.sendStatus(404);

        unlink(path.join("static", image.image), (err) => {
            if (err) return next(err);
            return res.json({ message: "Image Deleted" });
          });
    }catch(err){
        next(err)
    }
})

module.exports = router;
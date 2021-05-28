const router = require("express").Router();
const upload = require("../helpers/multer");
const { userAuthHandler } = require("../middlewares");
const Image = require("../model/Image");
const path = require("path");
const { unlink } = require("fs");

const photoUpload = upload.array("images", 5);

router.post("/", userAuthHandler, photoUpload, async (req, res, next) => {
  try {
    const uploadedImages = req.files;

    const images = uploadedImages.map((img) => {
      return {
        user: req.user.id,
        image: `/images/${img.filename}`,
        place: req.body.placeID,
      };
    });
    Image.insertMany(images);
    res.json({ message: "images Saved" });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", userAuthHandler, async (req, res, next) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);
    if (!image) return res.sendStatus(404);
    if (image.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You aren't allowed to do that." });
    }
    unlink(path.join("static", image.image), (err) => {
      if (err) return next(err);
      return res.json({ message: "File Deleted" });
    });
  } catch (err) {
    next(err);
  }
});


router.post('/:id/flag',userAuthHandler,(req,res,next)=>{
  try{
    const image = Image.findById(req.params.id);
    image.flagged = true;
    await image.save();
    return res.json({message:"Image was Flagged"});
  }catch(err){
    next(err)
  }
})
module.exports = router;

const router = require("express").Router();
const { query, validationResult, param, body} = require("express-validator");
const User = require("../../model/User");
const mongoose = require("mongoose");

const isValidObjectId = param("id").custom((value) => {
  const isValid = mongoose.Types.ObjectId.isValid(value);
  if (!isValid) throw new Error("Invalid ID");
  return isValid;
});

const admin = query("is_admin").isBoolean().optional();

router.get("/", admin, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const usersQuery = User.find({});
    if (req.query.is_admin !== null && req.query.is_admin !== undefined) {
      usersQuery.where("is_admin", req.query.is_admin);
    }
    const users = await usersQuery.exec();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", isValidObjectId, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findById(req.params.id);
    if (!user) return res.sendStatus(404);
    res.json(user);
  } catch (err) {
    next(err);
  }
});

router.put(
  "/:id",
  isValidObjectId,
  body("is_admin").isBoolean(),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const user = await User.findById(req.params.id);
      user.is_admin = req.body.is_admin;
      await user.save();
      if (!user) return res.sendStatus(404);

      res.json(user);
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:id", isValidObjectId, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const user = await User.findById(req.params.id);
      if (!user) return res.sendStatus(404);
      if(user._id.toString() === req.user.id){
        return res.status(403).json({message: "Can't Delete Yourself"});
      }
      await user.delete();
      res.json({message: "User Deleted"});
    } catch (err) {
      next(err);
    }
});


router.get("/:id/places", isValidObjectId, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const user = await User.findById(req.params.id).populate('places');
      if (!user) return res.sendStatus(404);
      res.json(user);
    } catch (err) {
      next(err);
    }
  });

  router.get("/:id/images", isValidObjectId, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const user = await User.findById(req.params.id).populate('images');
      if (!user) return res.sendStatus(404);
      res.json(user);
    } catch (err) {
      next(err);
    }
  });

  router.get("/:id/reviews", isValidObjectId, async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const user = await User.findById(req.params.id).populate('reviews');
      if (!user) return res.sendStatus(404);
      res.json(user);
    } catch (err) {
      next(err);
    }
  });

module.exports = router;

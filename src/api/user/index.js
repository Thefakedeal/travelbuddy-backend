const express = require("express");
const router = express.Router();
const upload = require("../../helpers/multer");
const { userAuthHandler } = require("../../middlewares");
router.use(userAuthHandler);

router.get("/", (req, res) => {
  const user = req.user;
  res.json({ user });
});

const imageUpload = upload.single("image");
router.put("/", userAuthHandler, imageUpload, async (req, res) => {
  try {
    const user = req.user;
    const { name, email } = req.body;
    const image = req.file;
    if (name) user.name = name;
    if (email) user.email = email;
    if (image) user.image = image.path;
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;

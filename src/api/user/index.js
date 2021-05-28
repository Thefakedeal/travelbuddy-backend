const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const upload = require("../../helpers/multer");
const { userAuthHandler } = require("../../middlewares");

router.use(userAuthHandler);

router.get("/", (req, res) => {
  const { user } = req;
  res.json({ user });
});

const imageUpload = upload.single("image");
router.put("/", imageUpload, async (req, res) => {
  try {
    const { user } = req;
    const { name, email } = req.body;
    const image = req.file;
    if (name) user.name = name;
    if (email) user.email = email;
    if (image) user.image =`/images/${image.filename}`
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put("/changepassword", async (req, res) => {
  try {
    const { user } = req;
    const { oldPassword, newPassword } = req.body;
    const correctPassword = await bcrypt.compare(oldPassword, user.password);
    if (!correctPassword)
      return res.status(400).json({ message: "Incorrect Password" });
    const salt = await bcrypt.genSalt();
    user.password = bcrypt.hash(newPassword, salt);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;

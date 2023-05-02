const Item = require("../models/Item");
const multer = require("multer");
const express = require("express");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop(); // Get the file extension
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExtension);
  },
});

const upload = multer({ storage: storage });
router.post("/", upload.single("image"), async (req, res) => {
  const user_id = req.cookies.user_id;
  const { item_name, item_type, condition, dimensions } = req.body;
  try {
    const newItem = new Item({
      user_id,
      item_name,
      item_type,
      condition,
      dimensions,
      charity_id: user_id,
      image: req.file.filename,
    });

    await newItem.save();
    res.status(201).redirect("/items");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/search", async (req, res) => {
  const user_id = req.cookies.user_id;
  const user_type = req.cookies.user_type;
  try {
    const data = await Item.find({ item_name: req.body.search });
    res.render("donations", {
      data,
      user_type,
      user_id,
    });
  } catch (error) {
    const data = await Item.find({});
    res.render("donations", {
      data,
      user_id,
    });
  }
});

router.post("/searchitems", async (req, res) => {
  const user_id = req.cookies.user_id;
  try {
    const data = await Item.find({ item_name: req.body.search });
    res.render("items", {
      data,
      user_id,
    });
  } catch (error) {
    const data = await Item.find({});
    res.render("items", {
      data,
      user_id,
    });
  }
});

module.exports = router;

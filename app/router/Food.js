const express = require("express");
const router = express.Router();
const foods = require("../controller/FoodController");
const multer = require("multer");
const moment = require("moment");
const path = require("path");

const dirName = path.dirname(require.main.filename);
const pathName = `${dirName}/public/images/restaurants/`;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pathName);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage
});

router.post("/", foods.showAllFoodsDataByResId);
router.get("/:restId/:foodId", foods.showFoodsDataByResId);
router.get("/allfoods", foods.countFoodInRestaurant);
router.get("/allfoods/:restId/:foodId", foods.countMyFoodsInRestaurant);
router.post("/create", upload.any(), foods.insertFoodsData);
router.post("/update/:foodId", upload.any(), foods.updateFoodsData);
router.post("/delete", foods.deleteFoods);

module.exports = router;

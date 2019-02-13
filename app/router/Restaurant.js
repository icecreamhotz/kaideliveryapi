const express = require("express");
const router = express.Router();
const restaurants = require("../controller/RestaurantController");
const multer = require("multer");
const moment = require("moment");
const path = require("path");
const jwtauth = require("../middleware/jwtauth");

const pathName =
  path.dirname(require.main.filename) + "/public/images/restaurants/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pathName);
  },
  filename: (req, file, cb) => {
    cb(null, "res_" + moment().format("YYYYMMDDhhmmss") + ".jpg");
  }
});

const upload = multer({
  storage: storage
});

router.get("/", restaurants.getRestaurantData);
router.get("/owner", jwtauth, restaurants.getRestaurantForManage);
router.post("/", jwtauth, restaurants.getRestaurantDataByName);
router.post(
  "/create",
  [upload.single("image"), jwtauth],
  restaurants.insertRestaurant
);
router.post("/delete", jwtauth, restaurants.deleteRestaurantAllData);
router.post(
  "/update/:resName",
  [upload.single("image"), jwtauth],
  restaurants.updateRestaurantData
);
router.get("/:restId", jwtauth, restaurants.getRestaurantDataById);

module.exports = router;

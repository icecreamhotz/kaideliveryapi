const express = require("express");
const router = express.Router();
const restaurants = require("../controller/RestaurantController");
const multer = require("multer");
const moment = require("moment");
const path = require("path");
const jwtauth = require("../middleware/jwtauth");

const dirName = path.dirname(require.main.filename);
const pathName = `${dirName}/public/images/restaurants/`;
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
router.get("/open", restaurants.getRestaurantOpenNow);
router.get("/owners", restaurants.getRestaurantWithOwnerData);
router.get("/myrestaurant/owner", jwtauth, restaurants.getRestaurantForManage);
router.get("/:restId", restaurants.getRestaurantDataById);

router.post("/", jwtauth, restaurants.getRestaurantDataByName);
router.post(
  "/create/owner",
  [upload.single("image"), jwtauth],
  restaurants.insertRestaurant
);
router.post(
  "/create",
  [upload.single("image"), jwtauth],
  restaurants.createRestaurantWithoutOwner
);
router.post("/delete", jwtauth, restaurants.deleteRestaurantAllData);
router.post(
  "/update",
  [upload.single("image"), jwtauth],
  restaurants.updateRestaurantData
);
router.post("/verify", jwtauth, restaurants.verifyRestaurant);

module.exports = router;

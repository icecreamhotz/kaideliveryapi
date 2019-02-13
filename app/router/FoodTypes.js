const express = require("express");
const router = express.Router();
const FoodTypes = require("../controller/FoodTypesController");

router.get("/", FoodTypes.getAllFoodTypes);

module.exports = router;

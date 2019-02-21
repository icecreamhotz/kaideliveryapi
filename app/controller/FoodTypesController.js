const models = require("../model");

const FoodTypes = models.FoodType;

const foodTypes = {
  getAllFoodTypes: async (req, res) => {
    await FoodTypes.findAll({
      attributes: ["foodtype_id", "foodtype_name"]
    })
      .then(foodtypes => {
        if (!foodtypes) {
          return res.status(200).json({ message: "success", data: [] });
        }
        res.status(200).json({
          message: "success",
          data: foodtypes
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  }
};

module.exports = foodTypes;

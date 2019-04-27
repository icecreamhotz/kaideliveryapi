const models = require("../model");
const sequelize = require("sequelize");

const RestaurantScores = models.RestaurantScore;

const restaurantscore = {
  addRatingRestaurant: async (req, res) => {
    const score = {
      resscore_rating: req.body.rating,
      resscore_comment: req.body.comment == null ? null : req.body.comment,
      user_id: req.body.user_id,
      res_id: req.body.res_id
    };

    await RestaurantScores.create(score)
      .then(result => {
        res.status(200).json({
          message: "success",
          data: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  }
};

module.exports = restaurantscore;

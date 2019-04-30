const models = require("../model");
const sequelize = require("sequelize");

const RestaurantScores = models.RestaurantScore;

const restaurantscores = {
  getScoreAndCommentEmployee: async (req, res) => {
    const restId = req.params.restId;
    await RestaurantScores.findAll({
      where: {
        res_id: restId
      },
      include: [
        {
          model: models.User,
          attributes: ["name", "lastname", "user_id", "avatar"]
        },
        {
          model: models.Restaurant,
          attributes: ["res_name", "res_logo", "res_id"]
        }
      ]
    })
      .then(resscore => {
        res.status(200).json({
          message: "success",
          data: resscore
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  }
};

module.exports = restaurantscores;

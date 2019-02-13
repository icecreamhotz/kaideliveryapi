const Sequelize = require("sequelize");
const sequelize = require("../config/db_connection");
const restaurants = require("./Restaurants");

const foods = sequelize.define(
  "foods",
  {
    food_id: {
      type: Sequelize.INTEGER(10),
      primaryKey: true,
      autoIncrement: true
    },
    food_name: {
      type: Sequelize.STRING(40)
    },
    food_price: {
      type: Sequelize.DECIMAL(4, 2)
    },
    food_img: {
      type: Sequelize.STRING(60),
      allowNull: true
    },
    foodtype_id: {
      type: Sequelize.INTEGER(2)
    },
    res_id: {
      type: Sequelize.INTEGER(4)
    }
  },
  {
    timestamps: false
  }
);

module.exports = foods;

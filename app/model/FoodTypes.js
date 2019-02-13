const Sequelize = require("sequelize");
const sequelize = require("../config/db_connection");

const foodtypes = sequelize.define(
  "foodtypes",
  {
    foodtype_id: {
      type: Sequelize.INTEGER(2),
      primaryKey: true,
      autoIncrement: true
    },
    foodtype_name: {
      type: Sequelize.STRING(30)
    },
    foodtype_details: {
      type: Sequelize.STRING(100),
      allowNull: true
    }
  },
  {
    timestamps: false
  }
);

module.exports = foodtypes;

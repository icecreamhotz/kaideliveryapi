const Sequelize = require("sequelize");
const sequelize = require("../config/db_connection");
const locations = require("./Locations");
const User = require("./Users");
const foods = require("./Foods");

const restaurants = sequelize.define(
  "restaurants",
  {
    res_id: {
      type: Sequelize.INTEGER(4),
      primaryKey: true,
      autoIncrement: true
    },
    res_name: {
      type: Sequelize.STRING(40)
    },
    res_telephone: {
      type: Sequelize.STRING(30),
      allowNull: true
    },
    res_email: {
      type: Sequelize.STRING(30),
      allowNull: true
    },
    res_address: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    res_details: {
      type: Sequelize.STRING(50),
      allowNull: true
    },
    res_open: {
      type: Sequelize.TIME,
      allowNull: true
    },
    res_close: {
      type: Sequelize.TIME,
      allowNull: true
    },
    res_holiday: {
      type: Sequelize.STRING(30),
      allowNull: true
    },
    res_status: {
      type: Sequelize.STRING(1)
    },
    user_id: {
      type: Sequelize.INTEGER(6)
    },
    res_logo: {
      type: Sequelize.STRING(40),
      allowNull: true,
      unique: true
    },
    open_status: {
      type: Sequelize.STRING(1)
    },
    resscore_id: {
      type: Sequelize.INTEGER(4)
    },
    res_lat: {
      type: Sequelize.DECIMAL(16, 14),
      allowNull: true
    },
    res_lng: {
      type: Sequelize.DECIMAL(16, 14),
      allowNull: true
    },
    restype_id: {
      type: Sequelize.STRING(30),
      allowNull: true
    }
  },
  {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

restaurants.hasMany(foods, { foreignKey: "res_id" });

module.exports = restaurants;

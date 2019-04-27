// const Sequelize = require("sequelize");
// const sequelize = require("../config/db_connection");
// const restaurants = require("./Restaurants");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "users",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true
      },
      name: DataTypes.STRING,
      lastname: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        unique: true
      },
      telephone: {
        type: DataTypes.STRING,
        allowNull: true
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true
      },
      provider: {
        type: DataTypes.STRING(1),
        allowNull: true
      },
      provider_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
      },
      status: DataTypes.STRING(1),
      resetPasswordToken: {
        type: DataTypes.STRING,
        allowNull: true
      },
      resetPasswordExpired: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  return User;
};

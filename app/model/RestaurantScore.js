module.exports = (sequelize, DataTypes) => {
  const RestaurantScore = sequelize.define(
    "restaurantscores",
    {
      resscore_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      resscore_rating: {
        type: DataTypes.INTEGER(1)
      },
      resscore_comment: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      resscore_date: {
        type: DataTypes.DATE
      },
      user_id: {
        type: DataTypes.INTEGER(6)
      },
      res_id: {
        type: DataTypes.INTEGER(4)
      }
    },
    {
      timestamps: false
    }
  );

  return RestaurantScore;
};

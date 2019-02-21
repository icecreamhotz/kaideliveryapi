module.exports = (sequelize, DataTypes) => {
  const RestaurantType = sequelize.define(
    "restauranttypes",
    {
      restype_id: {
        type: DataTypes.INTEGER(2),
        primaryKey: true,
        autoIncrement: true
      },
      restype_name: {
        type: DataTypes.STRING(30)
      },
      restype_details: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      timestamps: false
    }
  );
  return RestaurantType;
};

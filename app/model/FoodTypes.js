module.exports = (sequelize, DataTypes) => {
  const FoodType = sequelize.define(
    "foodtypes",
    {
      foodtype_id: {
        type: DataTypes.INTEGER(2),
        primaryKey: true,
        autoIncrement: true
      },
      foodtype_name: {
        type: DataTypes.STRING(30)
      },
      foodtype_details: {
        type: DataTypes.STRING(100),
        allowNull: true
      }
    },
    {
      timestamps: false
    }
  );

  return FoodType;
};

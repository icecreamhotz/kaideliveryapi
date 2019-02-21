module.exports = (sequelize, DataTypes) => {
  const Food = sequelize.define(
    "foods",
    {
      food_id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true
      },
      food_name: {
        type: DataTypes.STRING(40)
      },
      food_price: {
        type: DataTypes.DECIMAL(4, 2)
      },
      food_img: {
        type: DataTypes.STRING(60),
        allowNull: true
      },
      foodtype_id: {
        type: DataTypes.INTEGER(2)
      },
      res_id: {
        type: DataTypes.INTEGER(4)
      }
    },
    {
      timestamps: false
    }
  );

  return Food;
};

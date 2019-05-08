module.exports = (sequelize, DataTypes) => {
  const ChangeList = sequelize.define(
    "changelists",
    {
      change_id: {
        type: DataTypes.INTEGER(6),
        primaryKey: true,
        autoIncrement: true
      },
      food_id: {
        type: DataTypes.INTEGER(10)
      },
      food_name: {
        type: DataTypes.STRING(30)
      },
      food_newprice: {
        type: DataTypes.DECIMAL(7, 2)
      },
      change_status: {
        type: DataTypes.STRING(1)
      },
      emp_id: {
        type: DataTypes.INTEGER(3)
      }
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false
    }
  );

  return ChangeList;
};

module.exports = (sequelize, DataTypes) => {
  const Income = sequelize.define(
    "incomes",
    {
      inc_id: {
        type: DataTypes.INTEGER(2),
        primaryKey: true,
        autoIncrement: true
      },
      inc_total: {
        type: DataTypes.DECIMAL(8, 2)
      },
      inc_rate: {
        type: DataTypes.INTEGER(3),
        allowNull: true
      },
      inc_status: {
        type: DataTypes.STRING(1),
        allowNull: true
      },
      order_id: {
        type: DataTypes.INTEGER(6),
        allowNull: true
      },
      emp_id: {
        type: DataTypes.INTEGER(3),
        allowNull: true
      }
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  return Income;
};

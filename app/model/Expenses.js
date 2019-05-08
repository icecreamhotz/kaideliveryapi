module.exports = (sequelize, DataTypes) => {
  const Expense = sequelize.define(
    "expenses",
    {
      exp_id: {
        type: DataTypes.INTEGER(6),
        primaryKey: true,
        autoIncrement: true
      },
      exp_name: {
        type: DataTypes.STRING(50)
      },
      exp_details: {
        type: DataTypes.STRING(100)
      },
      exp_date: {
        type: DataTypes.DATE
      },
      exp_price: {
        type: DataTypes.DECIMAL(8, 2)
      },
      emp_id: {
        type: DataTypes.INTEGER(3)
      }
    },
    {
      timestamps: false
    }
  );

  return Expense;
};

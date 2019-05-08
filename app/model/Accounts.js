module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define(
    "accounts",
    {
      acc_id: {
        type: DataTypes.INTEGER(6),
        primaryKey: true,
        autoIncrement: true
      },
      acc_name: {
        type: DataTypes.STRING(50)
      },
      acc_details: {
        type: DataTypes.STRING(100)
      },
      acc_date: {
        type: DataTypes.DATE
      },
      acc_price: {
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

  return Account;
};

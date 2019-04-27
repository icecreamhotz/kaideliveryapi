module.exports = (sequelize, DataTypes) => {
  const EmployeeScore = sequelize.define(
    "employeescores",
    {
      empscore_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      empscore_rating: {
        type: DataTypes.INTEGER(1)
      },
      empscore_comment: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      empscore_date: {
        type: DataTypes.DATE
      },
      user_id: {
        type: DataTypes.INTEGER(6)
      },
      emp_id: {
        type: DataTypes.INTEGER(3)
      }
    },
    {
      timestamps: false
    }
  );

  return EmployeeScore;
};

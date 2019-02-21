module.exports = (sequelize, DataTypes) => {
  const EmployeeType = sequelize.define(
    "employeetypes",
    {
      emptype_id: {
        type: DataTypes.INTEGER(2),
        primaryKey: true,
        autoIncrement: true
      },
      emptype_name: {
        type: DataTypes.STRING(30)
      }
    },
    {
      timestamps: false
    }
  );
  return EmployeeType;
};

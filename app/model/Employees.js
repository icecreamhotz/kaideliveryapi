module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    "employees",
    {
      emp_id: {
        type: DataTypes.INTEGER(3),
        primaryKey: true,
        autoIncrement: true
      },
      emp_username: {
        type: DataTypes.STRING(30),
        unique: true
      },
      emp_password: {
        type: DataTypes.STRING(80)
      },
      emp_name: {
        type: DataTypes.STRING(30)
      },
      emp_lastname: {
        type: DataTypes.STRING(30)
      },
      emp_idcard: {
        type: DataTypes.STRING(13)
      },
      emp_telephone: {
        type: DataTypes.STRING(10)
      },
      emp_address: {
        type: DataTypes.STRING(100)
      },
      emp_verified: {
        type: DataTypes.STRING(1)
      },
      emp_workstatus: {
        type: DataTypes.STRING(1)
      },
      emp_avatar: {
        type: DataTypes.STRING(40),
        allowNull: true
      },
      emptype_id: {
        type: DataTypes.INTEGER(2)
      },
      resetPasswordToken: {
        type: DataTypes.STRING(30)
      },
      resetPasswordExpired: {
        type: DataTypes.DATE
      }
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  Employee.associate = function(models) {
    models.Employee.hasMany(models.Order, {
      foreignKey: "emp_id"
    });
  };

  return Employee;
};

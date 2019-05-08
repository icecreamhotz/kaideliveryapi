module.exports = (sequelize, DataTypes) => {
  const onetimepassword = sequelize.define(
    "onetimepasswords",
    {
      otp_id: {
        type: DataTypes.INTEGER(7),
        primaryKey: true,
        autoIncrement: true
      },
      otp_code: {
        type: DataTypes.STRING(6)
      },
      otp_status: {
        type: DataTypes.STRING(1)
      },
      otp_expiredToken: {
        type: DataTypes.DATE
      },
      otp_telephone: {
        type: DataTypes.STRING(10)
      }
    },
    {
      timestamps: false
    }
  );

  return onetimepassword;
};

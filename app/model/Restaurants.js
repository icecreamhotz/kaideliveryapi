module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define(
    "restaurants",
    {
      res_id: {
        type: DataTypes.INTEGER(4),
        primaryKey: true,
        autoIncrement: true
      },
      res_name: {
        type: DataTypes.STRING(40)
      },
      res_telephone: {
        type: DataTypes.STRING(30),
        allowNull: true
      },
      res_email: {
        type: DataTypes.STRING(30),
        allowNull: true
      },
      res_address: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      res_details: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      res_open: {
        type: DataTypes.TIME,
        allowNull: true
      },
      res_close: {
        type: DataTypes.TIME,
        allowNull: true
      },
      res_holiday: {
        type: DataTypes.STRING(30),
        allowNull: true
      },
      res_status: {
        type: DataTypes.STRING(1)
      },
      user_id: {
        type: DataTypes.INTEGER(6),
        allowNull: true
      },
      res_logo: {
        type: DataTypes.STRING(40),
        allowNull: true,
        unique: true
      },
      open_status: {
        type: DataTypes.STRING(1)
      },
      resscore_id: {
        type: DataTypes.INTEGER(4)
      },
      res_lat: {
        type: DataTypes.DECIMAL(16, 14),
        allowNull: true
      },
      res_lng: {
        type: DataTypes.DECIMAL(16, 14),
        allowNull: true
      },
      restype_id: {
        type: DataTypes.STRING(30),
        allowNull: true
      }
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  return Restaurant;
};

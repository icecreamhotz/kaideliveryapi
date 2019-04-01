module.exports = (sequelize, DataTypes) => {
  const Rate = sequelize.define(
    "deliveryrates",
    {
      rate_id: {
        type: DataTypes.INTEGER(3),
        primaryKey: true,
        autoIncrement: true
      },
      rate_kilometers: {
        type: DataTypes.STRING(3)
      },
      rate_price: {
        type: DataTypes.INTEGER(3)
      },
      rate_status: {
        type: DataTypes.STRING(1)
      },
      rate_details: {
        type: DataTypes.STRING(50)
      },
      created_at: {
        type: DataTypes.DATE
      }
    },
    {
      timestamps: false
    }
  );

  Rate.associate = function(models) {
    models.Rate.hasMany(models.Order, {
      foreignKey: "rate_id"
    });
  };

  return Rate;
};

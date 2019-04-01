module.exports = (sequelize, DataTypes) => {
  const OrderDetail = sequelize.define(
    "orderdetails",
    {
      orderdetail_id: {
        type: DataTypes.INTEGER(10),
        primaryKey: true,
        autoIncrement: true
      },
      order_id: {
        type: DataTypes.INTEGER(6),
        references: {
          model: this.Order,
          key: "order_id"
        }
      },
      food_id: {
        type: DataTypes.INTEGER(10)
      },
      orderdetail_total: {
        type: DataTypes.INTEGER(2)
      },
      orderdetail_price: {
        type: DataTypes.DECIMAL(6, 2)
      }
    },
    {
      timestamps: false
    }
  );

  OrderDetail.association = function(models) {
    models.OrderDetail.belongTo(models.Order, {
      foreignKey: "order_id"
    });
  };

  return OrderDetail;
};

module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define(
    "orders",
    {
      order_id: {
        type: DataTypes.INTEGER(6),
        primaryKey: true,
        autoIncrement: true
      },
      order_name: {
        type: DataTypes.STRING(16)
      },
      order_queue: {
        type: DataTypes.INTEGER(3),
        allowNull: true
      },
      order_details: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      min_minute: {
        type: DataTypes.INTEGER(2),
        allowNull: true
      },
      user_id: {
        type: DataTypes.STRING(10)
      },
      res_id: {
        type: DataTypes.INTEGER(4)
      },
      emp_id: {
        type: DataTypes.INTEGER(3),
        allowNull: true
      },
      resscore_id: {
        type: DataTypes.INTEGER(6),
        allowNull: true
      },
      empscore_id: {
        type: DataTypes.INTEGER(6),
        allowNull: true
      },
      rate_id: {
        type: DataTypes.INTEGER(6)
      },
      endpoint_name: {
        type: DataTypes.STRING(100)
      },
      endpoint_details: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      endpoint_lat: {
        type: DataTypes.DECIMAL(16, 14)
      },
      endpoint_lng: {
        type: DataTypes.DECIMAL(16, 14)
      },
      order_score: {
        type: DataTypes.INTEGER(6),
        allowNull: true
      },
      order_comment: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      order_status: {
        type: DataTypes.STRING(1)
      },
      order_statusdetails: {
        type: DataTypes.STRING(50)
      },
      order_timeout: {
        type: DataTypes.TIME,
        allowNull: true
      },
      order_deliveryprice: {
        type: DataTypes.DECIMAL(7, 2)
      },
      order_price: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true
      },
      order_date: {
        type: DataTypes.DATE
      },
      order_start: {
        type: DataTypes.TIME
      }
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  );

  return Order;
};

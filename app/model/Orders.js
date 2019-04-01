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
      order_details: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      user_id: {
        type: DataTypes.INTEGER(6),
        references: {
          model: this.User,
          key: "user_id"
        }
      },
      res_id: {
        type: DataTypes.INTEGER(4),
        references: {
          model: this.Restaurant,
          key: "res_id"
        }
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
        type: DataTypes.INTEGER(6),
        references: {
          model: this.Rate,
          key: "rate_id"
        }
      },
      pro_id: {
        type: DataTypes.INTEGER(3),
        allowNull: true
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
      order_timeout: {
        type: DataTypes.TIME,
        allowNull: true
      },
      order_deliveryprice: {
        type: DataTypes.DECIMAL(7, 2)
      },
      order_discount: {
        type: DataTypes.DECIMAL(7, 2),
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

  Order.associate = function(models) {
    models.Order.belongsTo(models.User, {
      foreignKey: "user_id"
    });
    models.Order.belongsTo(models.Restaurant, {
      foreignKey: "res_id"
    });
    models.Order.belongsTo(models.Rate, {
      foreignKey: "rate_id"
    });
    models.Order.hasMany(models.OrderDetail, {
      foreignKey: "order_id"
    });
  };

  return Order;
};

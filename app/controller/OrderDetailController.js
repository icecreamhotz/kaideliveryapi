const models = require("../model");
const moment = require("moment");

const OrderDetails = models.OrderDetail;

const orderdetail = {
  getOrderDetailByOrderID: async (req, res) => {
    const orderId = req.params.orderId;
    await OrderDetails.findAll({
      where: {
        order_id: orderId
      }
    })
      .then(menu => {
        res.status(200).json({
          message: "success",
          data: menu
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getTotalPriceByOrderID: async (req, res) => {
    const orderId = req.params.orderId;
    await OrderDetails.sum("orderdetail_price", {
      where: {
        order_id: orderId
      }
    })
      .then(price => {
        res.status(200).json({
          message: "success",
          data: price
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  }
};
module.exports = orderdetail;

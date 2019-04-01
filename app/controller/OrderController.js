const models = require("../model");
const sequelize = require("sequelize");
const moment = require("moment");
const Nexmo = require("nexmo");

const Orders = models.Order;
const OrderDetails = models.OrderDetail;
const OneTimePasswords = models.OneTimePassword;

const nexmo = new Nexmo(
  {
    apiKey: "a243d542",
    apiSecret: "jEUukrqFYnQAjZW9"
  },
  { debug: true }
);

const order = {
  insertOrder: async (req, res) => {
    const menu = req.body.menu;
    const dateNow = moment().format("YYYYMMDDhhmmss");
    const orderName = `OD${dateNow}`;
    await Orders.create({
      order_name: orderName,
      user_id: 85,
      res_id: req.body.res_id,
      rate_id: req.body.rate_id,
      endpoint_name: req.body.endpoint_name,
      endpoint_lat: req.body.endpoint_lat,
      endpoint_lng: req.body.endpoint_lng,
      order_deliveryprice: req.body.order_deliveryprice,
      order_start: req.body.order_start,
      order_details:
        req.body.order_details === "" ? null : req.body.order_details,
      endpoint_details:
        req.body.endpoint_details === "" ? null : req.body.endpoint_details
    })
      .then(order => {
        const getOrderID = order.order_id;
        const getOrderName = order.order_name;

        let promises = menu.map(menu => {
          return OrderDetails.create({
            order_id: getOrderID,
            food_id: menu.food_id,
            orderdetail_total: menu.orderdetails_total,
            orderdetail_price: menu.orderdetails_price
          });
        });

        Promise.all(promises).then(menu => {
          res.status(200).json({
            message: "success",
            order_id: getOrderID,
            order_name: getOrderName
          });
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  updateOrderFromEmployee: async (req, res) => {
    await Orders.update(
      {
        emp_id: 17, // dummy emp id
        order_status: 1
      },
      {
        where: {
          order_id: req.body.order_id
        }
      }
    )
      .then(() => {
        res.status(200).json({
          message: "update success",
          status: true
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err,
          status: false
        });
      });
  },
  getDeliveryEmployeeNow: async (req, res) => {
    await Orders.findAll({
      where: {
        order_status: 1,
        emp_id: 17
      },
      include: [
        { model: models.User, attributes: ["name", "lastname"] },
        {
          model: models.Restaurant,
          attributes: ["res_name", "res_lat", "res_lng"]
        },
        {
          model: models.OrderDetail,
          attributes: [
            [
              sequelize.fn("SUM", sequelize.col("orderdetail_price")),
              "totalPrice"
            ]
          ]
        }
      ],
      limit: 1
    })
      .then(order => {
        res.status(200).json({
          message: "Success",
          data: order
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getDeliveryUserNow: async (req, res) => {
    await Orders.findAll({
      where: {
        order_status: 1,
        user_id: 85
      },
      include: [
        { model: models.User, attributes: ["name", "lastname"] },
        {
          model: models.Restaurant,
          attributes: ["res_name", "res_lat", "res_lng"]
        },
        {
          model: models.OrderDetail,
          attributes: [
            [
              sequelize.fn("SUM", sequelize.col("orderdetail_price")),
              "totalPrice"
            ]
          ]
        }
      ],
      limit: 1
    })
      .then(order => {
        res.status(200).json({
          message: "Success",
          data: order
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getAllOrderIsWaiting: async (req, res) => {
    await Orders.findAll({
      where: {
        order_status: 0
      },
      include: [
        { model: models.User, attributes: ["name", "lastname"] },
        {
          model: models.Restaurant,
          attributes: ["res_name", "res_lat", "res_lng"]
        },
        {
          model: models.OrderDetail,
          attributes: [
            [
              sequelize.fn("SUM", sequelize.col("orderdetail_price")),
              "totalPrice"
            ]
          ]
        }
      ],
      group: ["orderdetails.order_id"]
    })
      .then(order => {
        res.status(200).json({
          message: "Success",
          data: order
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  sendOtpToSMS: async (req, res) => {
    const from = "TEST";
    const getTelephone = req.body.telephone.slice(1);
    const telephone = `66${getTelephone}`;
    const otpcode = 100000 + Math.floor(Math.random() * 900000);
    const text = `Verify order code: ${otpcode} Valid for 15 minutes`;
    const expiredOtp = Date.now() + 900000;
    await OneTimePasswords.create({
      otp_code: otpcode,
      otp_expiredToken: expiredOtp,
      otp_telephone: req.body.telephone,
      user_id: 85
    }).then(() => {
      nexmo.message.sendSms(
        from,
        telephone,
        text,
        { type: "unicode" },
        (err, responseData) => {
          if (err) {
            res.status(500).json({
              message: err
            });
          } else {
            res.status(200).json({
              message: "success"
            });
          }
        }
      );
    });
  },
  checkValidOTP: async (req, res) => {
    const otp = req.params.otp;
    console.log(otp);
    await OneTimePasswords.findOne({
      limit: 1,
      where: {
        otp_code: otp,
        otp_expiredToken: {
          $gt: Date.now()
        },
        user_id: 85
      },
      order: [["otp_id", "DESC"]]
    })
      .then(otp => {
        if (!otp) {
          return res.status(409).json({
            message: "success",
            data: null
          });
        }
        res.status(200).json({
          message: "success",
          data: otp
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  deleteOrderById: async (req, res) => {
    await Orders.destroy({
      where: {
        order_id: req.body.order_id
      }
    })
      .then(async result => {
        res.status(200).json({
          message: "Delete complete."
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  }
};
module.exports = order;

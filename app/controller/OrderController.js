const models = require("../model");
const sequelize = require("sequelize");
const moment = require("moment");
const Nexmo = require("nexmo");

const db = require("../model/index");
const fcmnotifications = require("./FCMNotificationController");

const Orders = models.Order;
const OrderDetails = models.OrderDetail;
const OneTimePasswords = models.OneTimePassword;
const Foods = models.Food;

const nexmo = new Nexmo(
  {
    apiKey: "a243d542",
    apiSecret: "jEUukrqFYnQAjZW9"
  },
  { debug: true }
);

const order = {
  updateOrderFromEmployee: async (req, res) => {
    await Orders.update(
      {
        emp_id: req.decoded.emp_id, // dummy emp id
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
        $or: [
          {
            order_status: {
              $lte: 3
            }
          },
          {
            order_status: 6
          }
        ],
        emp_id: req.decoded.emp_id
      },
      include: [
        {
          model: models.User,
          attributes: ["user_id", "name", "lastname", "avatar"]
        },
        {
          model: models.Restaurant,
          attributes: ["res_name", "res_lat", "res_lng", "res_quota"]
        },
        {
          model: models.OrderDetail,
          attributes: [
            [
              sequelize.literal(
                "(SELECT SUM(orderdetails.orderdetail_price * orderdetails.orderdetail_total) FROM orderdetails WHERE orderdetails.order_id = orders.order_id)"
              ),
              "totalPrice"
            ]
          ]
        },
        {
          model: models.Employee,
          attributes: ["emp_id", "emp_name", "emp_lastname", "emp_avatar"],
          include: [
            {
              model: models.EmployeeScore,
              attributes: [
                [
                  sequelize.fn("AVG", sequelize.col("empscore_rating")),
                  "rating"
                ]
              ],
              group: "emp_id",
              order: [[sequelize.fn("AVG", sequelize.col("empscore_rating"))]]
            }
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
        $or: [
          {
            order_status: {
              $lte: 3
            }
          },
          {
            order_status: 6
          }
        ],
        user_id: req.decoded.user_id
      },
      include: [
        {
          model: models.User,
          attributes: ["user_id", "name", "lastname", "avatar"]
        },
        {
          model: models.Restaurant,
          attributes: ["res_name", "res_lat", "res_lng", "res_quota"]
        },
        {
          model: models.OrderDetail,
          attributes: [
            [
              sequelize.literal(
                "(SELECT SUM(orderdetails.orderdetail_price * orderdetails.orderdetail_total) FROM orderdetails WHERE orderdetails.order_id = orders.order_id)"
              ),
              "totalPrice"
            ]
          ]
        },
        {
          model: models.Employee,
          attributes: ["emp_id", "emp_name", "emp_lastname", "emp_avatar"],
          include: [
            {
              model: models.EmployeeScore,
              attributes: [
                [
                  sequelize.fn("AVG", sequelize.col("empscore_rating")),
                  "rating"
                ]
              ],
              group: "emp_id",
              order: [[sequelize.fn("AVG", sequelize.col("empscore_rating"))]]
            }
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
  getDeliveryCommonUserNow: async (req, res) => {
    await Orders.findOne({
      where: {
        order_status: {
          $lte: 4
        },
        user_id: req.body.telephone
      },
      include: [
        {
          model: models.User,
          attributes: ["user_id", "name", "lastname", "avatar"]
        },
        {
          model: models.Restaurant,
          attributes: ["res_name", "res_lat", "res_lng", "res_quota"]
        },
        {
          model: models.OrderDetail,
          attributes: [
            [
              sequelize.literal(
                "(SELECT SUM(orderdetails.orderdetail_price * orderdetails.orderdetail_total) FROM orderdetails WHERE orderdetails.order_id = orders.order_id)"
              ),
              "totalPrice"
            ]
          ]
        },
        {
          model: models.Employee,
          attributes: ["emp_id", "emp_name", "emp_lastname", "emp_avatar"],
          include: [
            {
              model: models.EmployeeScore,
              attributes: [
                [
                  sequelize.fn("AVG", sequelize.col("empscore_rating")),
                  "rating"
                ]
              ],
              group: "emp_id",
              order: [[sequelize.fn("AVG", sequelize.col("empscore_rating"))]]
            }
          ]
        }
      ],
      order: [["order_id", "DESC"]],
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
      $and: [
        sequelize.where(
          sequelize.fn("DATE", sequelize.col("created_at")),
          sequelize.literal("CURRENT_DATE")
        )
      ],
      include: [
        { model: models.User, attributes: ["name", "lastname"] },
        {
          model: models.Restaurant,
          attributes: ["res_name", "res_lat", "res_lng", "res_quota"]
        },
        {
          model: models.OrderDetail,
          attributes: [
            [
              sequelize.literal(
                "(SELECT SUM(orderdetails.orderdetail_price * orderdetails.orderdetail_total) FROM orderdetails WHERE orderdetails.order_id = orders.order_id)"
              ),
              "totalPrice"
            ]
          ]
        }
      ],
      group: ["orderdetails.order_id"],
      order: [["order_queue", "ASC"]]
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
  getOrderIsDoned: async (req, res) => {
    await Orders.findAll({
      where: {
        order_status: 4,
        order_id: req.params.orderId
      },
      include: [
        {
          model: OrderDetails,
          include: [
            {
              model: Foods
            }
          ]
          // attributes: ["food_id", "orderdetail_total", "orderdetail_price"],
        },
        {
          model: models.Employee,
          attributes: ["emp_name", "emp_lastname", "emp_avatar"]
        },
        {
          model: models.Restaurant,
          attributes: ["res_name", "res_logo", "res_quota"]
        }
      ]
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
      otp_telephone: req.body.telephone
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
    const telephone = req.params.telephone;
    console.log(otp);
    await OneTimePasswords.findOne({
      limit: 1,
      where: {
        otp_code: otp,
        otp_expiredToken: {
          $gt: Date.now()
        },
        otp_telephone: telephone
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
  updateOrderStatus: async (req, res) => {
    const message = req.body.message;
    const fcmToken = req.body.token;
    console.log(fcmToken);
    const statusDetails =
      req.body.order_statusdetails == null
        ? null
        : req.body.order_statusdetails;
    await Orders.update(
      {
        emp_id: req.decoded.empId, // dummy emp id
        order_status: req.body.order_status,
        order_statusdetails: statusDetails
      },
      {
        where: {
          order_id: req.body.order_id
        }
      }
    )
      .then(() => {
        if (typeof message !== "undefined" && typeof fcmToken !== "undefined") {
          fcmnotifications(message, fcmToken);
        }

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
  updateCustomPrice: async (req, res) => {
    await Orders.update(
      {
        order_price: req.body.order_price
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
  getOrderDetailAndFood: async (req, res) => {
    await Orders.findAll({
      where: {
        order_id: req.params.orderId
      },
      include: [
        {
          model: OrderDetails,
          include: [
            {
              model: Foods
            }
          ]
          // attributes: ["food_id", "orderdetail_total", "orderdetail_price"],
        },
        {
          model: models.Employee,
          attributes: ["emp_name", "emp_lastname"]
        },
        {
          model: models.User,
          attributes: ["name", "lastname"]
        }
      ]
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
  getOrderDetailAndFoodByName: async (req, res) => {
    await Orders.findAll({
      where: {
        order_name: req.params.orderName
      },
      include: [
        {
          model: OrderDetails,
          required: false,
          separate: true,
          include: [
            {
              model: Foods
            }
          ]
          // attributes: ["food_id", "orderdetail_total", "orderdetail_price"],
        },
        {
          model: models.Employee,
          attributes: ["emp_name", "emp_lastname", "emp_id", "emp_avatar"],
          include: [
            {
              model: models.EmployeeScore,
              attributes: [
                [
                  sequelize.fn("AVG", sequelize.col("empscore_rating")),
                  "rating"
                ]
              ],
              group: "emp_id",
              order: [[sequelize.fn("AVG", sequelize.col("empscore_rating"))]]
            }
          ]
        },
        {
          model: models.User,
          attributes: ["name", "lastname", "user_id", "avatar"]
        },
        {
          model: models.Restaurant,
          attributes: ["res_id", "res_name", "res_logo", "res_quota"]
        }
      ]
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
  orderHistoryEmployee: async (req, res) => {
    await Orders.findAll({
      where: {
        emp_id: req.decoded.emp_id
      },
      attributes: Object.keys(Orders.attributes).concat([
        [
          sequelize.literal(
            "(SELECT SUM(orderdetails.orderdetail_price * orderdetails.orderdetail_total) FROM orderdetails WHERE orderdetails.order_id = orders.order_id)"
          ),
          "totalPrice"
        ]
      ]),
      include: [
        { model: models.User, attributes: ["name", "lastname"] },
        {
          model: models.Restaurant,
          attributes: ["res_name", "res_lat", "res_lng", "res_quota"]
        },
        {
          model: models.OrderDetail,
          include: [
            {
              model: models.Food
            }
          ]
        }
      ],
      order: [["order_id", "DESC"]]
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
  orderHistoryCustomer: async (req, res) => {
    await Orders.findAll({
      where: {
        user_id: req.decoded.user_id,
        $or: [{ order_status: 4 }, { order_status: 5 }]
      },
      attributes: Object.keys(Orders.attributes).concat([
        [
          sequelize.literal(
            "(SELECT SUM(orderdetails.orderdetail_price  * orderdetails.orderdetail_total) FROM orderdetails WHERE orderdetails.order_id = orders.order_id)"
          ),
          "totalPrice"
        ]
      ]),
      include: [
        {
          model: models.Employee,
          attributes: ["emp_name", "emp_lastname", "emp_avatar"]
        },
        {
          model: models.Restaurant,
          attributes: ["res_name", "res_lat", "res_lng", "res_quota"]
        },
        {
          model: models.OrderDetail,
          separate: true,
          include: [
            {
              model: models.Food
            }
          ]
        }
      ],
      order: [["order_id", "DESC"]]
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
  addNewOrder: async (req, res) => {
    await Orders.findOne({
      where: {
        $and: [
          sequelize.where(
            sequelize.fn("DATE", sequelize.col("created_at")),
            sequelize.literal("CURRENT_DATE")
          )
        ]
      },
      order: [["order_queue", "DESC"]]
    })
      .then(async order => {
        const menu = req.body.menu;
        const dateNow = moment().format("YYYYMMDDhhmmss");
        const orderName = `OD${dateNow}`;
        const orderQueue = order === null ? 1 : order.order_queue + 1;
        const minMinute =
          req.body.min_minute === 0 ? null : req.body.min_minute;
        let orderData = {
          order_name: orderName,
          order_queue: orderQueue,
          order_details:
            req.body.order_details === "" ? null : req.body.order_details,
          min_minute: minMinute,
          user_id: req.decoded.user_id,
          res_id: req.body.res_id,
          rate_id: req.body.rate_id,
          endpoint_name: req.body.endpoint_name,
          endpoint_lat: req.body.endpoint_lat,
          endpoint_lng: req.body.endpoint_lng,
          endpoint_details:
            req.body.endpoint_details === "" ? null : req.body.endpoint_details,
          order_deliveryprice: req.body.order_deliveryprice,
          order_start: req.body.order_start
        };
        await Orders.create(orderData)
          .then(orders => {
            const getOrderID = orders.order_id;
            const getOrderName = orders.order_name;

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
        // res.status(200).json({
        //   message: "success"
        // });
      })
      .catch(err => {
        res.status(500).json({
          message: err,
          status: false
        });
      });
  },
  addNewOrderGuest: async (req, res) => {
    await Orders.findOne({
      where: {
        $and: [
          sequelize.where(
            sequelize.fn("DATE", sequelize.col("created_at")),
            sequelize.literal("CURRENT_DATE")
          )
        ]
      },
      order: [["order_queue", "DESC"]]
    })
      .then(async order => {
        const menu = req.body.menu;
        const dateNow = moment().format("YYYYMMDDhhmmss");
        const orderName = `OD${dateNow}`;
        const orderQueue = order === null ? 1 : order.order_queue + 1;
        const minMinute =
          req.body.min_minute === 0 ? null : req.body.min_minute;
        let orderData = {
          order_name: orderName,
          order_queue: orderQueue,
          order_details:
            req.body.order_details === "" ? null : req.body.order_details,
          min_minute: minMinute,
          user_id: req.body.telephone,
          res_id: req.body.res_id,
          rate_id: req.body.rate_id,
          endpoint_name: req.body.endpoint_name,
          endpoint_lat: req.body.endpoint_lat,
          endpoint_lng: req.body.endpoint_lng,
          endpoint_details:
            req.body.endpoint_details === "" ? null : req.body.endpoint_details,
          order_deliveryprice: req.body.order_deliveryprice,
          order_start: req.body.order_start
        };
        await Orders.create(orderData)
          .then(orders => {
            const getOrderID = orders.order_id;
            const getOrderName = orders.order_name;

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
        // res.status(200).json({
        //   message: "success"
        // });
      })
      .catch(err => {
        res.status(500).json({
          message: err,
          status: false
        });
      });
  },
  updateQueuePrevious: async (req, res) => {
    let promises = [];
    const orderId = req.body.order_id;
    await Orders.findOne({
      where: {
        $and: [
          sequelize.where(
            sequelize.fn("DATE", sequelize.col("created_at")),
            sequelize.literal("CURRENT_DATE")
          )
        ]
      },
      offset: 1,
      order: [["order_id", "DESC"]]
    })
      .then(async order => {
        if (!order) {
          return res.status(200).json({
            message: "Success",
            status: false
          });
        }
        const previousQueue = order.order_queue + 1;
        const updatePrevious = await Orders.update(
          { order_queue: previousQueue },
          { where: { order_id: order.order_id } }
        );
        promises = [...promises, updatePrevious];

        const newQueue = order.order_queue - 1;
        const checkQueue = newQueue === 0 ? 1 : newQueue;
        const updateNewQueue = await Orders.update(
          { order_queue: checkQueue },
          { where: { order_id: orderId } }
        );
        promises = [...promises, updateNewQueue];

        Promise.all(promises)
          .then(() => {
            res.status(200).json({
              message: "Success",
              status: true
            });
          })
          .catch(err => {
            res.status(500).json({
              message: err
            });
          });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  updateNextQueue: async (req, res) => {
    let promises = [];
    const orderId = req.body.order_id;
    const orderQueue = req.body.order_queue;
    await Orders.findOne({
      where: {
        $and: [
          sequelize.where(
            sequelize.fn("DATE", sequelize.col("created_at")),
            sequelize.literal("CURRENT_DATE")
          )
        ],
        order_queue: {
          $gt: orderQueue
        }
      }
    })
      .then(async order => {
        if (!order) {
          return res.status(200).json({
            message: "Success",
            status: false
          });
        }
        const previousQueue = order.order_queue - 1;
        const updatePrevious = await Orders.update(
          { order_queue: previousQueue },
          { where: { order_id: order.order_id } }
        );
        promises = [...promises, updatePrevious];

        const newQueue = order.order_queue;
        const updateNewQueue = await Orders.update(
          { order_queue: newQueue },
          { where: { order_id: orderId } }
        );
        promises = [...promises, updateNewQueue];

        Promise.all(promises)
          .then(() => {
            res.status(200).json({
              message: "Success",
              status: true
            });
          })
          .catch(err => {
            res.status(500).json({
              message: err
            });
          });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  updateTimeOut: async (req, res) => {
    const timeout = req.body.timeout;
    const orderId = req.body.order_id;
    const foodPrice = req.body.foodprice;
    await Orders.update(
      {
        order_timeout: timeout
      },
      {
        where: {
          order_id: orderId
        }
      }
    )
      .then(async () => {
        await Orders.findOne({
          where: {
            order_id: orderId
          }
        })
          .then(async order => {
            await models.Restaurant.findOne({
              where: {
                res_id: order.res_id
              }
            })
              .then(async restaurant => {
                const rate = restaurant.res_quota;
                const data = {
                  inc_rate: rate,
                  inc_total: (foodPrice * rate) / 100,
                  inc_status: 0,
                  order_id: orderId,
                  emp_id: req.decoded.emp_id
                };
                await models.Income.create(data)
                  .then(() => {
                    res.status(200).json({
                      message: "Success",
                      status: true
                    });
                  })
                  .catch(err => {
                    res.status(500).json({
                      message: err
                    });
                  });
              })
              .catch(err => {
                res.status(500).json({
                  message: err
                });
              });
          })
          .catch(err => {
            res.status(500).json({
              message: err
            });
          });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  updateScoreEmployeeAfterDelivered: async (req, res) => {
    const data = {
      empscore_rating: req.body.rating,
      empscore_comment: req.body.comment == "" ? null : req.body.comment,
      user_id: req.body.user_id,
      emp_id: req.body.emp_id
    };
    await models.EmployeeScore.create(data)
      .then(empscore => {
        Orders.update(
          {
            empscore_id: empscore.empscore_id
          },
          {
            where: {
              order_id: req.body.order_id
            }
          }
        )
          .then(() => {
            res.status(200).json({
              message: "Success",
              status: true
            });
          })
          .catch(err => {
            res.status(500).json({
              message: err
            });
          });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  updateScoreRestaurantAfterDelivered: async (req, res) => {
    const data = {
      resscore_rating: req.body.rating,
      resscore_comment: req.body.comment == "" ? null : req.body.comment,
      user_id: req.body.user_id,
      res_id: req.body.res_id
    };
    await models.RestaurantScore.create(data)
      .then(resscore => {
        Orders.update(
          {
            resscore_id: resscore.resscore_id
          },
          {
            where: {
              order_id: req.body.order_id
            }
          }
        )
          .then(() => {
            res.status(200).json({
              message: "Success",
              status: true
            });
          })
          .catch(err => {
            res.status(500).json({
              message: err
            });
          });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getCustomerUsedTotalByDay: async (req, res) => {
    const resId = req.params.resId;
    const date = req.params.date;
    const startdate = moment(date, "YYYY-MM-DD").toDate();
    const enddate = moment(date, "YYYY-MM-DD")
      .add(1, "days")
      .toDate();
    await Orders.count({
      where: {
        res_id: resId,
        order_status: 4,
        created_at: {
          $between: [startdate, enddate]
        }
      }
    })
      .then(total => {
        res.status(200).json({
          message: "Success",
          total: total
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getCustomerUsedTotalByMonth: async (req, res) => {
    const resId = req.params.resId;
    const date = req.params.date;
    const startdate = moment(date, "YYYY-MM-DD")
      .set("date", 1)
      .toDate();
    const enddate = moment(date, "YYYY-MM-DD")
      .set("date", 1)
      .add(1, "M")
      .toDate();
    await Orders.count({
      where: {
        res_id: resId,
        order_status: 4,
        created_at: {
          $between: [startdate, enddate]
        }
      }
    })
      .then(total => {
        res.status(200).json({
          message: "Success",
          total: total
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getCustomerUsedTotalByYear: async (req, res) => {
    const resId = req.params.resId;
    const date = req.params.date;
    const startdate = moment(date, "YYYY-MM-DD")
      .set("date", 1)
      .set("months", 0)
      .toDate();
    const enddate = moment(date, "YYYY-MM-DD")
      .set("date", 1)
      .set("months", 0)
      .add(1, "year")
      .toDate();
    await Orders.count({
      where: {
        res_id: resId,
        order_status: 4,
        created_at: {
          $between: [startdate, enddate]
        }
      }
    })
      .then(total => {
        res.status(200).json({
          message: "Success",
          total: total
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getCustomerUsedTotalByRange: async (req, res) => {
    const resId = req.params.resId;
    const date = req.params.date;
    const enddate = moment(req.params.enddate).add(1, "day");
    const parseEndDate = moment(enddate).format("YYYY-MM-DD");

    await Orders.count({
      where: {
        res_id: resId,
        order_status: 4,
        created_at: {
          $gte: date,
          $lte: parseEndDate
        }
      },
      attributes: [
        [
          sequelize.fn(`date_format`, sequelize.col("created_at"), "%Y-%m-%d"),
          "date"
        ],
        [sequelize.literal(`COUNT(*)`), "count"]
      ],
      group: ["date"]
    })
      .then(total => {
        res.status(200).json({
          message: "Success",
          total: total
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

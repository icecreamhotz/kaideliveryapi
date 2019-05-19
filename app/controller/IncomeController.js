const models = require("../model");
const moment = require("moment");
const sequelize = require("sequelize");

const Incomes = models.Income;

const incomes = {
  getIncomeByEmployee: async (req, res) => {
    await models.Employee.findAll({
      attributes: [
        "emp_id",
        "emp_name",
        "emp_lastname",
        "emp_telephone",
        "emp_idcard",
        "emp_avatar",
        [
          sequelize.literal(
            "(SELECT SUM(inc_total) FROM incomes WHERE employees.emp_id = incomes.emp_id)"
          ),
          "Incomes"
        ],
        [
          sequelize.literal(
            "(SELECT SUM(inc_total) FROM incomes WHERE inc_status = 0 AND employees.emp_id = incomes.emp_id)"
          ),
          "Debt"
        ],
        [
          sequelize.literal(
            "(SELECT SUM(inc_total) FROM incomes WHERE inc_status = 1 AND employees.emp_id = incomes.emp_id)"
          ),
          "Payed"
        ]
      ],
      include: [
        {
          model: Incomes,
          include: [
            {
              model: models.Order,
              attributes: ["order_name", "order_price", "order_discount"],
              where: {
                order_status: 4
              }
            }
          ]
        }
      ]
    })
      .then(incomes => {
        res.status(200).json({
          message: "Success",
          data: incomes
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getOnlyPayed: async (req, res) => {
    await models.Employee.findAll({
      attributes: [
        "emp_id",
        "emp_name",
        "emp_lastname",
        "emp_telephone",
        "emp_idcard",
        "emp_avatar",
        [
          sequelize.literal(
            "(SELECT SUM(inc_total) FROM incomes WHERE employees.emp_id = incomes.emp_id)"
          ),
          "Incomes"
        ],
        [
          sequelize.literal(
            "(SELECT SUM(inc_total) FROM incomes WHERE inc_status = 0 AND employees.emp_id = incomes.emp_id)"
          ),
          "Debt"
        ],
        [
          sequelize.literal(
            "(SELECT SUM(inc_total) FROM incomes WHERE inc_status = 1 AND employees.emp_id = incomes.emp_id)"
          ),
          "Payed"
        ]
      ],
      include: [
        {
          model: Incomes,
          required: false,
          include: [
            {
              model: models.Order,
              attributes: ["order_name", "order_price", "order_discount"],
              where: {
                order_status: 4
              }
            }
          ],
          where: {
            inc_status: 1
          }
        }
      ]
    })
      .then(incomes => {
        res.status(200).json({
          message: "Success",
          data: incomes
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getOnlyDebt: async (req, res) => {
    await models.Employee.findAll({
      attributes: [
        "emp_id",
        "emp_name",
        "emp_lastname",
        "emp_telephone",
        "emp_idcard",
        "emp_avatar",
        [
          sequelize.literal(
            "(SELECT SUM(inc_total) FROM incomes WHERE employees.emp_id = incomes.emp_id)"
          ),
          "Incomes"
        ],
        [
          sequelize.literal(
            "(SELECT SUM(inc_total) FROM incomes WHERE inc_status = 0 AND employees.emp_id = incomes.emp_id)"
          ),
          "Debt"
        ],
        [
          sequelize.literal(
            "(SELECT SUM(inc_total) FROM incomes WHERE inc_status = 1 AND employees.emp_id = incomes.emp_id)"
          ),
          "Payed"
        ]
      ],
      include: [
        {
          model: Incomes,
          required: false,
          include: [
            {
              model: models.Order,
              attributes: ["order_name", "order_price", "order_discount"],
              where: {
                order_status: 4
              }
            }
          ],
          where: {
            inc_status: 0
          }
        }
      ]
    })
      .then(incomes => {
        res.status(200).json({
          message: "Success",
          data: incomes
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getIncomesByRange: async (req, res) => {
    const date = req.params.date;
    const enddate = moment(req.params.enddate).add(1, "day");
    const parseEndDate = moment(enddate).format("YYYY-MM-DD");
    await models.Employee.findAll({
      attributes: [
        "emp_id",
        "emp_name",
        "emp_lastname",
        "emp_telephone",
        "emp_idcard",
        "emp_avatar",
        [
          sequelize.literal(
            "(SELECT SUM(inc_total) FROM incomes WHERE employees.emp_id = incomes.emp_id)"
          ),
          "Incomes"
        ],
        [
          sequelize.literal(
            "(SELECT SUM(inc_total) FROM incomes WHERE inc_status = 0 AND employees.emp_id = incomes.emp_id)"
          ),
          "Debt"
        ],
        [
          sequelize.literal(
            "(SELECT SUM(inc_total) FROM incomes WHERE inc_status = 1 AND employees.emp_id = incomes.emp_id)"
          ),
          "Payed"
        ]
      ],
      include: [
        {
          model: Incomes,
          required: false,
          include: [
            {
              model: models.Order,
              attributes: ["order_name", "order_price", "order_discount"],
              where: {
                order_status: 4
              }
            }
          ],
          where: {
            created_at: {
              $gte: date,
              $lte: parseEndDate
            }
          }
        }
      ]
    })
      .then(incomes => {
        res.status(200).json({
          message: "Success",
          data: incomes
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getIncomeListByDay: async (req, res) => {
    const date = req.params.date;
    const enddate = moment(date)
      .add(1, "days")
      .format("YYYY-MM-DD");
    await models.Employee.findAll({
      attributes: [
        "emp_id",
        "emp_name",
        "emp_lastname",
        [
          sequelize.literal(
            `(SELECT coalesce(SUM(inc_total),0) FROM incomes WHERE employees.emp_id = incomes.emp_id AND incomes.created_at between '${date}' and '${enddate}')`
          ),
          "Incomes"
        ],
        [
          sequelize.literal(
            `(SELECT coalesce(SUM(inc_total),0) FROM incomes WHERE inc_status = 0 AND employees.emp_id = incomes.emp_id AND incomes.created_at between '${date}' and '${enddate}')`
          ),
          "Debt"
        ],
        [
          sequelize.literal(
            `(SELECT coalesce(SUM(inc_total),0) FROM incomes WHERE inc_status = 1 AND employees.emp_id = incomes.emp_id AND incomes.created_at between '${date}' and '${enddate}')`
          ),
          "Payed"
        ]
      ],
      include: [
        {
          model: Incomes,
          attributes: [],
          where: {
            created_at: {
              $between: [date, enddate]
            }
          },
          required: false
        }
      ],
      order: [["emp_id", "ASC"]],
      group: "emp_id"
    })
      .then(incomes => {
        res.status(200).json({
          message: "Success",
          data: incomes
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getIncomeListByMonth: async (req, res) => {
    const date = req.params.date;
    const startdate = moment(date)
      .set("date", 1)
      .format("YYYY-MM-DD");
    const enddate = moment(date)
      .set("date", 1)
      .add(1, "M")
      .format("YYYY-MM-DD");
    await models.Employee.findAll({
      attributes: [
        "emp_id",
        "emp_name",
        "emp_lastname",
        [
          sequelize.literal(
            `(SELECT coalesce(SUM(inc_total),0) FROM incomes WHERE employees.emp_id = incomes.emp_id AND incomes.created_at between '${startdate}' and '${enddate}')`
          ),
          "Incomes"
        ],
        [
          sequelize.literal(
            `(SELECT coalesce(SUM(inc_total),0) FROM incomes WHERE inc_status = 0 AND employees.emp_id = incomes.emp_id AND incomes.created_at between '${startdate}' and '${enddate}')`
          ),
          "Debt"
        ],
        [
          sequelize.literal(
            `(SELECT coalesce(SUM(inc_total),0) FROM incomes WHERE inc_status = 1 AND employees.emp_id = incomes.emp_id AND incomes.created_at between '${startdate}' and '${enddate}')`
          ),
          "Payed"
        ]
      ],
      include: [
        {
          model: Incomes,
          attributes: [],
          where: {
            created_at: {
              $between: [startdate, enddate]
            }
          },
          required: false
        }
      ],
      order: [["emp_id", "ASC"]]
    })
      .then(incomes => {
        res.status(200).json({
          message: "Success",
          data: incomes
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getIncomeListByYear: async (req, res) => {
    const date = req.params.date;
    const startdate = moment(date)
      .set("date", 1)
      .set("months", 0)
      .format("YYYY-MM-DD");
    const enddate = moment(date)
      .set("date", 1)
      .set("months", 0)
      .add(1, "year")
      .format("YYYY-MM-DD");
    await models.Employee.findAll({
      attributes: [
        "emp_id",
        "emp_name",
        "emp_lastname",
        [
          sequelize.literal(
            `(SELECT coalesce(SUM(inc_total),0) FROM incomes WHERE employees.emp_id = incomes.emp_id AND incomes.created_at between '${startdate}' and '${enddate}')`
          ),
          "Incomes"
        ],
        [
          sequelize.literal(
            `(SELECT coalesce(SUM(inc_total),0) FROM incomes WHERE inc_status = 0 AND employees.emp_id = incomes.emp_id AND incomes.created_at between '${startdate}' and '${enddate}')`
          ),
          "Debt"
        ],
        [
          sequelize.literal(
            `(SELECT coalesce(SUM(inc_total),0) FROM incomes WHERE inc_status = 1 AND employees.emp_id = incomes.emp_id AND incomes.created_at between '${startdate}' and '${enddate}')`
          ),
          "Payed"
        ]
      ],
      include: [
        {
          model: Incomes,
          attributes: [],
          where: {
            created_at: {
              $between: [startdate, enddate]
            }
          },
          required: false
        }
      ],
      order: [["emp_id", "ASC"]]
    })
      .then(incomes => {
        res.status(200).json({
          message: "Success",
          data: incomes
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  updateSuccessStatus: async (req, res) => {
    await Incomes.update(
      {
        inc_status: 1
      },
      {
        where: {
          inc_id: req.body.inc_id
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
  },
  updateProcessStatus: async (req, res) => {
    await Incomes.update(
      {
        inc_status: 0
      },
      {
        where: {
          inc_id: req.body.inc_id
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
  }
};

module.exports = incomes;

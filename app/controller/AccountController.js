const models = require("../model");
const moment = require("moment");
const sequelize = require("sequelize");

const Accounts = models.Account;

const account = {
  addNewAccountList: async (req, res) => {
    const data = {
      acc_name: req.body.name,
      acc_details: req.body.details,
      acc_price: req.body.price,
      acc_date: req.body.date,
      emp_id: req.decoded.emp_id
    };
    await Accounts.create(data)
      .then(() => {
        res.status(200).json({
          message: "success",
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
  editAccountListById: async (req, res) => {
    const data = {
      acc_name: req.body.name,
      acc_details: req.body.details,
      acc_price: req.body.price,
      acc_date: req.body.date,
      emp_id: req.decoded.emp_id
    };
    await Accounts.update(data, {
      where: {
        acc_id: req.body.id,
        emp_id: req.decoded.emp_id
      }
    })
      .then(() => {
        res.status(200).json({
          message: "success",
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
  deleteAccountListById: async (req, res) => {
    await Accounts.destroy({
      where: {
        acc_id: req.body.id,
        emp_id: req.decoded.emp_id
      }
    })
      .then(() => {
        res.status(200).json({
          message: "success",
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
  getAllAccountListById: async (req, res) => {
    await Accounts.findAll({
      where: {
        emp_id: req.decoded.emp_id
      },
      attributes: [
        ["acc_id", "id"],
        ["acc_name", "name"],
        ["acc_details", "details"],
        ["acc_date", "date"],
        ["acc_price", "price"],
        "emp_id"
      ],
      order: [["acc_date", "ASC"]]
    })
      .then(accounts => {
        res.status(200).json({
          message: "success",
          data: accounts
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err,
          status: false
        });
      });
  },
  getAccountListByDay: async (req, res) => {
    // const empId = req.decoded.emp_id;
    const date = req.params.date;
    const startdate = moment(date, "YYYY-MM-DD").toDate();
    const enddate = moment(date, "YYYY-MM-DD")
      .add(1, "days")
      .toDate();
    await Accounts.findOne({
      where: {
        emp_id: req.decoded.emp_id,
        acc_date: {
          $between: [startdate, enddate]
        }
      },
      attributes: [
        "acc_date",
        [sequelize.fn("SUM", sequelize.col("acc_price")), "total"]
      ]
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
  getAccountListByMonth: async (req, res) => {
    // const empId = req.decoded.emp_id;
    const date = req.params.date;
    const startdate = moment(date, "YYYY-MM-DD")
      .set("date", 1)
      .toDate();
    const enddate = moment(date, "YYYY-MM-DD")
      .set("date", 1)
      .add(1, "M")
      .toDate();
    await Accounts.findOne({
      where: {
        emp_id: req.decoded.emp_id,
        acc_date: {
          $between: [startdate, enddate]
        }
      },
      attributes: [
        [sequelize.fn("SUM", sequelize.col("acc_price")), "total"],
        [
          sequelize.fn(`date_format`, sequelize.col("acc_date"), "%Y-%m"),
          "date"
        ]
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
  },
  getAccountListByYear: async (req, res) => {
    // const empId = req.decoded.emp_id;
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
    await Accounts.findOne({
      where: {
        emp_id: req.decoded.emp_id,
        acc_date: {
          $between: [startdate, enddate]
        }
      },
      attributes: [
        [sequelize.fn("SUM", sequelize.col("acc_price")), "total"],
        [sequelize.fn(`date_format`, sequelize.col("acc_date"), "%Y"), "date"]
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
  },
  getAccountsByRange: async (req, res) => {
    const date = req.params.date;
    const enddate = moment(req.params.enddate).add(1, "day");
    const parseEndDate = moment(enddate).format("YYYY-MM-DD");

    await Accounts.findAll({
      where: {
        emp_id: req.decoded.emp_id,
        acc_date: {
          $gte: date,
          $lte: parseEndDate
        }
      },
      attributes: [
        ["acc_id", "id"],
        ["acc_name", "name"],
        ["acc_details", "details"],
        ["acc_date", "date"],
        ["acc_price", "price"],
        "emp_id"
      ]
    })
      .then(acc => {
        res.status(200).json({
          message: "Success",
          data: acc
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  test: async (req, res) => {
    await models.sequelize
      .query(
        "select * from accounts union select * from expenses order by acc_date ASC LIMIT 1"
      )
      .then(function(rows) {
        console.log(rows.length);
        res.status(200).json({
          message: "Success",
          total: rows
        });
      });
  }
};

module.exports = account;

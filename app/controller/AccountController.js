const models = require("../model");
const moment = require("moment");
const sequelize = require("sequelize");

const Accounts = models.Account;

const account = {
  addNewAccountList: async (req, res) => {
    const data = {
      acc_name: req.body.accName,
      acc_details: req.body.accDetails,
      acc_price: req.body.accPrice,
      acc_date: req.body.accDate,
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
      acc_name: req.body.accName,
      acc_details: req.body.accDetails,
      acc_price: req.body.accPrice,
      acc_date: req.body.accDate,
      emp_id: req.decoded.emp_id
    };
    await Accounts.update(data, {
      where: {
        acc_id: req.body.accId,
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
        acc_id: req.body.accId,
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
      }
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
        emp_id: 17,
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
        emp_id: 17,
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
        emp_id: 17,
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
  }
};

module.exports = account;

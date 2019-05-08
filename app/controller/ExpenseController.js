const models = require("../model");
const moment = require("moment");
const sequelize = require("sequelize");

const Expenses = models.Expense;

const expense = {
  addNewExpenseList: async (req, res) => {
    const data = {
      exp_name: req.body.extName,
      exp_details: req.body.expDetails,
      exp_date: req.body.expDate,
      exp_price: req.body.expPrice,
      emp_id: req.decoded.emp_id
    };
    await Expenses.create(data)
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
  editExpenseListById: async (req, res) => {
    const data = {
      exp_name: req.body.extName,
      exp_details: req.body.expDetails,
      exp_date: req.body.expDate,
      exp_price: req.body.expPrice,
      emp_id: req.decoded.emp_id
    };
    await Expenses.update(data, {
      where: {
        exp_id: req.body.expId,
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
  deleteExpenseListById: async (req, res) => {
    await Expenses.destroy({
      where: {
        exp_id: req.body.expId,
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
  getAllExpenseListById: async (req, res) => {
    await Expenses.findAll({
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
  getExpenseListByDay: async (req, res) => {
    // const empId = req.decoded.emp_id;
    const date = req.params.date;
    const startdate = moment(date, "YYYY-MM-DD").toDate();
    const enddate = moment(date, "YYYY-MM-DD")
      .add(1, "days")
      .toDate();
    await Expenses.findOne({
      where: {
        emp_id: 17,
        exp_date: {
          $between: [startdate, enddate]
        }
      },
      attributes: [
        "exp_date",
        [sequelize.fn("SUM", sequelize.col("exp_price")), "total"]
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
  getExpenseListByMonth: async (req, res) => {
    // const empId = req.decoded.emp_id;
    const date = req.params.date;
    const startdate = moment(date, "YYYY-MM-DD")
      .set("date", 1)
      .toDate();
    const enddate = moment(date, "YYYY-MM-DD")
      .set("date", 1)
      .add(1, "M")
      .toDate();
    await Expenses.findOne({
      where: {
        emp_id: 17,
        exp_date: {
          $between: [startdate, enddate]
        }
      },
      attributes: [
        "exp_date",
        [sequelize.fn("SUM", sequelize.col("exp_price")), "total"]
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
  getExpenseListByYear: async (req, res) => {
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
    await Expenses.findOne({
      where: {
        emp_id: 17,
        exp_date: {
          $between: [startdate, enddate]
        }
      },
      attributes: [
        "exp_date",
        [sequelize.fn("SUM", sequelize.col("exp_price")), "total"]
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
  }
};

module.exports = expense;

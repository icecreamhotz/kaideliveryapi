const models = require("../model");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const sharp = require("sharp");
const fs = require("fs");
const request = require("request");
const { promisify } = require("util");
const path = require("path");
const helperEmployee = require("../helper/employee");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
/******************* provider image  ********************/
const dirName = path.dirname(require.main.filename);
const pathName = `${dirName}/public/images/employees/`;

let avatarName = null;

const readdir = promisify(fs.exists);
const unlinkdir = promisify(fs.unlink);
const writefiledir = promisify(fs.writeFile);

sharp.cache(false);

const writeImage = path => {
  return new Promise((resolve, reject) => {
    sharp(path)
      .resize(150, 150)
      .toBuffer(async (err, buffer) => {
        if (err) return reject(err);
        await writefiledir(path, buffer);
        resolve();
      });
  });
};

const settingImage = async (logo, file) => {
  if (logo !== null) {
    try {
      const checkFile = await readdir(pathName + logo);
      if (checkFile) {
        if (file) {
          await unlinkdir(pathName + logo);
          await writeImage(file.path);
          avatarName = file.filename;
        } else {
          await unlinkdir(pathName + logo);
        }
      }
    } catch (err) {
      res.json({
        message: err
      });
    }
  } else {
    if (file) {
      await writeImage(file.path);
      avatarName = file.filename;
    }
  }
};

const Employees = models.Employee;

const employees = {
  getEmployeeInfo: async (req, res) => {
    await Employees.findByPk(req.decoded.emp_id)
      .then(emp =>
        res.status(200).json({
          message: "success",
          data: emp
        })
      )
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  },
  getAllEmployee: async (req, res) => {
    await Employees.findAll({
      attributes: [
        "emp_id",
        "emp_username",
        "emp_name",
        "emp_lastname",
        "emp_idcard",
        "emp_telephone",
        "emp_address",
        "emp_verified",
        "emp_avatar",
        "emptype_id",
        [
          Sequelize.literal(
            "(SELECT AVG(employeescores.empscore_rating) FROM employeescores WHERE employeescores.emp_id=employees.emp_id)"
          ),
          "rating"
        ]
      ],
      where: {
        emp_id: {
          [Op.ne]: req.decoded.emp_id
        }
      },
      order: [["emp_id", "ASC"]]
    })
      .then(emp =>
        res.status(200).json({
          message: "success",
          data: emp
        })
      )
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  },
  insertEmployee: (req, res) => {
    bcrypt.hash(req.body.emp_password, 10, async (err, hash) => {
      if (err) {
        return res.status(500).json({
          error: err
        });
      } else {
        if (req.file) {
          await settingImage(null, req.file);
        }

        const employee = {
          emp_username: req.body.emp_username,
          emp_password: hash,
          emp_name: req.body.emp_name,
          emp_lastname: req.body.emp_lastname,
          emp_idcard: req.body.emp_idcard,
          emp_telephone: req.body.emp_telephone,
          emp_address: req.body.emp_address,
          emptype_id: req.body.emptype_id,
          emp_avatar: avatarName !== null ? avatarName : null,
          emp_verified: req.body.emp_verified
        };
        await Employees.create(employee)
          .then(result => {
            avatarName = null;
            res.status(200).json({
              message: "success"
            });
          })
          .catch(err => {
            res.status(500).json({
              error: err
            });
          });
      }
    });
  },
  updateById: (req, res) => {
    Employees.findByPk(req.decoded.emp_id, {
      attributes: ["emp_avatar"]
    })
      .then(async emp => {
        avatarName = emp.emp_avatar;

        if (req.file) {
          await settingImage(avatarName, req.file);
        }

        const employee = {
          emp_name: req.body.emp_name,
          emp_lastname: req.body.emp_lastname,
          emp_idcard: req.body.emp_idcard,
          emp_telephone: req.body.emp_telephone,
          emp_address: req.body.emp_address,
          emp_avatar: avatarName !== null ? avatarName : null
        };

        await Employees.update(employee, {
          where: {
            emp_id: req.decoded.emp_id
          }
        })
          .then(result => {
            avatarName = null;
            res.status(200).json({
              message: "update success",
              status: true
            });
          })
          .catch(err => {
            res.status(401).json({
              message: err
            });
          });
      })
      .catch(err => {
        res.status(401).json({
          message: err
        });
      });
  },
  updateEmployee: (req, res) => {
    Employees.findByPk(req.body.emp_id, {
      attributes: ["emp_avatar", "emp_password"]
    })
      .then(async emp => {
        let password = emp.emp_password;
        avatarName = emp.emp_avatar;

        if (req.body.emp_password) {
          password = bcrypt.hashSync(req.body.emp_password, 10);
        }

        if (req.file) {
          await settingImage(avatarName, req.file);
        }

        const employee = {
          emp_username: req.body.emp_username,
          emp_password: password,
          emp_name: req.body.emp_name,
          emp_lastname: req.body.emp_lastname,
          emp_idcard: req.body.emp_idcard,
          emp_telephone: req.body.emp_telephone,
          emp_address: req.body.emp_address,
          emptype_id: req.body.emptype_id,
          emp_avatar: avatarName !== null ? avatarName : null
        };

        await Employees.update(employee, {
          where: {
            emp_id: req.body.emp_id
          }
        })
          .then(result => {
            avatarName = null;
            res.status(200).json({
              message: "update success",
              status: true
            });
          })
          .catch(err => {
            res.status(401).json({
              message: err
            });
          });
      })
      .catch(err => {
        res.status(401).json({
          message: err
        });
      });
  },
  updatePasswordById: (req, res) => {
    bcrypt.hash(req.body.emp_password, 10, (err, hash) => {
      if (err) {
        return res.status(500).json({
          message: err
        });
      }
      Employees.update(
        {
          emp_password: hash
        },
        {
          where: {
            emp_id: req.decoded.emp_id
          }
        }
      ).then(result => {
        res.status(200).json({
          message: "reset password complete"
        });
      });
    });
  },
  loginEmployee: async (req, res) => {
    const emp = await Employees.findOne({
      attributes: ["emp_id", "emp_password", "emptype_id"],
      where: { emp_username: req.body.emp_username }
    });
    if (emp) {
      const match = await bcrypt.compare(
        req.body.emp_password,
        emp.emp_password
      );
      if (!match) {
        return res.status(200).json({
          status: false,
          data: null,
          message: "Please check username or password."
        });
      }
      const response = helperEmployee.loginJWT(emp);
      return res.status(200).json({
        status: true,
        message: "Login successful.",
        data: response
      });
    } else {
      res.status(200).json({
        message: "Please check username or password.",
        status: false
      });
    }
  },
  deleteEmployee: async (req, res) => {
    await Employees.destroy({
      where: {
        emp_id: req.body.emp_id
      }
    })
      .then(async result => {
        const image = req.body.emp_avatar;
        for (let img of image) {
          await settingImage(img, false);
        }

        res.status(200).json({
          message: "Delete complete."
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  checkUsername: async (req, res) => {
    await Employees.findOne({
      attributes: ["emp_username"],
      where: {
        emp_username: req.body.emp_username
      }
    })
      .then(emp => {
        if (emp) return res.status(200).json({ data: true });

        res.status(200).json({
          data: false
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  verifyEmployee: async (req, res) => {
    await Employees.update(
      {
        emp_verified: req.body.emp_verified
      },
      {
        where: {
          emp_id: req.body.emp_id
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
  getEmployeeWorkerStatusNow: async (req, res) => {
    await Employees.count({
      attributes: ["emp_workstatus"],
      where: {
        emp_workstatus: 1
      }
    })
      .then(emp => {
        res.status(200).json({
          data: emp
        });
      })
      .catch(err => {
        res.status(500).json({
          data: err
        });
      });
  },
  changeWorkStatus: async (req, res) => {
    await Employees.update(
      {
        emp_workstatus: req.body.work_status
      },
      {
        where: {
          emp_id: req.decoded.emp_id
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
  getEmployeeIncomeTotalByDay: async (req, res) => {
    const date = req.params.date;
    const startdate = moment(date, "YYYY-MM-DD").toDate();
    const enddate = moment(date, "YYYY-MM-DD")
      .add(1, "days")
      .toDate();
    await models.Order.findAll({
      where: {
        emp_id: 17,
        order_status: 4,
        created_at: {
          $between: [startdate, enddate]
        }
      },
      attributes: [
        [
          Sequelize.fn(`date_format`, Sequelize.col("created_at"), "%Y-%m-%d"),
          "date"
        ],
        [Sequelize.fn("sum", Sequelize.col("order_deliveryprice")), "income"]
      ],
      group: ["date"]
    })
      .then(total => {
        res.status(200).json({
          message: "Success",
          data: total
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getEmployeeIncomeTotalByMonth: async (req, res) => {
    const date = req.params.date;
    const startdate = moment(date, "YYYY-MM-DD")
      .set("date", 1)
      .toDate();
    const enddate = moment(date, "YYYY-MM-DD")
      .set("date", 1)
      .add(1, "M")
      .toDate();
    await models.Order.findAll({
      where: {
        emp_id: 17,
        order_status: 4,
        created_at: {
          $between: [startdate, enddate]
        }
      },
      attributes: [
        [
          Sequelize.fn(`date_format`, Sequelize.col("created_at"), "%Y-%m"),
          "date"
        ],
        [Sequelize.fn("sum", Sequelize.col("order_deliveryprice")), "income"]
      ],
      group: ["date"]
    })
      .then(total => {
        res.status(200).json({
          message: "Success",
          data: total
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getEmployeeIncomeTotalByYear: async (req, res) => {
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
    await models.Order.findAll({
      where: {
        emp_id: 17,
        order_status: 4,
        created_at: {
          $between: [startdate, enddate]
        }
      },
      attributes: [
        [
          Sequelize.fn(`date_format`, Sequelize.col("created_at"), "%Y"),
          "date"
        ],
        [Sequelize.fn("sum", Sequelize.col("order_deliveryprice")), "income"]
      ],
      group: ["date"]
    })
      .then(total => {
        res.status(200).json({
          message: "Success",
          data: total
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getEmployeeIncomeTotalByRange: async (req, res) => {
    const date = req.params.startDate;
    const enddate = moment(req.params.endDate).add(1, "day");
    const parseEndDate = moment(enddate).format("YYYY-MM-DD");

    await models.Order.findAll({
      where: {
        emp_id: 17,
        order_status: 4,
        created_at: {
          $gte: date,
          $lte: parseEndDate
        }
      },
      attributes: [
        [
          Sequelize.fn(`date_format`, Sequelize.col("created_at"), "%Y-%m-%d"),
          "date"
        ],
        [Sequelize.fn("sum", Sequelize.col("order_deliveryprice")), "income"]
      ],
      group: ["date"]
    })
      .then(total => {
        res.status(200).json({
          message: "Success",
          data: total
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getSalaryListByDay: async (req, res) => {
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
          Sequelize.literal(
            `(SELECT coalesce(SUM(order_deliveryprice),0) FROM orders WHERE employees.emp_id = orders.emp_id AND orders.created_at between '${date}' and '${enddate}')`
          ),
          "Salary"
        ]
      ],
      include: [
        {
          model: models.Order,
          attributes: [],
          where: {
            created_at: {
              $between: [date, enddate]
            },
            order_status: 4
          },
          required: false
        }
      ],
      order: [["emp_id", "ASC"]],
      group: "emp_id"
    })
      .then(orders => {
        res.status(200).json({
          message: "Success",
          data: orders
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getSalaryListByMonth: async (req, res) => {
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
          Sequelize.literal(
            `(SELECT coalesce(SUM(order_deliveryprice),0) FROM orders WHERE employees.emp_id = orders.emp_id AND orders.created_at between '${startdate}' and '${enddate}')`
          ),
          "Salary"
        ]
      ],
      include: [
        {
          model: models.Order,
          attributes: [],
          where: {
            created_at: {
              $between: [date, enddate]
            },
            order_status: 4
          },
          required: false
        }
      ],
      order: [["emp_id", "ASC"]],
      group: "emp_id"
    })
      .then(orders => {
        res.status(200).json({
          message: "Success",
          data: orders
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getSalaryListByYear: async (req, res) => {
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
          Sequelize.literal(
            `(SELECT coalesce(SUM(order_deliveryprice),0) FROM orders WHERE employees.emp_id = orders.emp_id AND orders.created_at between '${startdate}' and '${enddate}')`
          ),
          "Salary"
        ]
      ],
      include: [
        {
          model: models.Order,
          attributes: [],
          where: {
            created_at: {
              $between: [date, enddate]
            },
            order_status: 4
          },
          required: false
        }
      ],
      order: [["emp_id", "ASC"]],
      group: "emp_id"
    })
      .then(orders => {
        res.status(200).json({
          message: "Success",
          data: orders
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  }
};

module.exports = employees;

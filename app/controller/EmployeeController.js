const models = require("../model");
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
  getEmployeeById: async (req, res) => {
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
        "emptype_id"
      ],
      where: {
        emp_id: {
          [Op.ne]: req.decoded.emp_id
        }
      }
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
          message: "Please check username or password."
        });
      }
      const response = helperEmployee.loginJWT(emp);
      return res.status(200).json({
        status: true,
        response
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
  }
};

module.exports = employees;

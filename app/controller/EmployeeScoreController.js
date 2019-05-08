const models = require("../model");
const sequelize = require("sequelize");

const EmployeeScores = models.EmployeeScore;

const employeescores = {
  addRatingEmployee: async (req, res) => {
    const score = {
      empscore_rating: req.body.rating,
      empscore_comment: req.body.comment == null ? null : req.body.comment,
      user_id: req.body.user_id,
      emp_id: req.body.emp_id
    };

    await EmployeeScores.create(score)
      .then(result => {
        res.status(200).json({
          message: "success",
          data: result
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getScoreAndCommentEmployee: async (req, res) => {
    const empId = req.params.empId;
    await EmployeeScores.findAll({
      where: {
        emp_id: empId
      },
      include: [
        {
          model: models.User,
          attributes: ["name", "lastname", "user_id", "avatar"]
        },
        {
          model: models.Employee,
          attributes: ["emp_name", "emp_lastname", "emp_id", "emp_avatar"]
        }
      ]
    })
      .then(empscore => {
        res.status(200).json({
          message: "success",
          data: empscore
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  deleteEmployeeScoreAndComment: async (req, res) => {
    const empScoreId = req.body.empScoreId;
    await EmployeeScores.destroy({
      where: {
        empscore_id: empScoreId
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
  }
};

module.exports = employeescores;

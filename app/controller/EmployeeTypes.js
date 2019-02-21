const models = require("../model");

const EmployeeTypes = models.EmployeeType;

const employeetypes = {
  getAllTypes: async (req, res) => {
    await EmployeeTypes.findAll()
      .then(types =>
        res.status(200).json({
          message: "success",
          data: types
        })
      )
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  }
};

module.exports = employeetypes;

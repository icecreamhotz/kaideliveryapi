const models = require("../model");

const ChangeLog = models.ChangeLog;
const Food = models.Food;

const changelog = {
  addNewChangeLog: async (req, res) => {
    const newFoodName = req.body.newFoodName;
    const newFoodPrice = req.body.newFoodPrice;
    const changelogStatus = req.body.changelogStatus;
    const changeLogData = {
      change_id: req.body.changeId,
      old_foodname: req.body.oldFoodName,
      old_foodprice: req.body.oldFoodPrice,
      new_foodname: newFoodName,
      new_foodprice: newFoodPrice,
      changelog_status: changelogStatus
    };
    await ChangeLog.create(changeLogData)
      .then(async changelogs => {
        if (changelogStatus === 1) {
          return await Food.update(
            {
              food_name: newFoodName,
              food_price: newFoodPrice
            },
            {
              where: {
                food_id: req.body.foodId
              }
            }
          )
            .then(foods => {
              res.status(200).json({
                message: "success",
                data: foods
              });
            })
            .catch(err => {
              res.status(500).json({
                message: err
              });
            });
        }
        res.status(200).json({
          message: "success",
          data: changelogs
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  allChangeLog: async (req, res) => {}
};

module.exports = changelog;

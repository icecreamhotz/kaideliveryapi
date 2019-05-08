const models = require("../model");

const ChangeList = models.ChangeList;

const chagelist = {
  addNewChangeList: async (req, res) => {
    const foodId = req.body.food_id;
    const foodName = req.body.food_name;
    const foodNewPrice = req.body.food_newPrice;
    const empId = req.decoded.emp_id;
    await ChangeList.findOne({
      where: {
        food_id: foodId
      }
    })
      .then(async food => {
        if (food) {
          await ChangeList.destroy({ where: { change_id: food.change_id } });
        }
        await ChangeList.create({
          food_id: foodId,
          food_name: foodName,
          food_newprice: foodNewPrice,
          emp_id: empId
        })
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
      })
      .catch(err => {
        res.status(500).json({
          message: err,
          status: false
        });
      });
  },
  allCheckLists: async (req, res) => {
    await models.Restaurant.findAll({
      include: [
        {
          model: models.Food,
          include: [
            {
              model: ChangeList,
              where: {
                change_status: 0
              }
            }
          ]
        }
      ]
    })
      .then(changelists => {
        res.status(200).json({
          message: "success",
          data: changelists
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  updateChangeListStatus: async (req, res) => {
    await ChangeList.update(
      {
        change_status: 1
      },
      {
        where: {
          change_id: req.body.change_id
        }
      }
    )
      .then(changelists => {
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

module.exports = chagelist;

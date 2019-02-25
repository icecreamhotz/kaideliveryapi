const models = require("../model");
const moment = require("moment");

const Rates = models.Rate;

const rate = {
  showAllDeliveryRates: async (req, res) => {
    await Rates.findAll({
      limit: 3,
      order: [["created_at", "desc"]]
    })
      .then(rate => {
        res.status(200).json({
          message: "Success",
          data: rate
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  updateRatesById: async (req, res) => {
    await Rates.update(
      {
        rate_status: 0
      },
      {
        where: {
          rate_status: 1
        }
      }
    )
      .then(async () => {
        await Rates.create({
          rate_kilometers: req.body.rate_kilometers,
          rate_price: req.body.rate_price,
          rate_status: 1,
          rate_details: req.body.rate_details,
          created_at: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss")
        })
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
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  }
};

module.exports = rate;

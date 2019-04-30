const models = require("../model");
const sequelize = require("sequelize");
const User = require("../model/Users");
const sharp = require("sharp"),
  fs = require("fs");
const { promisify } = require("util");
const path = require("path");

const dirName = path.dirname(require.main.filename);
const pathName = `${dirName}/public/images/restaurants/`;

let logoName = null;

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
          logoName = file.filename;
        } else {
          await unlinkdir(pathName + logo);
        }
      }
    } catch (err) {
      console.log(err);
      res.json({
        message: "err"
      });
    }
  } else {
    if (file) {
      await writeImage(file.path);
      logoName = file.filename;
    }
  }
};

const Restaurants = models.Restaurant;

const restaurant = {
  getRestaurantData: async (req, res) => {
    await Restaurants.findAll({
      attributes: Object.keys(Restaurants.attributes).concat([
        [
          sequelize.literal(
            "(SELECT AVG(restaurantscores.resscore_rating) FROM restaurantscores WHERE restaurantscores.res_id=restaurants.res_id)"
          ),
          "rating"
        ]
      ])
    })
      .then(rest => {
        if (!rest)
          return res.status(200).json({
            message: "Success",
            data: []
          });
        res.status(200).json({
          message: "Success",
          data: rest
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getRestaurantWithOwnerData: async (req, res) => {
    await Restaurants.findAll({
      include: [
        {
          model: models.User,
          attributes: ["name", "lastname"],
          required: false
        }
      ]
    })
      .then(rest => {
        if (!rest)
          return res.status(200).json({
            message: "Success",
            data: []
          });

        res.status(200).json({
          message: "Success",
          data: rest
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getRestaurantForManage: async (req, res) => {
    await Restaurants.findAll({
      where: {
        user_id: req.decoded.user_id
      },
      attributes: ["res_id", "res_name"]
    })
      .then(rest => {
        if (!rest)
          return res.status(200).json({
            message: "Success",
            data: []
          });

        res.status(200).json({
          message: "Success",
          data: rest
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getRestaurantDataByName: async (req, res) => {
    await Restaurants.findOne({
      attributes: ["res_id"],
      where: {
        res_name: req.body.res_name,
        user_id: req.decoded.user_id
      }
    })
      .then(rest => {
        if (!rest)
          return res.status(200).json({
            message: "success",
            data: []
          });

        res.status(200).json({
          message: "Success",
          data: rest
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  getRestaurantDataById: async (req, res) => {
    await Restaurants.findOne({
      where: {
        res_id: req.params.restId
      },
      attributes: Object.keys(Restaurants.attributes).concat([
        [
          sequelize.literal(
            "(SELECT AVG(restaurantscores.resscore_rating) FROM restaurantscores WHERE restaurantscores.res_id=restaurants.res_id)"
          ),
          "rating"
        ]
      ])
    })
      .then(rest => {
        if (!rest)
          return res.status(200).json({
            message: "success",
            data: []
          });

        if (rest.res_telephone !== null) {
          rest.res_telephone = JSON.parse(rest.res_telephone);
        } else {
          rest.res_telephone = [];
        }

        if (rest.res_holiday !== null) {
          rest.res_holiday = JSON.parse(rest.res_holiday);
        } else {
          rest.res_holiday = [];
        }

        if (rest.restype_id !== null) {
          rest.restype_id = JSON.parse(rest.restype_id);
        } else {
          rest.restype_id = [];
        }

        res.status(200).json({
          message: "Success",
          data: rest
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  insertRestaurant: async (req, res) => {
    if (req.file) {
      await writeImage(req.file.path);
    }

    await Restaurants.create({
      res_name: req.body.res_name,
      res_logo: req.file ? req.file.filename : null,
      user_id: req.decoded.user_id
    })
      .then(rest => {
        res.status(200).json({
          message: "success",
          data: rest
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  updateRestaurantData: async (req, res) => {
    await Restaurants.findOne({
      where: {
        res_id: req.body.res_id
      },
      attributes: ["res_logo"]
    })
      .then(async rest => {
        if (!rest) {
          if (req.file) {
            await unlinkdir(req.file.path);
          }

          return res.status(200).json({
            message: "Success",
            data: "No data"
          });
        }

        logoName = rest.res_logo;
        console.log(logoName);

        if (req.file) {
          await settingImage(logoName, req.file);
        }

        await Restaurants.update(
          {
            res_name: req.body.res_name,
            res_telephone: req.body.res_telephone,
            res_email: req.body.res_email,
            res_address: req.body.res_address,
            res_details: req.body.res_details,
            res_open: req.body.res_open,
            res_close: req.body.res_close,
            res_holiday: req.body.res_holiday,
            res_lat: req.body.res_lat,
            res_lng: req.body.res_lng,
            restype_id: req.body.res_typesValue,
            res_logo: logoName !== null ? logoName : null
          },
          {
            where: {
              res_id: req.body.res_id
            }
          }
        )
          .then(result => {
            logoName = null;
            res.status(200).json({
              message: "Update complete",
              data: true
            });
          })
          .catch(err => {
            res.status(500).json({
              message: "d"
            });
          });
      })
      .catch(err => {
        res.status(500).json({
          message: "d"
        });
      });
  },
  deleteRestaurantAllData: async (req, res) => {
    await Restaurants.destroy({
      where: {
        res_id: req.body.res_id
      }
    })
      .then(async result => {
        const image = req.body.res_logo;
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
  createRestaurantWithoutOwner: async (req, res) => {
    if (req.file) {
      await writeImage(req.file.path);
    }

    await Restaurants.create({
      res_name: req.body.res_name,
      res_telephone: req.body.res_telephone,
      res_email: req.body.res_email,
      res_address: req.body.res_address,
      res_details: req.body.res_details,
      res_open: req.body.res_open,
      res_close: req.body.res_close,
      res_holiday: req.body.res_holiday,
      res_lat: req.body.res_lat,
      res_lng: req.body.res_lng,
      restype_id: req.body.restype_id,
      res_logo: req.file ? req.file.filename : null,
      user_id: null
    })
      .then(rest => {
        res.status(200).json({
          message: rest
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  },
  verifyRestaurant: async (req, res) => {
    await Restaurants.update(
      {
        res_status: req.body.res_status
      },
      {
        where: {
          res_id: req.body.res_id
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
  getRestaurantOpenNow: async (req, res) => {
    await Restaurants.findAll({
      where: {
        res_status: "1"
      }
    })
      .then(rest => {
        if (!rest)
          return res.status(200).json({
            message: "Success",
            data: []
          });

        res.status(200).json({
          message: "Success",
          data: rest
        });
      })
      .catch(err => {
        res.status(500).json({
          message: err
        });
      });
  }
};

module.exports = restaurant;

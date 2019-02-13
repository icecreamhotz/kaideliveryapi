const Restaurants = require("../model/Restaurants");
const Foods = require("../model/Foods");
const sharp = require("sharp"),
  fs = require("fs"),
  moment = require("moment");
const { promisify } = require("util");

const path = require("path");

const pathName = path.dirname(require.main.filename) + "/public/images/foods/";

const readdir = promisify(fs.exists);
const unlinkdir = promisify(fs.unlink);
const writefiledir = promisify(fs.writeFile);

sharp.cache(false);

const writeImage = (path, name) => {
  return new Promise((resolve, reject) => {
    sharp(path)
      .resize(300, 300)
      .toFile(pathName + name, async (err, info) => {
        if (err) return reject(err);
        resolve();
      });
  });
};

let imgName = []; // variable for store imagename to database

const insertImage = async (files, res_id, food_total) => {
  for (const [index, file] of files.entries()) {
    let imgNameSave = `food${res_id}_${food_total[index]}.jpg`;
    await writeImage(file.path, imgNameSave);
    imgName = [...imgName, imgNameSave];
  }
};

const settingImage = async (res, imgfile) => {
  if (imgfile !== null) {
    try {
      for (const data of imgfile) {
        const checkFile = await readdir(pathName + data);
        if (checkFile) {
          await unlinkdir(pathName + data);
        }
      }
    } catch (err) {
      res.json({
        message: err
      });
    }
  } else {
    res.json({
      message: false
    });
  }
};

const food = {
  countFoodInRestaurant: async (req, res) => {
    await Foods.count().then(total => {
      return res.status(200).json({
        message: "Success",
        data: total
      });
    });
  },
  countMyFoodsInRestaurant: async (req, res) => {
    await Foods.count({
      where: {
        food_id: {
          $lt: req.params.foodId
        },
        res_id: req.params.restId
      }
    }).then(total => {
      return res.status(200).json({
        message: "Success",
        data: total
      });
    });
  },
  showFoodsDataByResId: async (req, res) => {
    await Foods.findOne({
      where: {
        food_id: req.params.foodId,
        res_id: req.params.restId
      }
    })
      .then(food => {
        if (!food) {
          return res.status(200).json({
            message: "Success",
            data: "No data"
          });
        }
        return res.status(200).json({
          message: "Success",
          data: food
        });
      })
      .catch(err => {
        res.status(409).json({
          message: err
        });
      });
  },
  showAllFoodsDataByResId: async (req, res) => {
    await Foods.findAll({
      where: {
        res_id: req.body.res_id
      }
    })
      .then(food => {
        if (!food) {
          return res.status(200).json({
            message: "Success",
            data: "No data"
          });
        }
        return res.status(200).json({
          message: "Success",
          data: food
        });
      })
      .catch(err => {
        res.status(409).json({
          message: err
        });
      });
  },
  insertFoodsData: async (req, res) => {
    if (req.files.length > 0) {
      await insertImage(
        req.files,
        req.body.res_id,
        JSON.parse(req.body.food_total)
      );
    }

    await Foods.create({
      food_name: req.body.food_name,
      food_price: req.body.food_price,
      food_img: JSON.stringify(imgName),
      foodtype_id: req.body.foodtype_id,
      res_id: req.body.res_id // dummy res_id
    })
      .then(food => {
        imgName = [];
        res.status(200).json({
          message: "Success",
          data: food
        });
      })
      .catch(err => {
        res.status(409).json({
          message: err
        });
      });
  },
  updateFoodsData: async (req, res) => {
    const food_img = JSON.parse(req.body.food_img);
    const food_total = JSON.parse(req.body.food_total);
    if (req.files) {
      if (req.files.length === 1) {
        const posImg = food_total[0].substr(food_total[0].length - 1);
        console.log(posImg);
        if (posImg === "1") {
          if (food_img[0] !== "") {
            let oldImg = food_img[0];
            let sendOldImg = [oldImg];
            imgName = [...imgName, oldImg];
            await settingImage(res, sendOldImg);
          } else {
            if (food_img[1] !== "") {
              await insertImage(req.files, req.body.res_id, food_total);
              imgName = [...imgName, food_img[1]];
            }
          }
          console.log("yoohoo");
        }
        if (posImg === "2") {
          if (food_img[1] !== "") {
            let oldImg = food_img[1];
            let sendOldImg = [oldImg];
            await settingImage(res, sendOldImg);
            imgName = [...imgName, oldImg];
          } else {
            if (food_img[0] !== "") {
              imgName = [...imgName, food_img[0]];
              await insertImage(req.files, req.body.res_id, food_total);
            }
          }
        }
      } else {
        await settingImage(res, food_img);
        await insertImage(req.files, req.body.res_id, food_total);
      }
    }

    if (food_img[0] !== "" && food_img[1] !== "") {
      imgName = food_img;
    }

    await Foods.update(
      {
        food_name: req.body.food_name,
        food_price: req.body.food_price,
        food_img: JSON.stringify(imgName),
        foodtype_id: req.body.foodtype_id
      },
      {
        where: {
          food_id: req.body.food_id,
          res_id: req.body.res_id
        }
      }
    )
      .then(result => {
        imgName = []; //clear data in imgName
        res.status(200).json({
          message: result
        });
      })
      .catch(err => {
        res.status(409).json({
          message: err
        });
      });
  },
  deleteFoods: async (req, res) => {
    await settingImage(res, req.body.food_image);
    await Foods.destroy({
      where: {
        food_id: req.body.food_id
      }
    })
      .then(() => {
        res.status(200).json({
          message: "Delete complete"
        });
      })
      .catch(err => {
        res.status(409).json({
          message: err
        });
      });
  }
};

module.exports = food;

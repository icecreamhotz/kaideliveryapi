const Restaurants = require('../model/Restaurants')
const Foods = require('../model/Foods')
const sharp = require('sharp'),
    fs = require('fs'),
    moment = require('moment')
const {
    promisify
} = require('util')

const pathName = '../../resource/images/foods/'

const readdir = promisify(fs.exists)
const unlinkdir = promisify(fs.unlink)
const writefiledir = promisify(fs.writeFile)

sharp.cache(false)

const writeImage = async (path, name) => {
    await sharp(path).resize(300, 200).toFile(pathName + name, (err, info) => {
        if (err) throw err
        unlinkdir(path)
    })
}


let imgName = [] // variable for store imagename to database

const insertImage = async (files) => {
    let i = 1
    for (const file of files) {
        let imgNameSave = '45' + i + '_' + moment().format('YYYYMMDDHHmmss') + '.jpg'
        await writeImage(file.path, imgNameSave)
        /*let checkComma = (i == 2) ? '' : ','
        imgName += imgNameSave + checkComma*/
        imgName.push(imgNameSave)
        i++
    }
}

const settingImage = async (imgfile, file) => {
    if (imgfile != null) {
        try {
            for (const data of imgfile) {
                const checkFile = await readdir(pathName + data)
                if (checkFile) {
                    await unlinkdir(pathName + data)
                }
            }

        } catch (err) {
            res.json({
                message: err
            })
        }
    }
}

const food = {
    showFoodsDataByResId: async (req, res) => {
        await Foods.findOne({
                where: {
                    food_id: req.params.foodId,
                    res_id: req.params.restId
                }
            })
            .then((food) => {
                if (!food) {
                    return res.status(200).json({
                        message: 'Success',
                        data: 'No data'
                    })
                }
                return res.status(200).json({
                    message: 'Success',
                    data: food
                })
            })
            .catch((err) => {
                res.status(409).json({
                    message: err
                })
            })
    },
    showAllFoodsDataByResId: async (req, res) => {
        await Foods.findAll({
                where: {
                    res_id: req.params.restId
                }
            })
            .then((food) => {
                if (!food) {
                    return res.status(200).json({
                        message: 'Success',
                        data: 'No data'
                    })
                }
                return res.status(200).json({
                    message: 'Success',
                    data: food
                })
            })
            .catch((err) => {
                res.status(409).json({
                    message: err
                })
            })
    },
    insertFoodsData: async (req, res) => {
        await insertImage(req.files)

        await Foods.create({
                food_name: req.body.food_name,
                food_price: req.body.food_price,
                food_img: JSON.stringify(imgName),
                res_id: 35 // req.session.resId
            })
            .then((food) => {
                imgName = [] //clear data in imgName
                res.status(200).json({
                    message: 'Success',
                    data: food
                })
            })
            .catch((err) => {
                res.status(409).json({
                    message: err
                })
            })
    },
    updateFoodsData: async (req, res) => {
        await Foods.findByPk(req.params.foodId)
            .then(async (food) => {
                if (!food) {
                    if (req.files) {
                        for (const data of req.files) {
                            await unlinkdir(data.path)
                        }
                    }

                    return res.status(200).json({
                        message: 'Success',
                        data: 'No data'
                    })
                }


                if (req.files.length >= 1) {
                    await settingImage(JSON.parse(food.food_img), req.files)
                    await insertImage(req.files)
                    console.log(req.files)
                }

                await Foods.update({
                        food_name: req.body.food_name,
                        food_price: req.body.food_price,
                        food_img: (req.files.length >= 1) ? JSON.stringify(imgName) : food.food_img,
                        res_id: 35 // req.session.resId
                    }, {
                        where: {
                            food_id: food.food_id
                        }
                    })
                    .then((result) => {
                        imgName = [] //clear data in imgName
                        res.status(200).json({
                            message: 'Update complete'
                        })
                    })
                    .catch((err) => {
                        res.status(409).json({
                            message: err
                        })
                    })
            })
            .catch((err) => {
                res.status(409).json({
                    message: err
                })
            })
    }
}

module.exports = food
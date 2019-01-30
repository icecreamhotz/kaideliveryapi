const Restaurants = require('../model/Restaurants')
const Locations = require('../model/Locations')
const sharp = require('sharp'),
    fs = require('fs')
const {
    promisify
} = require('util')
const path = require('path')

const pathName = path.dirname(require.main.filename) + '/public/images/restaurants/'

const readdir = promisify(fs.exists)
const unlinkdir = promisify(fs.unlink)
const writefiledir = promisify(fs.writeFile)

sharp.cache(false)

const writeImage = (path) => {
    sharp(path).resize(150, 150).toBuffer(async (err, buffer) => {
        if (err) throw err
        await writefiledir(path, buffer)
    })
}

let logoName = null
const settingImage = async (logo, file) => {
    if (logo != null) {
        try {
            const checkFile = await readdir(pathName + logo)
            if (checkFile) {
                if (file) {
                    await unlinkdir(pathName + logo)
                    await writeImage(file.path)
                    logoName = file.filename
                }
            }
        } catch (err) {
            res.json({
                message: err
            })
        }
    } else {
        if (file) {
            await writeImage(file.path)
            logoName = file.filename
        }
    }
}

const restaurant = {
    getRestaurantData: async (req, res) => {
        await Restaurants.findAll({
                include: Locations
            })
            .then((rest) => {
                if (!rest) return res.status(200).json({
                    message: 'Success',
                    data: 'No data'
                })
                res.status(200).json({
                    message: 'Success',
                    data: rest
                })
            })
            .catch((err) => {
                res.status(409).json({
                    message: err
                })
            })
    },
    getRestaurantForManage: async (req, res) => {
        await Restaurants.findAll({
                where: {
                    user_id: req.decoded.user_id
                }
            })
            .then((rest) => {
                if (!rest) return res.status(200).json({
                    message: 'Success',
                    data: 'No data.'
                })
                res.status(200).json({
                    message: 'Success',
                    data: rest
                })
            })
            .catch((err) => {
                res.status(409).json({
                    message: err
                })
            })
    },
    getRestaurantDataById: async (req, res) => {
        await Restaurants.findByPk(req.params.restId, {
                include: Locations
            })
            .then((rest) => {
                if (!rest) return res.status(200).json({
                    message: 'Success',
                    data: 'No data'
                })
                res.status(200).json({
                    message: 'Success',
                    data: rest
                })
            })
            .catch((err) => {
                res.status(409).json({
                    message: err
                })
            })
    },
    insertRestaurant: async (req, res) => {
        if (req.file) {
            await writeImage(req.file.path)
        }

        await Restaurants.create({
                res_name: req.body.res_name,
                res_logo: (req.file) ? req.file.filename : null,
                user_id: req.decoded.user_id
            })
            .then((rest) => {
                res.status(200).json({
                    message: rest
                })
            })
            .catch((err) => {
                res.status(409).json({
                    message: err
                })
            })
    },
    updateRestaurantData: async (req, res) => {

        await Restaurants.findByPk(req.params.restId)
            .then(async (rest) => {
                if (!rest) {
                    if (req.file) {
                        await unlinkdir(req.file.path)
                    }

                    return res.status(200).json({
                        message: 'Success',
                        data: 'No data'
                    })
                }

                logoName = rest.res_logo

                if (req.file) {
                    await settingImage(logoName, req.file)
                }

                await Restaurants.update({
                        res_name: req.body.res_name,
                        res_telephone: req.body.res_telephone,
                        res_email: req.body.res_email,
                        res_address: req.body.res_address,
                        res_details: req.body.res_details,
                        res_open: req.body.res_open,
                        res_close: req.body.res_close,
                        res_holiday: req.body.res_holiday,
                        res_status: '0',
                        open_status: '0',
                        res_logo: (logoName != null) ? logoName : null
                    }, {
                        where: {
                            res_id: rest.res_id
                        }
                    })
                    .then((result) => {
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
    },
    deleteRestaurantAllData: async (req, res) => {
        await Restaurants.destroy({
                where: {
                    res_id: req.body.res_id
                }
            })
            .then((result) => {
                if (!result) return res.status(200).json({
                    message: 'Success',
                    data: 'No data'
                })
                Locations.destroy({
                    where: {
                        loc_id: req.body.loc_id
                    }
                })
                res.status(200).json({
                    message: 'Delete succesful'
                })
            })
            .catch((err) => {
                res.status(409).json({
                    message: err
                })
            })
    }
}

module.exports = restaurant
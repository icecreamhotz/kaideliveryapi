const RestaurantTypes = require('../model/RestaurantTypes')


const restaurantTypes = {
    getAllRestaurantTypes: async (req, res) => {
        await RestaurantTypes.findAll({
            attributes: ['restype_id', 'restype_name']
        })
            .then(types => {
                if (!types) return res.status(200).json({
                    message: 'success',
                    data: []
                })
                res.status(200).json({
                    message: 'success',
                    data: types
                })
            })
            .catch(err => {
                res.status(409).json({
                    message: err
                })
            })
    },
    getRestaurantTypesById: async (req, res) => {
        await RestaurantTypes.findByPk(req.params.resTypeId, {
                attributes: ['restype_id', 'restype_name']
            })
            .then(types => {
                if (!types) return res.status(200).json({
                    message: 'success',
                    data: []
                })
                res.status(200).json({
                    message: 'success',
                    data: types
                })
            })
            .catch(err => {
                res.status(409).json({
                    message: err
                })
            })
    },
}
module.exports = restaurantTypes
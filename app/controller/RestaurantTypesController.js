const RestaurantTypes = require('../model/RestaurantTypes')


const restaurantTypes = {
    getAllRestaurantTypes: async (req, res) => {
        await RestaurantTypes.findAll()
            .then(types => {
                if (!types) return res.status(200).json({
                    message: 'success',
                    data: 'No data'
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
    }
}

module.exports = restaurantTypes
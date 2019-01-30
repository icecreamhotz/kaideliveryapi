const express = require('express')
const router = express.Router()
const RestaurantTypes = require('../controller/RestaurantTypesController')

router.get('/', RestaurantTypes.getAllRestaurantTypes)

module.exports = router
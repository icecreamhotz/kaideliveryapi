const Sequelize = require('sequelize')
const sequelize = require('../config/db_connection')

const restaurantType = sequelize.define('restauranttypes', {
    restype_id: {
        type: Sequelize.INTEGER(2),
        primaryKey: true,
        autoIncrement: true
    },
    restype_name: {
        type: Sequelize.STRING(30),
    },
    restype_details: {
        type: Sequelize.STRING(100),
        allowNull: true
    }
}, {
    timestamps: false
})

module.exports = restaurantType
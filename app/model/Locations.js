const Sequelize = require('sequelize')
const sequelize = require('../config/db_connection')

const locations = sequelize.define('locations', {
    loc_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    loc_lat: {
        type: Sequelize.DECIMAL(12, 9)
    },
    loc_lng: {
        type: Sequelize.DECIMAL(12, 9)
    }
}, {
    timestamps: false
})

module.exports = locations
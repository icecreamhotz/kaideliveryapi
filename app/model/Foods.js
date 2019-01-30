const Sequelize = require('sequelize')
const sequelize = require('../config/db_connection')
const restaurants = require('./Restaurants')

const foods = sequelize.define('foods', {
    food_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    food_name: {
        type: Sequelize.STRING
    },
    food_price: {
        type: Sequelize.DECIMAL(4, 2)
    },
    food_img: {
        type: Sequelize.STRING,
        allowNull: true
    },
    res_id: {
        type: Sequelize.INTEGER,
    }
} , {
    timestamps: false
})

foods.belongsTo(restaurants, {targetKey: 'res_id', foreignKey: 'res_id'})

module.exports = foods
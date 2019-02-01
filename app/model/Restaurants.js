const Sequelize = require('sequelize')
const sequelize = require('../config/db_connection')
const locations = require('./Locations')
const users = require('./Users')

const restaurants = sequelize.define('restaurants', {
    res_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    res_name: {
        type: Sequelize.STRING
    },
    res_telephone: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    res_email: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    res_address: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    res_details: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    res_open: {
        type: Sequelize.TIME,
        allowNull: true,
    },
    res_close: {
        type: Sequelize.TIME,
        allowNull: true,
    },
    res_holiday: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    res_status: {
        type: Sequelize.STRING(1)
    },
    user_id: {
        type: Sequelize.INTEGER,
    },
    res_logo: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
    },
    open_status: {
        type: Sequelize.STRING(1),
    },
    resscore_id: {
        type: Sequelize.INTEGER
    },
    res_lat: {
        type: Sequelize.DECIMAL(16, 14),
        allowNull: true,
    },
    res_lng: {
        type: Sequelize.DECIMAL(16, 14),
        allowNull: true,
    },
    restype_id: {
        type: Sequelize.STRING,
        allowNull: true,
    }
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

restaurants.belongsTo(users, {
    targetKey: 'user_id',
    foreignKey: 'user_id'
})

module.exports = restaurants
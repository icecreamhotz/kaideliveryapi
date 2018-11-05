const Sequelize = require('sequelize')
const sequelize = require('../config/db_connection')

const users = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: true
    },
    name: Sequelize.STRING,
    lastname: Sequelize.STRING,
    email: {
        type: Sequelize.STRING,   
        unique: true
    },
    telephone: {
        type: Sequelize.STRING,
        allowNull: true
    },
    address: {
        type: Sequelize.STRING,
        allowNull: true
    },
    provider: {
        type: Sequelize.STRING(1),
        allowNull: true
    },
    provider_id: {
        type: Sequelize.STRING,
        allowNull: true
    },
    avatar: {
        type: Sequelize.STRING,
        allowNull: true
    },
    status: Sequelize.STRING(1),
    resetPasswordToken: {
        type: Sequelize.STRING,
        allowNull: true
    },
    resetPasswordExpired: {
        type: Sequelize.DATE,
        allowNull: true
    },
}, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
})

module.exports = users
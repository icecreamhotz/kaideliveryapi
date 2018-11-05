const express = require('express')
const router = express.Router()
const users = require('../controller/UserController')
const jwtauth = require('../middleware/jwtauth')
const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

router.get('/users/:userId', jwtauth, users.userData)
router.post('/users/signup', users.signUpUsers)
router.post('/users/login', users.loginUsers)
router.post('/users/token', jwtauth, users.refreshToken)
router.post('/users/forgot', users.forgotPassword)
router.post('/users/forgot/:token', users.resetPassword)
router.post('/users/password', users.changePassword)
router.post('/users/update', users.updateData)
router.post('/users/delete', users.deleteData)

module.exports = router
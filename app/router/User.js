const express = require('express')
const router = express.Router()
const users = require('../controller/UserController')
const jwtauth = require('../middleware/jwtauth')
const jwt = require('jsonwebtoken')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const path = require('path')

const multer = require('multer')
const moment = require('moment')

const pathName = path.dirname(require.main.filename) + '/public/images/users/'
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, pathName)
    },
    filename: (req, file, cb) => {
        cb(null, 'user_' + moment().format('YYYYMMDDhhmmss') + '.jpg')
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
})

// router.get('/test', jwtauth, users.test)
router.get('/', users.userAllData)
router.get('/info', jwtauth, users.userDataById)
router.post('/signup', users.signUpUsers)
router.post('/auth/facebook', users.loginFacebook)
router.post('/checkusername', users.checkUsername)
router.post('/checkemail', users.checkEmail)
router.post('/login', users.loginUsers)
router.post('/token', jwtauth, users.refreshToken)
router.post('/forgot', users.forgotPassword)
router.post('/forgot/:token', users.resetPassword)
router.get('/forgot/:token', users.checkResetPasswordToken)
router.post('/password', jwtauth, users.changePassword)
router.post('/update', jwtauth, upload.single('image'), users.updateData)
router.post('/delete', users.deleteData)

module.exports = router
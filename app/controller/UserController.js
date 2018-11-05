const User = require('../model/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const async = require('async')
const crypto = require('crypto')
const nodemailer = require('nodemailer')

const checkUsernameUnique = (usname, res) => {
    User.count({
            attributes: ['username'],
            where: {
                username: usname
            }
        })
        .then(result => {
            if (result != 0) {
                return res.status(409).json({
                    message: 'username exists.'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

const checkEmailUnique = (email, res) => {
    User.count({
            attributes: ['email'],
            where: {
                email: email
            }
        })
        .then(result => {
            if (result != 0) {
                return res.status(409).json({
                    message: 'email exists.'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

const checkTelephoneUnique = (tel, res) => {
    User.count({
            attributes: ['telephone'],
            where: {
                telephone: tel
            }
        })
        .then(result => {
            if (result != 0) {
                return res.status(409).json({
                    message: 'telephone exists.'
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

const insertUser = (req, res) => {
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            return res.status(500).json({
                error: err
            })
        } else {
            const user = {
                username: req.body.username,
                password: hash,
                name: req.body.name,
                lastname: req.body.lastname,
                email: req.body.email,
                telephone: req.body.telephone,
                address: req.body.address
            }
            User.create(user)
                .then(result => {
                    res.status(201).json({
                        message: 'User Created.'
                    })
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({
                        error: err
                    })
                })
        }
    })
}

const users = {
    userData: async (req, res) => {
        if (req.session.userId != req.params.userId) return res.status(401).json({
            message: 'cannot access data.'
        })
        await User.findOne({
            where: {
                id: req.session.userId
            }
        }).then(user => {
            res.status(400).json(user)
        }).catch(err => {
            res.status(500).json({
                message: err
            })
        })
    },
    signUpUsers: async (req, res) => {
        await checkUsernameUnique(req.body.username, res)
        await checkEmailUnique(req.body.email, res)
        await checkTelephoneUnique(req.body.telephone, res)
        await insertUser(req, res)
    },
    loginUsers: async (req, res) => {
        await User.findOne({
                attributes: ['id', 'username', 'password'],
                where: {
                    username: req.body.username
                }
            })
            .then(user => {
                if (!user) {
                    res.status(401).json({
                        message: 'Please check username or password.'
                    })
                    return
                }
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        res.status(401).json({
                            message: 'Please check username or password.'
                        })
                        return
                    }
                    if (result) {
                        req.session.userId = user.id
                        const userdata = {
                            id: user.id,
                            email: user.email
                        }
                        const token = jwt.sign(userdata, process.env.JWT_SECRET, {
                            expiresIn: '1h'
                        })
                        const response = {
                            message: 'Login Successful.',
                            token: token,
                            expiresIn: '3600000'
                        }
                        res.status(200).json(response)
                        return
                    }
                    res.status(401).json({
                        message: 'Please check username or password.'
                    })
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            })
    },
    refreshToken: async (req, res) => {
        await User.findOne({
                attributes: ['id'],
                where: {
                    id: req.session.userId
                }
            })
            .then(user => {
                if (!user) {
                    res.status(401).json({
                        message: 'cannot refresh token'
                    })
                    return
                }
                const userdata = {
                    id: user.id,
                    email: user.email
                }
                const token = jwt.sign(userdata, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                })
                res.status(200).json({
                    message: 'refresh token.',
                    refreshtoken: token,
                    expiresIn: '3600000'
                })
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                })
            })
    },
    changePassword: (req, res) => {
        if (req.body.password == req.body.confirm_password) {
            User.findOne({
                    attributes: ['id'],
                    where: {
                        id: req.session.userId
                    }
                })
                .then((user) => {
                    if (!user) return res.status(409).json({
                        message: 'user not found'
                    })
                    bcrypt.hash(req.body.password, 10, (err, hash) => {
                        if (err) return res.json({
                            message: err
                        })
                        User.update({
                                password: hash
                            }, {
                                where: {
                                    id: user.id
                                }
                            })
                            .then((result) => {
                                res.status(200).json({
                                message: 'reset password complete'
                            })
                        })
                    })
                })
        } else {
            res.json({
                message: 'Passwords not do match.'
            })
        }
    },
    updateData: (req, res) => {
        const user = {
            name: req.body.name,
            lastname: req.body.lastname,
            email: req.body.email,
            telephone: req.body.telephone,
            address: req.body.address,
        }
        User.update(user, {
                where: {
                    id: req.session.userId
                }
            })
            .then((result) => {
                res.status(200).json({
                    message: 'Update success!!'
                })
            })
            .catch((err) => {
                res.status(500).json({
                    message: err
                })
            })
    },
    deleteData: (req, res) => {
        User.destroy({
                where: {
                    id: req.body.id
                }
            })
            .then((result) => {
                res.status(200).json({
                    message: 'Delete complete.'
                })
            })
            .catch((err) => {
                res.status(500).json({
                    message: err
                })
            })
    },
    forgotPassword: (req, res) => {
        async.waterfall([
            (done) => {
                crypto.randomBytes(20, (err, buf) => {
                    let token = buf.toString('hex')
                    done(err, token)
                })
            },
            (token, done) => {
                User.findOne({
                        where: {
                            email: req.body.email
                        }
                    })
                    .then(user => {
                        if (!user) {
                            return res.status(409).json({
                                message: 'email not found.'
                            })
                        }
                        User.update({
                                resetPasswordToken: token,
                                resetPasswordExpired: Date.now() + 3600000
                            }, {
                                where: {
                                    email: req.body.email
                                }
                            })
                            .then(() => {
                                done(null, token, user)
                            })
                    })
                    .catch(err => {
                        res.status(500).json({
                            message: err
                        })
                    })
            },
            (token, user, done) => {
                let smtpTransport = nodemailer.createTransport({
                    host: "smtp-mail.outlook.com",
                    secureConnection: false,
                    port: 587,
                    tls: {
                        ciphers: 'SSLv3'
                    },
                    auth: {
                        user: 'best_dota@hotmail.com',
                        pass: 'jykusijhkiwqbabh'
                    }
                })
                let mailOptions = {
                    to: 'best_dota@hotmail.com',
                    from: 'Kai Delivery',
                    subject: 'Kai Delivery Password Reset',
                    text: 'Please click on the following link, or paste into you browser to complete\n' +
                        'http://localhost:3000/reset/' + token,
                }
                smtpTransport.sendMail(mailOptions, (err) => {
                    if (err) {
                        return res.status(401).json({
                            message: err
                        })
                    }
                    res.status(200).json({
                        message: 'sended email.'
                    })
                    done(err, 'done')
                })
            }
        ], (err) => {
            if (err) return res.status(422).json({
                message: err
            })
        })
    },
    resetPassword: async (req, res) => {
        await User.findOne({
                attributes: ['id'],
                where: {
                    resetPasswordToken: req.params.token,
                    resetPasswordExpired: {
                        [Op.gt]: Date.now()
                    }
                }
            })
            .then((user) => {
                if (!user) {
                    return res.status(401).json({
                        message: 'Password reset token is invalid or has expired.'
                    })
                }
                const password = req.body.password
                const confirm_password = req.body.confirm_password
                if (!password === confirm_password) {
                    return res.json({
                        message: 'Passwords do not match.'
                    })
                }
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) return res.json({
                        message: 'error'
                    })
                    User.update({
                            password: hash,
                            resetPasswordToken: null,
                            resetPasswordExpired: null
                        }, {
                            where: {
                                id: user.id
                            }
                        })
                        .then(() => {
                            res.status(200).json({
                                message: 'updated new password.'
                            })
                        })
                })
            })
            .catch((err) => {
                res.status(500).json({
                    message: err
                })
            })
    }
}

module.exports = users
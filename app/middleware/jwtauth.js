const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    let token

    if(req.headers.authorization) {
        token = req.headers.authorization.split(" ")[1]
    }

    if(token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err) {
                res.status(401).json({
                    message: 'invalid token.'
                })
                return
            } else {
                req.decoded = decoded
                next()
            }
        })
    } else {
        res.status(401).json({
            message: 'No token provided.',
            token: token
        })
    }
}
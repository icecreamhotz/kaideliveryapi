const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const FacebookStrategy = require('passport-facebook').Strategy
const session = require('express-session')

require('dotenv').config()

const app = express()

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization');
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE');
    next();
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(session({ 
    secret: 'd5w3q2cas548548fqw48qwFQWdas55W', 
    resave: false, 
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 3600000
    }
}))
app.use(passport.initialize())
app.use(passport.session())

// api user
app.use('/api/v1', require('./app/router/User'))
app.use(require('./app/router/SocialLogin'))
app.get('/session',(req,res) => {
    console.log(req.session.userId)
})
//

app.listen(3000, () => { console.log('Listening on port 3000....') })
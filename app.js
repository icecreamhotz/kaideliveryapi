const express = require('express')
const bodyParser = require('body-parser')
// const passport = require('passport')
// const cookieParser = require('cookie-parser')
// const FacebookStrategy = require('passport-facebook').Strategy
// const session = require('express-session')
const cors = require('cors')

require('dotenv').config()

const app = express()

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static(__dirname + '/public/images'));

// app.use(function(req, res, next) {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
//     next();
// });

// app.use(cookieParser())
// app.use(session({
//     secret: 'd5w3q2cas548548fqw48qwFQWdas55W',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         secure: false,
//         httpOnly: true,
//         maxAge: 3600000
//     }
// }))
// app.use(passport.initialize())
// app.use(passport.session())

// api user
app.use('/api/v1/users', require('./app/router/User'))
app.use('/api/v1/restaurants', require('./app/router/Restaurant'))
app.use('/api/v1/restauranttypes', require('./app/router/RestaurantTypes'))
app.use('/api/v1/foods', require('./app/router/Food'))

app.get('/session', (req, res) => {
    console.log(req.session.userId)
})
//

app.listen(3000, () => {
    console.log('Listening on port 3000....')
})
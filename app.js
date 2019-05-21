const express = require("express");
const bodyParser = require("body-parser");
// const passport = require('passport')
// const cookieParser = require('cookie-parser')
// const FacebookStrategy = require('passport-facebook').Strategy
// const session = require('express-session')
const cors = require("cors");

require("dotenv").config();

//fcmnotifications
const fcmnotifications = require("./app/controller/FCMNotificationController");

const app = express();
let PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(express.static(__dirname + "/public/images"));

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Authorization"
  );
  next();
});

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
app.use("/api/v1/users", require("./app/router/User"));
app.use("/api/v1/restaurants", require("./app/router/Restaurant"));
app.use("/api/v1/restauranttypes", require("./app/router/RestaurantTypes"));
app.use("/api/v1/foods", require("./app/router/Food"));
app.use("/api/v1/foodtypes", require("./app/router/FoodTypes"));
app.use("/api/v1/employees", require("./app/router/Employee"));
app.use("/api/v1/employeetypes", require("./app/router/EmployeeTypes"));
app.use("/api/v1/rates", require("./app/router/Rate"));
app.use("/api/v1/orders", require("./app/router/Order"));
app.use("/api/v1/orderdetails", require("./app/router/OrderDetail"));
app.use("/api/v1/changelists", require("./app/router/ChangeList"));
app.use("/api/v1/changelogs", require("./app/router/ChangeLog"));
app.use("/api/v1/accounts", require("./app/router/Account"));
app.use("/api/v1/expenses", require("./app/router/Expense"));
app.use("/api/v1/incomes", require("./app/router/Income"));

app.post("/notification", (req, res) => {
  const message = req.body.message;
  const fcmToken = req.body.token;

  fcmnotifications(message, fcmToken);
});
//

app.listen(PORT, () => {
  console.log("Listening on port 3000....");
});

/*const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '1147',
    database: 'kaidelivery',
    insecureAuth: true
})

connection.connect()*/
const Sequelize = require("sequelize");

const sequelize = new Sequelize({
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  dialect: "mysql",
  timezone: "+07:00"
});

module.exports = sequelize;

const Sequelize = require("sequelize");

const sequelize = new Sequelize({
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  dialect: "mysql",
  timezone: "+07:00"
});

var db = {
  Sequelize: Sequelize,
  sequelize: sequelize
};

// Insert models below
db.User = db.sequelize.import("./Users.js");
db.Restaurant = db.sequelize.import("./Restaurants.js");
db.RestaurantType = db.sequelize.import("./RestaurantTypes.js");
db.FoodType = db.sequelize.import("./FoodTypes.js");
db.Food = db.sequelize.import("./Foods.js");
db.EmployeeType = db.sequelize.import("./EmployeeTypes.js");
db.Employee = db.sequelize.import("./Employees.js");

Object.keys(db).forEach(key => {
  if (db[key] && db[key].associate) {
    db[key].associate(db);
  }
});

module.exports = db;

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
db.Rate = db.sequelize.import("./Rates.js");
db.Order = db.sequelize.import("./Orders.js");
db.OrderDetail = db.sequelize.import("./OrderDetails.js");
db.OneTimePassword = db.sequelize.import("./OneTimePassword.js");
db.EmployeeScore = db.sequelize.import("./EmployeeScore.js");
db.RestaurantScore = db.sequelize.import("./RestaurantScore.js");

db.OrderDetail.belongsTo(db.Order, {
  foreignKey: "order_id"
});
db.Order.hasMany(db.OrderDetail, {
  foreignKey: "order_id"
});
db.Food.hasMany(db.OrderDetail, { foreignKey: "food_id" });
db.OrderDetail.belongsTo(db.Food, { foreignKey: "food_id" });

db.Employee.hasMany(db.Order, { foreignKey: "emp_id" });

db.Order.belongsTo(db.User, { foreignKey: "user_id" });
db.Order.belongsTo(db.Restaurant, { foreignKey: "res_id" });
db.Order.belongsTo(db.Rate, { foreignKey: "rate_id" });
db.Order.belongsTo(db.Employee, { foreignKey: "emp_id" });

db.Rate.hasMany(db.Order, { foreignKey: "rate_id" });
db.Restaurant.belongsTo(db.User, { foreignKey: "user_id" });
db.Restaurant.hasMany(db.Order, { foreignKey: "res_id" });
db.User.hasMany(db.Restaurant, { foreignKey: "user_id" });
db.User.hasMany(db.Order, { foreignKey: "user_id" });

db.User.hasMany(db.RestaurantScore, { foreignKey: "user_id" });
db.RestaurantScore.belongsTo(db.User, { foreignKey: "user_id" });

db.RestaurantScore.belongsTo(db.User, { foreignKey: "res_id" });
db.Restaurant.hasMany(db.RestaurantScore, { foreignKey: "res_id" });

db.User.hasMany(db.EmployeeScore, { foreignKey: "user_id" });
db.EmployeeScore.belongsTo(db.User, { foreignKey: "user_id" });

db.Employee.hasMany(db.EmployeeScore, { foreignKey: "emp_id" });
db.EmployeeScore.belongsTo(db.Employee, { foreignKey: "emp_id" });

module.exports = db;

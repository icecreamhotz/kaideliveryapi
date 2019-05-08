const express = require("express");
const router = express.Router();
const order = require("../controller/OrderController");
const jwtauth = require("../middleware/jwtauth");

router.get("/waiting", order.getAllOrderIsWaiting);
router.get("/otp/:otp/:telephone", order.checkValidOTP);
router.get("/delivery/employee/now", jwtauth, order.getDeliveryEmployeeNow);
router.get("/delivery/user/now", jwtauth, order.getDeliveryUserNow);
router.get("/:orderId", order.getOrderDetailAndFood);
router.get("/name/:orderName", order.getOrderDetailAndFoodByName);
router.get("/doned/:orderId", order.getOrderIsDoned);
router.get("/history/employee", jwtauth, order.orderHistoryEmployee);
router.get("/history/user", jwtauth, order.orderHistoryCustomer);
// router.get("/test/test", order.updateQueuePrevious);
router.get(
  "/report/customer/total/day/:resId/:date",
  order.getCustomerUsedTotalByDay
);
router.get(
  "/report/customer/total/month/:resId/:date",
  order.getCustomerUsedTotalByMonth
);
router.get(
  "/report/customer/total/year/:resId/:date",
  order.getCustomerUsedTotalByYear
);
router.get(
  "/report/customer/total/range/:resId/:date/:enddate",
  order.getCustomerUsedTotalByRange
);

router.post("/", jwtauth, order.addNewOrder);
router.post("/guest/", order.addNewOrderGuest);
router.post("/delivery", jwtauth, order.updateOrderFromEmployee);
router.post("/otp", order.sendOtpToSMS);
router.post("/update/status", jwtauth, order.updateOrderStatus);
router.post("/update/customprice", order.updateCustomPrice);
router.post("/queue/previous", order.updateQueuePrevious);
router.post("/queue/next", order.updateNextQueue);
router.post("/comment/employee", order.updateScoreEmployeeAfterDelivered);
router.post("/comment/restaurant", order.updateScoreRestaurantAfterDelivered);

module.exports = router;

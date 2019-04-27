const express = require("express");
const router = express.Router();
const order = require("../controller/OrderController");

router.get("/waiting", order.getAllOrderIsWaiting);
router.get("/otp/:otp", order.checkValidOTP);
router.get("/delivery/employee/now", order.getDeliveryEmployeeNow);
router.get("/delivery/user/now", order.getDeliveryUserNow);
router.get("/:orderId", order.getOrderDetailAndFood);
router.get("/doned/:orderId", order.getOrderIsDoned);
router.get("/history/employee", order.orderHistoryEmployee);
router.get("/history/user", order.orderHistoryCustomer);
router.get("/test/test", order.updateQueuePrevious);

router.post("/", order.addNewOrder);
router.post("/delivery", order.updateOrderFromEmployee);
router.post("/otp", order.sendOtpToSMS);
router.post("/update/status", order.updateOrderStatus);
router.post("/queue/previous", order.updateQueuePrevious);
router.post("/queue/next", order.updateNextQueue);
router.post("/comment/employee", order.updateScoreEmployeeAfterDelivered);
router.post("/comment/restaurant", order.updateScoreRestaurantAfterDelivered);

module.exports = router;

const express = require("express");
const router = express.Router();
const order = require("../controller/OrderController");

router.get("/waiting", order.getAllOrderIsWaiting);
router.get("/otp/:otp", order.checkValidOTP);
router.get("/delivery/employee/now", order.getDeliveryEmployeeNow);
router.get("/delivery/user/now", order.getDeliveryUserNow);
router.post("/", order.insertOrder);
router.post("/delivery", order.updateOrderFromEmployee);
router.post("/otp", order.sendOtpToSMS);
router.post("/delete", order.deleteOrderById);

module.exports = router;

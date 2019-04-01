const express = require("express");
const router = express.Router();
const orderdetail = require("../controller/OrderDetailController");

router.get("/:orderId", orderdetail.getOrderDetailByOrderID);
router.get("/price/:orderId", orderdetail.getTotalPriceByOrderID);

module.exports = router;

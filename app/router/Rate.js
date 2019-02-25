const express = require("express");
const router = express.Router();
const rate = require("../controller/RateController");

router.get("/", rate.showAllDeliveryRates);
router.post("/update", rate.updateRatesById);

module.exports = router;

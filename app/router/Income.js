const express = require("express");
const router = express.Router();
const Incomes = require("../controller/IncomeController");

router.get("/", Incomes.getIncomeByEmployee);
router.get("/payed", Incomes.getOnlyPayed);
router.get("/debt", Incomes.getOnlyDebt);
router.get("/report/income/range/:date/:enddate", Incomes.getIncomesByRange);
router.get("/report/income/chart/day/:date", Incomes.getIncomeListByDay);
router.get("/report/income/chart/month/:date", Incomes.getIncomeListByMonth);
router.get("/report/income/chart/year/:date", Incomes.getIncomeListByYear);

router.post("/update/processing", Incomes.updateProcessStatus);
router.post("/update/success", Incomes.updateSuccessStatus);

module.exports = router;

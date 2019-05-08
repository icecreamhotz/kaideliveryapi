const express = require("express");
const router = express.Router();
const accounts = require("../controller/ExpenseController");
const jwtauth = require("../middleware/jwtauth");

router.get("/", jwtauth, accounts.getAllExpenseListById);
router.get("/report/total/day/:date", accounts.getExpenseListByDay);
router.get("/report/total/month/:date", accounts.getExpenseListByMonth);
router.get("/report/total/year/:date", accounts.getExpenseListByYear);
router.post("/", jwtauth, accounts.addNewExpenseList);
router.post("/update", jwtauth, accounts.editExpenseListById);
router.post("/delete", jwtauth, accounts.deleteExpenseListById);

module.exports = router;

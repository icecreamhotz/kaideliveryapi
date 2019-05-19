const express = require("express");
const router = express.Router();
const expenses = require("../controller/ExpenseController");
const jwtauth = require("../middleware/jwtauth");

router.get("/", jwtauth, expenses.getAllExpenseListById);
router.get("/report/total/day/:date", expenses.getExpenseListByDay);
router.get("/report/total/month/:date", expenses.getExpenseListByMonth);
router.get("/report/total/year/:date", expenses.getExpenseListByYear);
router.get("/report/total/range/:date/:enddate", expenses.getExpensesByRange);
router.post("/", jwtauth, expenses.addNewExpenseList);
router.post("/update", jwtauth, expenses.editExpenseListById);
router.post("/delete", jwtauth, expenses.deleteExpenseListById);

module.exports = router;

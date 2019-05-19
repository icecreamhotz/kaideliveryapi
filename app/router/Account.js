const express = require("express");
const router = express.Router();
const accounts = require("../controller/AccountController");
const jwtauth = require("../middleware/jwtauth");

router.get("/", jwtauth, accounts.getAllAccountListById);
router.get("/report/total/day/:date", jwtauth, accounts.getAccountListByDay);
router.get(
  "/report/total/month/:date",
  jwtauth,
  accounts.getAccountListByMonth
);
router.get("/report/total/year/:date", jwtauth, accounts.getAccountListByYear);
router.get(
  "/report/total/range/:date/:enddate",
  jwtauth,
  accounts.getAccountsByRange
);

router.post("/", jwtauth, accounts.addNewAccountList);
router.post("/update", jwtauth, accounts.editAccountListById);
router.post("/delete", jwtauth, accounts.deleteAccountListById);

module.exports = router;

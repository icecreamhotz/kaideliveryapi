const express = require("express");
const router = express.Router();
const accounts = require("../controller/AccountController");
const jwtauth = require("../middleware/jwtauth");

router.get("/", jwtauth, accounts.getAllAccountListById);
router.get("/report/total/day/:date", accounts.getAccountListByDay);
router.get("/report/total/month/:date", accounts.getAccountListByMonth);
router.get("/report/total/year/:date", accounts.getAccountListByYear);
router.post("/", jwtauth, accounts.addNewAccountList);
router.post("/update", jwtauth, accounts.editAccountListById);
router.post("/delete", jwtauth, accounts.deleteAccountListById);

module.exports = router;

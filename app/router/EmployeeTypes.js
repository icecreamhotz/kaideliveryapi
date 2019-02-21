const express = require("express");
const router = express.Router();
const employeetypes = require("../controller/EmployeeTypes");

router.get("/", employeetypes.getAllTypes);

module.exports = router;

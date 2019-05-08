const express = require("express");
const router = express.Router();
const changelogs = require("../controller/ChangeLogController");
const jwtauth = require("../middleware/jwtauth");

router.get("/", changelogs.allChangeLog);
router.post("/", jwtauth, changelogs.addNewChangeLog);

module.exports = router;

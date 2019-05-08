const express = require("express");
const router = express.Router();
const changelists = require("../controller/ChangeListController");
const jwtauth = require("../middleware/jwtauth");

router.get("/", changelists.allCheckLists);
router.post("/", jwtauth, changelists.addNewChangeList);
router.post("/update", jwtauth, changelists.updateChangeListStatus);

module.exports = router;

const express = require("express");
const router = express.Router();
const employees = require("../controller/EmployeeController");
const employeescores = require("../controller/EmployeeScoreController");
const multer = require("multer");
const jwtauth = require("../middleware/jwtauth");
const moment = require("moment");
const path = require("path");

const dirName = path.dirname(require.main.filename);
const pathName = `${dirName}/public/images/employees/`;
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pathName);
  },
  filename: (req, file, cb) => {
    cb(null, `employee_${moment().format("YYYYMMDDhhmmss")}.jpg`);
  }
});

const upload = multer({
  storage: storage
});

router.get("/", jwtauth, employees.getAllEmployee);
router.get("/info", jwtauth, employees.getEmployeeInfo);
router.get("/working", employees.getEmployeeWorkerStatusNow);
router.post("/register", upload.single("image"), employees.insertEmployee);
router.post(
  "/update/info",
  [upload.single("image"), jwtauth],
  employees.updateById
);
router.post(
  "/update",
  [upload.single("image"), jwtauth],
  employees.updateEmployee
);
router.post("/login", employees.loginEmployee);
router.post("/update/password", jwtauth, employees.updatePasswordById);
router.post("/delete", jwtauth, employees.deleteEmployee);
router.post("/username", employees.checkUsername);
router.post("/verify", jwtauth, employees.verifyEmployee);
router.post("/working", jwtauth, employees.changeWorkStatus);

//score
router.get("/score/comment/:empId", employeescores.getScoreAndCommentEmployee);
router.post(
  "/score/comment/delete",
  employeescores.deleteEmployeeScoreAndComment
);

module.exports = router;
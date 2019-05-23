const jwt = require("jsonwebtoken");

const helperEmployee = {
  loginJWT: emp => {
    const empdata = {
      emp_id: emp.emp_id,
      emptype_id: emp.emptype_id
    };
    const token = jwt.sign(empdata, process.env.JWT_SECRET, {
      expiresIn: "10h"
    });
    const response = {
      message: "Login Successful",
      token: token,
      expiresIn: "3600000",
      empId: empdata.emp_id,
      role: emp.emptype_id
    };
    return response;
  }
};

module.exports = helperEmployee;

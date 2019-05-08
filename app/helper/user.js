const jwt = require("jsonwebtoken");

const helperUser = {
  loginJWT: user => {
    const userdata = {
      user_id: user.user_id,
      email: user.email
    };
    const token = jwt.sign(userdata, process.env.JWT_SECRET, {
      expiresIn: "10h"
    });
    const response = {
      message: "Login Successful.",
      token: token,
      expiresIn: "3600000",
      userId: userdata.user_id
    };

    return response;
  }
};

module.exports = helperUser;

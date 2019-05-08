const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token;

  if (req.headers.authorization) {
    token = req.headers.authorization;
    console.log(token);
  }

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        console.log("err");
        res.status(401).json({
          message: "invalid token."
        });
        return;
      } else {
        console.log(decoded);
        req.decoded = decoded;
        next();
      }
    });
  } else {
    res.status(401).json({
      message: "No token provided."
    });
  }
};

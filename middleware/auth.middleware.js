var jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticate = (req, res, next) => {
  try {
    let authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }
    // authHeader = authHeader.split(" ")
    let token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(404).json({ error: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if(!decoded){
        return res.status(403).json({error: "Unauthorized user"});
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }
    res
      .status(500)
      .json({ error: "Something went wrong, please try again later" });
  }
};


module.exports = authenticate;
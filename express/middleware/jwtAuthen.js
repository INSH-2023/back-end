const jwt = require("jsonwebtoken");
const errorModel =require('../response/errorModel')

const dotenv = require('dotenv');

// get config vars
dotenv.config();

exports.cookieJwtAuth = (req, res, next) => {
  const token = req.cookies.token;
  if (token == null) return res.status(401).json(errorModel("need login first",req.originalUrl))
  try {
    const user = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(user)
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json(errorModel(err.message,req.originalUrl))
  }
};
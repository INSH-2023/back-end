const jwt = require("jsonwebtoken");
const errorModel =require('../response/errorModel')
const {getUser,refreshToken} = require('../validator/authentication')

const dotenv = require('dotenv');

// get config vars
dotenv.config();

exports.JwtAuth = (req, res, next) => {
  // call token from hearders or cookies token
  const jwtToken = req.headers.authorization || "Bearer " + req.cookies.token ;
  const jwtRefreshToken = req.headers.refresh || "Bearer " + req.cookies.refreshToken ;
  // check if not have token that unauthorized
  if (jwtToken == null && jwtRefreshToken == null) return res.status(401).json(errorModel("need login first",req.originalUrl))
  try {
    // check access token
    let user = jwt.verify(jwtToken.substring(7), process.env.TOKEN_SECRET);
    console.log(user)
    // if found that request on user
    if (user.user_email === undefined || user.user_role === undefined) {
      return res.status(401).json(errorModel("invalid token",req.originalUrl))
    }
    req.user = user;
    next();
  } catch (err) {
    // if access token invalid that check refresh token and refresh
    try {
      // check refresh token
      user = jwt.verify(jwtRefreshToken.substring(7), process.env.TOKEN_SECRET);
    } catch (err1) {
      // if refresh token expired that remove cookie on session and go to login page
      return res.status(403).json(errorModel("Refresh token: " + err1.message,req.originalUrl))
    }
      return res.status(401).json(errorModel("Access token: " + err.message,req.originalUrl))
    }
};

exports.verifyRole = (...roles) => {
  return (req,res,next) => {
    const reqRole = getUser(req.cookies.token).user_role;
    if (!reqRole) return res.status(403).json(errorModel("the role is null",req.originalUrl));
    const result = [...roles].includes(reqRole);
    if (!result) return res.status(403).json(errorModel("the role is not allowed to use",req.originalUrl));
    next();
  }
}
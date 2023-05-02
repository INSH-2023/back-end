const jwt = require("jsonwebtoken");
const errorModel =require('../response/errorModel')
const {getUserEmail,getUserRole,refreshToken} = require('../validator/authentication')

const dotenv = require('dotenv');

// get config vars
dotenv.config();

exports.cookieJwtAuth = (req, res, next) => {
  // call cookies token
  const jwtToken = req.cookies.token;
  const jwtRefreshToken = req.cookies.refreshToken;

  // check if not have token that unauthorized
  if (jwtToken == null) return res.status(401).json(errorModel("need login first",req.originalUrl))
  try {
    // check access token
    let user = jwt.verify(jwtToken, process.env.TOKEN_SECRET);
    console.log(user)
    // if found that request on user
    req.user = user;
    next();
  } catch (err) {
      // if access token invalid that check refresh token and refresh
      try {
        // check refresh token
        user = jwt.verify(jwtRefreshToken, process.env.TOKEN_SECRET);
      } catch (err1) {
        // if refresh token expired that remove cookie on session and go to login page
        res.clearCookie("token");
        res.clearCookie("refreshToken");
        res.clearCookie("email");
        res.clearCookie("role");
        return res.status(403).json(errorModel(err1.message,req.originalUrl))
      }
      // if refresh token is not expired that refresh your access token and can use continually until refresh token expired
      let token = refreshToken(jwtToken,"30m")
      res.cookie("token", token);
      res.cookie("email",getUserEmail(token));
      res.cookie("role",getUserRole(token));
      return res.status(401).json(errorModel(err.message,req.originalUrl))
    }
};

exports.verifyRole = (...roles) => {
  return (req,res,next) => {
    const reqRole = getUserRole(req.cookies.token);
    if (!reqRole) return res.status(403).json(errorModel("the role is null",req.originalUrl));
    const result = [...roles].includes(reqRole);
    if (!result) return res.status(403).json(errorModel("the role is not allowed to use",req.originalUrl));
    next();
  }
}
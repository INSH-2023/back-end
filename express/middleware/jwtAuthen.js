const jwt = require("jsonwebtoken");
const errorModel =require('../response/errorModel')
const {getUser} = require('../validator/authentication')

const dotenv = require('dotenv');

// get config vars
dotenv.config();

exports.JwtAuth = (req, res, next) => {
  // เอา token จาก headers or cookies
  const jwtToken = req.headers.authorization || "Bearer " + req.cookies.token ;
  const jwtRefreshToken = req.headers.refresh || "Bearer " + req.cookies.refreshToken ;
  // ตรวจสอบถ้าไม่มี token จะเข้าสู่ระบบไม่ได้
  if (jwtToken == "Bearer " && jwtRefreshToken == "Bearer ") return res.status(401).json(errorModel("need login first",req.originalUrl))
  try {
    // ตรวจสอบ user ใน access token 
    let user = jwt.verify(jwtToken.substring(7), process.env.TOKEN_SECRET);
    console.log(user)
    // ตรวจสอบใน token มีการทำ format ของ user ถูกต้องไหม
    if (user.user_email === undefined || user.user_role === undefined) {
      return res.status(401).json(errorModel("invalid token",req.originalUrl))
    }
    // ถ้าเจอจะ request ไปยัง user
    req.user = user;
    next();
  } catch (err) {
    // ถ้า access token ไม่ถูกต้องหรือหมดอายุจะตรวจ refresh token ว่าใช้ได้ไหม
    try {
      // ตรวจ refresh token
      user = jwt.verify(jwtRefreshToken.substring(7), process.env.TOKEN_SECRET);
    } catch (err1) {
      // ถ้า refresh token หมดอายุ แสดงว่าต้องไปหน้า login ใหม่
      return res.status(403).json(errorModel("Refresh token: " + err1.message,req.originalUrl))
    }
      return res.status(401).json(errorModel("Access token: " + err.message,req.originalUrl))
    }
};

exports.verifyRole = (...roles) => {
  return (req,res,next) => {
    // เรียก role จาก header หรือ cookie
    const jwtToken =  req.headers.authorization || "Bearer " + req.cookies.token
    const reqRole = getUser(jwtToken.substring(7)).user_role;

    // ถ้าไม่มี role จะไม่มีสิทธิ์สำหรับการเข้าระบบ
    if (!reqRole) return res.status(403).json(errorModel("the role is null",req.originalUrl));
    const result = [...roles].includes(reqRole);

    // ถ้า role ไม่ใช่ user, admin_it และ admin_pr จะไม่มีสิทธิ์สำหรับการเข้าระบบในส่วนนั้น
    if (!result) return res.status(403).json(errorModel("the role is not allowed to use",req.originalUrl));
    next();
  }
}
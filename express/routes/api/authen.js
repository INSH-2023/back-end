const express =require('express')
const router =express.Router()
const connMSQL =require('../../config/db_config')
const {getToken, getUser, refreshToken} = require('../../validator/authentication')
const errorModel = require('../../response/errorModel')

const table='user'
const bcrypt = require('bcrypt')

router.post('/',async(req,res)=>{
  // เก็บ email และ password ของผู้ใช้
  const { email, password } = req.body;

  // เรียกข้อมูล user โดยใช้ email
  let {status_pool:status_p,data:user,msg:msg} = await connMSQL.connection_pool(`SELECT * FROM moral_it_device.${table} WHERE user_email ='${email}'`)
  
  // ตรวจสอบ password ที่ได้จาก mysql2 ว่าเป็น hash match กับ password ที่กรอกมาหรือป่าว
  if (user.length==0 || !await bcrypt.compare(password, user[0].user_password)) {
    return res.status(401).json(errorModel("user email or password is invalid please login again",req.originalUrl))
  } 
  
  // ตรวจสอบสถานะของ user
  else if (user[0].user_status!=='active'){
    return res.status(403).json(errorModel("this user is inactive!",req.originalUrl))
  }

  // ลบ password ของ user ก่อน response กลับไป
  delete user[0].user_password;

  console.log(user[0])

  // สร้าง access token ภายใต้ method ที่กำหนด
  const token = getToken({
    "user_emp_code":user[0].user_emp_code,
    "user_first_name":user[0].user_first_name,
    "user_last_name":user[0].user_last_name,
    "user_email":user[0].user_email,
    "user_role":user[0].user_role,
  },"30m");

  // และ refresh token แต่เวลาต่างกัน
  const refreshtoken = getToken({
    "user_emp_code":user[0].user_emp_code,
    "user_first_name":user[0].user_first_name,
    "user_last_name":user[0].user_last_name,
    "user_email":user[0].user_email,
    "user_role":user[0].user_role,
  },"24h");

  // เก็บเป็น cookie ให้ผู้พัฒนา backend สามารถใช้งานได้
  res.cookie("token", token);
  res.cookie("refreshToken", refreshtoken);
  res.cookie("user_email",getUser(token).user_email);
  res.cookie("user_role",getUser(token).user_role);
  res.cookie("user_first_name",getUser(token).user_first_name)
  res.cookie("user_last_name",getUser(token).user_last_name)
  res.status(200).json({"token": token, "refreshToken": refreshtoken, "user_emp_code" : getUser(token).user_emp_code , "user_email": getUser(token).user_email, "user_role": getUser(token).user_role, "user_first_name": getUser(token).user_first_name, "user_last_name": getUser(token).user_last_name })
})

router.get('/refresh', async(req,res)=>{
  // เรียก refresh token เพื่อใช้ในการ refresh ถ้าหากเป็น access token จะทำการลบข้อมูลของ user ทำให้ส่ง token ผิด
  const jwtRefreshToken = req.headers.authorization || "Bearer " + req.cookies.token ;
  let token = refreshToken(jwtRefreshToken.substring(7),"30m")
  let refreshtoken = refreshToken(jwtRefreshToken.substring(7),"24h")
  // ตรวจดูว่า token ถูกต้องไหมก่อนส่ง
  if ([getUser(token).user_email,getUser(token).user_role].includes(undefined)) { 
    return res.status(401).json(errorModel("please input valid refresh token",req.originalUrl)) 
  }
  res.cookie("token", token);
  res.cookie("refreshToken", refreshtoken);
  res.cookie("user_email",getUser(token).user_email);
  res.cookie("user_role",getUser(token).user_role);
  res.cookie("user_first_name",getUser(token).user_first_name)
  res.cookie("user_last_name",getUser(token).user_last_name)
  res.status(200).json({"token": token, "refreshToken": refreshtoken, "user_emp_code" : getUser(token).user_emp_code,  "user_email": getUser(token).user_email, "user_role": getUser(token).user_role, "user_first_name": getUser(token).user_first_name, "user_last_name": getUser(token).user_last_name })
})

module.exports=router
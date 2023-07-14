const express = require('express')
const router = express.Router()
const connMSQL = require('../../config/db_config')
const { getToken, getUser, refreshToken, isExpired, regenRefreshToken } = require('../../validator/authentication')
const errorModel = require('../../response/errorModel')
const { v4: uuidv4 } = require('uuid')
const validator = require('./../../validator/validate')

const table = 'user'
const table_log = 'reset_password_log'
const bcrypt = require('bcrypt')

const dotenv = require('dotenv');

// get config vars
dotenv.config();

router.post('/', async (req, res) => {
  // เก็บ email และ password ของผู้ใช้
  const { email, password } = req.body;

  // เรียกข้อมูล user โดยใช้ email
  let { status_pool: status_p, data: user, msg: msg } = await connMSQL.connection_pool(validator.foundId(table, '',
    [{ col: 'user_email', val: email }]
  ))

  // ถ้า email หาไม่เจอก็จะส่งกลับไปเพื่อใช้ในการทำ reset password
  if (user.length == 0) {
    return res.status(404).json(errorModel(`user email ${email} does not exist`, req.originalUrl))
  }

  // ตรวจสอบ password ที่ได้จาก mysql2 ว่าเป็น hash match กับ password ที่กรอกมาหรือป่าว
  if (!await bcrypt.compare(password, user[0].user_password)) {
    return res.status(401).json(errorModel("user email or password is invalid please login again", req.originalUrl))
  }

  // ตรวจสอบสถานะของ user
  else if (user[0].user_status !== 'active') {
    return res.status(403).json(errorModel("this user is inactive!", req.originalUrl))
  }

  // ลบ password ของ user ก่อน response กลับไป
  delete user[0].user_password;

  console.log(user[0])

  // สร้าง access token ภายใต้ method ที่กำหนด
  const token = getToken({
    "user_emp_code": user[0].user_emp_code,
    "user_first_name": user[0].user_first_name,
    "user_last_name": user[0].user_last_name,
    "user_email": user[0].user_email,
    "user_role": user[0].user_role,
  },"30m");

  // และ refresh token แต่เวลาต่างกัน
  const refreshtoken = getToken({
    "user_emp_code": user[0].user_emp_code,
    "user_first_name": user[0].user_first_name,
    "user_last_name": user[0].user_last_name,
    "user_email": user[0].user_email,
    "user_role": user[0].user_role,
  },"24h");
  console.log(token)
  console.log(getUser(token).user_role)

  // เก็บเป็น cookie ให้ผู้พัฒนา backend สามารถใช้งานได้
  res.cookie("token", token);
  res.cookie("refreshToken", refreshtoken);
  res.cookie("user_email", getUser(token).user_email);
  res.cookie("user_role", getUser(token).user_role);
  res.cookie("user_first_name", getUser(token).user_first_name)
  res.cookie("user_last_name", getUser(token).user_last_name)
  res.status(200).json({
    "token": token, "refreshToken": refreshtoken,
    "user_emp_code": getUser(token).user_emp_code,
    "user_email": getUser(token).user_email,
    "user_role": getUser(token).user_role,
    "user_first_name": getUser(token).user_first_name,
    "user_last_name": getUser(token).user_last_name
  })
})

router.post('/refresh', async (req, res) => {
  // เรียก refresh token เพื่อใช้ในการ refresh ถ้าหากเป็น access token จะทำการลบข้อมูลของ user ทำให้ส่ง token ผิด
  const jwtRefreshToken = req.headers.authorization || "Bearer " + req.cookies.refreshToken;
  const jwttoken = req.body.token
  let userInfo = {
    "user_emp_code": req.body.user_emp_code,
    "user_first_name": req.body.user_first_name,
    "user_last_name": req.body.user_last_name,
    "user_email": req.body.user_email,
    "user_role": req.body.user_role,
  }

  if (isExpired(jwtRefreshToken.substring(7))){
    return res.status(401).json(errorModel("token is expired", req.originalUrl))
  }

  let token = refreshToken(jwttoken, jwttoken, userInfo, "30m")
  let refreshtoken = refreshToken(jwttoken, jwtRefreshToken.substring(7), userInfo, "24h")

  // ตรวจดูว่า token ถูกต้องไหมก่อนส่ง
  if ([getUser(token).user_email, getUser(token).user_role].includes(undefined)) {
    return res.status(401).json(errorModel("please input valid refresh token", req.originalUrl))
  }
  res.cookie("token", token);
  res.cookie("refreshToken",refreshtoken);
  res.cookie("user_emp_code", getUser(token).user_emp_code)
  res.cookie("user_email", getUser(token).user_email);
  res.cookie("user_role", getUser(token).user_role);
  res.cookie("user_first_name", getUser(token).user_first_name)
  res.cookie("user_last_name", getUser(token).user_last_name)
  res.status(200).json({
    "token": token, "refreshToken":refreshtoken,
    "user_emp_code": getUser(token).user_emp_code,
    "user_email": getUser(token).user_email,
    "user_role": getUser(token).user_role,
    "user_first_name": getUser(token).user_first_name,
    "user_last_name": getUser(token).user_last_name
  })
})

router.post('/verify', async (req, res) => {
  let { email } = req.body
  // เรียกข้อมูล user โดยใช้ email
  let { status_pool: status_p, data: user, msg: msg } = await connMSQL.connection_pool(validator.foundId(table, '',
    [{ col: 'user_email', val: email }]
  ))
  if (user.length == 0) {
    return res.status(404).json(errorModel(`user email : ${email} does not exist`, req.originalUrl))
  }

  let input
  let status = undefined
  try {
    input = [
      { prop: "uuId_token", value: uuidv4(), type: 'str' },
      { prop: "user_email", value: validator.validateEmail(await email, 50, table_log, 'user_email'), type: 'str' },
    ]
    status = !(await validator.checkUndefindData(input, table))

    // block reset password in 3 times per day
    let { status_pool: status_p1, data: logs, msg: msg1 } = await connMSQL.connection_pool(`SELECT Count(*) AS count 
    FROM moral_it_device.${table_log} WHERE user_email ='${email}' and use_token = 1 and timestamp >= CURDATE()`)
    console.log(logs[0])
    if (logs[0].count >= 3) {
      return res.status(403).json(errorModel(`this user email can verify token in 3 times per day`, req.originalUrl))
    }

  } catch (err) {
    console.log(err)
    status = false
    res.status(400).json(errorModel(err.message, req.originalUrl))
  }

  if (status == true) {
    try {
      await connMSQL.connection_pool(validator.createData(input, table_log, res))
      let { status_pool: status_p2_1, data: max, msg: msg2_1 } = await connMSQL.connection_pool(validator.foundId(table_log, ['max(reset_password_logId) as Id']))
      let { status_pool: status_p2, data: logs1, msg: msg2 } = await connMSQL.connection_pool(validator.foundId(table_log, ['uuId_token'],
        [{ col: 'user_email', val: email, log: 'AND' }, { col: 'use_token', val: 0, log: 'AND' }, { col: 'reset_password_logId', val: max[0].Id }]
      ))
      if (status_p2) {
        return res.status(200).json(logs1[0])
      }
    } catch (error) {
      res.status(500).json(errorModel(error.message, req.originalUrl))
    }
  }
})

router.post('/verify/count', async (req, res) => {
  let { email } = req.body

  try {
    // เรียกข้อมูล user โดยใช้ email
    let { status_pool: status_p, data: user, msg: msg } = await connMSQL.connection_pool(validator.foundId(table, ['user_email'],
      [{ col: 'user_email', val: email }]
    ))
    if (user.length == 0) {
      return res.status(404).json(errorModel(`user email : ${email} does not exist`, req.originalUrl))
    }

    // block reset password in 3 times per day
    let { status_pool: status_p1, data: logs, msg: msg1 } = await connMSQL.connection_pool(`SELECT Count(*) AS count
    FROM moral_it_device.${table_log} WHERE user_email ='${user[0].user_email}' and use_token = 1 and timestamp >= CURDATE()`)
    return res.status(200).json({ count: 3 - logs[0].count })
  } catch (err) {
    console.log(err)
    status = false
    res.status(400).json(errorModel(err.message, req.originalUrl))
  }
})

router.put('/reset_password', async (req, res) => {
  let uuId_token = req.headers.authorization.substring(7, 43)
  let { password } = req.body
  // เรียกข้อมูล user โดยใช้ email
  let { status_pool: status_p, data: logs, msg: msg } = await connMSQL.connection_pool(
    validator.foundId(table_log, ["re.reset_password_logId", "us.userId", "re.user_email", "re.use_token"],
      [{ col: 'uuId_token', val: uuId_token }],
      [{ table: `moral_it_device.${table} as us `, on: `re.user_email = us.user_email` }]
    ))
  //     `SELECT l.reset_password_logId,u.userId,l.user_email,l.use_token FROM moral_it_device.${table_log} l 
  // JOIN moral_it_device.${table} u on l.user_email = u.user_email WHERE l.uuId_token ='${uuId_token}'`
  if (logs.length == 0) {
    return res.status(401).json(errorModel(`token : ${uuId_token} is invalid`, req.originalUrl))
  } else if (logs[0].use_token == 1) {
    return res.status(403).json(errorModel(`token : ${uuId_token} is already used`, req.originalUrl))
  }
  let input
  let status = undefined
  try {
    input = [
      { prop: "user_password", value: await validator.validatePassword(await password, table, 'user_password'), type: 'str' },
    ]
    input_log = [
      { prop: "use_token", value: 1, type: 'int' }
    ]
    status = !(await validator.checkUndefindData(input, table))

  } catch (err) {
    console.log(err)
    status = false
    res.status(400).json(errorModel(err.message, req.originalUrl))
  }

  if (status == true) {
    try {
      req.params.id = logs[0].reset_password_logId
      await connMSQL.connection_pool(validator.updateData(req, input_log, table_log))
      req.params.id = logs[0].userId
      console.log(logs[0])
      let { status_pool: status_p1, data: logs1, msg: msg1 } = await connMSQL.connection_pool(validator.updateData(req, input, table))
      if (status_p1) {
        return res.status(200).json({ message: `password of ${logs[0].user_email} is reset!!`, status: '200' })
      }
    } catch (error) {
      res.status(500).json(errorModel(error.message, req.originalUrl))
    }
  }
})

module.exports = router
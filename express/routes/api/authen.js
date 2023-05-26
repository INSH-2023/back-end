const express =require('express')
const router =express.Router()
const connMSQL =require('../../config/db_config')
const {getToken, getUserEmail, getUserRole, refreshToken} = require('../../validator/authentication')

const table='user'
const bcrypt = require('bcrypt')
const { JwtAuth } = require("../../middleware/jwtAuthen");

router.post('/',async(req,res)=>{
    const { email, password } = req.body;
    let {status_pool:status_p,data:user,msg:msg} = await connMSQL.connection_pool(`SELECT * FROM moral_it_device.${table} WHERE user_email ='${email}'`)
    if (!await bcrypt.compare(password, user[0].user_password)) {
      return res.status(401).json({
        error: "user email or password is invalid please login again",
      });
    }
    delete user[0].user_password;
    console.log(user[0])
    const token = getToken({
      "user_name":user[0].user_first_name+" "+user[0].user_last_name,
      "user_email":user[0].user_email,
      "user_role":user[0].user_role,
    },"30m");
    const refreshtoken = getToken({
      "user_name":user[0].user_first_name+" "+user[0].user_last_name,
      "user_email":user[0].user_email,
      "user_role":user[0].user_role,
    },"24h");
    res.cookie("token", token);
    res.cookie("refreshToken", refreshtoken);
    res.cookie("email",getUserEmail(token));
    res.cookie("role",getUserRole(token));
    res.status(200).json({"token": token, "refreshToken": refreshtoken, "email": getUserEmail(token), "role": getUserRole(token)})
})

router.get('/refresh',JwtAuth, async(req,res)=>{
  const jwtToken = req.headers.authorization || "Bearer " + req.cookies.token ;
    let token = refreshToken(jwtToken.substring(7),"30m")
    let refreshtoken = refreshToken(jwtToken.substring(7),"24h")
    res.cookie("token", token);
    res.cookie("refreshToken", refreshtoken);
    res.cookie("email",getUserEmail(token));
    res.cookie("role",getUserEmail(token));
    res.status(200).json({"token": token, "refreshToken": refreshtoken, "email": getUserEmail(token), "role": getUserRole(token)})
})

module.exports=router
const express =require('express')
const router =express.Router()
const connMSQL =require('../../config/db_config')
const {getToken, getUserEmail, getUserRole, refreshToken} = require('../../validator/authentication')

const table='user'
const bcrypt = require('bcrypt')

router.post('/',async(req,res)=>{
    const { email, password } = req.body;
    let {status_pool:status_p,data:user,msg:msg} = await connMSQL.connection_pool(`SELECT * FROM moral_it_device.${table} WHERE user_email ='${email}'`)
    if (!await bcrypt.compare(password, user[0].user_password)) {
      return res.status(401).json({
        error: "user email or password is invalid please login again",
      });
    }
    delete user[0].user_password;
    const token = getToken(user[0],"30m");
    res.cookie("token", token);
    res.cookie("email",getUserEmail(token));
    res.cookie("role",getUserRole(token));
    res.status(200).json({"message": "login successfully"})
})

router.get('/refresh', async(req,res)=>{
    let jwttoken = req.cookies.token;
    let token = refreshToken(jwttoken,"24h")
    res.cookie("token", token);
    res.cookie("email",getUserEmail(token));
    res.cookie("role",getUserEmail(token));
    res.status(200).send({"message": "refresh successfully"})
})

module.exports=router
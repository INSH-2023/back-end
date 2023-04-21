const express =require('express')
const router =express.Router()
const errorModel =require('../../response/errorModel')
const validator = require('../../validator/authentication.js')
const connMSQL =require('../../mysql/db_config')

const table='user'
router.post('/',async(req,res)=>{

    try {
        // if(!connMSQL.handdleConnection()){
            // console.log(req.body)
            // validator.logIn(req)
            let [status,data]=await validator.logIn(req)
            if(status==true){
                res.status(200).json({"message":'login successful !!',"data":data})
            }else{
                res.status(404).json(errorModel('this account does not exist !!',req.originalUrl))
            }


        // }else{
        //     console.log(`Cannot connect to mysql server !!`) 
        //     throw new Error('connection error something :')
        // }
        // validator.login(data)
    } catch (error) {
        console.log(error)
        return res.status(500).json(errorModel(error.message,req.originalUrl))

        
    }
    
})

module.exports=router
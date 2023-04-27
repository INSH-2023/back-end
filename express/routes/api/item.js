const express =require('express')
const router =express.Router()
// const users =require("../../data/Users")
// const uuid =require("uuid")
const validator = require('../../validator/validate')
const connMSQL =require('../../config/db_config')
const errorModel =require('../../response/errorModel')

const table='item'

//get item
router.get('/',async(req,res)=>{

    try {
        // if(!connMSQL.handdleConnection()){
            
            let {status_pool,data} = await connMSQL.connection_pool(`SELECT itemId,item_name,item_number,item_type,user_first_name,user_last_name,user_email,user_group FROM moral_it_device.item as item join moral_it_device.user as user on user.user_emp_code=item.user_emp_code;`)
            if(status_pool){
                return res.status(200).json(data)
            }
        // }else{
        //     console.log(`Cannot connect to mysql server !!`) 
        //     throw new Error('connection error something')
        // }
    } catch (error) {
        console.log(error)
        return res.status(500).json(errorModel(error.message,req.originalUrl))
    }
})


// get item by id
router.get('/:id',async(req,res)=>{
    try {
        // if(!connMSQL.handdleConnection()){
            let {status_pool:status_p,data:items,msg:msg} = await connMSQL.connection_pool(`SELECT itemId,item_name,item_number,item_type,user.user_emp_code FROM moral_it_device.item as item join moral_it_device.user as user on user.user_emp_code = item.user_emp_code WHERE item.itemId = ${req.params.id};` )
            if(status_p && items.length!=0){
                return res.status(200).json(items)
            }else
            if(status_p && items.length==0){
                return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
            }
        // }else{
        //     console.log(`Cannot connect to mysql server !!`) 
        //     throw new Error('connection error something')
        // } 
    } catch (error) {
        res.status(500).json(errorModel(error.message,req.originalUrl))
    }

})

router.get('/emp-code/:id',async(req,res)=>{
    try {
        // if(!connMSQL.handdleConnection()){
            let {status_pool:status_p,data:items,msg:msg} = await connMSQL.connection_pool(`SELECT itemId,item_name,item_number,item_type,user.user_emp_code FROM moral_it_device.item as item join moral_it_device.user as user on user.user_emp_code = item.user_emp_code WHERE user.user_emp_code = ${req.params.id};` )
            if(status_p && items.length!=0){
                return res.status(200).json(items)
            }else
            if(status_p && items.length==0){
                return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
            }
        // }else{
        //     console.log(`Cannot connect to mysql server !!`) 
        //     throw new Error('connection error something')
        // } 
    } catch (error) {
        res.status(500).json(errorModel(error.message,req.originalUrl))
    }

})

module.exports=router
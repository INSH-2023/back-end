const express =require('express')
const router =express.Router()
// const users =require("../../data/Users")
// const uuid =require("uuid")
const validator = require('../../validator/validate')
const connMSQL =require('../../config/db_config')
const errorModel =require('../../response/errorModel')
const { JwtAuth } = require("../../middleware/jwtAuthen");

const table='item'

//get item
router.get('/',JwtAuth,async(req,res)=>{

    try {
        let statement = `SELECT itemId,item_name,item_number,item_type,user_first_name,
        user_last_name,user_email,user_group FROM moral_it_device.item as item 
        join moral_it_device.user as user on user.user_emp_code=item.user_emp_code`

        let results
        console.log(req.user.user_role)
        if (req.user.user_role == "user") {
            console.log(statement)
            results = await connMSQL.connection_pool(`${statement} WHERE user.user_email = "${req.user.user_email}"`)
            
        } else {
            results = await connMSQL.connection_pool(statement)
        }
        let {status_pool,data} = results
        if(status_pool){
            return res.status(200).json(data)
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json(errorModel(error.message,req.originalUrl))
    }
})


// get item by id
router.get('/:id',JwtAuth,async(req,res)=>{
    try {
        
        let {status_pool:status_p,data:items,msg:msg} = await connMSQL.connection_pool(
        `SELECT itemId,item_name,item_number,item_type,user_first_name,
        user_last_name,user_email,user_group FROM moral_it_device.item as item 
        join moral_it_device.user as user on user.user_emp_code = item.user_emp_code 
        WHERE item.itemId = "${req.params.id}";`)

        if(status_p && items.length!=0){
            return res.status(200).json(items)
        }
        else if(status_p && items.length==0){
            blockPermissionWithEmail(req,res,items[0].user_email)
            return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
        }
    } catch (error) {
        res.status(500).json(errorModel(error.message,req.originalUrl))
    }

})

router.get('/emp-code/:id',JwtAuth,async(req,res)=>{
    try {
        let {status_pool:status_p,data:items,msg:msg} = await connMSQL.connection_pool(`
        SELECT itemId,item_name,item_number,item_type,user_first_name,user_last_name,
        user_email,user_group FROM moral_it_device.item as item 
        join moral_it_device.user as user on user.user_emp_code = item.user_emp_code 
        WHERE user.user_emp_code = "${req.params.id}";` )
        
        if(status_p && items.length!=0){
            return res.status(200).json(items)
        }else if(status_p && items.length==0){
            blockPermissionWithEmail(req,res,items[0].user_email)
            return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
        }
    } catch (error) {
        res.status(500).json(errorModel(error.message,req.originalUrl))
    }

})

function blockPermissionWithEmail(req, res, email) {
    if (req.user.user_role == "user" && email !== req.user.user_email) {
        return res.status(403).json(errorModel(`cannot access other user email with user permission`,req.originalUrl))
    }
}

module.exports=router
const express =require('express')
const router =express.Router()
// const users =require("../../data/Users")
// const uuid =require("uuid")
const validator = require('../../validator/validate')
const connMSQL =require('../../config/db_config')
const errorModel =require('../../response/errorModel')
const { JwtAuth } = require("../../middleware/jwtAuthen");

const table='item'
const userView='userview'
const columns=["itemId","item_name","item_number","item_type","user_first_name",
    "user_last_name","user_email","user_group"]

//get item
router.get('/',JwtAuth,async(req,res)=>{

    try {
        // if(!connMSQL.handdleConnection()){
        // let statement = `SELECT itemId,item_name,item_number,item_type,user_first_name,
        // user_last_name,user_email,user_group FROM moral_it_device.item as item 
        // join moral_it_device.user as user on user.user_emp_code=item.user_emp_code`

        let results
        // console.log(req.user.user_role)
        if (req.user.user_role == "user") {
            results = await connMSQL.connection_pool(validator.foundId(table,columns,
                [{col: "user_email", val: req.user.user_email}],
                [{table: `JOIN moral_it_device.${userView} as us`, on: 'us.user_emp_code=it.user_emp_code'}]
            ))
        } else {

            results = await connMSQL.connection_pool(validator.foundId(table,columns,
                '',
                [{table: `JOIN moral_it_device.${userView} as us`, on: 'us.user_emp_code=it.user_emp_code'}]
            ))
        }
        let {status_pool,data} = results
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
router.get('/:id',JwtAuth,async(req,res)=>{
    try {
        // if(!connMSQL.handdleConnection()){
        
        // let {status_pool:status_p,data:items,msg:msg} = await connMSQL.connection_pool(
        // `SELECT itemId,item_name,item_number,item_type,user_first_name,
        // user_last_name,user_email,user_group FROM moral_it_device.item as item 
        // join moral_it_device.user as user on user.user_emp_code = item.user_emp_code 
        // WHERE item.itemId = "${req.params.id}";`)
        let {status_pool:status_p,data:items,msg:msg} = await connMSQL.connection_pool(validator.foundId(table,columns,
            [{col: "user_email", val: req.user.user_email, log: "AND"},{col: "itemId",val: req.params.id}],
            [{table: `JOIN moral_it_device.${userView} as us`, on: 'us.user_emp_code=it.user_emp_code'}]
        ))

        if(status_p && items.length!=0){
            return res.status(200).json(items)
        }
        else if(status_p && items.length==0){
            blockPermissionWithEmail(req,res,items[0].user_email)
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

router.get('/emp-code/:id',JwtAuth,async(req,res)=>{
    try {
        // if(!connMSQL.handdleConnection()){
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
        // }else{
        //     console.log(`Cannot connect to mysql server !!`) 
        //     throw new Error('connection error something')
        // } 
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
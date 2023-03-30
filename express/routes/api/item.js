const express =require('express')
const router =express.Router()
// const users =require("../../data/Users")
// const uuid =require("uuid")
const validator = require('../../validator/validate')
const connMSQL=require('../../mysql/db_config')
const errorModel =require('../../response/errorModel')

const table='item'

//get item
router.get('/',async(req,res)=>{

    try {
        if(!connMSQL.handdleConnection()){
            
            let {status_pool,data} = await connMSQL.connection_pool(`SELECT item_name,item_number,item_type,user_first_name,user_last_name,user_email,user_group FROM moral_it_device.item as item join moral_it_device.user as user on user.user_emp_code=item.user_emp_code;`)
            if(status_pool){
                return res.status(400).json(errorModel(err.message,req.originalUrl))

            }else{
                return res.status(200).json(data)
            }
            // connMSQL.connection.query(
            //     // `SELECT * FROM moral_it_device.${table}`,
            //     `SELECT item_name,item_number,item_type,user_first_name,user_last_name,user_email,user_group FROM moral_it_device.item as item join moral_it_device.user as user on user.user_emp_code=item.user_emp_code;
            //     `,
            //     (err,results)=>{
            //         if(err){
            //             console.log(err)
            //             return res.status(400).json(errorModel(err.message,req.originalUrl))
            //         }
            //         res.status(200).json(results)
            //     }
            // )
        }else{
            console.log(`Cannot connect to mysql server !!`) 
            throw new Error('connection error something :',err)
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(errorModel(error.message,req.originalUrl))
    }
})


// get item by id
router.get('/:id',async(req,res)=>{
    try {
        if(!connMSQL.handdleConnection()){
            let {status_pool,data} = await connMSQL.connection_pool(`SELECT item_name,item_number,item_type,user.user_emp_code FROM moral_it_device.item as item join moral_it_device.user as user on user.user_emp_code = item.user_emp_code WHERE user.user_emp_code = ${req.params.id};` )
            if(status_pool){
                return res.status(400).json(errorModel(err.message,req.originalUrl))

            }else{
                return res.status(200).json(data)
            }
        //    console.log(data) 
           //  connMSQL.connection.query(

            //     //this statement
            //     `SELECT item_name,item_number,item_type,user.user_emp_code FROM moral_it_device.item as item join moral_it_device.user as user on user.user_emp_code = item.user_emp_code WHERE user.user_emp_code = ${req.params.id};`
            //     ,
            //     // validator.foundId(req,table),

            //     (err,results)=>{
            //         if(err){
            //             console.log(err)
            //             return res.status(400).json(errorModel(err.message,req.originalUrl))
            //         }

            //         if(results.length==0){
            //             console.log(`${table} id  ${req.params.id} does not exist`)
            //             res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
            //         }else{
            //             res.status(200).json(results)
            //         }
            //     }
            // )
        }else{
            console.log(`Cannot connect to mysql server !!`) 
            throw new Error('connection error something :',err)
        } 
    } catch (error) {
        res.status(500).json(errorModel(error.message,req.originalUrl))
    }

})






module.exports=router
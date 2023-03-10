const express =require('express')
const router =express.Router()
const users =require("../../data/Users")
const uuid =require("uuid")
const validator = require('../../validator/validate')
const connMSQL=require('../../mysql/db_config')
const errorModel =require('../../response/errorModel')

const table='request'

// get request
router.get('/',async(req,res)=>{

    try {
        if(!connMSQL.handdleConnection()){
            connMSQL.connection.query(
                `SELECT * FROM moral_it_device.${table}`,
                (err,results)=>{
                    if(err){
                        console.log(err)
                        throw new Error(`Query ${table} error : `,err)
                    }
                    res.status(200).json(results)
                }
            )
        }else{
            console.log(`Cannot connect to mysql server !!`) 
            throw new Error('connection error something :',err)
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(errorModel(error.message,req.originalUrl))
    }
})


// get request by id
router.get('/:id',async(req,res)=>{

    try {
        if(!connMSQL.handdleConnection()){
             connMSQL.connection.query(

                //this statement
                validator.foundId(req,table),

                (err,results)=>{
                    if(err){
                        console.log(err)
                        throw new Error(`find ${table} by id err :`,err)
                    }

                    if(results.length==0){
                        console.log(`${table} id  ${req.params.id} does not exist`)
                        res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
                    }else{
                        res.status(200).json(results)
                    }
                }
            )
        }else{
            console.log(`Cannot connect to mysql server !!`) 
            throw new Error('connection error something :',err)
        } 
    } catch (error) {
        res.status(500).json(errorModel(error.message,req.originalUrl))
    }

})

// create request
router.post('/',async(req,res)=>{
    let data
    let status=undefined
    try{

        data=[
            {prop:"request_first_name"      ,value: validator.validateStr(await req.body.request_first_name,100,table,'request_first_name'),type:'str'},
            {prop:"request_last_name"       ,value: validator.validateStr(await req.body.request_last_name,100,table,'request_last_name'),type:'str'},
            {prop:"request_email"           ,value: validator.validateEmail(await req.body.request_email,100,table,'request_email'),type:'str'},
            {prop:"request_group"           ,value: validator.validateStr(await req.body.request_group,100,table,'request_group'),type:'str'},
            {prop:"request_service_type"    ,value: validator.validateStr(await req.body.request_service_type,100,table,'request_service_type'),type:'str'},
            {prop:"request_subject"         ,value: validator.validateStr(await req.body.request_subject,100,table,'request_subject'),type:'str'},
            {prop:"request_status"          ,value: validator.validateStr(await req.body.request_status,100,table,'request_status'),type:'str'},
            {prop:"request_req_date"        ,value: validator.validateDate(await req.body.request_req_date,table,'request_req_date'),type:'str'},
            {prop:"request_assign"          ,value: validator.validateStr(await req.body.request_assign,100,table,'request_assign'),type:'str'},
            {prop:"request_use_type"        ,value: validator.validateStr(await req.body.request_use_type,5,table,'request_use_type'),type:'str'},
            {prop:"request_sn"              ,value: validator.validateStr(await req.body.request_sn,50,table,'request_sn'),type:'str'},
            {prop:"request_brand"           ,value: validator.validateStr(await req.body.request_brand,100,table,'request_brand'),type:'str'},
            {prop:"request_type_matchine"   ,value: validator.validateStr(await req.body.request_type_matchine,50,table,'request_type_matchine'),type:'str'},
            {prop:"request_other"           ,value: validator.validateStr(await req.body.request_other,150,table,'request_other'),type:'str'},
            {prop:"request_problems"        ,value: validator.validateStr(await req.body.request_problems,150,table,'request_problems'),type:'str'},
        
        ]
        // console.log('testing',await req.body.role)
        status=!(await validator.checkUndefindData(data,table))
        // validator.createData(data,table)
    }catch(err){
        console.log(err)
        status=false
        // console.log(status)
        
        res.status(400).json(errorModel(err.message,req.originalUrl))
    }

    if(status==true){
        try {

            if(!connMSQL.handdleConnection()){
                
                connMSQL.connection.query(
                        
                    validator.createData(data,table,res),

                    (err,results)=>{
                        // error
                        if(err){
                            console.log(err)
                            return res.status(400).json(errorModel(err.message,req.originalUrl))
                        }
                        console.log(results)
                        console.log(`create ${table} success!!`)
                        return res.status(200).json({message:`create ${table} success!!`,status:'200'})
                    }
                )

            }else{
                console.log(`Cannot connect to mysql server !!`) 
                throw new Error('connection error something :',err)
            } 
        } catch (error) {
            res.status(500).json(errorModel(error.message,req.originalUrl))
        }
    }
})

// create data
router.post('/:id',(req,res)=>{
    res.status(400).json(errorModel('bad request !! 😒,create data dont need params data !!',req.originalUrl))
})

// delete
router.delete('/:id',async(req,res)=>{
    // delete data
    try {
        if(!connMSQL.handdleConnection()){
            connMSQL.connection.query(

                //this statement
                validator.deleteData(req,table),

                (err,results)=>{
                    if(err){
                        console.log(err)
                        throw new Error(`cannot delete ${table} by id ${req.params.id} :`,err)
                    }
                        
                    console.log(results)
                    if(results.affectedRows==0){
                        return res.status(400).json(errorModel(`${table} id: ${req.params.id} does not exist`,req.originalUrl))
                    }else{
                        return res.status(200).json({message:`delete ${table} id ${req.params.id} success!!`,status:'200'})

                    }
                }
            )
        }else{
                console.log(`Cannot connect to mysql server !!`) 
                throw new Error('connection error something :',err)
        } 
    } catch (error) {
        res.status(500).json(errorModel(error.message,req.originalUrl))
    }
})

// delete data
router.delete('/',(req,res)=>{
    res.status(400).json(errorModel("bad request !! 😒,need params data to delete !!",req.originalUrl))
})


// update data
router.put('/:id',async(req,res)=>{
    let data
    let status=undefined
    try{
        data=[
            {prop:"request_first_name"      ,value: validator.validateStr(await req.body.request_first_name,100,table,'request_first_name'),type:'str'},
            {prop:"request_last_name"       ,value: validator.validateStr(await req.body.request_last_name,100,table,'request_last_name'),type:'str'},
            {prop:"request_email"           ,value: validator.validateEmail(await req.body.request_email,100,table,'request_email'),type:'str'},
            {prop:"request_group"           ,value: validator.validateStr(await req.body.request_group,100,table,'request_group'),type:'str'},
            {prop:"request_service_type"    ,value: validator.validateStr(await req.body.request_service_type,100,table,'request_service_type'),type:'str'},
            {prop:"request_subject"         ,value: validator.validateStr(await req.body.request_subject,100,table,'request_subject'),type:'str'},
            {prop:"request_status"          ,value: validator.validateStr(await req.body.request_status,100,table,'request_status'),type:'str'},
            {prop:"request_req_date"        ,value: validator.validateDate(await req.body.request_req_date,table,'request_req_date'),type:'str'},
            {prop:"request_assign"          ,value: validator.validateStr(await req.body.request_assign,100,table,'request_assign'),type:'str'},
            {prop:"request_use_type"        ,value: validator.validateStr(await req.body.request_use_type,5,table,'request_use_type'),type:'str'},
            {prop:"request_sn"              ,value: validator.validateStr(await req.body.request_sn,50,table,'request_sn'),type:'str'},
            {prop:"request_brand"           ,value: validator.validateStr(await req.body.request_brand,100,table,'request_brand'),type:'str'},
            {prop:"request_type_matchine"   ,value: validator.validateStr(await req.body.request_type_matchine,50,table,'request_type_matchine'),type:'str'},
            {prop:"request_other"           ,value: validator.validateStr(await req.body.request_other,150,table,'request_other'),type:'str'},
            {prop:"request_problems"        ,value: validator.validateStr(await req.body.request_problems,150,table,'request_problems'),type:'str'},
        
        ]
        // console.log('testing',await req.body.role)
        status=!(await validator.checkUndefindData(data,table))
        // validator.createData(data,table)
    }catch(err){
        console.log(err)
        status=false
        // console.log(status)
        
        res.status(400).json(errorModel(err.message,req.originalUrl))
    }

    if(status==true){
        // delete data
        try {
            if(!connMSQL.handdleConnection()){
                connMSQL.connection.query(

                    //this statement
                    validator.updateData(req,data,table),

                    (err,results)=>{
                        if(err){
                            console.log(err)
                            return res.status(400).json(errorModel(err.message,req.originalUrl))                        }
                            
                        console.log(results)
                        console.log(`update ${table} success!!`)
                        if(results.affectedRows==0){
                            return res.status(400).json(errorModel(`${table} id: ${req.params.id} does not exist`,req.originalUrl))
                        }else{
                            return res.status(200).json({message:`update ${table} id ${req.params.id} success!!`,status:'200'})
    
                        }
                    }
                )
            }else{
                    console.log(`Cannot connect to mysql server !!`) 
                    throw new Error('connection error something :',err)
            } 
        } catch (error) {
            res.status(500).json(errorModel(error.message,req.originalUrl))
        }
    }
})

// update data
router.put('/',(req,res)=>{
    res.status(400).json(errorModel('bad request !! 🤨,need param data to update!! ',req.originalUrl))
})

module.exports=router
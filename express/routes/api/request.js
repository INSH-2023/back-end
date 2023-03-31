const express =require('express')
const router =express.Router()
const uuid =require("uuid")
const validator = require('../../validator/validate')
const connMSQL=require('../../mysql/db_config')
const errorModel =require('../../response/errorModel')

const table='request'




// get data
router.get('/',async(req,res)=>{

    let col ='requestId,request_first_name,request_last_name,request_email,request_group,request_service_type,request_subject,request_status,DATE_FORMAT(request_req_date,"%Y-%m-%d %H:%i:%s") as request_req_date,request_assign,request_use_type,request_sn,request_brand,request_type_matchine,request_other,request_problems,request_message'

    try {
        if(!connMSQL.handdleConnection()){
            
            let {status_pool:status_p,data:requests,msg:msg} = await connMSQL.connection_pool(`SELECT ${col} FROM moral_it_device.${table}`)
            if(status_p){
                return res.status(200).json(requests)
            }
            // connMSQL.connection.query(
            //     `SELECT requestId,request_first_name,request_last_name,request_email,request_group,request_service_type,request_subject,request_status,DATE_FORMAT(request_req_date,"%Y-%m-%d %H:%i:%s") as request_req_date,request_assign,request_use_type,request_sn,request_brand,request_type_matchine,request_other,request_problems,request_message
            //     FROM moral_it_device.request`,
            //     (err,results)=>{
            //         if(err){
            //             console.log(err)
            //             throw new Error(`Query ${table} error : `,err)
            //         }
                    
            //         return res.status(200).json(results)
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


// get data by id
router.get('/:id',async(req,res)=>{
    try {
        if(!connMSQL.handdleConnection()){
            let {status_pool:status_p,data:requests,msg:msg} = await connMSQL.connection_pool(validator.foundId(req,table))
            if(status_p &&requests.length!=0){
                return res.status(200).json(requests)
            }else
            if(status_p&&requests.length==0){
                return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))

            }
            //  connMSQL.connection.query(

            //     //this statement
            //     validator.foundId(req,table),

            //     (err,results)=>{
            //         if(err){
            //             console.log(err)
            //             return res.status(400).json(errorModel(err.message,req.originalUrl))
            //         }

            //         if(results.length==0){
            //             console.log(`${table} id  ${req.params.id} does not exist`)
            //             return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
            //         }else{
            //             return res.status(200).json(results)
            //         }
            //     }
            // )
        }else{
            console.log(`Cannot connect to mysql server !!`) 
            throw new Error('connection error something')
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
            {prop:"request_first_name"      ,value: validator.validateStrNotNull(await req.body.request_first_name,100,table,'request_first_name'),type:'str'},
            {prop:"request_last_name"       ,value: validator.validateStrNotNull(await req.body.request_last_name,100,table,'request_last_name'),type:'str'},
            {prop:"request_email"           ,value: validator.validateEmail(await req.body.request_email,100,table,'request_email'),type:'str'},
            {prop:"request_group"           ,value: validator.validateStrNotNull(await req.body.request_group,100,table,'request_group'),type:'str'},
            {prop:"request_service_type"    ,value: validator.validateStrNotNull(await req.body.request_service_type,100,table,'request_service_type'),type:'str'},
            {prop:"request_subject"         ,value: validator.validateStrNotNull(await req.body.request_subject,100,table,'request_subject'),type:'str'},
            {prop:"request_status"          ,value: validator.validateStrNotNull(await req.body.request_status,100,table,'request_status'),type:'str'},
            {prop:"request_assign"          ,value: validator.validateStrNotNull(await req.body.request_assign,100,table,'request_assign'),type:'str'},
            {prop:"request_use_type"        ,value: validator.validateStrNotNull(await req.body.request_use_type,5,table,'request_use_type'),type:'str'},
            {prop:"request_sn"              ,value: validator.validateStrNull(await req.body.request_sn,50,table,'request_sn') ,type:'str'},
            {prop:"request_brand"           ,value: validator.validateStrNull(await req.body.request_brand,100,table,'request_brand'),type:'str'},
            {prop:"request_type_matchine"   ,value: validator.validateStrNull(await req.body.request_type_matchine,50,table,'request_type_matchine'),type:'str'},
            {prop:"request_other"           ,value: validator.validateStrNull(await req.body.request_other,150,table,'request_other'),type:'str'},
            {prop:"request_problems"        ,value: validator.validateStrNotNull(await req.body.request_problems,150,table,'request_problems'),type:'str'},
            // {prop:"request_message"        ,value: validator.validateStr(await req.body.request_message,150,table,'request_message'),type:'str'},
            {prop:"request_message"        ,value: validator.validateStrNull(await req.body.request_message,150,table,'request_message'),type:'str'},
        
        ]
        // console.log('testing',await req.body.role)
        status=!(await validator.checkUndefindData(data,table))
        // validator.createData(data,table)
    }catch(err){
        console.log(err)
        status=false
        // console.log(status)
        
        return res.status(400).json(errorModel(err.message,req.originalUrl))
    }

    if(status==true){
        try {

            if(!connMSQL.handdleConnection()){
                let {status_pool:status_p,data:requests,msg:msg} = await connMSQL.connection_pool(validator.createData(data,table,res))
                if(status_p){
                    return res.status(200).json({message:`create ${table} success!!`,status:'200'})
                } 
                // else if(status_p==false&&msg.errno==1062){
                //     return res.status(400).json(errorModel("Duplicate data",req.originalUrl))
                // } 
                // connMSQL.connection.query(
                        
                //     validator.createData(data,table,res),

                //     (err,results)=>{
                //         // error
                //         if(err){
                //             console.log(err)
                //             return res.status(400).json(errorModel(err.message,req.originalUrl))
                //         }
                //         console.log(results)
                //         console.log(`create ${table} success!!`)
                //         return res.status(200).json({message:`create ${table} success!!`,status:'200'})
                //     }
                // )

            }else{
                console.log(`Cannot connect to mysql server !!`) 
                throw new Error('connection error something')
            } 
        } catch (error) {
            res.status(500).json(errorModel(error.message,req.originalUrl))
        }
    }else{
        return res.status(400).json(errorModel('data not valid',req.originalUrl))
    }
})

// create data
router.post('/:id',(req,res)=>{
    res.status(405).json(errorModel('method not allow',req.originalUrl))
})

// delete
router.delete('/:id',async(req,res)=>{
    // delete data
    try {
        if(!connMSQL.handdleConnection()){
            let {status_pool:status_p,data:requests,msg:msg}=await connMSQL.connection_pool(validator.deleteData(req,table))
            if(status_p&&requests.affectedRows!=0){
                console.log(msg)
                return res.status(200).json({message:`delete ${table} id ${req.params.id} success!!`,status:'200'})

            }else
            if(status_p&&requests.affectedRows==0){
                return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
                // return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))

            }
            // connMSQL.connection.query(

            //     //this statement
            //     validator.deleteData(req,table),

            //     (err,results)=>{
            //         if(err){
            //             console.log(err)
            //             throw new Error(`cannot delete ${table} by id ${req.params.id} :`,err)
            //         }
                        
            //         console.log(results)
            //         if(results.affectedRows==0){
            //             return res.status(400).json(errorModel(`${table} id: ${req.params.id} does not exist`,req.originalUrl))
            //         }else{
            //             return res.status(200).json({message:`delete ${table} id ${req.params.id} success!!`,status:'200'})

            //         }
            //     }
            // )
        }else{
                console.log(`Cannot connect to mysql server !!`) 
                throw new Error('connection error something ')
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
            // {prop:"request_first_name"      ,value: validator.validateStr(await req.body.request_first_name,100,table,'request_first_name'),type:'str'},
            // {prop:"request_last_name"       ,value: validator.validateStr(await req.body.request_last_name,100,table,'request_last_name'),type:'str'},
            // {prop:"request_email"           ,value: validator.validateEmail(await req.body.request_email,100,table,'request_email'),type:'str'},
            // {prop:"request_group"           ,value: validator.validateStr(await req.body.request_group,100,table,'request_group'),type:'str'},
            // {prop:"request_service_type"    ,value: validator.validateStr(await req.body.request_service_type,100,table,'request_service_type'),type:'str'},
            // {prop:"request_subject"         ,value: validator.validateStr(await req.body.request_subject,100,table,'request_subject'),type:'str'},
            {prop:"request_status"          ,value: validator.validateStrNotNull(await req.body.request_status,100,table,'request_status'),type:'str'},
            // {prop:"request_req_date"        ,value: validator.validateDate(await req.body.request_req_date,table,'request_req_date'),type:'str'},
            {prop:"request_assign"          ,value: validator.validateStrNotNull(await req.body.request_assign,100,table,'request_assign'),type:'str'},
            // {prop:"request_use_type"        ,value: validator.validateStr(await req.body.request_use_type,5,table,'request_use_type'),type:'str'},
            // {prop:"request_sn"              ,value: validator.validateStr(await req.body.request_sn,50,table,'request_sn'),type:'str'},
            // {prop:"request_brand"           ,value: validator.validateStr(await req.body.request_brand,100,table,'request_brand'),type:'str'},
            // {prop:"request_type_matchine"   ,value: validator.validateStr(await req.body.request_type_matchine,50,table,'request_type_matchine'),type:'str'},
            // {prop:"request_other"           ,value: validator.validateStr(await req.body.request_other,150,table,'request_other'),type:'str'},
            // {prop:"request_problems"        ,value: validator.validateStr(await req.body.request_problems,150,table,'request_problems'),type:'str'},
            // {prop:"request_message"         ,value: validator.validateStr(await req.body.request_message,150,table,'request_message'),type:'str'},

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
                let {status_pool:status_p,data:requests,msg:msg}=await connMSQL.connection_pool(validator.updateData(req,data,table))

                if(status_p&&requests.affectedRows!=0){
                    return res.status(200).json({message:`update ${table} id ${req.params.id} success!!`,status:'200'})
                }else
                if(status_p&&requests.affectedRows==0){
                    return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
                }
                // connMSQL.connection.query(

                //     //this statement
                //     validator.updateData(req,data,table),

                //     (err,results)=>{
                //         if(err){
                //             console.log(err)
                //             return res.status(400).json(errorModel(err.message,req.originalUrl))                        }
                            
                //         console.log(results)
                //         console.log(`update ${table} success!!`)
                //         if(results.affectedRows==0){
                //             return res.status(400).json(errorModel(`${table} id: ${req.params.id} does not exist`,req.originalUrl))
                //         }else{
                //             return res.status(200).json({message:`update ${table} id ${req.params.id} success!!`,status:'200'})
    
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
    }
})

// update data
router.put('/',(req,res)=>{
    res.status(405).json(errorModel('method not allow',req.originalUrl))
})

module.exports=router
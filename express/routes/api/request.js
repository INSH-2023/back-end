const express =require('express')
const router =express.Router()
const uuid =require("uuid")
const validator = require('../../validator/validate')
const connMSQL =require('../../config/db_config')
const errorModel =require('../../response/errorModel')
const sendMail=require('../../config/mailer_config')
const line =require('../../config/lineChat_config')

const table='request'
const { JwtAuth, verifyRole } = require("../../middleware/jwtAuthen");

// get data
router.get('/',JwtAuth, async(req,res)=>{
    // can sorted data
    try {
        if(!connMSQL.handdleConnection()){
            let columns = ['first_name','last_name','email','group','service_type','subject','status',
            'req_date','assign','use_type','sn','brand','type_matchine','other','problems','message']
            let {status_pool,data} = await connMSQL.connection_pool(
                `SELECT requestId,request_first_name,request_last_name,request_email,request_group,
                request_service_type,request_subject,request_status,DATE_FORMAT(request_req_date,"%Y-%m-%d %H:%i:%s") 
                as request_req_date,request_assign,request_use_type,request_sn,request_brand,request_type_matchine,
                request_other,request_problems,request_message FROM moral_it_device.request 
                order by request${columns.includes(req.query.sort)
                ? '_' + req.query.sort : 'Id'} ${req.query.sortType == 'desc' ? 'desc': 'asc'}`)
            if (req.user.user_role == "user") {
                data=data.filter(e=> e.request_email == req.user.user_email)
            }
            return res.status(200).json(data)
        } else {
            console.log(`Cannot connect to mysql server !!`) 
            throw new Error('connection error something :',err)
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json(errorModel(error.message,req.originalUrl))
    }
})

// get data by id
router.get('/:id',JwtAuth,async(req,res)=>{
    try {
        if(!connMSQL.handdleConnection()){
            let {status_pool:status_p,data:requests,msg:msg} = await connMSQL.connection_pool(validator.foundId(req,table))
            blockPermissionWithEmail(req,res,requests[0].request_email)
            if(status_p &&requests.length!=0){
                return res.status(200).json(requests)
            }else
            if(status_p&&requests.length==0){
                return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
            }
        }else{
            console.log(`Cannot connect to mysql server !!`) 
            throw new Error('connection error something')
        } 
    } catch (error) {
        res.status(400).json(errorModel(error.message,req.originalUrl))
    }
})

// create request
router.post('/',JwtAuth,async(req,res)=>{
    let input
    let status=undefined
    try{
        // data=await validator.validateRequestData(req)
        input=[
            {prop:"request_first_name"      ,value:  validator.validateStrNotNull( await req.body.request_first_name,100,table,'request_first_name'),type:'str'},
            {prop:"request_last_name"       ,value:  validator.validateStrNotNull( await req.body.request_last_name,100,table,'request_last_name'),type:'str'},
            {prop:"request_email"           ,value:  validator.validateEmail( await req.body.request_email,100,table,'request_email'),type:'str'},
            {prop:"request_group"           ,value:  validator.validateStrNotNull( await req.body.request_group,100,table,'request_group'),type:'str'},
            {prop:"request_service_type"    ,value:  validator.validateStrNotNull( await req.body.request_service_type,100,table,'request_service_type'),type:'str'},
            {prop:"request_subject"         ,value:  validator.validateStrNotNull( await req.body.request_subject,100,table,'request_subject'),type:'str'},
            {prop:"request_status"          ,value:  validator.validateStrNotNull( await req.body.request_status,100,table,'request_status'),type:'str'},
            {prop:"request_assign"          ,value:  validator.validateStrNotNull( await req.body.request_assign,100,table,'request_assign'),type:'str'},
            {prop:"request_use_type"        ,value:  validator.validateStrNull( await req.body.request_use_type,4,table,'request_use_type'),type:'str'},
            {prop:"request_sn"              ,value:  validator.validateStrNull( await req.body.request_sn,50,table,'request_sn') ,type:'str'},
            {prop:"request_brand"           ,value:  validator.validateStrNull( await req.body.request_brand,100,table,'request_brand'),type:'str'},
            {prop:"request_type_matchine"   ,value:  validator.validateStrNull( await req.body.request_type_matchine,50,table,'request_type_matchine'),type:'str'},
            {prop:"request_other"           ,value:  validator.validateStrNull( await req.body.request_other,150,table,'request_other'),type:'str'},
            {prop:"request_problems"        ,value:  validator.validateStrNotNull( await req.body.request_problems,150,table,'request_problems'),type:'str'},
            // {prop:"request_message"        ,value: validator.validateStr(await req.body.request_message,150,table,'request_message'),type:'str'},
            {prop:"request_message"        ,value:  validator.validateStrNull( await req.body.request_message,150,table,'request_message'),type:'str'},
        
        ]
        console.log(input)
        // console.log('testing',await req.body.role)
        status=!(await validator.checkUndefindData(input,table))
        // validator.createData(data,table)

        blockPermissionWithEmail(req, res, input[2].value)

        } catch(err) {
        console.log(err)
        status=false
        // console.log(status)
        return res.status(400).json(errorModel(err.message,req.originalUrl))
    }

    // if(status==true){
    //     try {
    //         // if(!connMSQL.handdleConnection()){
    //             let {status_pool:status_p,data:requests,msg:msg} = await connMSQL.connection_pool(validator.createData(input,table,res))
    //             if(status_p){
    //                 // let sub ='This is summary report!!'
    //                 // let service=await req.body.request_service_type
    //                 // let fname=`${await req.body.request_first_name} ${await req.body.request_last_name}`
    //                 // let subject=await req.body.request_subject
    //                 // let type_of_use=await req.body.request_use_type
    //                 // let type_machine=await req.body.request_type_matchine
    //                 // let brand_name=await req.body.request_brand
    //                 // let problems=await req.body.request_problems
    //                 // let other =await req.body.request_other
    //                 // let message =await req.body.request_message
    //                 // let email =await req.body.request_email
    //                 // await sendMail.sendMail('request',res,sub,sendMail.report_html(service,subject,type_of_use,type_machine,brand_name,problems,other,message),email)
    //                 // await line.send(service,fname,email,subject,type_of_use,type_machine,brand_name,problems,other,message)
    //                 return res.status(200).json({message:`create ${table} success!!`,status:'200'})
    //             } 

    //             // else if(status_p==false&&msg.errno==1062){
    //             //     return res.status(400).json(errorModel("Duplicate data",req.originalUrl))
    //             // } 
    //             // connMSQL.connection.query(
                        
    //             //     validator.createData(data,table,res),

    //             //     (err,results)=>{
    //             //         // error
    //             //         if(err){
    //             //             console.log(err)
    //             //             return res.status(400).json(errorModel(err.message,req.originalUrl))
    //             //         }
    //             //         console.log(results)
    //             //         console.log(`create ${table} success!!`)
    //             //         return res.status(200).json({message:`create ${table} success!!`,status:'200'})
    //             //     }
    //             // )

    //         // }else{
    //         //     console.log(`Cannot connect to mysql server !!`) 
    //         //     throw new Error('connection error something')
    //         // } 
    //     } catch (error) {
    //         console.log(error)
    //         return res.status(500).json(errorModel(error.message,req.originalUrl))
    //     }
    // } else {
    //     return res.status(400).json(errorModel('data not valid',req.originalUrl))
    // }
})

// delete
router.delete('/:id',JwtAuth,async(req,res)=>{
    // delete data
    try {
        if(!connMSQL.handdleConnection()){
            let {status_pool:status_p,data:requests,msg:msg}=await connMSQL.connection_pool(validator.deleteData(req,table,'requestId'))
            
            blockPermissionWithEmail(req, res, requests[0].request_email)

            if(status_p&&requests.affectedRows!=0){
                console.log(msg)
                return res.status(200).json({message:`delete ${table} id ${req.params.id} success!!`,status:'200'})

            }else
            if(status_p&&requests.affectedRows==0){
                return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
                // return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))

            }
        }else{
                console.log(`Cannot connect to mysql server !!`) 
                throw new Error('connection error something ')
        }
    } catch (error) {
        res.status(400).json(errorModel(error.message,req.originalUrl))
    }
})

// update data
router.put('/:id',JwtAuth,async(req,res)=>{
    let input
    let status=undefined
    try{
        input=[
            {prop:"request_status" ,value: validator.validateStrNotNull(await req.body.request_status,100,table,'request_status'),type:'str'},
            {prop:"request_assign" ,value: validator.validateStrNotNull(await req.body.request_assign,100,table,'request_assign'),type:'str'}
        ]
        // console.log('testing',await req.body.role)
        status=!(await validator.checkUndefindData(input,table))
        // validator.createData(data,table)
    } catch(err) {
        console.log(err)
        status=false
        // console.log(status)
        res.status(400).json(errorModel(err.message,req.originalUrl))
    }

    if(status==true){
        // update data
        try {
            if(!connMSQL.handdleConnection()){
                let {status_pool,data: requests} = await connMSQL.connection_pool(validator.foundId(req,table,'*',`requestId=${req.params.id}`))
                blockPermissionWithEmail(req, res, requests[0].request_email)
                if (data.length == 0) {
                    return res.status(404).json(errorModel(`${table} id ${req.params.id} does not exist`,req.originalUrl))
                } else {
                    await connMSQL.connection_pool(validator.updateData(req,input,table))
                    return res.status(200).json({message:`update ${table} id ${req.params.id} success!!`,status:'200'})
                }
            } else {
                console.log(`Cannot connect to mysql server !!`) 
                throw new Error('connection error something :',err)
            } 
        } catch (error) {
            res.status(400).json(errorModel(error.message,req.originalUrl))
        }
    }
})

function blockPermissionWithEmail(req, res, email) {
    if (req.user.user_role == "user" && email !== req.user.user_email) {
        return res.status(403).json(errorModel(`cannot access other user email with user permission`,req.originalUrl))
    }
}

module.exports=router
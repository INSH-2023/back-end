const express =require('express')
const router =express.Router()
// const users =require("../../data/Users")
// const uuid =require("uuid")
const validator = require('../../validator/validate')
const connMSQL =require('../../config/db_config')
const errorModel =require('../../response/errorModel')
const { cookieJwtAuth } = require("../../middleware/jwtAuthen");

const table ="problem"
// get data
router.get('/',cookieJwtAuth,async(req,res)=>{
    // console.log('header',req.headers.subject_type)
    try {
        // if(!connMSQL.handdleConnection()){
            // if ( req.headers.subject_type == undefined || req.headers.subject_type == null ) {
            let {status_pool:status_p,data:problems,msg:msg} = await connMSQL.connection_pool(`SELECT * FROM moral_it_device.${table};`)
            if(status_p){
                return res.status(200).json(problems)
            }

        // } else {
        //     console.log(`Cannot connect to mysql server !!`) 
        //     throw new Error('connection error somethin')
        // }
    } catch (error) {
        console.log(error)
        return res.status(500).json(errorModel(error.message,req.originalUrl))
    }
})

router.get('/type/:type',async(req,res)=>{
    try {
        // if(!connMSQL.handdleConnection()){
            let {status_pool:status_p,data:problems,msg:msg} = await connMSQL.connection_pool(`SELECT * FROM moral_it_device.${table} where problem_type='${req.params.type}';`)
            if(status_p && problems.length!=0){
                return res.status(200).json(problems)
            }else
            if(status_p && problems.length==0){
                return res.status(404).json(errorModel(`${table} type ${req.params.type} does not exist`,req.originalUrl))
            }
        // }
    }catch(error){
        console.log(error)
        return res.status(500).json(errorModel(error.message,req.originalUrl))
    }
})

// create problem
router.post('/',async(req,res)=>{
    console.log(req.body)
    let data
    let status=undefined
    try{
        data=[
            {prop:"problem_problem",value: validator.validateStrNotNull(await req.body.problem_problem,100,table,'problem_problem'),type:'str'},
            {prop:"problem_type",value: validator.validateStrNotNull(await req.body.problem_type,45,table,'problem_type'),type:'str'},
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
                let {status_pool:status_p,data:problems,msg:msg} = await connMSQL.connection_pool(validator.createData(data,table,res))
                if(status_p){
                    
                    return res.status(200).json({message:`create ${table} success!!`,status:'200'})
                }
                
            }else{
                console.log(`Cannot connect to mysql server !!`) 
                throw new Error('connection error something')
            } 
        } catch (error) {
            res.status(500).json(errorModel(error.message,req.originalUrl))
        }
    }
})

// delete
router.delete('/:id',async(req,res)=>{
    // delete data
    try {
        if(!connMSQL.handdleConnection()){
            let {status_pool:status_p,data:problems,msg:msg} = await connMSQL.connection_pool(validator.deleteData(req,table,'problemId'))
                if(status_p&&problems.affectedRows!=0){
                    return res.status(200).json({message:`delete ${table} id ${req.params.id} success!!`,status:'200'})
                }else
                if(status_p&&problems.affectedRows==0){
                    return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
                    // return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
    
                }
        }else{
                console.log(`Cannot connect to mysql server !!`) 
                throw new Error('connection error something')
        } 
    } catch (error) {
        res.status(500).json(errorModel(error.message,req.originalUrl))
    }
})

// update data
router.put('/:id',async(req,res)=>{
    let input
    let status=undefined
    try{
        input=[    
        {prop:"problem_problem",value: validator.validateStrNotNull(await req.body.problem_problem,100,table,'problem_problem'),type:'str'},
        {prop:"problem_type",value: validator.validateStrNotNull(await req.body.problem_type,45,table,'problem_type'),type:'str'},
    ]
        // console.log('testing',await req.body.role)
        status=!(await validator.checkUndefindData(input,table))
        // validator.createData(data,table)
    }catch(err){
        console.log(err)
        status=false
        // console.log(status)
        
        res.status(400).json(errorModel(err.message,req.originalUrl))
    }

    if(status==true){
        // update data
        try {
            if(!connMSQL.handdleConnection()){
                let {status_pool:status_p,data:problems,msg:msg} = await connMSQL.connection_pool(validator.updateData(req,input,table))
                if(status_p&&problems.affectedRows!=0){
                    return res.status(200).json({message:`update ${table} id ${req.params.id} success!!`,status:'200'})
                    
                }else
                if(status_p&&problems.affectedRows==0){
                    return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
                }
            // }else{
            //         console.log(`Cannot connect to mysql server !!`) 
            //         throw new Error('connection error something')
            // } 
            }
        } catch (error) {
            res.status(500).json(errorModel(error.message,req.originalUrl))
        }
    }
})

module.exports=router
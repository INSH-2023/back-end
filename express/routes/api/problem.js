const express =require('express')
const router =express.Router()
// const users =require("../../data/Users")
// const uuid =require("uuid")
const validator = require('../../validator/validate')
const connMSQL=require('../../mysql/db_config')
const errorModel =require('../../response/errorModel')

const table ="problem"
// get data
router.get('/',async(req,res)=>{
    console.log('params',req.query.problem_type) // request by params
    try {
        if(!connMSQL.handdleConnection()){
            if ( req.query.problem_type == undefined || req.query.problem_type == null ) {
                let {status_pool,data} = await connMSQL.connection_pool(`SELECT * FROM moral_it_device.${table};`)
                if(status_pool){
                   
                return res.status(200).json(data)
                }else{
                    return res.status(400).json(errorModel(err.message,req.originalUrl))
                    
                }
            } else {
                let {status_pool,data} = await connMSQL.connection_pool(`SELECT * FROM moral_it_device.${table} where problem_type like '%${req.query.problem_type}%';`)
                if(status_pool){
                    return res.status(200).json(data)
    
                }else{
                    return res.status(400).json(errorModel(err.message,req.originalUrl))
                }
            }
        } else {
            console.log(`Cannot connect to mysql server !!`) 
            throw new Error('connection error something :',err)
        }
    } catch (error) {
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
            {prop:"problem_problem",value: validator.validateStr(await req.body.problem_problem,100,table,'problem_problem'),type:'str'},
            {prop:"problem_type",value: validator.validateStr(await req.body.problem_type,45,table,'problem_type'),type:'str'},
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
                let {status_pool,data} = await connMSQL.connection_pool(validator.createData(data,table,res))
                if(status_pool){
                    
                    return res.status(200).json({message:`create ${table} success!!`,status:'200'})
                }else{
                    return res.status(400).json(errorModel(err.message,req.originalUrl))
                }
            }else{
                console.log(`Cannot connect to mysql server !!`) 
                throw new Error('connection error something :',err)
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
            let {status_pool,data} = await connMSQL.connection_pool(validator.deleteData(req,table))
                if(status_pool){
                    return res.status(200).json({message:`delete ${table} id ${req.params.id} success!!`,status:'200'})
                }else{
                    return res.status(400).json(errorModel(`${table} id: ${req.params.id} does not exist`,req.originalUrl))
                }
        }else{
                console.log(`Cannot connect to mysql server !!`) 
                throw new Error('connection error something :',err)
        } 
    } catch (error) {
        res.status(500).json(errorModel(error.message,req.originalUrl))
    }
})

// update data
router.put('/:id',async(req,res)=>{
    let data
    let status=undefined
    try{
        data=[    
        {prop:"problem_problem",value: validator.validateStr(await req.body.problem_problem,100,table,'problem_problem'),type:'str'},
        {prop:"problem_type",value: validator.validateStr(await req.body.problem_type,45,table,'problem_type'),type:'str'},
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
                let {status_pool,data} = await connMSQL.connection_pool(validator.updateData(req,data,table))
                if(status_pool){
                    return res.status(200).json({message:`update ${table} id ${req.params.id} success!!`,status:'200'})
                    
                }else{
                    return res.status(400).json(errorModel(`${table} id: ${req.params.id} does not exist`,req.originalUrl))
                }
            }else{
                    console.log(`Cannot connect to mysql server !!`) 
                    throw new Error('connection error something :',err)
            } 
        } catch (error) {
            res.status(500).json(errorModel(error.message,req.originalUrl))
        }
    }
})

module.exports=router
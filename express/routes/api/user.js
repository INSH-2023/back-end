const express =require('express')
const router =express.Router()
// const users =require("../../data/Users")
const uuid =require("uuid")
const validator = require('../../validator/validate')
const connMSQL=require('../../mysql/db_config')
const errorModel =require('../../response/errorModel')

const table='user'

let statement_update=undefined
let statement_delete=undefined

// get data
router.get('/',async(req,res)=>{
    // connMSQL.testinsg_pool()
    try {
        if(!connMSQL.handdleConnection()){
            connMSQL.connection.query(
                `SELECT * FROM moral_it_device.${table}`,
                (err,results)=>{
                    if(err){
                        console.log(err)
                        throw new Error(`Query ${table} error : `,err)
                    }
                    return res.status(200).json(results)
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


// get data by id
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
                        return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
                    }else{
                        return res.status(200).json(results)
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


// create user
router.post('/',async(req,res)=>{
    let data
    let status=undefined
    try{
        data=[
            // {prop:"userId",value: uuid.v4(),type:'int'},
            {prop:"user_emp_code",value: validator.validateNumber(await req.body.emp_code,table,'emp_code'),type:'int'},
            {prop:"user_first_name",value: validator.validateStr(await req.body.first_name,100,table,'first_name'),type:'str'},
            {prop:"user_last_name",value: validator.validateStr(await req.body.last_name,100,table,'last_name'),type:'str'},
            {prop:"user_role",value: validator.validateRole(await req.body.role,table,'role'),type:'str'},
            {prop:"user_group",value: validator.validateStr(await req.body.group,100,table,'group'),type:'str'},
            {prop:"user_office",value: validator.validateStr(await req.body.office,100,table,'office'),type:'str'},
            {prop:"user_status",value: validator.validateStr(await req.body.status,100,table,'status'),type:'str'},
            {prop:"user_position",value: validator.validateStr(await req.body.position,100,table,'position'),type:'str'},
            {prop:"user_email",value: validator.validateEmail(await req.body.email,100,table,'email'),type:'str'},
            {prop:"user_password",value: validator.validatePassword(await req.body.password,table,'password'),type:'str'},
            {prop:"user_createdAt",value: validator.currentDate(table,'createdAt'),type:'str'},
            {prop:"user_updatedAt",value: validator.currentDate(table,'updatedAt'),type:'str'}
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
            // {prop:"userId",value: uuid.v4(),type:'int'},
            // {prop:"user_emp_code",value: validator.validateNumber(await req.body.emp_code,table,'emp_code'),type:'int'},
            {prop:"user_first_name",value: validator.validateStr(await req.body.first_name,100,table,'first_name'),type:'str'},
            {prop:"user_last_name",value: validator.validateStr(await req.body.last_name,100,table,'last_name'),type:'str'},
            {prop:"user_role",value: validator.validateRole(await req.body.role,table,'role'),type:'str'},
            {prop:"user_group",value: validator.validateStr(await req.body.group,100,table,'group'),type:'str'},
            {prop:"user_office",value: validator.validateStr(await req.body.office,100,table,'office'),type:'str'},
            {prop:"user_status",value: validator.validateStr(await req.body.status,100,table,'status'),type:'str'},
            {prop:"user_position",value: validator.validateStr(await req.body.position,100,table,'position'),type:'str'},
            {prop:"user_email",value: validator.validateEmail(await req.body.email,100,table,'email'),type:'str'},
            {prop:"user_password",value: validator.validatePassword(await req.body.password,table,'password'),type:'str'},
            {prop:"user_updatedAt",value: validator.currentDate(table,'updatedAt'),type:'str'}
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

router.put('/',(req,res)=>{
    res.status(400).json(errorModel('bad request !! 🤨,need param data to update!! ',req.originalUrl))
})


module.exports=router
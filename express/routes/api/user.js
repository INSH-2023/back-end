const express =require('express')
const router =express.Router()
// const users =require("../../data/Users")
const uuid =require("uuid")
const validator = require('../../validator/validate')
const connMSQL=require('../../mysql/db_config')
const errorModel =require('../../response/errorModel')

const table='user'


// get user
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

//find by id user
router.get('/:id',(req,res)=>{
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

module.exports=router
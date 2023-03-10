const express =require('express')
const router =express.Router()
// const users =require("../../data/Users")
// const uuid =require("uuid")
const validator = require('../../validator/validate')
const connMSQL=require('../../mysql/db_config')
const errorModel =require('../../response/errorModel')

const table ="problem"
// get problem
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


// get problem by id
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


// create problem
router.post('/',async(req,res)=>{
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
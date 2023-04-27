const express =require('express')
const router =express.Router()
const users =require("../../data/Users")
const uuid =require("uuid")
const validator = require('../../validator/validate')
const connMSQL =require('../../config/db_config')
const errorModel =require('../../response/errorModel')

const table='solution'

//get solution
router.get('/',async(req,res)=>{

    try {
        // if(!connMSQL.handdleConnection()){
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
        // }else{
        //     console.log(`Cannot connect to mysql server !!`) 
        //     throw new Error('connection error something :',err)
        // }
    } catch (error) {
        console.log(error)
        return res.status(500).json(errorModel(error.message,req.originalUrl))
    }
})


// get solution by id
router.get('/:id',async(req,res)=>{

    try {
        // if(!connMSQL.handdleConnection()){
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
        // }else{
        //     console.log(`Cannot connect to mysql server !!`) 
        //     throw new Error('connection error something :',err)
        // } 
    } catch (error) {
        res.status(500).json(errorModel(error.message,req.originalUrl))
    }

})

module.exports=router
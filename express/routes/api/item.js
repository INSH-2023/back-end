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
        connMSQL.connection.query(
            'SELECT * FROM moral_it_device.item',
            (err,results)=>{
                if(err){
                    console.log(err)
                    return res.status(400).send()
                }
                return res.status(200).json(results)
            }
        )
    } catch (error) {
        console.log(error)
        return res.status(500).send()
    }
})


// get item by id
router.get('/:id',async(req,res)=>{
    let testing
    try {
        if(!connMSQL.handdleConnection()){
             connMSQL.connection.query(

                //this statement
                validator.foundId(req,table),

                (err,results)=>{
                    if(err){
                        console.log(err)
                        throw new Error('query err somethig :',err)
                    }

                    if(results.length==0){
                        console.log("user id " + req.params.id + " does not exist")
                        res.status(404).json(errorModel("user id :" + req.params.id + " does not exist",req.originalUrl))
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
        res.status(400).json(errorModel(error.message,req.originalUrl))
    }

    console.log( testing)
})



module.exports=router
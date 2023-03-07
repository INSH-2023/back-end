const express =require('express')
const router =express.Router()
const users =require("../../data/Users")
const uuid =require("uuid")
// const {handleDisconnect,connection} =require('../../mysql/db_config')
const connection =require('../../mysql/db_config')


// get request
router.get('/',(req,res)=>{

        try {
            connection.query(
            'SELECT * FROM moral_it_device.request',
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



module.exports=router
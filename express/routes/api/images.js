const express =require('express')
const { route } = require('./user')
const router =express.Router()
const errorModel=require('../../response/errorModel')

router.get('/',(req,res)=>{
    res.download(`${__dirname}/../../images/vue.svg`)
})

router.get ('/:path',(req,res)=>{
    // res.json({msg:__dirname})
    res.download(`${__dirname}/../../images/${req.params.path}`)
})

router.get('/stage/:stage/:id',(req,res)=>{
    // res.json({msg:__dirname})
    let stage = parseInt(req.params.stage)
    let num = parseInt(req.params.id)
    let min =0
    let max =5
    if(stage==5&&num!=0){
        if(num<=max && num>=min){
            return  res.status(200).download(`${__dirname}/../../assets/images/stage/stage_5/${num}.png`)

        }else{
            return res.status(404).json(errorModel("not found id !!!",req.originalUrl))
        }    
    }else
    if(stage==3&&num!=0){
        num+=2
        if(num<=max && num>=min){
            return  res.status(200).download(`${__dirname}/../../assets/images/stage/stage_5/${num}.png`)

        }else{
            return res.status(404).json(errorModel("not found id !!!",req.originalUrl))
        } 
    }else
    if(stage==2&&num!=0){
        num+=3
        if(num<=max && num>=min){
            return  res.status(200).download(`${__dirname}/../../assets/images/stage/stage_5/${num}.png`)

        }else{
            return res.status(404).json(errorModel("not found id !!!",req.originalUrl))
        }
    }else{
        return res.status(404).json(errorModel('not found !!!',req.originalUrl))
    }
    
    // res.download(`${__dirname}/../../images/stage/stage_5/${req.params.id}.png`)

})



module.exports=router
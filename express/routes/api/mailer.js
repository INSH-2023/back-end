const express =require('express')
const router =express.Router()
const errorModel=require('../../response/errorModel')
const sendMail=require('../../config/mailer_config')
const line=require('../../config/lineChat_config')


router.get('/',async(req,res)=>{
    // let sub ='This is summary report!!'
    //         let type_of_use='Testing'
    //         let type_machine='Testing'
    //         let brand_name='Testing'
    //         let problems='Testing'
    //         let other ='Testing'
    //         let message ='Testing'
   
    // try { 
        
    //     sendMail.sendMailTesting('name',res,sub,sendMail.report_html(type_of_use,type_machine,brand_name,problems,other,message),'pheeraprt0123@gmail.com')
       
    // } catch (error) {
    //     console.log('from mailer',error)
    //     return res.status(500).json(errorModel(error,req.originalUrl))

    // }
    try {
       await line.send('pheeraprt0123@gmail.com','hardware','or','PC','Nike kick','bad,sad hello','Testing','Bruh')
    } catch (error) {
        return res.status(500).json(error)
    }
    
})
module.exports=router
const express =require('express')
const router =express.Router()
const errorModel=require('../../response/errorModel')
const sendMail=require('../../config/mailer_config')
// const line=require('../../config/lineChat_config')


// router.get('/',async(req,res)=>{
//     // let sub ='This is summary report!!'
//     //         let type_of_use='Testing'
//     //         let type_machine='Testing'
//     //         let brand_name='Testing'
//     //         let problems='Testing'
//     //         let other ='Testing'
//     //         let message ='Testing'
   
//     // try { 
        
//     //     sendMail.sendMailTesting('name',res,sub,sendMail.report_html(type_of_use,type_machine,brand_name,problems,other,message),'pheeraprt0123@gmail.com')
       
//     // } catch (error) {
//     //     console.log('from mailer',error)
//     //     return res.status(500).json(errorModel(error,req.originalUrl))

//     // }
//     try {
//        await line.send('pheeraprt0123@gmail.com','hardware','or','PC','Nike kick','bad,sad hello','Testing','Bruh')
//     } catch (error) {
//         return res.status(500).json(error)
//     }
    
// })



const line = require('@line/bot-sdk');

const config={
    channelAccessToken: 'GLeng818OcRR/bAYPcpdrqvSEfLYzWryS3vKDkgAiMZ3Peq/7voYmJgNNmBoyEGxRwq97Gd6GQg2j96Rbl6OpXR7Jq6+QiWPo5qqSm1ClnkpUbC3JW/95gmcMAZDxHob+Him8s+TRzDM3ideBn+vnwdB04t89/1O/w1cDnyilFU=',
    channelSecret: '2d0ca1c01e90483ab7a466ed2a8ffc80',
}

const client = new line.Client(config);

// Event handler
router.post('/w', line.middleware(config), async(req, res) => {
    function handleEvent(event) {
        if (event.type === 'message' && event.message.type === 'text') {
          // Get the group ID
          const groupId = event.source.groupId;
          console.log('Group ID:', groupId);
        }
      }
  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.status(200).end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});



module.exports=router
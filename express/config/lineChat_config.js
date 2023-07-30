let FormData=require('form-data')
const fetch = require('node-fetch')
require('dotenv').config().parsed

// const line = require('@line/bot-sdk');

const send=async(service,fullName='',email='',subj='',tOfU='',tOfM='',brand='',problem='',other='',message='',status='')=>{
    if(fullName.length==0,email.length==0,subj.length==0,service.length==0,problem.length==0){
        console.log('cannot send message to line !!')
        throw new Error('LINE function invalid data parameter !!')
    }

    // const config = {
    //     channelAccessToken: process.env.LINE_TOKEN,
    // };

    // const client = new line.Client(config);
    // const msg={
    //     type:"text",
    //     text:`🔧 คำร้องขอบริการของ 🔧\n${fullName.length==0?'-':fullName}\n${email.length==0?'-':email}\n ---------------- \n🎯 หัวข้อของปัญหา : ${subj.length==0?'-':subj}\n📋 ประเภทการใช้งาน : ${tOfU=='or'?'ขององค์กรณ์':'ของส่วนตัว'}\n💻 ประเภทของอุปกรณ์ : ${tOfM.length==0?'-':tOfM} \n💻 ยี่ห้อ : ${brand.length==0?'-':brand}\n----------------\nปัญหาที่พบ : ${problem.length==0?'-':problem}\n\nปัญหาอื่นๆ ที่พบเจอ : ${other.length==0?'-':other}\n\nเพิ่มเติม : ${message.length==0?'-':message}`
    // }
    // // client.pushMessage(process.env.LINE_USER_ID,msg)
    // // .then(res=>console.log('line message send!!'))
    // // .catch(err=>console.log('line cannot send message!!'))
    // async function sendBroadcastMessage(message) {
    //     const response = await client.broadcast({
    //       messages: [message],
    //     });
      
    //     if (response) {
    //       console.log('Broadcast message sent successfully.');
    //     } else {
    //       console.error('Failed to send broadcast message.');
    //     }
    //   }

    //   await sendBroadcastMessage({
    //     type:"text",
    //     text:`🔧 คำร้องขอบริการของ 🔧\n${fullName.length==0?'-':fullName}\n${email.length==0?'-':email}\n ---------------- \n🎯 หัวข้อของปัญหา : ${subj.length==0?'-':subj}\n📋 ประเภทการใช้งาน : ${tOfU=='or'?'ขององค์กรณ์':'ของส่วนตัว'}\n💻 ประเภทของอุปกรณ์ : ${tOfM.length==0?'-':tOfM} \n💻 ยี่ห้อ : ${brand.length==0?'-':brand}\n----------------\nปัญหาที่พบ : ${problem.length==0?'-':problem}\n\nปัญหาอื่นๆ ที่พบเจอ : ${other.length==0?'-':other}\n\nเพิ่มเติม : ${message.length==0?'-':message}`
    // });
   
    // old version
    // console.log(env)
    try {
        // let messages=[{
        //     text:`🔧 คำร้องขอบริการของ 🔧\n${email.length==0?'-':email}\n ---------------- \n🎯 หัวข้อของปัญหา : ${subj.length==0?'-':subj}\n📋 ประเภทการใช้งาน : ${tOfU=='or'?'ขององค์กรณ์':'ของส่วนตัว'}\n💻 ประเภทของอุปกรณ์ : ${tOfM.length==0?'-':tOfM} \n💻 ยี่ห้อ : ${brand.length==0?'-':brand}\n----------------\nปัญหาที่พบ : ${problem.length==0?'-':problem}\n\nปัญหาอื่นๆ ที่พบเจอ : ${other.length==0?'-':other}\n\nเพิ่มเติม : ${message.length==0?'-':message}`
        // }]
        let message_it=`\n🔧 คำร้องขอบริการของ 🔧\n${fullName.length==0?'-':fullName}\n${email.length==0?'-':email}\n ---------------- \n📣 Service : ${service}\n🎯 หมวดหมู่ : ${subj.length==0?'-':subj}\n📋 ประเภทการใช้งาน : ${tOfU=='or'?'ขององค์กรณ์':'ของส่วนตัว'}\n💻 ประเภทของอุปกรณ์ : ${tOfM.length==0?'-':tOfM} \n💻 ยี่ห้อ : ${brand.length==0?'-':brand}\n----------------\nปัญหาที่พบ : ${problem.length==0?'-':problem}\n\nปัญหาอื่นๆ ที่พบเจอ : ${other.length==0?'-':other}\n\nเพิ่มเติม : ${message.length==0?'-':message}\n\nสถานะการรับแจ้ง : ${status.length==0?'-':status}`
        let message_pr=`\n🔧 คำร้องขอบริการของ 🔧\n${fullName.length==0?'-':fullName}\n${email.length==0?'-':email}\n ---------------- \n📣 Service : ${service}\n🎯 หมวดหมู่ : ${subj.length==0?'-':subj}\n----------------\nปัญหาที่พบ : ${problem.length==0?'-':problem}\n\nปัญหาอื่นๆ ที่พบเจอ : ${other.length==0?'-':other}\n\nเพิ่มเติม : ${message.length==0?'-':message}\n\nสถานะการรับแจ้ง : ${status.length==0?'-':status}`
        let data = new FormData()
        
        data.append("message",service=='IT_Service'?message_it:message_pr)

        // let formBody = []
        // for (let property in messages) {
        //     var encodedKey = encodeURIComponent(property);
        //     var encodedValue = encodeURIComponent(messages[property]);
        //     formBody.push(encodedKey + "=" + encodedValue);
        // }
        // formBody = formBody.join("&")

        let res=await fetch('https://notify-api.line.me/api/notify',{
            method:'POST',
            headers:{
                'Authorization':`Bearer tPKlVyIHny5gXfeEdoUIrnjF3i3j74lQ8zU3bkYCcf5`
            },
            body:data
        })
            if(res.status==200){
                console.log('line message send!!')
            }else{
                console.log(res.status)
                console.log('line cannot send message!!')
            }
    } catch (error) {
        console.log('cannot send line!!',error)
    }
    
    
}
module.exports.send=send
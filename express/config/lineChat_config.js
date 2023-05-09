require('dotenv').config().parsed
const line = require('@line/bot-sdk');

const send=async(email='',subj='',tOfU='',tOfM='',brand='',problem='',other='',message='')=>{
    if(email.length==0,subj.length==0,tOfU.length==0,tOfM.length==0,brand.length==0,problem.length==0){
        console.log('cannot send message to line !!')
        throw new Error('LINE function invalid data parameter !!')
    }
    const client = new line.Client({
        channelAccessToken: process.env.LINE_TOKEN
    });
    const msg={
        "type":"text",
        "text":`🔧 คำร้องขอบริการของ 🔧\n${email.length==0?'-':email}\n ---------------- \n🎯 หัวข้อของปัญหา : ${subj.length==0?'-':subj}\n📋 ประเภทการใช้งาน : ${tOfU=='or'?'ขององค์กรณ์':'ของส่วนตัว'}\n💻 ประเภทของอุปกรณ์ : ${tOfM.length==0?'-':tOfM} \n💻 ยี่ห้อ : ${brand.length==0?'-':brand}\n----------------\nปัญหาที่พบ : ${problem.length==0?'-':problem}\n\nปัญหาอื่นๆ ที่พบเจอ : ${other.length==0?'-':other}\n\nเพิ่มเติม : ${message.length==0?'-':message}`
    }
    client.pushMessage(process.env.LINE_USER_ID,msg)
    .then(res=>console.log('line message send!!'))
    .catch(err=>console.log('line cannot send message!!'))

    // old version
    // console.log(env)
    // try {
    //     console.log('Authorization',`Bearer ${process.env.LINE_TOKEN}`)
    //     let res=await fetch('https://api.line.me/v2/bot/message/push',{
    //     method:'POST',
    //     headers:{
    //         'Content-Type':'application/json',
    //         'Authorization':`Bearer ${process.env.LINE_TOKEN}`
    //     },
    //     body: JSON.stringify({
    //         to: process.env.LINE_USER_ID,
    //         messages:[{
    //             "type":"text",
    //             "text":`🔧 คำร้องขอบริการของ 🔧\n${email.length==0?'-':email}\n ---------------- \n🎯 หัวข้อของปัญหา : ${subj.length==0?'-':subj}\n📋 ประเภทการใช้งาน : ${tOfU=='or'?'ขององค์กรณ์':'ของส่วนตัว'}\n💻 ประเภทของอุปกรณ์ : ${tOfM.length==0?'-':tOfM} \n💻 ยี่ห้อ : ${brand.length==0?'-':brand}\n----------------\nปัญหาที่พบ : ${problem.length==0?'-':problem}\n\nปัญหาอื่นๆ ที่พบเจอ : ${other.length==0?'-':other}\n\nเพิ่มเติม : ${message.length==0?'-':message}`
    //         },]
    //         })
    //     })
    //         if(res.status==200){
    //             console.log('line message send!!')
    //         }else{
    //             console.log(res.status)
    //             console.log('line cannot send message!!')
    //         }
    // } catch (error) {
    //     console.log('cannot send line!!',error)
    // }
    
    
}
module.exports.send=send
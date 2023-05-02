const env=require('dotenv').config().parsed

const send=async(email='',subj='',tOfU='',tOfM='',brand='',problem='',other='',message='')=>{
    if(email.length==0,subj.length==0,tOfU.length==0,tOfM.length==0,brand.length==0,problem.length==0){
        console.log('cannot send message to line !!')
        throw new Error('LINE function invalid data parameter !!')
    }

    // console.log(env)
    let res=await fetch('https://api.line.me/v2/bot/message/push',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${env.LINE_TOKEN}`
        },
        body: JSON.stringify({
            to: env.LINE_USER_ID,
            messages:[{
                "type":"text",
                "text":`คำร้องขอบริการของ\n${email.length==0?'-':email}\n ---------------- \nหัวข้อของปัญหา : ${subj.length==0?'-':subj}\nประเภทการใช้งาน : ${tOfU=='or'?'ขององค์กรณ์':'ของส่วนตัว'}\nประเภทของอุปกรณ์ : ${tOfM.length==0?'-':tOfM} \nยี่ห้อ : ${brand.length==0?'-':brand}\n----------------\nปัญหาที่พบ : ${problem.length==0?'-':problem}\nปัญหาอื่นๆ ที่พบเจอ : ${other.length==0?'-':other}\nเพิ่มเติม : ${message.length==0?'-':message}`
            },]
        })
        
    })
    if(res.status==200){
        console.log('line message send!!')
    }else{
        console.log(res.status)
        console.log('line cannot send message!!')
    }
}
module.exports.send=send
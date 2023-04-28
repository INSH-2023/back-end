const env=require('dotenv')

const send=async()=>{
    let res=await fetch('https://api.line.me/v2/bot/message/push',{
        method:'POST',
        headers:{
            'Content-Type':'application/json',
            'Authorization':`Bearer ${process.env.LINE_TOKEN}`
        },
        body: JSON.stringify({
            to: process.env.LINE_USER_ID,
            messages:[{
                "type":"text",
                "text":"Hello, world1"
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
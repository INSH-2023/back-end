const nodemailer=require('nodemailer')

let report_html=(tOfUse='',tOfMachine='',brand='',problem='',other='',msg='')=>{
 if(tOfUse.length==0||tOfMachine.length==0||brand.length==0||problem.length==0){
    throw 'cannot make template for e-mail !!'
 }
return `
<div style='width:100%;font-size:15px'>        
  
     <div style="=width:90%;margin:auto;">
     <h5 style='width:fit-content;margin:auto;margin-top:10px;margin-bottom:10px;font-size: 23px;font-weight: bold;'>คำร้องของคุณ</h5>

        <hr style="width: 60%;margin:auto;border-top: 2px solid gray;">
        <table style="width:fit-content;margin:15px auto 15px auto;">
           <tr>
              <th style="text-align: right;">
                 ประเภทของอุปกรณ์ :
              </th>
              <td style="text-align: left;">
                 ${tOfMachine}
              </td>
           </tr>
           <tr >
              <th style="text-align: right;">
                 ประเภทการใช้งาน :
              </th>
              <td style="text-align: left;">
                 ${tOfUse}
              </td>
           </tr>
           <tr>
              <th style="text-align: right;">
                 ยี่ห้อ :
              </th>
              <td style="text-align: left;">
                 ${brand}
              </td>
           </tr>
        </table>
        <hr style="width: 60%;margin:auto;border-top: 2px solid gray">
        <div style="width:fit-content;margin-top: 15px;margin:auto;text-align: left;">
              <div style="margin:10px 15px 0px 15px;">
                 <h5 style="display: block;text-align: left;font-weight: bold;">
                    ปัญหาที่พบ :
                 </h5>
                 <p style="text-align: left;margin-left:20px">
                    ${problem}
                 </p>
              </div>
              <div style="margin:10px 15px 0px 15px;">
                 <h5 style="display: block;text-align: left;font-weight: bold;">
                    ปัญหาอื่นๆ ที่พบเจอ :
                 </h5>
                 <p style="text-align: left;margin-left:20px">
                    ${other}
                 </p>
              </div>
              <div style="margin:10px 15px 0px 15px;">
                 <h5 style="display: block;text-align: left;font-weight: bold;">
                    เพิ่มเติม :
                 </h5>
                 <p style="text-align: left;margin-left:20px">
                    ${msg}
                 </p>
              </div>
        </div>
     </div>
  </div> 
`

}
const sendMailTesting=(positionName=undefined,res=undefined,sub=undefined,html=undefined,to=undefined)=>{
    let status=undefined

    if(positionName==undefined||res==undefined||sub==undefined||html==undefined||to==undefined){
        throw 'Invalid data cannot send mail'
    }
    //fortesting account
    // let testAccount =await nodemailer.createTestAccount()

    // let transporter = nodemailer.createTransport({
    //     host:"smtp.ethereal.email",
    //     port:587,
    //     secure:false,
    //     auth:{
    //         user:testAccount.user,
    //         pass:testAccount.pass
    //     }
    // })

    // let content ={
    //     from: '"admin IT" <no-reply@gmail.com>',
    //     to:'pheeraprt0123@gmail.com',
    //     subject:"hello",
    //     text:"hello world?",
    //     html:"<h1>hello WW</h1>"
    // }

    // transporter.sendMail(content)
    // .then(info=>{
    //     status=true
    //     console.log(info.messageId)
    //     console.log(nodemailer.getTestMessageUrl(info))
    // })
    // .catch(err=>{
    //     status=false
    //     console.log(err)
    // })
    // return status

    // for real account
    let config = {
        service:'gmail',
        auth:{
            user:process.env.MAILER_GMAIL||'moralceter.test@gmail.com',
            pass:process.env.MAILER_PASSWORD||'svdzfbrzelinxvdy'
        }
    }

    let transporter = nodemailer.createTransport(config)
    
    let content ={
        from: '"IT-HELP-DESK moralcenter" <no-reply@gmail.com>',
        to:to,
        subject:sub,
        text:sub,
        html:html
    }
    try {

        if(positionName==undefined||res==undefined||sub==undefined||html==undefined||to==undefined){
            throw new Error('invalid parameter data cannot send email!!!')
        }


        transporter.sendMail(content)
        .then (info=>{
            console.log(`${positionName} => send mail to ${to}`)
            if(info==undefined||info==false){
                console.log('cannot send mail !!')
                return res.status(500).json(errorModel(error,req.originalUrl))
                // return status=false   
            }else{
                console.log('mail sended!! :',info.messageId)
                return res.status(201).json({msg:'email sended!!'})
                // return status= true
            }    
            // console.log(nodemailer.getTestMessageUrl(info))
        })
    } catch (error) {
        console.log(`${positionName} => ${error}`)

        throw 'cannot send mail'
    }
}

module.exports.sendMailTesting=sendMailTesting
module.exports.report_html=report_html

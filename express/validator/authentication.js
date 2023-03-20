const connMSQL =require('../mysql/db_config')

const logIn=async(req)=>{
    let status =undefined
    let return_data=[]
    let {email:email,password:password}= req.body
    
    let statement =`SELECT userId,user_email,user_password FROM moral_it_device.user WHERE user_email="${email}"`

    let [sqlD] =await connMSQL.connection_pool(statement)

    // console.log('from sql :', sqlD)
    // console.log(`data : ${email} / ${password}`)
    
    if(sqlD==null||sqlD==undefined){
        status = false
    }else{
        if(sqlD.user_email.toLowerCase().trim()==email.toLowerCase().trim() && sqlD.user_password==password){
            status=true
        }else{
            status = false
        }

    }
    return_data.push(status)
    return_data.push(sqlD)
    console.log(`authen status : ${status}`)
    return return_data

}

module.exports.logIn = logIn
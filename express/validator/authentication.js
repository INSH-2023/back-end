const connMSQL =require('../mysql/db_config')

const logIn=async(req)=>{
    let status =undefined
    let return_data=[]
    let {email:email,password:password}= req.body
    
    let statement =`SELECT userId,user_emp_code,user_email,user_role,user_password FROM moral_it_device.user WHERE user_email="${email}"`

    let sqlD={}
    let {status_pool:status_p,data:authen,msg:msg}=await connMSQL.connection_pool(statement)
    if(status_p){
        console.log(authen)
        let [{userId,user_emp_code,user_email,user_role,user_password}]=authen
        console.log('from sql :', sqlD)
        // console.log(`data : ${email} / ${password}`)

        if(sqlD==null||sqlD==undefined){
        status = false
        }else{
        if(user_email.toLowerCase().trim()==email.toLowerCase().trim() && user_password==password){
            status=true
            sqlD={userId:userId,user_emp_code,user_email, user_role:user_role}
        }else{
            status = false
        }

        }
        return_data.push(status)
        return_data.push(sqlD)
        console.log(`authen status : ${status}`)
        return return_data
    }
    

}

module.exports.logIn = logIn
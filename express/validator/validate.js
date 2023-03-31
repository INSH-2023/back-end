// const { EmptyResultError } = require('sequelize')
const ROLE = require('../enum/Role')

// const Users = require('../config/db').users


// make statement
//find data
const foundId =  (req,
    table=undefined,
    select=undefined,
    where=undefined,
    join=undefined,
    on=undefined ) => {
    let id =parseInt(req.params.id)
    let statement
    console.log('this is params id :',id)
    if(select!=undefined||where!=undefined||(join!=undefined&&on!=undefined)){
        
        if(select!=undefined &&select.length > 0){
            statement=`SELECT ${select} FROM moral_it_device.${table} `
        }else{
            statement=`SELECT * FROM moral_it_device.${table} `
        }

        if(where!=undefined && where.length != 0){
            statement+=` WHERE ${where} `
        }

        if(join!=undefined && join.length !=0 && on.length!=0){
            statement+=` JOIN ${join} on ${on}`
        }

        if(statement.length==0 ||statement==undefined ||statement==null){
            throw new Error('cannot create script')
        }
        console.log(statement)
        return statement

    }else{
        statement=''
        statement =`SELECT * FROM moral_it_device.${table} where ${table}Id=${id}`
        console.log(statement)
        return statement

    }
    console.log('cannot create statement')
}

// create data
const createData= (data,table)=>{
    // console.log(table)
    // console.log(data)
    let fields
    let value=""

    if(data!=undefined){
        
        let text=''        
        // format 
        fields = data.reduce((value,cValue)=>value+","+cValue.prop,"").substring(1)
        // console.log(fields)
        // format value
        for(let v of data){
            if(v.type=='str'){
                text=text+','+"'"+v.value+"'"
            }else
            if(v.type=='int'||v.type=='date'){
                text=text+','+v.value
            }
        }
        // console.log(text)
        value=text.substring(1)
        // console.log(fields)
        let statement=`INSERT INTO ${table} (${fields}) VALUES (${value});`
        console.log(' ')
        console.log(statement)
        console.log(' ')
        return statement
    }else{
        console.log("data is undefind cannot get fields")
    }
}

// delete data
const deleteData=(req,table)=>{
    if(req.params.id==null||req.params.id==undefined||req.params.id==""){
        throw new Error('please input id to delete data !!')
    }else{
        let id =parseInt(req.params.id)
        // console.log(id)
        // console.log(table)
        let statement =`DELETE FROM ${table} WHERE ${table}Id = ${id}`
        return statement        
    }

}

// update date
const updateData=(req,data,table)=>{
    
    if(req.params.id==null||req.params.id==undefined||req.params.id==""){
        throw new Error('please input id to update data !!')
    }else{
        let id =parseInt(req.params.id)

        if(data!=undefined){
        
            let text=''
            
            for(let v of data){
                console.log(v)
                if(v.type=='str'){
                    text=text+ `${v.prop} = '${v.value}' ,`
                }else
                if(v.type=='int'){
                    text=text+ `${v.prop} = ${v.value},`
                }
            }
            text = text.substring(0,text.length-1)

            let statement=`UPDATE ${table} SET ${text} WHERE ${table}Id=${id}`

            console.log(' ')
            console.log(statement)
            console.log(' ')
            return statement
        }else{
            console.log("data is undefind cannot get fields")
        }
    }
}



// validation
const validateStrNotNull = (str,l,table,name) => {
    let text = str
    if(text == null || text == undefined) {
        throw new Error(`${name} is null or undefined`)
    }
    else if(text.length > l){
            throw new Error(`${name} :${text}  have  more than ${l} characters`)
    }else{
            console.log(`validator string / ${table} ${name} : ${text}`)
            return text.toString().trim()
    } 
}

const validateStrNull = (str,l,table,name) => {
    let text = str
    if(text.length > l || isNaN(text)){
        throw new Error(`${name} :${text}  have  more than ${l} characters`)
    } else {
        console.log(`validator string / ${table} ${name} : ${text}`)
        return text == null ? null : text.toString().trim()
    } 
}

const validateNumber =  (int,table,name) => {
    if(int === undefined || int === null){
        throw new Error(`${name} is null`)
    }else
    if(isNaN(int)){
        console.log(`validate number / ${table} ${name} : ${int} is not number `)
        throw new Error(`validate number / ${table} ${name} : ${int} is not number `)
    }else if(int <= 0){
        throw new Error(int + " is more than 0")
    }else{
        let number =parseInt(int)
        console.log(`validate number / ${table} ${name} : ${number}`)
        return parseInt(number)
    }
}

const validateEmail =  (str,l,table,name) => {
    let text = str
    regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    
    if(text === undefined || text === null || text === ""){
        throw new Error(`${name} is null`)
    }else if(text.length > 100){
        throw new Error(text + ` have  more than ${l} characters`)
    }else if(!String(text).match(regex)){
        throw new Error(text + " is not email format")
    }else{
        console.log(`validate email / ${table} ${name} : ${text}`)
        return text.toString().trim()
    }
}


const validatePassword =  (str,table,name) => {
    let text =str
    if(text === undefined || text === null || text === ""){
        throw new Error(`${name} is null`)
    }else if(text.length > 16 || text.length < 8){
        throw new Error(text + " password need have between 8 and 16 characters")
    }else{
        console.log(`validate password / ${table} ${name}`)
        return text.toString().trim()
    }
}

const validateRole =  (str,table,name) => {
    let text = str
    if(text === undefined || text === null || text === ""){
        throw new Error(`${name} is null`)
    }else if(text != ROLE.Admin_it && text != ROLE.Admin_pr && text != ROLE.User){
        throw new Error("role is user , admin_it and admin_pr only")
    }else{
        console.log(`validate role / ${table} ${name} : ${text}`)
        return text.toString().trim()
    }
}

const currentDate =(table,name)=>{
    const date= new Date()
    let now_utc=Date.UTC(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds())
    let date_utc=new Date(now_utc)
    let new_date=`${date_utc.getFullYear()}-${modifyNumber(date_utc.getMonth())}-${modifyNumber(date_utc.getDate())}T${modifyNumber(date_utc.getHours())}:${modifyNumber(date_utc.getMinutes())}:${modifyNumber(date_utc.getSeconds())}`
    console.log(`current date / ${table} ${name} : ${new_date}`)
    
    return new_date.toString().trim()

}

const modifyNumber=(number)=>number<10?'0'+number:number

// const validateUnique = (newUser,user,req) => {
//     if (req.params.id != user.userId) {
//         if(newUser.emp_code === user.emp_code || newUser.full_name === user.full_name || newUser.email === user.email) {
//             throw new Error("this user is not unique by employee code : " + user.emp_code + ", full name : " + user.full_name + " and email : " + user.email)
//         }
//     }
// }

const checkUndefindData=async(data,table)=>{
    let status=false
    for(let d of await data){
        if(d.value==undefined||d.value==null){
            status=true
        }
    }
    console.log(`validate data payload is bad ? / ${table} : `,status==true?'bad':'good')
    return status
}

const validateDate =  (date,table,name) => {
 
    if(date === undefined || date === null || date === ""){
        throw new Error(date + " is not null")
    }else{
        let dat=date.split(" ")

        if(dat.length<2||(dat[0] === undefined || dat[0] === null || dat[0] === "")||(dat[1] === undefined || dat[1] === null || dat[1] === "")){
            throw new Error(`invalid date form !!`)
        }
        else if((dat[0] instanceof  Date && !isNaN(date[0])) ||(dat[1] instanceof Date && !isNaN(dat[1])) ){
            throw new Error(date + " is not date format" )
        }else{
            let new_date=`${dat[0]}T${dat[1]}`
            console.log(`validate date / ${table} ${name} : ${new_date} `)
            return new_date.toString().trim()
        }
    }

}

module.exports.foundId = foundId
module.exports.validateStrNotNull = validateStrNotNull
module.exports.validateStrNull = validateStrNull
module.exports.validateNumber = validateNumber
module.exports.validateEmail = validateEmail
module.exports.validatePassword = validatePassword
module.exports.validateRole = validateRole
module.exports.createData=createData
module.exports.currentDate=currentDate
module.exports.checkUndefindData=checkUndefindData
module.exports.validateDate=validateDate
module.exports.deleteData=deleteData
module.exports.updateData=updateData
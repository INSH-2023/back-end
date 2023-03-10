// const { EmptyResultError } = require('sequelize')
// const connectMysql=require('../../mysql/db_config')
const connMSQL=require('../mysql/db_config')
// const {handleDisconnect,connection}=require('../mysql/db_config')




const foundId = async (req,table) => {
    let id =parseInt(req.params.id)
    // console.log('this is params id :',id)
    let statement =`SELECT * FROM moral_it_device.${table} where userId=${id}`
    // console.log(statement)
    return statement
}



// const validateStr = async (str) => {
//     if(str === undefined || str === null || str === ""){
//         throw new Error("item is not null")
//     }else if(str.length > 100){
//         throw new Error(str + " have not more than 100 characters")
//     }else{
//         return str.trim()
//     }
// }

// const validateSL = async (str) => {
//     if(str === undefined || str === null || str === ""){
//         throw new Error("item is not null")
//     }else if(str.length !== 15){
//         throw new Error(str + " have 15 characters only")
//     }else{
//         return str.trim()
//     }
// }

// const validateSW = async (str) => {
//     if(str === undefined || str === null || str === ""){
//         throw new Error("item is not null")
//     }else if(str.length !== 13){
//         throw new Error(str + " have 13 characters only")
//     }else{
//         return str.trim()
//     }
// }

// const validateDate = async (date) => {
//     if(date === undefined || date === null || date === ""){
//         throw new Error(date + " is not null")
//     }else if(!(!date instanceof Date && isNaN(date))){
//         throw new Error(date + " is not date format")
//     }else{
//         return date
//     }
// }

// exports.foundId=foundId
module.exports.foundId = foundId
// module.exports.validateStr = validateStr
// module.exports.validateSL = validateSL
// module.exports.validateSW = validateSW
// module.exports.validateDate = validateDate
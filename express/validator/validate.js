// const { EmptyResultError } = require('sequelize')
// const ROLE = require('')
const connMSQL=require('../mysql/db_config')
// const Users = require('../config/db').users

const foundId =  (req,table) => {
    let id =parseInt(req.params.id)
    console.log('this is params id :',id)
    let statement =`SELECT * FROM moral_it_device.${table} where ${table}Id=${id}`
    console.log(statement)
    return statement
}

// const validateStr = async (str) => {
//     if(str === undefined || str === null || str === ""){
//         throw new Error("user is not null")
//     }else if(str.length > 100){
//         throw new Error(str + " have not more than 100 characters")
//     }else{
//         return str.trim()
//     }
// }

// const validatePassword = async (str) => {
//     if(str === undefined || str === null || str === ""){
//         throw new Error("user is not null")
//     }else if(str.length > 16 || str.length < 8){
//         throw new Error(str + " password need have between 8 and 16 characters")
//     }else{
//         return str.trim()
//     }
// }

// const validateRole = async (str) => {
//     if(str === undefined || str === null || str === ""){
//         throw new Error("user is not null")
//     }else if(str != ROLE.Admin && str != ROLE.User){
//         throw new Error("the role is user or admin only")
//     }else{
//         return str.trim()
//     }
// }

// const validateEmail = async (str) => {
//     regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
//     if(str === undefined || str === null || str === ""){
//         throw new Error("user is not null")
//     }else if(str.length > 100){
//         throw new Error(str + " have not more than 100 characters")
//     }else if(!String(str).match(regex)){
//         throw new Error(str + " is not email format")
//     }else{
//         return str.trim()
//     }
// }

// const validateNumber = async (int) => {
//     if(int === undefined || int === null){
//         throw new Error(int + " is not null")
//     }else if(int <= 0){
//         throw new Error(int + " is more than 0")
//     }else{
//         return int
//     }
// }

// const validateUnique = (newUser,user,req) => {
//     if (req.params.id != user.userId) {
//         if(newUser.emp_code === user.emp_code || newUser.full_name === user.full_name || newUser.email === user.email) {
//             throw new Error("this user is not unique by employee code : " + user.emp_code + ", full name : " + user.full_name + " and email : " + user.email)
//         }
//     }
// }

module.exports.foundId = foundId
// module.exports.validateStr = validateStr
// module.exports.validateNumber = validateNumber
// module.exports.validateEmail = validateEmail
// module.exports.validatePassword = validatePassword
// module.exports.validateRole = validateRole
// module.exports.validateUnique = validateUnique
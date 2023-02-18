const { EmptyResultError } = require('sequelize')
const Request = require('../config/db').requests

const foundId = async (req,res) => {
    let request = await Request.findOne({ where: { requestId: req.params.id } })
    if(request === null) {
        throw new EmptyResultError("request id " + req.params.id + " does not exist")
    } else {
        return request
    }
}

const validateStr = async (str) => {
    if(str === undefined || str === null || str === ""){
        throw new Error("request is not null")
    }else if(str.length > 100){
        throw new Error(str + " have not more than 100 characters")
    }else{
        return str.trim()
    }
}

const validateEmail = async (str) => {
    regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(str === undefined || str === null || str === ""){
        throw new Error("user is not null")
    }else if(str.length > 100){
        throw new Error(str + " have not more 20 characters")
    }else if(!String(str).match(regex)){
        throw new Error(str + " is not email format")
    }else{
        return str.trim()
    }
}

const validateDate = async (date) => {
    if(date === undefined || date === null || date === ""){
        throw new Error(date + " is not null")
    }else if(!(!date instanceof Date && isNaN(date))){
        throw new Error(date + " is not date format")
    }else{
        return date
    }
}

module.exports.foundId = foundId
module.exports.validateStr = validateStr
module.exports.validateEmail = validateEmail
module.exports.validateDate = validateDate
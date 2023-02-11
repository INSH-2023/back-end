const errorModel = require('../response/errorModel')
const ROLE = require('../models/Role')

const foundId = (list,req,res) => {
    const found = list.some(item => item.userId === parseInt(req.params.id))
    if(!found) {
        throw res.status(404).json(errorModel("user " + req.params.id + " does not exist", req.originalUrl))
    } else {
        return list.filter(item => item.userId === parseInt(req.params.id))[0]
    }
}

const validateStr = (str,req,res) => {
    if(str === undefined || str === null || str === ""){
        throw res.status(400).send(errorModel("user is not null",req.originalUrl))
    }else if(str.length > 100){
        throw res.status(400).send(errorModel(str + " have not more 100 characters",req.originalUrl))
    }else{
        return str.trim()
    }
}

const validatePassword = (str,req,res) => {
    if(str === undefined || str === null || str === ""){
        throw res.status(400).send(errorModel("user is not null",req.originalUrl))
    }else if(str.length > 16 || str.length < 8){
        throw res.status(400).send(errorModel(str + " password need have 8-16 characters",req.originalUrl))
    }else{
        return str.trim()
    }
}

const validateRole = (str,req,res) => {
    console.log(str)
    console.log(ROLE.Admin)
    if(str === undefined || str === null || str === ""){
        throw res.status(400).send(errorModel("user is not null",req.originalUrl))
    }else if(str != ROLE.Admin && str != ROLE.User){
        throw res.status(400).send(errorModel(str + " is user or admin only",req.originalUrl))
    }else{
        return str.trim()
    }
}

const validateEmail = (str,req,res) => {
    regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(str === undefined || str === null || str === ""){
        throw res.status(400).send(errorModel("user is not null",req.originalUrl))
    }else if(str.length > 100){
        throw res.status(400).send(errorModel(str + " have not more 20 characters",req.originalUrl))
    }else if(!String(str).match(regex)){
        throw res.status(400).send(errorModel(str + " is not email format",req.originalUrl))
    }else{
        return str.trim()
    }
}

const validateNumber = (int,req,res) => {
    if(int === undefined || int === null){
        throw res.status(400).send(errorModel(int + " is not null",req.originalUrl))
    }else if(int <= 0){
        throw res.status(400).send(errorModel(int + " is more than 0",req.originalUrl))
    }else{
        return int
    }
}

module.exports.foundId = foundId
module.exports.validateStr = validateStr
module.exports.validateNumber = validateNumber
module.exports.validateEmail = validateEmail
module.exports.validatePassword = validatePassword
module.exports.validateRole = validateRole
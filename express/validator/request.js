const errorModel = require('../response/errorModel')

const foundId = (list,req,res) => {
    const found = list.some(item => item.requestId === parseInt(req.params.id))
    if(!found) {
        throw res.status(404).json(errorModel("request " + req.params.id + " does not exist", req.originalUrl))
    } else {
        return list.filter(item => item.requestId === parseInt(req.params.id))[0]
    }
}

const validateStr = (str,req,res) => {
    if(str === undefined || str === null || str === ""){
        throw res.status(400).send(errorModel("request is not null",req.originalUrl))
    }else if(str.length > 100){
        throw res.status(400).send(errorModel(str + " have not more 100 characters",req.originalUrl))
    }else{
        return str.trim()
    }
}

const validateEmail = (str,req,res) => {
    regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if(str === undefined || str === null || str === ""){
        throw res.status(400).send(errorModel("request is not null",req.originalUrl))
    }else if(str.length > 100){
        throw res.status(400).send(errorModel(str + " have not more 20 characters",req.originalUrl))
    }else if(!String(str).match(regex)){
        throw res.status(400).send(errorModel(str + " is not email format",req.originalUrl))
    }else{
        return str.trim()
    }
}

const validateDate = (date,req,res) => {
    if(date === undefined || date === null || date === ""){
        throw res.status(400).send(errorModel(date + " is not null",req.originalUrl))
    }else if(!(new Date(date) instanceof Date && !isNaN(new Date(date)))){
        throw res.status(400).send(errorModel(date + " is not date format",req.originalUrl))
    }else{
        return date
    }
}

module.exports.foundId = foundId
module.exports.validateStr = validateStr
module.exports.validateEmail = validateEmail
module.exports.validateDate = validateDate
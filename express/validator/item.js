const errorModel = require('../response/errorModel')
const Items = require('../config/db').items

const foundId = async (req,res) => {
    let item = await Items.findOne({ where: { itemId: req.params.id } })
    if(item === null) {
        throw res.status(404).json(errorModel("item " + req.params.id + " does not exist", req.originalUrl))
    } else {
        return item
    }
}

const validateStr = (str,req,res) => {
    if(str === undefined || str === null || str === ""){
        throw res.status(400).send(errorModel("item is not null",req.originalUrl))
    }else if(str.length > 100){
        throw res.status(400).send(errorModel(str + " have not more 100 characters",req.originalUrl))
    }else{
        return str.trim()
    }
}

const validateSL = (str,req,res) => {
    if(str === undefined || str === null || str === ""){
        throw res.status(400).send(errorModel("item is not null",req.originalUrl))
    }else if(str.length !== 15){
        throw res.status(400).send(errorModel(str + " have 15 characters only",req.originalUrl))
    }else{
        return str.trim()
    }
}

const validateSW = (str,req,res) => {
    if(str === undefined || str === null || str === ""){
        throw res.status(400).send(errorModel("item is not null",req.originalUrl))
    }else if(str.length !== 13){
        throw res.status(400).send(errorModel(str + " have 13 characters only",req.originalUrl))
    }else{
        return str.trim()
    }
}

const validateDate = (date,req,res) => {
    if(date === undefined || date === null || date === ""){
        throw res.status(400).send(errorModel(date + " is not null",req.originalUrl))
    }else if(!date instanceof Date && isNaN(date)){
        throw res.status(400).send(errorModel(date + " is not date format",req.originalUrl))
    }else{
        return date
    }
}

module.exports.foundId = foundId
module.exports.validateStr = validateStr
module.exports.validateSL = validateSL
module.exports.validateSW = validateSW
module.exports.validateDate = validateDate
const errorModel = require('../response/errorModel')
const Item = require('../config/db').items

const foundId = async (req,res) => {
    let item = await Item.findOne({ where: { itemId: req.params.id } })
    if(item === null) {
        await res.status(404).json(errorModel("item " + req.params.id + " does not exist", req.originalUrl))
    } else {
        return item
    }
}

const validateStr = async (str) => {
    if(str === undefined || str === null || str === ""){
        throw new Error("item is not null")
    }else if(str.length > 100){
        throw new Error(str + " have not more than 100 characters")
    }else{
        return str.trim()
    }
}

const validateSL = async (str) => {
    if(str === undefined || str === null || str === ""){
        throw new Error("item is not null")
    }else if(str.length !== 15){
        throw new Error(str + " have 15 characters only")
    }else{
        return str.trim()
    }
}

const validateSW = async (str) => {
    if(str === undefined || str === null || str === ""){
        throw new Error("item is not null")
    }else if(str.length !== 13){
        throw new Error(str + " have 13 characters only")
    }else{
        return str.trim()
    }
}

const validateDate = async (date) => {
    if(date === undefined || date === null || date === ""){
        throw new Error(date + " is not null")
    }else if(!date instanceof Date && isNaN(date)){
        throw new Error(date + " is not date format")
    }else{
        return date
    }
}


module.exports.foundId = foundId
module.exports.validateStr = validateStr
module.exports.validateSL = validateSL
module.exports.validateSW = validateSW
module.exports.validateDate = validateDate
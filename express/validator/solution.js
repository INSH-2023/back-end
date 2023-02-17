const errorModel = require('../response/errorModel')
const Solution = require('../config/db').solutions

const foundId = async (req,res) => {
    let solution = await Solution.findOne({ where: { solutionId: req.params.id } })
    if(solution === null) {
        await res.status(404).json(errorModel("solution " + req.params.id + " does not exist", req.originalUrl))
    } else {
        return solution
    }
}

const validateStr100 = async (str) => {
    if(str === undefined || str === null || str === ""){
        throw new Error("solution is not null")
    }else if(str.length > 100){
        throw new Error(str + " have not more than 100 characters")
    }else{
        return str.trim()
    }
}

const validateStr100Null = async (str) => {
    if(str.length > 100){
        throw new Error(str + " have not more than 100 characters")
    }else{
        return str.trim()
    }
}

const validateStr500 = async (str) => {
    if(str.length > 500){
        throw new Error(str + " have not more than 500 characters only")
    }else{
        return str.trim()
    }
}

const validateNumber = async (int) => {
    if(int === undefined || int === null){
        throw new Error(int + " is not null")
    }else if(int <= 0){
        throw new Error(int + " is more than 0")
    }else{
        return int
    }
}

module.exports.foundId = foundId
module.exports.validateStr100 = validateStr100
module.exports.validateStr100Null = validateStr100Null
module.exports.validateStr500 = validateStr500
module.exports.validateNumber = validateNumber
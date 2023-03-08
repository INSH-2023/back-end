const { EmptyResultError } = require('sequelize')
const Solution = require('../config/db').solutions

const foundId = async (req,res) => {
    let solution = await Solution.findOne({ where: { solutionId: req.params.id }, include: ["steps"], order: [[{ model: 'steps' }, 'step', 'ASC']] })
    if(solution === null) {
        throw new EmptyResultError("solution id " + req.params.id + " does not exist")
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

const validateStr500Tag = async (arr) => {
    if(arr === undefined || arr === null){
        throw new Error("tag is not null")
    }else if(!Array.isArray(arr)) {
        throw new Error("tag is not array please fix to array format")
    } else {
        return arr.toString()
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

const validateStep = async (arr) => {
    if(arr === undefined || arr === null){
        throw new Error("step is not null")
    } else if(!Array.isArray(arr)) {
        throw new Error("step is not array please fix to array format")
    } else if(arr.length === 0) {
        throw new Error("step have not empty list")
    } else {
        return arr
    }
}

module.exports.foundId = foundId
module.exports.validateStr100 = validateStr100
module.exports.validateStr100Null = validateStr100Null
module.exports.validateStr500 = validateStr500
module.exports.validateStr500Tag = validateStr500Tag
module.exports.validateNumber = validateNumber
module.exports.validateStep = validateStep
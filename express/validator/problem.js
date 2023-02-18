const { EmptyResultError } = require('sequelize')
const Problem = require('../config/db').problems

const foundId = async (req,res) => {
    let problem = await Problem.findOne({ where: { problemId: req.params.id } })
    if(problem === null) {
        throw new EmptyResultError("problem id " + req.params.id + " does not exist")
    } else {
        return problem
    }
}

const validateStr100 = async (str) => {
    if(str === undefined || str === null || str === ""){
        throw new Error("problem is not null",req.originalUrl)
    }else if(str.length > 100){
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

module.exports.foundId = foundId
module.exports.validateStr100 = validateStr100
module.exports.validateStr500 = validateStr500
const express = require('express')
const Problem = require('../../config/db').problems
const validator = require('../../validator/problem')
const errorModel = require('../../response/errorModel')
const router = express.Router()
const { EmptyResultError } = require('sequelize')

// get problems
router.get('/', async (req, res)=> {
    // get all problems
    let problems = await Problem.findAll({})
    res.send(problems)
})

// get problem by id
router.get('/:id', async (req, res)=>{
    try {
        // get problem by id
        let problem = await validator.foundId(req, res)
        res.send(problem)
    } catch (err) {
        res.status(404).json(errorModel(err.message,req.originalUrl))
    }
})

// create problem
router.post('/', async (req, res)=>{
    try {
        // validate body
        let newProblem = {
            problem: await validator.validateStr100(req.body.problem),
            icon: await validator.validateStr500(req.body.icon)
        }
        // create problem
        let problem = await Problem.create(newProblem)
        res.status(201).send(problem)
    } catch (err) {
        res.status(400).json(errorModel(err.message, req.originalUrl))
    }
})

// update problem by id
router.put('/:id', async (req,res)=> {
    try {
        // get problems by id
        let problems = await validator.foundId(req, res)
        
        // validate body
        let newProblem = {
            problem: await validator.validateStr100(req.body.problem),
            icon: await validator.validateStr500(req.body.icon),
        }

        // update problem
        await Problem.update(newProblem, { where: { problemId: problems.problemId }})
        res.send({msg: "problems id : " + req.params.id + " have been updated"})
    } catch(err) {
        res.status(400).json(errorModel(err.message, req.originalUrl))
    }
})

// delete problem by id
router.delete('/:id', async (req,res)=>{
    try {
        // get problem by id
        let problem = await validator.foundId(req, res)
    
        // delete problem
        await Problem.destroy({ where: { problemId: problem.problemId }} )
        res.send({msg: "problems id : " + req.params.id + " have been deleted"})
    } catch (err) {
        res.status(404).json(errorModel(err.message,req.originalUrl))
    }
})

module.exports = router
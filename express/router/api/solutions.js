const express = require('express')
const Solution = require('../../config/db').solutions
const Step = require('../../config/db').steps
const validator = require('../../validator/solution')
const errorModel = require('../../response/errorModel')
const router = express.Router()
const { EmptyResultError } = require('sequelize')

// get solutions
router.get('/', async (req, res)=> {
    // get all solution
    let solutions = await Solution.findAll({include: ["steps"], order: [[{ model: 'steps' }, 'step', 'ASC']]})
    res.send(solutions)
})

// get solution by id
router.get('/:id', async (req, res)=>{
    try {
        // get solution by id
        let solution = await validator.foundId(req, res)
        res.send(solution)
    } catch (err) {
        res.status(404).json(errorModel(err.message, req.originalUrl))
    }
})

// create solution
router.post('/', async (req, res)=>{
    // validate body
    try {
        // create new solution
        let newsolution = {
            title: await validator.validateStr100(req.body.title),
            icon: await validator.validateStr500(req.body.icon),
            text: await validator.validateStr100(req.body.text),
            tag: await validator.validateStr500Tag(req.body.tag)
        }

        // validate step
        await validator.validateStep(req.body.steps)

        // create solution
        let solution = await Solution.create(newsolution)

        // create new step list
        req.body.steps.forEach(async (step) => {
            let newStep = {
                step: await validator.validateNumber(step.step),
                step_name: await validator.validateStr100(step.step_name),
                image_name: await validator.validateStr100Null(step.image_name),
                solutionId: solution.dataValues.solutionId
            }
            await Step.create(newStep)
            console.log(newStep)
        });
        res.status(201).send(solution)
    } catch(err) {
        res.status(400).json(errorModel(err.message, req.originalUrl))
    }
})

// update solution by id
router.put('/:id', async (req,res)=> {
    try {
        // get solutions by id
        let solutions = await validator.foundId(req, res)

        // validate body
        let newsolution = {
            title: await validator.validateStr100(req.body.title),
            icon: await validator.validateStr500(req.body.icon),
            text: await validator.validateStr100(req.body.text),
            tag: await validator.validateStr500Tag(req.body.tag)
        }

        // validate step
        await validator.validateStep(req.body.steps)

        // update solution
        await Solution.update(newsolution, { where: { solutionId: solutions.solutionId }})

        // delete all old steps
        Step.destroy({ where: { solutionId: solutions.solutionId }})

        // create step
        req.body.steps.forEach(async (step) => {
            let newStep = {
                step: await validator.validateNumber(step.step),
                step_name: await validator.validateStr100(step.step_name),
                image_name: await validator.validateStr100Null(step.image_name),
                solutionId: solutions.solutionId
            }
            await Step.create(newStep)
        });

        res.send({msg: "solutions id : " + req.params.id + " have been updated"})
    } catch (err) {
        if (err instanceof EmptyResultError) {
            res.status(404).json(errorModel(err.message,req.originalUrl))
        } else {
            res.status(400).json(errorModel(err.message,req.originalUrl))
        }
    }
})

// delete solution by id
router.delete('/:id', async (req,res)=>{
    try {
        // get solution by id
        let solution = await validator.foundId(req, res)

        // delete step and solution
        await Step.destroy({ where: { solutionId: solution.solutionId }})
        await Solution.destroy({ where: { solutionId: solution.solutionId }} )

        res.send({msg: "solutions id : " + req.params.id + " have been deleted"})
    } catch (err) {
        res.status(404).json(errorModel(err.message, req.originalUrl))
    }
})

module.exports = router
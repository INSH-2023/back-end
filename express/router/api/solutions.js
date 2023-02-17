const express = require('express')
const Solution = require('../../config/db').solutions
const Step = require('../../config/db').steps
const validator = require('../../validator/solution')
const errorModel = require('../../response/errorModel')
const router = express.Router()

// get solutions
router.get('/', async (req, res)=> {
    // get all solution
    let solutions = await Solution.findAll({})
    res.send(solutions)
})

// get solution by id
router.get('/:id', async (req, res)=>{
    // get solution by id
    let solution = await validator.foundId(req, res)
    res.send(solution)
})

// create solution
router.post('/', async (req, res)=>{
    // validate body
    try {
        // create new solution
        let newsolution = {
            title: await validator.validateStr100(req.body.solution),
            icon: await validator.validateStr500(req.body.icon),
            text: await validator.validateStr100(req.body.text),
            tag: await validator.validateStr500(req.body.tag)
        }
        let solution = await Solution.create(newsolution)

        // create new step list
        newsolution.steps = []
        for(i in req.body.steps) {
            let step = {
                step: await validator.validateNumber(i.step),
                step_name: await validator.validateStr100(i.step_name),
                image_name: await validator.validateStr100Null(i.image_name),
                solution_id: solution.solutionId
            }
            await Step.create(step)
            newsolution.steps.push(step)
        }
        res.status(201).send(solution)
    } catch(err) {
        res.status(400).send(errorModel(err.message, req.originalUrl))
    }
})

// update solution by id
router.put('/:id', async (req,res)=> {
    // get solutions by id
    let solutions = await validator.foundId(req, res)

    // validate body
    let newsolution = {
        solution: validator.validateStr100(req.body.solution,req,res),
        icon: validator.validateStr500(req.body.icon,req,res),
    }

    await Solution.update(newsolution, { where: { solutionId: solutions.solutionId }})
    res.send({msg: "solutions id : " + req.params.id + " have been updated"})
})

// delete solutions by id
router.delete('/:id', async (req,res)=>{
    // get solution by id
    let solution = await validator.foundId(req, res)
    
    await Solution.destroy({ where: { solutionId: solution.solutionId }} )

    res.send({msg: "solutions id : " + req.params.id + " have been deleted"})
})


module.exports = router
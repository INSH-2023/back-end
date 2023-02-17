const express = require('express')
const Request = require('../../config/db').requests
const validator = require('../../validator/request')
const errorModel = require('../../response/errorModel')
const router = express.Router()

// get requests
router.get('/', async (req, res)=> {
    // get request all
    let requests = await Request.findAll({})
    res.send(requests)
})

// get request by id
router.get('/:id', async (req, res)=>{
    // get request by id
    let request = await validator.foundId(req, res)
    res.send(request)
})

// create request
router.post('/', async (req, res)=>{

    // validate body
    try {
        let newRequests = {
            full_name: await validator.validateStr(req.body.full_name),
            email: await validator.validateEmail(req.body.email),
            group_work: await validator.validateStr(req.body.group_work),
            service_type: await validator.validateStr(req.body.service_type),
            subject: await validator.validateStr(req.body.subject),
            status: await validator.validateStr(req.body.status),
            req_date: await validator.validateDate(req.body.req_date),
            assign: await validator.validateStr(req.body.assign)
        }

        // create request
        let requests = await Request.create(newRequests)
        res.status(201).send(requests)
    } catch(err) {
        res.status(400).json(errorModel(err.message,req.originalUrl))
    }
})

// update request by id
router.put('/:id', async (req,res)=> {
    // get request by id
    let request = await validator.foundId(req, res)

    // validate body
    try {
        let newRequests = {
            full_name: await validator.validateStr(req.body.full_name),
            email: await validator.validateEmail(req.body.email),
            group_work: await validator.validateStr(req.body.group_work),
            service_type: await validator.validateStr(req.body.service_type),
            subject: await validator.validateStr(req.body.subject),
            status: await validator.validateStr(req.body.status),
            req_date: await validator.validateDate(req.body.req_date),
            assign: await validator.validateStr(req.body.assign)
        }

        // update request
        await Request.update(newRequests, { where: { requestId: request.requestId }})
        res.send({msg: "request id : " + req.params.id + " have been updated"})
    } catch(err) {
        res.status(400).json(errorModel(err.message,req.originalUrl))
    }
})

// delete request by id
router.delete('/:id', async (req,res)=>{
    // get request by id
    let request = await validator.foundId(req, res)

    // delete request
    await Request.destroy({ where: { requestId: request.requestId }} )
    res.send({msg: "request id : " + req.params.id + " have been deleted"})
})

module.exports = router
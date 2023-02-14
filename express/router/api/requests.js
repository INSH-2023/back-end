const express = require('express')
const Requests = require('../../config/db').requests
const validator = require('../../validator/request')
const router = express.Router()

// get requests
router.get('/', async (req, res)=> {
    let requests = await Items.findAll({})
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
    let newRequests = {
        full_name: validator.validateStr(req.body.full_name,req,res),
        email: validator.validateEmail(req.body.email,req,res),
        group_work: validator.validateStr(req.body.group_work,req,res),
        service_type: validator.validateStr(req.body.service_type,req,res),
        subject: validator.validateStr(req.body.subject,req,res),
        status: validator.validateStr(req.body.status,req,res),
        req_date: validator.validateDate(req.body.req_date,req,res),
        assign: validator.validateStr(req.body.assign,req,res)
    }

    let requests = await Requests.create(newRequests)
    res.status(201).send(requests)
})

// update request by id
router.put('/:id', async (req,res)=> {
    // get request by id
    let request = await validator.foundId(req, res)

    let newRequests = {
        full_name: validator.validateStr(req.body.full_name,req,res),
        email: validator.validateEmail(req.body.email,req,res),
        group_work: validator.validateStr(req.body.group_work,req,res),
        service_type: validator.validateStr(req.body.service_type,req,res),
        subject: validator.validateStr(req.body.subject,req,res),
        status: validator.validateStr(req.body.status,req,res),
        req_date: validator.validateDate(req.body.req_date,req,res),
        assign: validator.validateStr(req.body.assign,req,res)
    }

    await Requests.update(newRequests, { where: { requestId: request.requestId }})
    res.send({msg: "request id : " + req.params.id + " have been updated"})
})

// delete request by id
router.delete('/:id', async (req,res)=>{
    // get request by id
    let request = await validator.foundId(req, res)

    await Product.destroy({ where: { requestId: request.requestId }} )
    res.send({msg: "request id : " + req.params.id + " have been deleted"})
})

module.exports = router
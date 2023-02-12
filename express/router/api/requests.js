const express = require('express')
const requests = require('../../models/Requests')
const validator = require('../../validator/request')

const router = express.Router()

// get requests
router.get('/', (req, res)=> {
    requests.selectRequest(req, res)
})

// get request by id
router.get('/:id', (req, res)=>{
    // get request by id
    requests.selectRequestById(req, res)
})

// create request
router.post('/', (req, res)=>{
    requests.insertRequest(
        validator.validateStr(req.body.full_name,req,res),
        validator.validateEmail(req.body.email,req,res),
        validator.validateStr(req.body.group_work,req,res),
        validator.validateStr(req.body.service_type,req,res),
        validator.validateStr(req.body.subject,req,res),
        validator.validateStr(req.body.status,req,res),
        validator.validateDate(req.body.req_date,req,res),
        validator.validateStr(req.body.assign,req,res),
        req, res
    )
})

// update request by id
router.put('/:id', (req,res)=> {
    requests.updateRequest(
        validator.validateStr(req.body.full_name,req,res),
        validator.validateEmail(req.body.email,req,res),
        validator.validateStr(req.body.group_work,req,res),
        validator.validateStr(req.body.service_type,req,res),
        validator.validateStr(req.body.subject,req,res),
        validator.validateStr(req.body.status,req,res),
        validator.validateDate(req.body.req_date,req,res),
        validator.validateStr(req.body.assign,req,res),
        req, res
    )
})

// delete request by id
router.delete('/:id', (req,res)=>{
    requests.deleteRequest(req, res)
})


module.exports = router
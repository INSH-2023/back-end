const express = require('express')
const users = require('../../models/Users')
const validator = require('../../validator/user')

const router = express.Router()

// get users
router.get('/', (req, res)=> {
    users.selectUser(req, res)
})

// get user by id
router.get('/:id', (req, res)=>{
    // get user by id
    users.selectUserById(req, res)
})

// create user
router.post('/', (req, res)=>{
    users.insertUser(
        validator.validateNumber(req.body.emp_code),
        validator.validateStr(req.body.full_name,req,res),
        validator.validateRole(req.body.role,req,res),
        validator.validateStr(req.body.group_work,req,res),
        validator.validateStr(req.body.office,req,res),
        validator.validateStr(req.body.status,req,res),
        validator.validateStr(req.body.position,req,res),
        validator.validateEmail(req.body.email,req,res),
        validator.validatePassword(req.body.password,req,res),
        req, res
    )
})

// update user by id
router.put('/:id', (req,res)=> {
    users.updateUser(
        validator.validateStr(req.body.full_name,req,res),
        validator.validateRole(req.body.role,req,res),
        validator.validateStr(req.body.group_work,req,res),
        validator.validateStr(req.body.office,req,res),
        validator.validateStr(req.body.status,req,res),
        validator.validateStr(req.body.position,req,res),
        validator.validateEmail(req.body.email,req,res),
        validator.validatePassword(req.body.password,req,res),
        req, res
    )
})

// delete user by id
router.delete('/:id', (req,res)=>{
    users.deleteUser(req, res)
})


module.exports = router
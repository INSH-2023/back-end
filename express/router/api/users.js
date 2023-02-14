const express = require('express')
const Users = require('../../config/db').users
const validator = require('../../validator/user')
const router = express.Router()

// get users
router.get('/', async (req, res)=> {
    let users = await Users.scope('withoutPassword').findAll({})
    res.send(users)
})

// get user by id
router.get('/:id', async (req, res)=>{
    // get user by id
    let user = await validator.scope('withoutPassword').foundId(req, res)
    res.send(user)
})

// create user
router.post('/', async (req, res) => {
    let newUser = {
        emp_code: validator.validateNumber(req.body.emp_code),
        full_name: validator.validateStr(req.body.full_name,req,res),
        role: validator.validateRole(req.body.role,req,res),
        group_work: validator.validateStr(req.body.group_work,req,res),
        office: validator.validateStr(req.body.office,req,res),
        status: validator.validateStr(req.body.status,req,res),
        position: validator.validateStr(req.body.position,req,res),
        email: validator.validateEmail(req.body.email,req,res),
        password: validator.validatePassword(req.body.password,req,res)
    }
    
    // unique check
    let users = await Users.scope('withoutPassword').findAll({})
    
    users.forEach(u => {
        validator.validateUnique(newUser,u,req,res)
    });

    let user = await Users.create(newUser)
    res.status(201).send(user)
})

// update user by id
router.put('/:id', async (req,res)=> {
    // get user by id
    let user = await validator.foundId(req, res)

    // validate body
    let newUser = {
        emp_code: validator.validateNumber(req.body.emp_code),
        full_name: validator.validateStr(req.body.full_name,req,res),
        role: validator.validateRole(req.body.role,req,res),
        group_work: validator.validateStr(req.body.group_work,req,res),
        office: validator.validateStr(req.body.office,req,res),
        status: validator.validateStr(req.body.status,req,res),
        position: validator.validateStr(req.body.position,req,res),
        email: validator.validateEmail(req.body.email,req,res),
        password: validator.validatePassword(req.body.password,req,res)
    }

    // unique check
    let users = await Users.scope('withoutPassword').findAll({})

    users.forEach(u => {
        validator.validateUnique(newUser,u,req,res)
    });

    await Users.update(newUser, { where: { userId: user.userId }})
    res.send({msg: "user id : " + req.params.id + " have been updated"})
})

// delete user by id
router.delete('/:id', async (req,res)=>{
    // get user by id
    let user = await validator.foundId(req, res)
    
    await Product.destroy({ where: { userId: user.userId }} )

    res.send({msg: "item id : " + req.params.id + " have been deleted"})
})

module.exports = router
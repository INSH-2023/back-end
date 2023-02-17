const express = require('express')
const User = require('../../config/db').users
const validator = require('../../validator/user')
const errorModel = require('../../response/errorModel')
const router = express.Router()

// get users
router.get('/', async (req, res)=> {
    let users = await User.scope('withoutPassword').findAll({})
    res.send(users)
})

// get user by id
router.get('/:id', async (req, res)=>{
    // get user by id
    let user = await validator.foundId(req, res)
    res.send(user)
})

// create user
router.post('/', async (req, res) => {
    // validate body
    try {
        let newUser = {
            emp_code: await validator.validateNumber(req.body.emp_code),
            full_name: await validator.validateStr(req.body.full_name,req,res),
            role: await validator.validateRole(req.body.role,req,res),
            group_work: await validator.validateStr(req.body.group_work,req,res),
            office: await validator.validateStr(req.body.office,req,res),
            status: await validator.validateStr(req.body.status,req,res),
            position: await validator.validateStr(req.body.position,req,res),
            email: await validator.validateEmail(req.body.email,req,res),
            password: await validator.validatePassword(req.body.password,req,res)
        }

        // unique check
        let users = await User.scope('withoutPassword').findAll({})
        users.forEach(u => {
            validator.validateUnique(newUser,u,req,res)
        });

        // create user
        let user = await User.create(newUser)
        res.status(201).send(user)
    } catch (err) {
        res.status(400).json(errorModel(err.message,req.originalUrl))
    }
})

// update user by id
router.put('/:id', async (req,res)=> {
    // get user by id
    let user = await validator.foundId(req, res)

    // validate body
    try {
        let newUser = {
            emp_code: await validator.validateNumber(req.body.emp_code),
            full_name: await validator.validateStr(req.body.full_name,req,res),
            role: await validator.validateRole(req.body.role,req,res),
            group_work: await validator.validateStr(req.body.group_work,req,res),
            office: await validator.validateStr(req.body.office,req,res),
            status: await validator.validateStr(req.body.status,req,res),
            position: await validator.validateStr(req.body.position,req,res),
            email: await validator.validateEmail(req.body.email,req,res),
            password: await validator.validatePassword(req.body.password,req,res)
        }

        // unique check
        let users = await User.scope('withoutPassword').findAll({})
        users.forEach(u => {
            validator.validateUnique(newUser,u,req)
        });

        // update user
        await User.update(newUser, { where: { userId: user.userId }})
        res.json({msg: "user id : " + req.params.id + " have been updated"})
    } catch(err) {
        res.status(400).json(errorModel(err.message,req.originalUrl))
    }
})

// delete user by id
router.delete('/:id', async (req,res)=>{
    // get user by id
    let user = await validator.foundId(req, res)
    
    // delete user
    await User.destroy({ where: { userId: user.userId }} )
    res.send({msg: "item id : " + req.params.id + " have been deleted"})
})

module.exports = router
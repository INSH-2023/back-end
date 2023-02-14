const express = require('express')
const Items = require('../../config/db').items
const validator = require('../../validator/item')
const router = express.Router()

// get items
router.get('/', async (req, res)=> {
    let items = await Items.findAll({})
    res.send(items)
})

// get item by id
router.get('/:id', async (req, res)=>{
    // get item by id
    let item = await validator.foundId(req, res)
    res.send(item)
})

// create item
router.post('/', async (req, res)=>{
    // validate body
    let newItem = {
        name: validator.validateStr(req.body.name,req,res),
        number: validator.validateStr(req.body.number,req,res),
        SL: validator.validateSL(req.body.SL,req,res),
        SW: validator.validateSW(req.body.SW,req,res),
        sent_date: validator.validateDate(req.body.sent_date,req,res),
        type: validator.validateStr(req.body.type,req,res),
        note: validator.validateStr(req.body.note,req,res)
    }
    
    let item = await Items.create(newItem)
    res.status(201).send(item)
})

// update item by id
router.put('/:id', async (req,res)=> {
    // get item by id
    let item = await validator.foundId(req, res)

    // validate body
    let newItem = {
        name: validator.validateStr(req.body.name,req,res),
        number: validator.validateStr(req.body.number,req,res),
        SL: validator.validateSL(req.body.SL,req,res),
        SW: validator.validateSW(req.body.SW,req,res),
        sent_date: validator.validateDate(req.body.sent_date,req,res),
        type: validator.validateStr(req.body.type,req,res),
        note: validator.validateStr(req.body.note,req,res)
    }

    await Items.update(newItem, { where: { itemId: item.itemId }})
    res.send({msg: "item id : " + req.params.id + " have been updated"})
})

// delete item by id
router.delete('/:id', async (req,res)=>{
    // get item by id
    let item = await validator.foundId(req, res)
    
    await Product.destroy({ where: { itemId: item.itemId }} )

    res.send({msg: "item id : " + req.params.id + " have been deleted"})
})


module.exports = router
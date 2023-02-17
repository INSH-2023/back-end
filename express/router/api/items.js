const express = require('express')
const Item = require('../../config/db').items
const validator = require('../../validator/item')
const errorModel = require('../../response/errorModel')
const router = express.Router()

// get items
router.get('/', async (req, res)=> {
    // get all items
    let items = await Item.findAll({})
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
    try {
        let newItem = {
            name: await validator.validateStr(req.body.name),
            number: await validator.validateStr(req.body.number),
            SL: await validator.validateSL(req.body.SL),
            SW: await validator.validateSW(req.body.SW),
            sent_date: await validator.validateDate(req.body.sent_date),
            type: await validator.validateStr(req.body.type),
            note: await validator.validateStr(req.body.note)
        }

        // create item
        let item = await Item.create(newItem)
        res.status(201).send(item)
    } catch(err) {
        res.status(400).json(errorModel(err.message, req.originalUrl));
    }
})

// update item by id
router.put('/:id', async (req,res)=> {
    // get item by id
    let item = await validator.foundId(req, res)
    // validate body
    try {
        let newItem = {
            name: await validator.validateStr(req.body.name),
            number: await validator.validateStr(req.body.number),
            SL: await validator.validateSL(req.body.SL),
            SW: await validator.validateSW(req.body.SW),
            sent_date: await validator.validateDate(req.body.sent_date),
            type: await validator.validateStr(req.body.type),
            note: await validator.validateStr(req.body.note)
        }

        // update item
        await Item.update(newItem, { where: { itemId: item.itemId }})
        res.send({msg: "item id : " + req.params.id + " have been updated"})
    } catch(err) {
        res.status(400).json(errorModel(err.message, req.originalUrl));
    }
})

// delete item by id
router.delete('/:id', async (req,res)=>{
    // get item by id
    let item = await validator.foundId(req, res)
    
    // delete item
    await Item.destroy({ where: { itemId: item.itemId }} )
    res.send({msg: "item id : " + req.params.id + " have been deleted"})
})


module.exports = router
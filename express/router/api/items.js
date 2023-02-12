const express = require('express')
const items = require('../../models/Items')
const validator = require('../../validator/item')

const router = express.Router()

// get items
router.get('/', (req, res)=> {
    items.selectItem(req, res)
})

// get item by id
router.get('/:id', (req, res)=>{
    // get item by id
    items.selectItemById(req, res)
})

// create item
router.post('/', (req, res)=>{
    items.insertItem(
        validator.validateStr(req.body.name,req,res),
        validator.validateStr(req.body.number,req,res),
        validator.validateSL(req.body.SL,req,res),
        validator.validateSW(req.body.SW,req,res),
        validator.validateDate(req.body.sent_date,req,res),
        validator.validateStr(req.body.type,req,res),
        validator.validateStr(req.body.note,req,res),
        req, res
    )
})

// update item by id
router.put('/:id', (req,res)=> {
    items.updateItem(
        validator.validateStr(req.body.name,req,res),
        validator.validateStr(req.body.number,req,res),
        validator.validateSL(req.body.SL,req,res),
        validator.validateSW(req.body.SW,req,res),
        validator.validateDate(req.body.sent_date,req,res),
        validator.validateStr(req.body.type,req,res),
        validator.validateStr(req.body.note,req,res),
        req, res
    )
})

// delete item by id
router.delete('/:id', (req,res)=>{
    items.deleteItem(req, res)
})


module.exports = router
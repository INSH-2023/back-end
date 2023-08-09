const express = require('express')
const router = express.Router()
// const users =require("../../data/Users")
// const uuid =require("uuid")
const validator = require('../../validator/validate')
const connMSQL = require('../../config/db_config')
const errorModel = require('../../response/errorModel')
const { JwtAuth } = require("../../middleware/jwtAuthen");

const table = 'item'
const userView = 'userview'
const columns = ["itemId", "item_name", "item_number", "item_type", "user_first_name",
    "user_last_name", "user_email", "user_group"]

//get item
router.get('/', JwtAuth, async (req, res) => {

    try {
        if (!connMSQL.handdleConnection()) {
            // let statement = `SELECT itemId,item_name,item_number,item_type,user_first_name,
            // user_last_name,user_email,user_group FROM moral_it_device.item as item 
            // join moral_it_device.user as user on user.user_emp_code=item.user_emp_code`

            let results
            // console.log(req.user.user_role)

            if (req.user.user_role == "user") {
                results = await connMSQL.connection_pool(validator.foundId(table, columns,
                    [{ col: "user_email", val: req.user.user_email }],
                    [{ table: `moral_it_device.${userView} as us`, on: 'us.user_emp_code=it.user_emp_code' }]
                ))
            } else {

                results = await connMSQL.connection_pool(validator.foundId(table, columns,
                    '',
                    [{ table: `moral_it_device.${userView} as us`, on: 'us.user_emp_code=it.user_emp_code' }]
                ))
            }
            let { status_pool, data } = results
            if (status_pool) {
                return res.status(200).json(data)
            }

        } else {
            console.log(`Cannot connect to mysql server !!`)
            throw new Error('connection error something')
        }
    } catch (error) {
        // console.log(error)
        next(errorModel(error.message, req.originalUrl,500))
    }
})


// get item by id
router.get('/:id', JwtAuth, async (req, res) => {
    try {
        // if (!connMSQL.handdleConnection()) {
        // let {status_pool:status_p,data:items,msg:msg} = await connMSQL.connection_pool(
        // `SELECT itemId,item_name,item_number,item_type,user_first_name,
        // user_last_name,user_email,user_group FROM moral_it_device.item as item 
        // join moral_it_device.user as user on user.user_emp_code = item.user_emp_code 
        // WHERE item.itemId = "${req.params.id}";`)

        // sql injection basic protector
        if (isNaN(Number(req.params.id))) {
            next(errorModel(`${table} id  ${req.params.id} does not exist`, req.originalUrl,404))
        }

        let { status_pool: status_p, data: items, msg: msg } = await connMSQL.connection_pool(validator.foundId(table, columns,
            [{ col: "itemId", val: req.params.id }],
            [{ table: `moral_it_device.${userView} as us`, on: 'us.user_emp_code=it.user_emp_code' }]
        ))
        console.log(items)

        if (status_p && items.length != 0) {
            return res.status(200).json(items)
        }
        else if (status_p && items.length == 0) {

            if (req.user.user_role == "user" && items[0].user_email !== req.user.user_email) {
                next(errorModel(`cannot access other user email with user permission`, req.originalUrl,403))
            }
            next(errorModel(`${table} id  ${req.params.id} does not exist`, req.originalUrl,404))
        }
        // } else {
        //     console.log(`Cannot connect to mysql server !!`)
        //     throw new Error('connection error something')
        // }
    } catch (error) {
        res.status(500).json()
        next(errorModel(error.message, req.originalUrl,500))
    }
})

router.get('/emp-code/:id', JwtAuth, async (req, res) => {
    try {
        // sql injection basic protector
        if (isNaN(Number(req.params.id))) {
            next(errorModel(`${table} id  ${req.params.id} does not exist`, req.originalUrl,404))
        }


        // if (!connMSQL.handdleConnection()) {
        //     let { status_pool: status_p, data: items, msg: msg } = await connMSQL.connection_pool(`
        // SELECT itemId,item_name,item_number,item_type,user_first_name,user_last_name,
        // user_email,user_group FROM moral_it_device.item as item 
        // join moral_it_device.user as user on user.user_emp_code = item.user_emp_code 
        // WHERE user.user_emp_code = "${req.params.id}";`)
        let { status_pool: status_p, data: items, msg: msg } = await connMSQL.connection_pool(validator.foundId(table, columns,
            [{ col: "it.user_emp_code", val: req.params.id }],
            [{ table: `moral_it_device.${userView} as us`, on: 'us.user_emp_code=it.user_emp_code' }]
        ))

        if (req.user.user_role == "user" && items[0].user_email !== req.user.user_email) {
            next(errorModel(`cannot access other user email with user permission`, req.originalUrl,403))
        }

        if (status_p && items.length != 0) {
            return res.status(200).json(items)
        } else if (status_p && items.length == 0) {
            next(errorModel(`${table} id  ${req.params.id} does not exist`, req.originalUrl,404))
        }
        // } else {
        //     console.log(`Cannot connect to mysql server !!`)
        //     throw new Error('connection error something')
        // }
    } catch (error) {
        next(errorModel(error.message, req.originalUrl,500))
    }
})

module.exports = router
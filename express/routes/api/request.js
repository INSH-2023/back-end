const express = require('express')
const router = express.Router()
const uuid = require("uuid")
const validator = require('../../validator/validate')
const connMSQL = require('../../config/db_config')
const errorModel = require('../../response/errorModel')
const sendMail = require('../../config/mailer_config')
const line = require('../../config/lineChat_config')

const table = 'request'
const { JwtAuth, verifyRole } = require("../../middleware/jwtAuthen");
const {ROLE} = require('../../enum/User')
const {SERVICE,USETYPE,STATUS,PROBLEM} = require('../../enum/Request')

// get data
router.get('/', JwtAuth, async (req, res) => {
    // can sorted data
    try {
        if (!connMSQL.handdleConnection()) {
            let columns = ['first_name', 'last_name', 'email', 'group', 'service_type', 'subject', 'status',
                'req_date', 'assign', 'use_type', 'sn', 'brand', 'type_matchine', 'other', 'problems', 'message']
            let { status_pool, data } = await connMSQL.connection_pool(
                `SELECT requestId,request_first_name,request_last_name,request_email,request_group,
                request_service_type,request_subject,request_status,DATE_FORMAT(request_req_date,"%Y-%m-%d %H:%i:%s") 
                as request_req_date,request_assign,request_use_type,request_sn,request_brand,request_type_matchine,
                request_other,request_problems,request_message FROM moral_it_device.request 
                order by request${columns.includes(req.query.sort)
                    ? '_' + req.query.sort : 'Id'} ${req.query.sortType == 'desc' ? 'desc' : 'asc'}`)
            if (req.user.user_role == "user") {
                data = data.filter(e => e.request_email == req.user.user_email)
            } else if (req.user.user_role == ROLE.Admin_it) {
                data = data.filter(e => e.request_service_type.toLocaleLowerCase() == "it_service")
            } else if (req.user.user_role == ROLE.Admin_pr) {
                data = data.filter(e => e.request_service_type.toLocaleLowerCase() == "pr_service")
            }
            return res.status(200).json(data)
        } else {
            console.log(`Cannot connect to mysql server !!`)
            throw new Error('connection error something :', err)
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json(errorModel(error.message, req.originalUrl))
    }
})

// get data by id
router.get('/:id', JwtAuth, async (req, res) => {
    try {
        if (!connMSQL.handdleConnection()) {
            let { status_pool: status_p, data: requests, msg: msg } = await connMSQL.connection_pool(validator.foundId(req, table))

            // user can get with their email only
            if (req.user.user_role == ROLE.User && requests[0].request_email !== req.user.user_email) {
                return res.status(403).json(errorModel(`cannot access other user email with user permission`, req.originalUrl))
            }

            // validate role of admin IT and admin PR who can upload by This role only
            if (req.user.user_role == ROLE.Admin_it && requests[0].request_service_type !== ServiceType.Admin_it) {
                return res.status(403).json(errorModel("admin it role can assign in it service only", req.originalUrl))
            } else if (req.user.user_role == ROLE.Admin_pr && requests[0].request_service_type !== ServiceType.Admin_pr) {
                return res.status(403).json(errorModel("admin pr role can assign in pr service only", req.originalUrl))
            }

            if (status_p && requests.length != 0) {
                return res.status(200).json(requests)
            } else
                if (status_p && requests.length == 0) {
                    return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`, req.originalUrl))
                }
        } else {
            console.log(`Cannot connect to mysql server !!`)
            throw new Error('connection error something')
        }
    } catch (error) {
        return res.status(400).json(errorModel(error.message, req.originalUrl))
    }
})

// create request
router.post('/', JwtAuth, async (req, res) => {
    let input
    let status = undefined
    try {
        // data=await validator.validateRequestData(req)
        input = [
            { prop: "request_first_name", value: validator.validateStrNotNull(await req.body.request_first_name, 50, table, 'request_first_name'), type: 'str' },
            { prop: "request_last_name", value: validator.validateStrNotNull(await req.body.request_last_name, 50, table, 'request_last_name'), type: 'str' },
            { prop: "request_email", value: validator.validateEmail(await req.body.request_email, 50, table, 'request_email'), type: 'str' },
            { prop: "request_group", value: validator.validateStrNotNull(await req.body.request_group, 50, table, 'request_group'), type: 'str' },
            { prop: "request_service_type", value: validator.validateRole(await req.body.request_service_type, SERVICE, 15, table, 'request_service_type'), type: 'str' },
            { prop: "request_subject", value: validator.validateRole(await req.body.request_subject, PROBLEM, 15, table, 'request_subject'), type: 'str' },
            { prop: "request_status", value: validator.validateRole(await req.body.request_status, STATUS, 15, table, 'request_status'), type: 'str' },
            { prop: "request_assign", value: validator.validateStrNotNull(await req.body.request_assign, 50, table, 'request_assign'), type: 'str' },
            { prop: "request_use_type", value: validator.validateRole(await req.body.request_use_type, USETYPE, 4, table, 'request_use_type'), type: 'str' },
            { prop: "request_sn", value: validator.validateStrNull(await req.body.request_sn, 40, table, 'request_sn'), type: 'str' },
            { prop: "request_brand", value: validator.validateStrNull(await req.body.request_brand, 50, table, 'request_brand'), type: 'str' },
            { prop: "request_type_matchine", value: validator.validateStrNull(await req.body.request_type_matchine, 15, table, 'request_type_matchine'), type: 'str' },
            { prop: "request_other", value: validator.validateStrNull(await req.body.request_other, 150, table, 'request_other'), type: 'str' },
            { prop: "request_problems", value: validator.validateStrNotNull(await req.body.request_problems, 150, table, 'request_problems'), type: 'str' },
            // {prop:"request_message"        ,value: validator.validateStr(await req.body.request_message,150,table,'request_message'),type:'str'},
            { prop: "request_message", value: validator.validateStrNull(await req.body.request_message, 150, table, 'request_message'), type: 'str' },

        ]
        console.log(input)
        // console.log('testing',await req.body.role)
        status = !(await validator.checkUndefindData(input, table))
        // validator.createData(data,table)

        // user can get with their email only
        if (req.user.user_role == ROLE.User && input[2].value !== req.user.user_email) {
            return res.status(403).json(errorModel(`cannot access other user email with user permission`, req.originalUrl))
        }

    } catch (err) {
        console.log(err)
        status = false
        // console.log(status)
        return res.status(400).json(errorModel(err.message, req.originalUrl))
    }

    if (status == true) {
        try {
            // if(!connMSQL.handdleConnection()){
            let { status_pool: status_p, data: requests, msg: msg } = await connMSQL.connection_pool(validator.createData(input, table, res))
            if (status_p) {
                let sub = 'This is summary report!!'
                let service = await req.body.request_service_type
                let fname = `${await req.body.request_first_name} ${await req.body.request_last_name}`
                let subject = await req.body.request_subject
                let type_of_use = await req.body.request_use_type
                let type_machine = await req.body.request_type_matchine
                let brand_name = await req.body.request_brand
                let problems = await req.body.request_problems
                let other = await req.body.request_other
                let message = await req.body.request_message
                let email = await req.body.request_email
                await sendMail.sendMail('request', res, sub, sendMail.report_html(service, subject, type_of_use, type_machine, brand_name, problems, other, message), email)
                await line.send(service, fname, email, subject, type_of_use, type_machine, brand_name, problems, other, message)
                return res.status(200).json({ message: `create ${table} success!!`, status: '200' })
            }

            // else if(!status_p&&msg.errno==1062){
            //     return res.status(400).json(errorModel("Duplicate data",req.originalUrl))
            // }
            // connMSQL.connection.query(

            //     validator.createData(data,table,res),

            //     (err,results)=>{
            //         // error
            //         if(err){
            //             console.log(err)
            //             return res.status(400).json(errorModel(err.message,req.originalUrl))
            //         }
            //         console.log(results)
            //         console.log(`create ${table} success!!`)
            //         return res.status(200).json({message:`create ${table} success!!`,status:'200'})
            //     }
            // )

            // }else{
            //     console.log(`Cannot connect to mysql server !!`) 
            //     throw new Error('connection error something')
            // } 
        } catch (error) {
            console.log(error)
            return res.status(500).json(errorModel(error.message, req.originalUrl))
        }
    } else {
        return res.status(400).json(errorModel('data not valid', req.originalUrl))
    }
})

// delete
router.delete('/:id', JwtAuth, verifyRole(ROLE.Super_admin), async (req, res) => {
    // delete data
    try {
        if (!connMSQL.handdleConnection()) {
            let { status_pool: status_p, data: requests, msg: msg } = await connMSQL.connection_pool(validator.deleteData(req, table, 'requestId'))

            // user can get with their email only
            if (req.user.user_role == role.User && requests[0].request_email !== req.user.user_email) {
                return res.status(403).json(errorModel(`cannot access other user email with user permission`, req.originalUrl))
            }

            // validate role of admin IT and admin PR who can upload by This role only
            if (req.user.user_role == role.Admin_it && requests[0].request_service_type !== ServiceType.Admin_it) {
                return res.status(403).json(errorModel("admin it role can assign in it service only", req.originalUrl))
            } else if (req.user.user_role == role.Admin_pr && requests[0].request_service_type !== ServiceType.Admin_pr) {
                return res.status(403).json(errorModel("admin pr role can assign in pr service only", req.originalUrl))
            }

            if (status_p && requests.affectedRows != 0) {
                console.log(msg)
                return res.status(200).json({ message: `delete ${table} id ${req.params.id} success!!`, status: '200' })

            } else
                if (status_p && requests.affectedRows == 0) {
                    return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`, req.originalUrl))
                    // return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))

                }
        } else {
            console.log(`Cannot connect to mysql server !!`)
            throw new Error('connection error something ')
        }
    } catch (error) {
        res.status(400).json(errorModel(error.message, req.originalUrl))
    }
})

// update data
router.put('/:id', JwtAuth, async (req, res) => {
    let input
    let status = undefined

    try {
        input = [
            { prop: "request_status", value: validator.validateRole(await req.body.request_status, STATUS, 15, table, 'request_status'), type: 'str' },
            { prop: "request_assign", value: validator.validateStrNotNull(await req.body.request_assign, 50, table, 'request_assign'), type: 'str' }
        ]
        // console.log('testing',await req.body.role)
        status = !(await validator.checkUndefindData(input, table))
        // validator.createData(data,table)
    } catch (err) {
        console.log(err)
        status = false
        // console.log(status)
        res.status(400).json(errorModel(err.message, req.originalUrl))
    }

    if (status == true) {
        // update data
        try {

            if (!connMSQL.handdleConnection()) {
                let { status_pool, data: requests, msg } = await connMSQL.connection_pool(validator.foundId(req, table, '*', `requestId=${req.params.id}`))
                if (requests.length == 0) {
                    return res.status(404).json(errorModel(`${table} id ${req.params.id} does not exist`, req.originalUrl))
                } else {
                    // user can get with their email only
                    if (req.user.user_role == role.User && requests[0].request_email !== req.user.user_email) {
                        return res.status(403).json(errorModel(`cannot access other user email with user permission`, req.originalUrl))
                    }

                    // validate role of admin IT and admin PR who can upload by This role only
                    if (req.user.user_role == role.Admin_it && requests[0].request_service_type !== ServiceType.Admin_it) {
                        return res.status(403).json(errorModel("admin it role can assign in it service only", req.originalUrl))
                    } else if (req.user.user_role == role.Admin_pr && requests[0].request_service_type !== ServiceType.Admin_pr) {
                        return res.status(403).json(errorModel("admin pr role can assign in pr service only", req.originalUrl))
                    }

                    await connMSQL.connection_pool(validator.updateData(req, input, table))
                    return res.status(200).json({ message: `update ${table} id ${req.params.id} success!!`, status: '200' })
                }
            } else {
                console.log(`Cannot connect to mysql server !!`)
                throw new Error('connection error something :', err)
            }
        } catch (error) {
            res.status(400).json(errorModel(error.message, req.originalUrl))
        }
    }
})

module.exports = router
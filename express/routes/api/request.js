const express = require('express')
const router = express.Router()
const uuid = require("uuid")
const validator = require('../../validator/validate')
const connMSQL = require('../../config/db_config')
const errorModel = require('../../response/errorModel')
const sendMail = require('../../config/mailer_config')
const line = require('../../config/lineChat_config')

const table = 'request'
const user = "user"
const userView = "userview"
const item = "item"
let columns = ["requestId", "user_first_name as request_first_name", "user_last_name as request_last_name",
    "user_email as request_email", "user_group as request_group", "request_service_type", "request_subject", "request_status",
    "request_req_date", "request_assign", "request_sn", "request_brand", "request_type_matchine", "request_other",
    "request_problems", "request_message"]
let notifyMessage = ["request_historyId", "request_problems", "request_message", "history_status", "history_assign", "history_req_date", "request_update"]
const { JwtAuth, verifyRole } = require("../../middleware/jwtAuthen");
const { ROLE } = require('../../enum/UserType')
const { SERVICE, USETYPE, STATUS, PROBLEM } = require('../../enum/Request')

// get data
router.get('/', JwtAuth, async (req, res, next) => {
    // can sorted data
    try {
        // let columns = ['first_name', 'last_name', 'email', 'group', 'service_type', 'subject', 'status',
        //     'req_date', 'assign', 'use_type', 'sn', 'brand', 'type_matchine', 'other', 'problems', 'message']
        let { status_pool, data, msg } = await connMSQL.connection_pool(
            validator.foundId(table, columns,
                '', [{ table: `moral_it_device.${userView} as us`, on: `us.user_emp_code=re.user_emp_code` }]
            ))
        if (req.user.user_role == ROLE.User) {
            data = data.filter(e => e.request_email == req.user.user_email)
        } else if (req.user.user_role == ROLE.Admin_it) {
            data = data.filter(e => e.request_service_type == SERVICE.Admin_it)
        } else if (req.user.user_role == ROLE.Admin_pr) {
            data = data.filter(e => e.request_service_type == SERVICE.Admin_pr)
        }

        // format for request date
        data.forEach(req => {
            req.request_req_date = new Date(req.request_req_date).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
        })

        // update user request by count for notify
        let { status_pool: status_p, data: requests, msg: msg1 } = await connMSQL.connection_pool(validator.foundId(userView, ["userId", "request_count", "request_update"],
            [{ col: "user_email", val: req.user.user_email }]
        ))
        req.params.id = requests[0].userId
        input = [
            { prop: "user_requestCount", value: data.length, type: 'int' }
        ]
        await connMSQL.connection_pool(validator.updateData(req, input, user))
        return res.status(200).json({ data: data, request_count: requests[0].request_count })
    } catch (error) {
        // console.log(error)
        next(errorModel(error.message, req.originalUrl,400))
    }
})

// get data by id
router.get('/:id', JwtAuth, async (req, res, next) => {
    try {
        // sql injection basic protector
        if (isNaN(Number(req.params.id))) {
            next(errorModel(`${table} id  ${req.params.id} does not exist`, req.originalUrl,404))
        }

        let { status_pool: status_p, data: requests, msg: msg } = await connMSQL.connection_pool(
            validator.foundId(table, columns,
                [{ col: "requestId", val: req.params.id }],
                [{ table: `moral_it_device.${userView} as us`, on: `us.user_emp_code=re.user_emp_code` }]
            ))
        if (status_p && requests.length == 0) {
            next(errorModel(`${table} id ${req.params.id} does not exist`, req.originalUrl, 404))
        }

        // let { status_pool: status_p1, data: problems, msg: msg1 } = await connMSQL.connection_pool(
        //     validator.foundId('problem', '', [{ col: "problem_type", val: requests[0].request_subject }]))

        // user can get with their email only
        if (req.user.user_role == ROLE.User && requests[0].request_email !== req.user.user_email) {
            next(errorModel(`cannot access other user email with user permission`, req.originalUrl, 403))
        }

        // validate role of admin IT and admin PR who can upload by This role only
        if (req.user.user_role == ROLE.Admin_it && requests[0].request_service_type !== SERVICE.Admin_it) {
            next(errorModel("admin it role can assign in it service only", req.originalUrl,403))
        } else if (req.user.user_role == ROLE.Admin_pr && requests[0].request_service_type !== SERVICE.Admin_pr) {
            next(errorModel("admin pr role can assign in pr service only", req.originalUrl,403))
        }

        if (status_p && requests.length != 0) {
            requests[0].request_req_date = new Date(req.request_req_date).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
            // if(problems[0] == undefined) {
            //     requests[0].problem_upload = problems[0].problem_upload
            // }
            return res.status(200).json(requests)
        }
    } catch (error) {
        next(errorModel(error.message, req.originalUrl,400))
    }
})

router.get('/updated/notify', JwtAuth, async (req, res, next) => {
    try {
        let { status_pool, data, msg } = await connMSQL.connection_pool(
            validator.foundId('request_history', notifyMessage,
                [{ col: "user_email", val: req.user.user_email }],
                [{ table: `moral_it_device.${table} as r`, on: `re.requestId=r.requestId` }, { table: `moral_it_device.${userView} as us`, on: `us.user_emp_code=r.user_emp_code` }]
            ))
        // format for request date
        data.forEach(req => {
            req.history_req_date = new Date(req.history_req_date).toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
        })
        return res.status(200).json(data)
    } catch (error) {
        next(errorModel(error.message, req.originalUrl,400))
    }
    // todo ให้ list เฉพาะอีเมลของตัวเองเมื่อมีการแจ้งซ่อม และเมื่อกดปุ่มรับแจ้งจะสามารถดูข้อมูลสรุปว่าใครสามารถแจ้งซ่อมได้
})

router.put('/updated/notify', JwtAuth, async (req, res, next) => {
    try {
        // update user request by count for notify
        let { status_pool: status_p, data: requests, msg: msg1 } = await connMSQL.connection_pool(validator.foundId(userView, ["userId"],
            [{ col: "user_email", val: req.user.user_email }]
        ))
        req.params.id = requests[0].userId
        input = [
            { prop: "user_updateRequest", value: 0, type: 'int' }
        ]
        await connMSQL.connection_pool(validator.updateData(req, input, user))
        return res.status(200).json({ message: `notification is confirmed!!` })
    } catch (error) {
        next(errorModel(error.message, req.originalUrl,400))
    }
})

router.get('/status/user', JwtAuth, async (req, res, next) => {
    try {
        let { status_pool, data, msg } = await connMSQL.connection_pool(
            validator.foundId(table, columns,
                [{ col: "user_email", val: req.user.user_email }], [{ table: `moral_it_device.${userView} as us`, on: `us.user_emp_code=re.user_emp_code` }]
            ))

        return res.status(200).json({
            request: data.filter(e => e.request_status == STATUS.Request).length,
            inProgress: data.filter(e => e.request_status == STATUS.InProgress).length,
            finish: data.filter(e => e.request_status == STATUS.Finish).length,
            opencase: data.filter(e => e.request_status == STATUS.OpenCase).length
        })
    } catch (error) {
        next(errorModel(error.message, req.originalUrl,400))
    }
})

router.get('/status/admin', JwtAuth, async (req, res, next) => {
    try {
        // if (!connMSQL.handdleConnection()) {
        let { status_pool, data, msg } = await connMSQL.connection_pool(
            validator.foundId(table, columns,
                '', [{ table: `moral_it_device.${userView} as us`, on: `us.user_emp_code=re.user_emp_code` }]
            ))
        if (req.user.user_role == ROLE.User) {
            return res.status(403).json(errorModel('block user get status', req.originalUrl))
        } else if (req.user.user_role == ROLE.Admin_it) {
            data = data.filter(e => e.request_service_type == SERVICE.Admin_it)
        } else if (req.user.user_role == ROLE.Admin_pr) {
            data = data.filter(e => e.request_service_type == SERVICE.Admin_pr)
        }

        return res.status(200).json({
            request: data.filter(e => e.request_status == STATUS.Request).length,
            inProgress: data.filter(e => e.request_status == STATUS.InProgress).length,
            finish: data.filter(e => e.request_status == STATUS.Finish).length,
            opencase: data.filter(e => e.request_status == STATUS.OpenCase).length
        })
    } catch (error) {
        next(errorModel(error.message, req.originalUrl, 400))
    }
})

// create request
router.post('/', JwtAuth, async (req, res, next) => {
    let input
    let status = undefined
    try {
        // data=await validator.validateRequestData(req)
        let { status_pool: user_p, data: userInput } = await connMSQL.connection_pool(
            validator.foundId("user", ["user_emp_code", "user_email"], [
                { col: "user_first_name", val: validator.validateStrNotNull(await req.body.request_first_name, 50, table, 'request_first_name'), log: 'AND' },
                { col: "user_last_name", val: validator.validateStrNotNull(await req.body.request_last_name, 50, table, 'request_last_name'), log: 'AND' },
                { col: "user_email", val: validator.validateEmail(await req.body.request_email, 50, table, 'request_email'), log: 'AND' },
                { col: "user_group", val: validator.validateStrNotNull(await req.body.request_group, 50, table, 'request_group') }
            ])
        )
        if (userInput.length == 0) {
            next(errorModel(`this ${table} does not exist by 
            ${req.body.request_first_name} ${req.body.request_last_name}
            ${req.body.request_email} ${req.body.request_group}`, req.originalUrl, 404))
        }

        input = [
            { prop: "user_emp_code", value: userInput[0].user_emp_code, type: 'int' },
            { prop: "request_service_type", value: validator.validateRole(await req.body.request_service_type, SERVICE, 15, table, 'request_service_type'), type: 'str' },
            { prop: "request_subject", value: validator.validateRole(await req.body.request_subject, PROBLEM, 15, table, 'request_subject'), type: 'str' },
            { prop: "request_status", value: validator.validateRole(await req.body.request_status, STATUS, 15, table, 'request_status'), type: 'str' },
            { prop: "request_assign", value: validator.validateStrNotNull(await req.body.request_assign, 50, table, 'request_assign'), type: 'str' },
            { prop: "request_use_type", value: validator.validateRole(await req.body.request_use_type, USETYPE, 4, table, 'request_use_type'), type: 'str' },
            { prop: "request_sn", value: validator.validateStrNull(await req.body.request_sn, 40, table, 'request_sn'), type: 'str' },
            { prop: "request_brand", value: validator.validateStrNull(await req.body.request_brand, 50, table, 'request_brand'), type: 'str' },
            { prop: "request_type_matchine", value: validator.validateStrNull(await req.body.request_type_matchine, 50, table, 'request_type_matchine'), type: 'str' },
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
        if (req.user.user_role == ROLE.User && userInput[0].user_email !== req.user.user_email) {
            next(errorModel(`cannot access other user email with user permission`, req.originalUrl,403))
        }

    } catch (err) {
        console.log(err)
        status = false
        // console.log(status)
        next(errorModel(err.message, req.originalUrl,400))
    }

    if (status == true) {
        try {
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
                await sendMail.sendMail('request', res, sub, sendMail.report_html(service, subject, type_of_use, type_machine, brand_name, problems, other, message, "กำลังรับเรื่อง"), email)
                await line.send(service, fname, email, subject, type_of_use, type_machine, brand_name, problems, other, message,"กำลังรับเรื่อง")
                return res.status(201).json({ message: `create ${table} success!!` })
            } else if (!status_p && msg.errno == 1062) {
                next(errorModel("input has been duplicate", req.originalUrl,400))
            }
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
            next(errorModel(error.message, req.originalUrl, 500))
        }
    } else {
        next(errorModel('data not valid', req.originalUrl,400))
    }
})

// delete
router.delete('/:id', JwtAuth, verifyRole(ROLE.Super_admin), async (req, res, next) => {
    // delete data
    try {
        // sql injection basic protector
        if (isNaN(Number(req.params.id))) {
            next(errorModel(`${table} id  ${req.params.id} does not exist`, req.originalUrl))
        }

        // user can get with their email only
        if (req.user.user_role == ROLE.User && requests[0].request_email !== req.user.user_email) {
            next(errorModel(`cannot access other user email with user permission`, req.originalUrl, 403))
        }

        // validate role of admin IT and admin PR who can upload by This role only
        if (req.user.user_role == ROLE.Admin_it && requests[0].request_service_type !== SERVICE.Admin_it) {
            next(errorModel("admin it role can assign in it service only", req.originalUrl,403))
        } else if (req.user.user_role == ROLE.Admin_pr && requests[0].request_service_type !== SERVICE.Admin_pr) {
            next(errorModel("admin pr role can assign in pr service only", req.originalUrl,403))
        }

        let { status_pool: status_p, data: requests, msg1 } = await connMSQL.connection_pool(
            validator.foundId(table, columns,
                [{ col: "requestId", val: req.params.id }],
                [{ table: `moral_it_device.${userView} as us`, on: `us.user_emp_code=re.user_emp_code` }]
        ))

        if (status_p && requests.length != 0) {
            await connMSQL.connection_pool(validator.deleteData(req, table, 'requestId'))

            let sub = 'Admin has removed your report!!'
            let service = requests[0].request_service_type
            let fname = `${requests[0].request_first_name} ${requests[0].request_last_name}`
            let subject = requests[0].request_subject
            let type_of_use = requests[0].request_use_type
            let type_machine = requests[0].request_type_matchine
            let brand_name = requests[0].request_brand
            let problems = requests[0].request_problems
            let other = requests[0].request_other
            let message = requests[0].request_message
            let email = requests[0].request_email
            await sendMail.sendMail('request', res, sub, sendMail.report_html(service, subject, type_of_use, type_machine, brand_name, problems, other, message, "admin ได้ลบการแจ้งเรื่องแล้ว"), email)
            await line.send(service, fname, email, subject, type_of_use, type_machine, brand_name, problems, other, message, "admin ได้ลบการแจ้งเรื่องแล้ว")
            return res.status(200).json({ message: `delete ${table} id ${req.params.id} success!!` })

        } else if (status_p && requests.length == 0) {
            // return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
            next(errorModel(`${table} id  ${req.params.id} does not exist`, req.originalUrl,404))
        }
    } catch (error) {
        next(errorModel(error.message, req.originalUrl,400))
    }
})

router.delete('/updated/notify/:id', JwtAuth, async (req, res, next) => {
    // delete data
    try {
        // sql injection basic protector
        if (isNaN(Number(req.params.id))) {
            next(errorModel(`${table} id  ${req.params.id} does not exist`, req.originalUrl, 404))
        }

        let { status_pool: status_p, data: requests, msg: msg } = await connMSQL.connection_pool(validator.deleteData(req, 'request_history', 'request_historyId'))

        await connMSQL.connection_pool(validator.deleteData(req, 'request_history', 'request_historyId'))

        if (status_p && requests.affectedRows != 0) {
            return res.status(200).json({ message: `delete request history id ${req.params.id} success!!` })

        } else if (status_p && requests.affectedRows == 0) {
            next(errorModel(`${table} id ${req.params.id} does not exist`, req.originalUrl, 404))
        }
    } catch (error) {
        next(errorModel(error.message, req.originalUrl,400))
    }
})

// update data
router.put('/:id', JwtAuth, verifyRole(ROLE.Super_admin, ROLE.Admin_it, ROLE.Admin_pr), async (req, res, next) => {
    let input
    let status = undefined

    // sql injection basic protector
    if (isNaN(Number(req.params.id))) {
        next(errorModel(`${table} id  ${req.params.id} does not exist`, req.originalUrl,404))
    }

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
        next(errorModel(err.message, req.originalUrl,400))
    }

    if (status == true) {
        // update data
        try {
            let { status_pool, data: requests, msg } = await connMSQL.connection_pool(
                validator.foundId(table, columns,
                    [{ col: "requestId", val: req.params.id }],
                    [{ table: `moral_it_device.${userView} as us`, on: `us.user_emp_code=re.user_emp_code` }]
                ))
            if (requests.length == 0) {
                next(errorModel(`${table} id ${req.params.id} does not exist`, req.originalUrl, 404))
            } else {
                // user can get with their email only
                if (req.user.user_role == ROLE.User && requests[0].request_email !== req.user.user_email) {
                    next(errorModel(`cannot access other user email with user permission`, req.originalUrl, 403))
                }

                // validate role of admin IT and admin PR who can upload by This role only
                if (req.user.user_role == ROLE.Admin_it && requests[0].request_service_type !== SERVICE.Admin_it) {
                    next(errorModel("admin it role can assign in it service only", req.originalUrl, 403))
                } else if (req.user.user_role == ROLE.Admin_pr && requests[0].request_service_type !== SERVICE.Admin_pr) {
                    next(errorModel("admin pr role can assign in pr service only", req.originalUrl, 403))
                }

                await connMSQL.connection_pool(validator.updateData(req, input, table))

                let reqId = req.params.id

                let { status_pool, data: user, msg } = await connMSQL.connection_pool(validator.foundId(
                    userView, ['userId', 'request_update'], [{ col: "user_email", val: requests[0].request_email }]))

                user[0].request_update++

                req.params.id = user[0].userId

                let update = [
                    { prop: "user_updateRequest", value: user[0].request_update, type: 'int' }
                ]

                await connMSQL.connection_pool(validator.updateData(req, update, 'user'))

                let log = [
                    { prop: "requestId", value: reqId, type: 'int' },
                    { prop: "history_status", value: validator.validateRole(await req.body.request_status, STATUS, 15, table, 'history_status'), type: 'str' },
                    { prop: "history_assign", value: validator.validateStrNotNull(await req.body.request_assign, 50, table, 'history_assign'), type: 'str' }
                ]

                await connMSQL.connection_pool(validator.createData(log, 'request_history'))

                // console.log(requests[0])

                let sub = 'Admin has updated your report!!'
                let service = requests[0].request_service_type
                let fname = `${requests[0].request_first_name} ${requests[0].request_last_name}`
                let subject = requests[0].request_subject
                let type_of_use = requests[0].request_use_type
                let type_machine = requests[0].request_type_matchine
                let brand_name = requests[0].request_brand
                let problems = requests[0].request_problems
                let other = requests[0].request_other
                let message = requests[0].request_message
                let email = requests[0].request_email
                await sendMail.sendMail('request', res, sub, sendMail.report_html(service, subject, type_of_use, type_machine, brand_name, problems, other, message, "admin ได้แก้ไขการแจ้งเรื่องแล้ว"), email)
                await line.send(service, fname, email, subject, type_of_use, type_machine, brand_name, problems, other, message, "admin ได้แก้ไขการแจ้งเรื่องแล้ว")        

                return res.status(200).json({ message: `update ${table} id ${reqId} success!!` })
            }
        } catch (error) {
            next(errorModel(error.message, req.originalUrl))
        }
    }
})

module.exports = router
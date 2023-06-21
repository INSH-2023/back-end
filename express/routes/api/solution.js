const express = require('express')
const router = express.Router()
const validator = require('../../validator/validate')
const connMSQL = require('../../config/db_config')
const errorModel = require('../../response/errorModel')
const { JwtAuth } = require("../../middleware/jwtAuthen");

const table = 'solution'
const stepTable = 'step_solution'
const stepColumn = ["step_", "step_name", "step_description"]

//get solution
router.get('/', JwtAuth, async (req, res) => {
    try {
        if (!connMSQL.handdleConnection()) {
            // เรียกข้อมูลของ solution ออกมา
            let { status_pool: sp1, data: solutions } = await connMSQL.connection_pool(validator.foundId(table))
            // เปลี่ยนค่าในการทำ promise ทั้งหมด ใน solution
            solutions = await Promise.all(solutions.map(async sol => {

                // เปลี่ยนจาก string เป็น array ถ้าค่านั้นไม่ว่าง
                sol.solution_tag = sol.solution_tag == null ? null : sol.solution_tag.split(",")

                // ทำการ map กับทุก step บน solution นั้น
                let { status_pool: sp2, data: steps } = await connMSQL.connection_pool(validator.foundId(stepTable, stepColumn,
                    [{ col: 'solution_Id', val: sol.solutionId }]
                ))
                sol.solution_steps = steps.length == 0 ? null : steps
                return sol
            }))
            return res.status(200).json(solutions)
        } else {
            console.log(`Cannot connect to mysql server !!`)
            throw res.status(400).json(errorModel(error.message, req.originalUrl))
        }
    } catch (error) {
        return res.status(500).json(errorModel(error.message, req.originalUrl))
    }
})


// get solution by id
router.get('/:id', JwtAuth, async (req, res) => {
    try {
        if (!connMSQL.handdleConnection()) {
            let { status_pool: sp1, data: solution } = await connMSQL.connection_pool(validator.foundId(validator.foundId(table, '',
                [{ col: 'solutionId', val: req.params.id }]
            )))
            if (sp1 && solution.length == 0) {
                return res.status(404).json(errorModel(`${table} id ${req.params.id} does not exist`, req.originalUrl))
            } else if (sp1 && solution.length != 0) {
                let { status_pool: sp2, data: steps } = await connMSQL.connection_pool(validator.foundId(stepTable, stepColumn,
                    [{ col: 'solution_Id', val: sol.solutionId }]
                ))
                // เปลี่ยนจาก string เป็น array ถ้าค่านั้นไม่ว่าง
                solution[0].solution_tag = solution[0].solution_tag == null ? null : solution[0].solution_tag.split(",")
                // ทำการ map กับทุก step บน solution นั้น
                solution[0].solution_steps = steps.length == 0 ? null : steps
                return res.status(200).send(solution)
            }
        } else {
            console.log(`Cannot connect to mysql server !!`)
            throw new Error('connection error something :', err)
        }
    } catch (error) {
        res.status(500).json(errorModel(error.message, req.originalUrl))
    }
})

// create solution
router.post('/', JwtAuth, async (req, res) => {
    let input
    let status = undefined
    try {
        input = [
            { prop: "solution_title", value: validator.validateStrNotNull(await req.body.solution_title, 100, table, 'solution_title'), type: 'str' },
            { prop: "solution_icon", value: validator.validateStrNotNull(await req.body.solution_icon, 100, table, 'solution_icon'), type: 'str' },
            { prop: "solution_text", value: validator.validateStrNotNull(await req.body.solution_text, 100, table, 'solution_text'), type: 'str' },
            { prop: "solution_tag", value: validator.validateTag(await req.body.solution_tag, 100, table, 'solution_tag'), type: 'str' },
        ]
        steps = validator.validateStep(await req.body.solution_steps, table, 'solution_steps')
        // console.log('testing',await req.body.role)
        status = !(await validator.checkUndefindData(input, table))
    } catch (err) {
        console.log(err)
        status = false
        // console.log(status)
        return res.status(400).json(errorModel(err.message, req.originalUrl))
    }

    if (status == true) {
        try {
            if (!connMSQL.handdleConnection()) {

                let { status_pool, data } = await connMSQL.connection_pool(validator.createData(input, table, res))

                // create step
                steps.forEach(async (step) => {
                    let stepInput = [
                        { prop: "solution_Id", value: data.insertId, type: 'int' },
                        { prop: "step_", value: step.step, type: 'int' },
                        { prop: "step_name", value: step.step_name, type: 'str' },
                        { prop: "step_description", value: step.step_description, type: 'str' }
                    ]
                    await connMSQL.connection_pool(validator.createData(stepInput, 'step_solution', res))
                })
                // error
                return res.status(200).json({ message: `create ${table} success!!`, status: '200' })
            } else {
                console.log(`Cannot connect to mysql server !!`)
                throw new Error('connection error something :', err)
            }
        } catch (error) {
            res.status(400).json(errorModel(error.message, req.originalUrl))
        }
    } else {
        return res.status(400).json(errorModel('data not valid', req.originalUrl))
    }
})

// delete solution
router.delete('/:id', JwtAuth, async (req, res) => {
    // delete data
    try {
        if (!connMSQL.handdleConnection()) {
            // delete
            await connMSQL.connection_pool(validator.deleteData(req, 'step_solution', 'solution_Id'))
            let { status_pool: status_p, data: sol, msg: msg } = await connMSQL.connection_pool(validator.deleteData(req, table, 'solutionId'))

            if (status_p && sol.affectedRows != 0) {
                return res.status(200).json({ message: `delete ${table} id ${req.params.id} success!!`, status: '200' })

            } else
                if (status_p && sol.affectedRows == 0) {
                    return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`, req.originalUrl))
                    // return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))

                }
        } else {
            console.log(`Cannot connect to mysql server !!`)
            throw new Error('connection error something')
        }
    } catch (error) {
        res.status(400).json(errorModel(error.message, req.originalUrl))
    }
})

// update solution
router.put('/:id', JwtAuth, async (req, res) => {
    let input
    let status = undefined
    try {
        input = [
            { prop: "solution_title", value: validator.validateStrNotNull(await req.body.solution_title, 100, table, 'solution_title'), type: 'str' },
            { prop: "solution_icon", value: validator.validateStrNotNull(await req.body.solution_icon, 100, table, 'solution_icon'), type: 'str' },
            { prop: "solution_text", value: validator.validateStrNotNull(await req.body.solution_text, 100, table, 'solution_text'), type: 'str' },
            { prop: "solution_tag", value: validator.validateTag(await req.body.solution_tag, 100, table, 'solution_tag'), type: 'str' },
        ]
        steps = validator.validateStep(await req.body.solution_steps, table, 'solution_steps')
        // console.log('testing',await req.body.role)
        status = !(await validator.checkUndefindData(input, table))
    } catch (err) {
        console.log(err)
        status = false
        // console.log(status)
        return res.status(400).json(errorModel(err.message, req.originalUrl))
    }

    if (status == true) {
        try {
            if (!connMSQL.handdleConnection()) {

                let { status_pool: status_p, data } = await connMSQL.connection_pool(validator.updateData(req, input, table))

                // update steps
                await connMSQL.connection_pool(validator.deleteData(req, 'step_solution', 'solution_Id'))
                steps.forEach(async (step) => {
                    let stepInput = [
                        { prop: "solution_Id", value: req.params.id, type: 'int' },
                        { prop: "step_", value: step.step, type: 'int' },
                        { prop: "step_name", value: step.step_name, type: 'str' },
                        { prop: "step_description", value: step.step_description, type: 'str' }
                    ]
                    await connMSQL.connection_pool(validator.createData(stepInput, 'step_solution', res))
                })

                if (status_p && data.affectedRows != 0) {
                    return res.status(200).json({ message: `update ${table} id ${req.params.id} success!!`, status: '200' })
                } else
                    if (status_p && data.affectedRows == 0) {
                        return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`, req.originalUrl))
                    } else
                        if (status_p == false) {
                            return res.status(400).json(errorModel('bad request!!', req.originalUrl))
                        }

                // error
                return res.status(200).json({ message: `update ${table} success!!`, status: '200' })
            } else {
                console.log(`Cannot connect to mysql server !!`)
                throw new Error('connection error something :', err)
            }
        } catch (error) {
            res.status(400).json(errorModel(error.message, req.originalUrl))
        }
    } else {
        return res.status(400).json(errorModel('data not valid', req.originalUrl))
    }
})

module.exports = router
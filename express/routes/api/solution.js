const express = require('express')
const router = express.Router()
const validator = require('../../validator/validate')
const connMSQL = require('../../config/db_config')
const errorModel = require('../../response/errorModel')
const { JwtAuth, verifyRole } = require("../../middleware/jwtAuthen");
const { ROLE } = require("../../enum/UserType")
const { bucket, mode } = require('../../config/firestore_implement')

const table = 'solution'
const stepTable = 'step_solution'
const stepColumn = ["step_", "step_name", "step_description", "step_upload"]

//get solution
router.get('/', JwtAuth, async (req, res) => {
    try {
        // เรียกข้อมูลของ solution ออกมา
        let { status_pool: sp1, data: solutions } = await connMSQL.connection_pool(validator.foundId(table))
        // เปลี่ยนค่าในการทำ promise ทั้งหมด ใน solution
        solutions = await Promise.all(solutions.map(async sol => {

            // เปลี่ยนจาก string เป็น array ถ้าค่านั้นไม่ว่าง
            sol.solution_tag = sol.solution_tag == [] ? [] : sol.solution_tag.split(",")

            //     ทำการ map กับทุก step บน solution นั้น
            //     let { status_pool: sp2, data: steps } = await connMSQL.connection_pool(validator.foundId(stepTable, stepColumn,
            //         [{ col: 'solution_Id', val: sol.solutionId }]
            //     ))
            //     sol.solution_steps = steps.length == 0 ? null : steps
            return sol
        }))
        return res.status(200).json(solutions)
    } catch (error) {
        return res.status(500).json(errorModel(error.message, req.originalUrl))
    }
})


// get solution by id
router.get('/:id', JwtAuth, async (req, res) => {
    try {
        // sql injection basic protector
        if (isNaN(Number(req.params.id))) {
            return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`, req.originalUrl));
        }

        let { status_pool: sp1, data: solution } = await connMSQL.connection_pool(validator.foundId(table, '',
            [{ col: 'solutionId', val: req.params.id }]
        ))
        if (sp1 && solution.length == 0) {
            return res.status(404).json(errorModel(`${table} id ${req.params.id} does not exist`, req.originalUrl))
        } else if (sp1 && solution.length != 0) {
            let { status_pool: sp2, data: steps } = await connMSQL.connection_pool(validator.foundId(stepTable, stepColumn,
                [{ col: 'solution_Id', val: solution[0].solutionId }]
            ))
            // เปลี่ยนจาก string เป็น array ถ้าค่านั้นไม่ว่าง
            solution[0].solution_tag = solution[0].solution_tag == null ? null : solution[0].solution_tag.split(",")
            // ทำการ map กับทุก step บน solution นั้น
            solution[0].solution_steps = steps.length == 0 ? null : steps
            return res.status(200).send(solution)
        }
    } catch (error) {
        res.status(500).json(errorModel(error.message, req.originalUrl))
    }
})

// create solution
router.post('/', JwtAuth, verifyRole(ROLE.Super_admin, ROLE.Admin_it), async (req, res) => {
    let input
    let status = undefined
    try {
        input = [
            { prop: "solution_title", value: validator.validateStrNotNull(await req.body.solution_title, 50, table, 'solution_title'), type: 'str' },
            // { prop: "solution_icon", value: validator.validateStrNotNull(await req.body.solution_icon, 100, table, 'solution_icon'), type: 'str' },
            { prop: "solution_text", value: validator.validateStrNotNull(await req.body.solution_text, 150, table, 'solution_text'), type: 'str' },
            { prop: "solution_tag", value: validator.validateStrNotNull(await req.body.solution_tag, 150, table, 'solution_tag'), type: 'str' },
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

            let { status_pool, data } = await connMSQL.connection_pool(validator.createData(input, table, res))

            // create step
            steps.forEach(async (step) => {
                let stepInput = [
                    { prop: "solution_Id", value: data.insertId, type: 'int' },
                    { prop: "step_", value: validator.validateNumber(await step.step, 'step_solution', 'step_'), type: 'int' },
                    { prop: "step_name", value: validator.validateStrNotNull(await step.step_name, 'step_solution', 'step_name'), type: 'str' },
                    { prop: "step_description", value: validator.validateStrNull(await step.step_description, 'step_solution', 'step_decsription'), type: 'str' },
                    { prop: "step_upload", value: validator.validateBoolean(await step.step_upload, 'step_solution', 'step_upload'), type: 'int' }
                ]
                await connMSQL.connection_pool(validator.createData(stepInput, 'step_solution', res))
            })
            req.body.solutionId = data.insertId
            // error
            return res.status(201).json(req.body)
        } catch (error) {
            res.status(400).json(errorModel(error.message, req.originalUrl))
        }
    } else {
        return res.status(500).json(errorModel('data not valid', req.originalUrl))
    }
})

// delete solution
router.delete('/:id', JwtAuth, verifyRole(ROLE.Super_admin, ROLE.Admin_it), async (req, res) => {
    // delete data
    try {
        // sql injection basic protector
        if (isNaN(Number(req.params.id))) {
            return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`, req.originalUrl));
        }

        // delete data
        await connMSQL.connection_pool(validator.deleteData(req, 'step_solution', 'solution_Id'))

        let { status_pool: status_p, data: sol, msg: msg } = await connMSQL.connection_pool(validator.deleteData(req, table, 'solutionId'))

        const folder = `images/${mode == "development" ? "developments" : "productions"}/solutions`
        const fileName = `${folder}/${req.params.id}.png`
        bucket.deleteFiles({
            prefix: fileName
        });
        const directory = `${folder}/${req.params.id}/`
        bucket.deleteFiles({
            prefix: directory
        });

        if (status_p && sol.affectedRows != 0) {
            return res.status(200).json({ message: `delete ${table} id ${req.params.id} success!!`, status: '200' })

        } else
            if (status_p && sol.affectedRows == 0) {
                return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`, req.originalUrl))
                // return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
            }
    } catch (error) {
        res.status(500).json(errorModel(error.message, req.originalUrl))
    }
})

// update solution
// router.put('/:id', JwtAuth, verifyRole(ROLE.Super_admin,ROLE.Admin_it), async (req, res) => {
//     let input
//     let status = undefined
//     try {
//         input = [
//             { prop: "solution_title", value: validator.validateStrNotNull(await req.body.solution_title, 50, table, 'solution_title'), type: 'str' },
//             // { prop: "solution_icon", value: validator.validateStrNotNull(await req.body.solution_icon, 100, table, 'solution_icon'), type: 'str' },
//             { prop: "solution_text", value: validator.validateStrNotNull(await req.body.solution_text, 150, table, 'solution_text'), type: 'str' },
//             { prop: "solution_tag", value: validator.validateStrNotNull(await req.body.solution_tag, 50, table, 'solution_tag'), type: 'str' },
//         ]
//         steps = validator.validateStep(await req.body.solution_steps, table, 'solution_steps')
//         // console.log('testing',await req.body.role)
//         status = !(await validator.checkUndefindData(input, table))
//     } catch (err) {
//         console.log(err)
//         status = false
//         // console.log(status)
//         return res.status(400).json(errorModel(err.message, req.originalUrl))
//     }

//     if (status == true) {
//         try {
//             if (!connMSQL.handdleConnection()) {

//                 let { status_pool: status_p, data } = await connMSQL.connection_pool(validator.updateData(req, input, table))

//                 // update steps
//                 await connMSQL.connection_pool(validator.deleteData(req, 'step_solution', 'solution_Id'))
//                 steps.forEach(async (step) => {
//                     let stepInput = [
//                         { prop: "solution_Id", value: req.params.id, type: 'int' },
//                         { prop: "step_", value: step.step, type: 'int' },
//                         { prop: "step_name", value: step.step_name, type: 'str' },
//                         { prop: "step_description", value: step.step_description, type: 'str' }
//                     ]
//                     await connMSQL.connection_pool(validator.createData(stepInput, 'step_solution', res))
//                 })

//                 if (status_p && data.affectedRows != 0) {
//                     return res.status(200).json({ message: `update ${table} id ${req.params.id} success!!`, status: '200' })
//                 } else
//                     if (status_p && data.affectedRows == 0) {
//                         return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`, req.originalUrl))
//                     } else
//                         if (status_p == false) {
//                             return res.status(400).json(errorModel('bad request!!', req.originalUrl))
//                         }

//                 // error
//                 return res.status(200).json({ message: `update ${table} success!!`, status: '200' })
//             } else {
//                 console.log(`Cannot connect to mysql server !!`)
//                 throw new Error('connection error something :', err)
//             }
//         } catch (error) {
//             res.status(400).json(errorModel(error.message, req.originalUrl))
//         }
//     } else {
//         return res.status(500).json(errorModel('data not valid', req.originalUrl))
//     }
// })

module.exports = router
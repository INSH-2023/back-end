const express = require('express')
const router = express.Router()
// const users =require("../../data/Users")
// const uuid =require("uuid")
const validator = require('../../validator/validate')
const connMSQL = require('../../config/db_config')
const errorModel = require('../../response/errorModel')
const { JwtAuth, verifyRole } = require("../../middleware/jwtAuthen");
const { ROLE } = require('../../enum/UserType')
const { PROBLEM } = require('../../enum/Request')
const { bucket, mode } = require('../../config/firestore_implement')

const table = "problem"
const problemTypeIt = [PROBLEM.Application, PROBLEM.Hardware, PROBLEM.Internet, PROBLEM.Meeting, PROBLEM.Printer, PROBLEM.Software, PROBLEM.Website]
const problemTypePr = [PROBLEM.Media, PROBLEM.News]
// get data
router.get('/', JwtAuth, async (req, res) => {
    // console.log('header',req.headers.subject_type)
    try {
        // if(!connMSQL.handdleConnection()){
        // if ( req.headers.subject_type == undefined || req.headers.subject_type == null ) {
        let { status_pool: status_p, data: problems, msg: msg } = await connMSQL.connection_pool(validator.foundId(table))
        if (status_p) {
            return res.status(200).json(problems)
        }

        // } else {
        //     console.log(`Cannot connect to mysql server !!`) 
        //     throw new Error('connection error somethin')
        // }
    } catch (error) {
        console.log(error)
        return res.status(500).json(errorModel(error.message, req.originalUrl))
    }
})

router.get('/type/:type', JwtAuth, async (req, res) => {
    try {
        // sql injection basic protector and not found
        if (!problemTypeIt.concat(...problemTypePr).includes(req.params.type)) {
            return res.status(404).json(errorModel(`${table} id  ${req.params.type} does not exist`, req.originalUrl));
        }

        // if(!connMSQL.handdleConnection()){
        if (req.user.role_user == ROLE.Admin_it && problemTypePr.includes(req.params.type)) {
            return res.status(403).json(errorModel(`${table} type ${req.params.type} is forbidden for admin_it`, req.originalUrl))
        } else if (req.user.role_user == ROLE.Admin_pr && problemTypeIt.includes(req.params.type)) {
            return res.status(403).json(errorModel(`${table} type ${req.params.type} is forbidden for admin_pr`, req.originalUrl))
        }
        let { status_pool: status_p, data: problems, msg: msg } = await connMSQL.connection_pool(validator.foundId(table, '', [{ col: "problem_type", val: req.params.type }]))
        if (status_p) {
            return res.status(200).json(problems)
        }
        // else
        // if(status_p && problems.length==0){
        //     return res.status(404).json(errorModel(`${table} type ${req.params.type} does not exist`,req.originalUrl))
        // }
        // }
    } catch (error) {
        console.log(error)
        return res.status(500).json(errorModel(error.message, req.originalUrl))
    }
})

// create problem
router.post('/', JwtAuth, verifyRole(ROLE.Admin_it, ROLE.Admin_pr, ROLE.Super_admin), async (req, res) => {
    console.log(req.body)
    let data
    let status = undefined
    try {
        data = [
            { prop: "problem_problem", value: validator.validateStrNotNull(await req.body.problem_problem, 100, table, 'problem_problem'), type: 'str' },
            { prop: "problem_type", value: validator.validateRole(await req.body.problem_type, PROBLEM, 50, table, 'problem_type'), type: 'str' },
            { prop: "problem_upload", value: validator.validateBoolean(await req.body.problem_upload, table, "problem_upload"), type: 'int' }
        ]
        if (req.user.role_user == ROLE.Admin_it && problemTypePr.includes(req.body.problem_type)) {
            return res.status(403).json(errorModel(`${table} type ${req.body.problem_type} is forbidden for admin_it`, req.originalUrl))
        } else if (req.user.role_user == ROLE.Admin_pr && problemTypeIt.includes(req.body.problem_type)) {
            return res.status(403).json(errorModel(`${table} type ${req.body.problem_type} is forbidden for admin_pr`, req.originalUrl))
        }

        // console.log('testing',await req.body.role)
        status = !(await validator.checkUndefindData(data, table))
        // validator.createData(data,table)
    } catch (err) {
        console.log(err)
        status = false
        // console.log(status)

        return res.status(400).json(errorModel(err.message, req.originalUrl))
    }

    if (status == true) {
        try {
            if (!connMSQL.handdleConnection()) {
                let { status_pool: status_p, data: problems, msg: msg } = await connMSQL.connection_pool(validator.createData(data, table, res))
                if (status_p) {
                    req.body.problemId = problems.insertId
                    return res.status(201).json(req.body)
                }
            } else {
                console.log(`Cannot connect to mysql server !!`)
                throw new Error('connection error something')
            }
        } catch (error) {
            res.status(500).json(errorModel(error.message, req.originalUrl))
        }
    }
})

// delete
router.delete('/:id', JwtAuth, verifyRole(ROLE.Admin_it, ROLE.Admin_pr, ROLE.Super_admin), async (req, res) => {
    // delete data
    try {
        // sql injection basic protector
        if (isNaN(Number(req.params.id))) {
            return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`, req.originalUrl));
        }

        // if (!connMSQL.handdleConnection()) {
        let { status_pool: status_p1, data: problems1, msg: msg1 } = await connMSQL.connection_pool(validator.foundId(table, ['problem_type'], [{ col: "problemId", val: req.params.id }]))
        if (req.user.role_user == ROLE.Admin_it && problemTypePr.includes(problems1[0].problem_type)) {
            return res.status(403).json(errorModel(`${table} type ${problems1[0].problem_type} is forbidden for admin_it`, req.originalUrl))
        } else if (req.user.role_user == ROLE.Admin_pr && problemTypeIt.includes(problems1[0].problem_type)) {
            return res.status(403).json(errorModel(`${table} type ${problems1[0].problem_type} is forbidden for admin_pr`, req.originalUrl))
        }

        let { status_pool: status_p, data: problems, msg: msg } = await connMSQL.connection_pool(validator.deleteData(req, table, 'problemId'))

        const folder = `images/${mode == "development" ? "developments" : "productions"}/problems`
        const fileName = `${folder}/${req.params.id}.png`
        bucket.deleteFiles({
            prefix: fileName
        });

        if (status_p && problems.affectedRows != 0) {
            return res.status(200).json({ message: `delete ${table} id ${req.params.id} success!!`, status: '200' })
        } else
            if (status_p && problems.affectedRows == 0) {
                return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`, req.originalUrl))
                // return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
            }
        // } else {
        //     console.log(`Cannot connect to mysql server !!`)
        //     throw new Error('connection error something')
        // }
    } catch (error) {
        res.status(500).json(errorModel(error.message, req.originalUrl))
    }
})


// // update data
// router.put('/:id',async(req,res)=>{
//     let data
//     let status=undefined
//     try{
//         data=[    
//         {prop:"problem_problem",value: validator.validateStrNotNull(await req.body.problem_problem,100,table,'problem_problem'),type:'str'},
//         {prop:"problem_type",value: validator.validateStrNotNull(await req.body.problem_type,45,table,'problem_type'),type:'str'},
//     ]
//         // console.log('testing',await req.body.role)
//         status=!(await validator.checkUndefindData(data,table))
//         // validator.createData(data,table)
//     }catch(err){
//         console.log(err)
//         status=false
//         // console.log(status)

//         res.status(400).json(errorModel(err.message,req.originalUrl))
//     }

//     if(status==true){
//         // delete data
//         try {
//             // if(!connMSQL.handdleConnection()){
//                 let {status_pool:status_p,data:problems,msg:msg} = await connMSQL.connection_pool(validator.updateData(req,data,table))
//                 if(status_p&&problems.affectedRows!=0){
//                     return res.status(200).json({message:`update ${table} id ${req.params.id} success!!`,status:'200'})

//                 }else
//                 if(status_p&&problems.affectedRows==0){
//                     return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
//                 }
//             // }else{
//             //         console.log(`Cannot connect to mysql server !!`) 
//             //         throw new Error('connection error something')
//             // } 
//         } catch (error) {
//             res.status(500).json(errorModel(error.message,req.originalUrl))
//         }
//     }
// })


module.exports = router
const express =require('express')
const router =express.Router()
const validator = require('../../validator/validate')
const connMSQL=require('../../mysql/db_config')
const errorModel =require('../../response/errorModel')

const table='solution'
const stepTable='step_solution'

//get solution
router.get('/',async(req,res)=>{
    try {
        if(!connMSQL.handdleConnection()){
            // เรียกข้อมูลของ solution ออกมา
            let {status_pool:sp1, data:solutions} = await connMSQL.connection_pool(
                `SELECT * FROM moral_it_device.${table}`)
            // เปลี่ยนค่าในการทำ promise ทั้งหมด ใน solution
            solutions = await Promise.all(solutions.map(async sol => {
                
                // เปลี่ยนจาก string เป็น array ถ้าค่านั้นไม่ว่าง
                sol.solution_tag = sol.solution_tag == null ? null : sol.solution_tag.split(",")

                // ทำการ map กับทุก step บน solution นั้น
                let {status_pool:sp2, data:steps} = await connMSQL.connection_pool(
                    `SELECT step_, step_name, step_description FROM moral_it_device.${stepTable} 
                    where solution_id = ${sol.solutionId}`)
                sol.solution_steps = steps.length == 0 ? null : steps
                return sol
            }))
            return res.status(200).json(solutions)
        }else{
            console.log(`Cannot connect to mysql server !!`) 
            throw res.status(400).json(errorModel(error.message,req.originalUrl))
        }
    } catch (error) {
        return res.status(500).json(errorModel(error.message,req.originalUrl))
    }
})


// get solution by id
router.get('/:id',async(req,res)=>{
    try {
        if(!connMSQL.handdleConnection()){
            let {status_pool:sp1, data:solution} = await connMSQL.connection_pool(validator.foundId(req,table,'*',`solutionId=${req.params.id}`))
            if (sp1 && solution.length == 0) {
                return res.status(404).json(errorModel(`${table} id ${req.params.id} does not exist`,req.originalUrl))
            } else if (sp1 && solution.length != 0) {
                let {status_pool:sp2, data:steps} = await connMSQL.connection_pool(
                    `SELECT step_, step_name, step_description FROM moral_it_device.${stepTable} 
                    where solution_id = ${solution[0].solutionId}`)
                // เปลี่ยนจาก string เป็น array ถ้าค่านั้นไม่ว่าง
                solution[0].solution_tag = solution[0].solution_tag == null ? null : solution[0].solution_tag.split(",")
                // ทำการ map กับทุก step บน solution นั้น
                solution[0].solution_steps = steps.length == 0 ? null : steps
                return res.status(200).send(solution)
            }
        }else{
            console.log(`Cannot connect to mysql server !!`) 
            throw new Error('connection error something :',err)
        } 
    } catch (error) {
        res.status(500).json(errorModel(error.message,req.originalUrl))
    }
})

// // create solution
// router.post('/',async(req,res)=>{
//     let input
//     let status=undefined
//     try{
//         input=[
//             {prop:"request_first_name"      ,value: validator.validateStrNotNull(await req.body.request_first_name,100,table,'request_first_name'),type:'str'},
//             {prop:"request_last_name"       ,value: validator.validateStrNotNull(await req.body.request_last_name,100,table,'request_last_name'),type:'str'},
//             {prop:"request_email"           ,value: validator.validateEmail(await req.body.request_email,100,table,'request_email'),type:'str'},
//             {prop:"request_group"           ,value: validator.validateStrNotNull(await req.body.request_group,100,table,'request_group'),type:'str'},
//             {prop:"request_service_type"    ,value: validator.validateStrNotNull(await req.body.request_service_type,100,table,'request_service_type'),type:'str'},
//             {prop:"request_subject"         ,value: validator.validateStrNotNull(await req.body.request_subject,100,table,'request_subject'),type:'str'},
//             {prop:"request_status"          ,value: validator.validateStrNotNull(await req.body.request_status,100,table,'request_status'),type:'str'},
//             {prop:"request_req_date"        ,value: 'CURRENT_TIMESTAMP()',type:'date'},
//             {prop:"request_assign"          ,value: validator.validateStrNotNull(await req.body.request_assign,100,table,'request_assign'),type:'str'},
//             {prop:"request_use_type"        ,value: validator.validateStrNotNull(await req.body.request_use_type,5,table,'request_use_type'),type:'str'},
//             {prop:"request_sn"              ,value: validator.validateStrNull(await req.body.request_sn,50,table,'request_sn'),type:'str'},
//             {prop:"request_brand"           ,value: validator.validateStrNull(await req.body.request_brand,100,table,'request_brand'),type:'str'},
//             {prop:"request_type_matchine"   ,value: validator.validateStrNull(await req.body.request_type_matchine,50,table,'request_matchine'),type:'str'},
//             {prop:"request_other"           ,value: validator.validateStrNull(await req.body.request_other,150,table,'request_other'),type:'str'},
//             {prop:"request_problems"        ,value: validator.validateStrNotNull(await req.body.request_problems,150,table,'request_problems'),type:'str'},
//             {prop:"request_message"        ,value: validator.validateStrNull(await req.body.request_message,150,table,'request_message'),type:'str'}
//         ]
//         // console.log('testing',await req.body.role)
//         status=!(await validator.checkUndefindData(input,table))
//         // validator.createData(data,table)
//         } catch(err) {
//         console.log(err)
//         status=false
//         // console.log(status)
//         return res.status(400).json(errorModel(err.message,req.originalUrl))
//     }

//     if(status==true){
//         try {
//             if(!connMSQL.handdleConnection()){
//                 await connMSQL.connection_pool(validator.createData(input,table,res))
//                 // error
//                 return res.status(200).json({message:`create ${table} success!!`,status:'200'})
//             } else {
//                 console.log(`Cannot connect to mysql server !!`) 
//                 throw new Error('connection error something :',err)
//             }
//         } catch (error) {
//             res.status(400).json(errorModel(error.message,req.originalUrl))
//         }
//     } else {
//         return res.status(400).json(errorModel('data not valid',req.originalUrl))
//     }
// })

module.exports=router
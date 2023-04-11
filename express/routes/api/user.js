const express =require('express')
const router =express.Router()
const validator = require('../../validator/validate')
const connMSQL=require('../../mysql/db_config')
const errorModel =require('../../response/errorModel')

const viewTable='userview'
const table='user'

// get data
router.get('/',async(req,res)=>{
    // connMSQL.testinsg_pool()
    try {
        if(!connMSQL.handdleConnection()){
            let results
            if (isNaN(req.query.role)) {
                // get user when pool
                results = await connMSQL.connection_pool(`SELECT * FROM moral_it_device.${viewTable}`)
            } else {
                results = await connMSQL.connection_pool(`SELECT * FROM moral_it_device.${viewTable} WHERE user_role ='${req.query.role}'`)
            }
            if (!results.status_pool) {

                return res.status(400).json(errorModel(`cannot GET data by something ${table}`,req.originalUrl))
            }else{
                results.data.forEach(user => {
                    user.user_createdAt = user.user_createdAt.toLocaleString('th-TH', {
                        timeZone: 'Asia/Bangkok',
                    })
                    user.user_updatedAt =user.user_updatedAt.toLocaleString('th-TH', {
                        timeZone: 'Asia/Bangkok',
                    })
                })
                return res.status(200).json(results.data)
            }
        }else{
            console.log(`Cannot connect to mysql server !!`) 
            throw new Error('connection error something :',err)
        }
    } catch (error) {
        console.log(error)
        return res.status(400).json(errorModel(error.message,req.originalUrl))
    }
})

// get data by id
router.get('/:id',async(req,res)=>{

    try {
        if(!connMSQL.handdleConnection()){
            let {status_pool,data} = await connMSQL.connection_pool(validator.foundId(req,viewTable,'*',`userId=${req.params.id}`))
            if(data.length==0){
                return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
            }else{
                data.forEach(user => {
                    user.user_createdAt = user.user_createdAt.toLocaleString('th-TH', {
                        timeZone: 'Asia/Bangkok',
                    })
                    user.user_updatedAt =user.user_updatedAt.toLocaleString('th-TH', {
                        timeZone: 'Asia/Bangkok',
                    })
                })
                return res.status(200).json(data)
            }
        }else{
            console.log(`Cannot connect to mysql server !!`) 
            throw new Error('connection error something :',err)
        } 
    } catch (error) {
        res.status(400).json(errorModel(error.message,req.originalUrl))
    }
})

// create user
router.post('/',async(req,res)=>{
    let input
    let status=undefined
    try{
        input=[
            // {prop:"userId",value: uuid.v4(),type:'int'},
            {prop:"user_emp_code",value: validator.validateNumber(await req.body.user_emp_code,table,'user_emp_code'),type:'int'},
            {prop:"user_first_name",value: validator.validateStrNotNull(await req.body.user_first_name,100,table,'user_first_name'),type:'str'},
            {prop:"user_last_name",value: validator.validateStrNotNull(await req.body.user_last_name,100,table,'user_last_name'),type:'str'},
            {prop:"user_role",value: validator.validateRole(await req.body.user_role,table,'user_role'),type:'str'},
            {prop:"user_group",value: validator.validateStrNotNull(await req.body.user_group,100,table,'user_group'),type:'str'},
            {prop:"user_office",value: validator.validateStrNotNull(await req.body.user_office,100,table,'user_office'),type:'str'},
            {prop:"user_status",value: validator.validateStrNotNull(await req.body.user_status,100,table,'user_status'),type:'str'},
            {prop:"user_position",value: validator.validateStrNotNull(await req.body.user_position,100,table,'user_position'),type:'str'},
            {prop:"user_email",value: validator.validateEmail(await req.body.user_email,100,table,'user_email'),type:'str'},
            {prop:"user_password",value: validator.validatePassword(await req.body.user_password,table,'user_password'),type:'str'},
            // {prop:"user_createdAt",value: validator.currentDate(table,'user_createdAt'),type:'str'},
            // {prop:"user_updatedAt",value: validator.currentDate(table,'user_updatedAt'),type:'str'}
        ]
        // console.log('testing',await req.body.role)
        status=!(await validator.checkUndefindData(input,table))
        // validator.createData(data,table)
    }catch(err){
        console.log(err)
        status=false
        // console.log(status)
        
        res.status(400).json(errorModel(err.message,req.originalUrl))
    }

    if(status==true){
        try {
            if(!connMSQL.handdleConnection()){
                await connMSQL.connection_pool(validator.createData(input,table,res))
                // error
                return res.status(200).json({message:`create ${table} success!!`,status:'200'})
            } else {
                console.log(`Cannot connect to mysql server !!`) 
                throw new Error('connection error something :',err)
            }
        } catch (error) {
            res.status(400).json(errorModel(error.message,req.originalUrl))
        }
    }
})

router.post('/:id',(req,res)=>{
    res.status(405).json(errorModel('method not allow !! 😒,create data dont need params data !!',req.originalUrl))
})

// delete
router.delete('/:id',async(req,res)=>{
    // delete data
    try {
        if(!connMSQL.handdleConnection()){
            let {status_pool,data} = await connMSQL.connection_pool(validator.foundId(req,table,'*',`userId=${req.params.id}`))
            if(data.length==0){
                return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
            }else{
                await connMSQL.connection_pool(validator.deleteData(req,table))
                return res.status(200).json({message:`delete ${table} id ${req.params.id} success!!`,status:'200'})
            }
        }else{
                console.log(`Cannot connect to mysql server !!`) 
                throw new Error('connection error something :',err)
        }
    } catch (error) {
        res.status(400).json(errorModel(error.message,req.originalUrl))
    }
})

// delete data
router.delete('/',(req,res)=>{
    res.status(405).json(errorModel("method not allow !! 😒,need params data to delete !!",req.originalUrl))
})


// update data
router.put('/:id',async(req,res)=>{
    let input
    let status=undefined
    try{
        input=[
            // {prop:"userId",value: uuid.v4(),type:'int'},
            // {prop:"user_emp_code",value: validator.validateNumber(await req.body.emp_code,table,'emp_code'),type:'int'},
            {prop:"user_first_name",value: validator.validateStrNotNull(await req.body.user_first_name,100,table,'user_first_name'),type:'str'},
            {prop:"user_last_name",value: validator.validateStrNotNull(await req.body.user_last_name,100,table,'user_last_name'),type:'str'},
            {prop:"user_role",value: validator.validateRole(await req.body.user_role,table,'user_role'),type:'str'},
            {prop:"user_group",value: validator.validateStrNotNull(await req.body.user_group,100,table,'user_group'),type:'str'},
            {prop:"user_office",value: validator.validateStrNotNull(await req.body.user_office,100,table,'user_office'),type:'str'},
            {prop:"user_status",value: validator.validateStrNotNull(await req.body.user_status,100,table,'user_status'),type:'str'},
            {prop:"user_position",value: validator.validateStrNotNull(await req.body.user_position,100,table,'user_position'),type:'str'},
            {prop:"user_email",value: validator.validateEmail(await req.body.user_email,100,table,'user_email'),type:'str'},
            {prop:"user_password",value: validator.validatePassword(await req.body.user_password,table,'user_password'),type:'str'},
            // {prop:"user_updatedAt",value: validator.currentDate(table,'updatedAt'),type:'str'}
        ]
        // console.log('testing',await req.body.role)
        status=!(await validator.checkUndefindData(input,table))
        // validator.createData(data,table)
    }catch(err){
        console.log(err)
        status=false
        // console.log(status)
        res.status(400).json(errorModel(err.message,req.originalUrl))
    }

    if(status==true){
        // update data
        try {
            if(!connMSQL.handdleConnection()){
                let {status_pool,data} = await connMSQL.connection_pool(validator.foundId(req,table,'*',`userId=${req.params.id}`))
                if (data.length == 0) {
                    return res.status(404).json(errorModel(`${table} id ${req.params.id} does not exist`,req.originalUrl))
                } else {
                    await connMSQL.connection_pool(validator.updateData(req,input,table))
                    return res.status(200).json({message:`update ${table} id ${req.params.id} success!!`,status:'200'})
                }
            }
        } catch (error) {
            res.status(400).json(errorModel(error.message,req.originalUrl))
        }
    }
})

router.put('/',(req,res)=>{
    res.status(400).json(errorModel('bad request !! 🤨,need param data to update!! ',req.originalUrl))
})


module.exports=router
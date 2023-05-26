const express =require('express')
const router =express.Router()
const validator = require('../../validator/validate')
const connMSQL =require('../../config/db_config')
const errorModel =require('../../response/errorModel')
const ROLE = require('../../enum/Role')

const viewTable='userview'
const table='user'
const { JwtAuth, verifyRole } = require("../../middleware/jwtAuthen");

// get data
router.get('/', JwtAuth, verifyRole(ROLE.Admin_it,ROLE.Admin_pr), async(req,res)=>{
    // connMSQL.testinsg_pool()
    try {
        // if(!connMSQL.handdleConnection()){
            // get user when pool
            let {status_pool:status_p,data:users,msg:msg} = await connMSQL.connection_pool(`SELECT * FROM moral_it_device.${viewTable}`)
            
            if(status_p){
                return res.status(200).json(users)
            }
        // }else{
        //     console.log(`Cannot connect to mysql server !!`) 
        //     throw new Error('connection error something')
        // }
    } catch (error) {
        console.log(error)
        return res.status(500).json(errorModel(error.message,req.originalUrl))
    }
})

// get user data by admin
router.get('/role/:role', JwtAuth, verifyRole(ROLE.Admin_it,ROLE.Admin_pr), async(req,res)=>{
    // connMSQL.testinsg_pool()
    try {
        // if(!connMSQL.handdleConnection()){
            // get user with roles
            let {status_pool:status_p,data:users,msg:msg} = await connMSQL.connection_pool(`SELECT * FROM moral_it_device.${viewTable} WHERE user_role ='${req.params.role}'`)
            if (status_p && users.length!=0) {
                users.forEach(user => {
                    user.user_createdAt = user.user_createdAt.toLocaleString('th-TH', {
                        timeZone: 'Asia/Bangkok',
                    })
                    user.user_updatedAt =user.user_updatedAt.toLocaleString('th-TH', {
                        timeZone: 'Asia/Bangkok',
                    })
                })
                return res.status(200).json(users)
            }else 
            if(status_p && users.length==0){
                console.log(msg)
                return res.status(404).json(errorModel(`${table} role ${req.params.role} does not exist`,req.originalUrl))
            }
     
        // }else{
        //     console.log(`Cannot connect to mysql server !!`) 
        //     throw new Error('connection error something')
        // }
    } catch (error) {
        console.log(error)
        return res.status(400).json(errorModel(error.message,req.originalUrl))
    }
})

router.get('/:id', JwtAuth, verifyRole(ROLE.Admin_it,ROLE.Admin_pr), async(req,res)=>{
    try {
        if(!connMSQL.handdleConnection()){
            let {status_pool:status_p,data:users,msg:msg} = await connMSQL.connection_pool(validator.foundId(req,viewTable,'*',`userId=${req.params.id}`))
            if(status_p && users.length!=0){
                users.forEach(user => {
                    user.user_createdAt = user.user_createdAt.toLocaleString('th-TH', {
                        timeZone: 'Asia/Bangkok',
                    })
                    user.user_updatedAt =user.user_updatedAt.toLocaleString('th-TH', {
                        timeZone: 'Asia/Bangkok',
                    })
                })
                return res.status(200).json(users)
            }else 
            if(status_p && users.length==0){
                // console.log(msg)
                return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
            }
        }else{
            console.log(`Cannot connect to mysql server !!`) 
            throw new Error('connection error something')
        } 
    } catch (error) {
        res.status(500).json(errorModel(error.message,req.originalUrl))
    }
})

// get data by emp code
router.get('/emp-code/:id', JwtAuth, verifyRole(ROLE.Admin_it,ROLE.Admin_pr), async(req,res)=>{

    try {
        if(!connMSQL.handdleConnection()){
            let {status_pool:status_p,data:users,msg:msg} = await connMSQL.connection_pool(validator.foundId(req,viewTable,'*',`user_emp_code=${req.params.id}`))
            if(status_p && users.length!=0){
                return res.status(200).json(users)
            }else 
            if(status_p && users.length==0){
                // console.log(msg)
                return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
            }
        }else{
            console.log(`Cannot connect to mysql server !!`) 
            throw new Error('connection error something')
        } 
    } catch (error) {
        res.status(400).json(errorModel(error.message,req.originalUrl))
    }
})

// create user
router.post('/', JwtAuth, verifyRole(ROLE.Admin_it), async(req,res)=>{
    let input
    let status=undefined
    try{
        input=[
            // {prop:"userId",value: uuid.v4(),type:'int'},
            {prop:"user_emp_code",value: validator.validateNumber(await req.body.user_emp_code,table,'user_emp_code'),type:'int'},
            {prop:"user_first_name",value: validator.validateStrNotNull(await req.body.user_first_name,50,table,'user_first_name'),type:'str'},
            {prop:"user_last_name",value: validator.validateStrNotNull(await req.body.user_last_name,50,table,'user_last_name'),type:'str'},
            {prop:"user_role",value: validator.validateRole(await req.body.user_role,table,'user_role'),type:'str'},
            {prop:"user_group",value: validator.validateStrNotNull(await req.body.user_group,50,table,'user_group'),type:'str'},
            {prop:"user_office",value: validator.validateStrNotNull(await req.body.user_office,50,table,'user_office'),type:'str'},
            {prop:"user_status",value: validator.validateStrNotNull(await req.body.user_status,10,table,'user_status'),type:'str'},
            {prop:"user_position",value: validator.validateStrNotNull(await req.body.user_position,50,table,'user_position'),type:'str'},
            {prop:"user_email",value: validator.validateEmail(await req.body.user_email,50,table,'user_email'),type:'str'},
            {prop:"user_password",value: await validator.validatePassword(await req.body.user_password,table,'user_password'),type:'str'}
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
            // if(!connMSQL.handdleConnection()){
                let {status_pool:status_p,data:users,msg:msg} = await connMSQL.connection_pool(validator.createData(input,table,res))
                
                // console.log(users)
                // error
                if(status_p){
                    return res.status(200).json({message:`create ${table} success!!`,status:'200'})

                } else
                if(status_p==false&&msg.errno==1062){
                    return res.status(400).json(errorModel("Duplicate data",req.originalUrl))
                }                   
            // }
        } catch (error) {

            res.status(500).json(errorModel(error.message,req.originalUrl))
        }
    }
})

router.post('/:id', (req,res)=>{
    res.status(405).json(errorModel('method not allow !! 😒,create data dont need params data !!',req.originalUrl))
})

// delete
router.delete('/:id', JwtAuth, verifyRole(ROLE.Admin_it), async(req,res)=>{
    // delete data
    try {
        if(!connMSQL.handdleConnection()){
            // delete
            let {status_pool:status_p,data:users,msg:msg}=await connMSQL.connection_pool(validator.deleteData(req,table,"userId"))

            if(status_p&&users.affectedRows!=0){
                return res.status(200).json({message:`delete ${table} id ${req.params.id} success!!`,status:'200'})

            }else
            if(status_p&&users.affectedRows==0){
                return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
                // return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))

            }
        }else{
                console.log(`Cannot connect to mysql server !!`) 
                throw new Error('connection error something')
        } 
    } catch (error) {
        res.status(400).json(errorModel(error.message,req.originalUrl))
    }
})

// delete data
router.delete('/',(req,res)=>{
    res.status(405).json(errorModel("method not allow !! 😒",req.originalUrl))
})


// update data
router.put('/:id', JwtAuth, verifyRole(ROLE.Admin_it,ROLE.Admin_pr), async(req,res)=>{
    let input
    let status=undefined
    try{
        input=[
            // {prop:"userId",value: uuid.v4(),type:'int'},
            // {prop:"user_emp_code",value: validator.validateNumber(await req.body.emp_code,table,'emp_code'),type:'int'},
            {prop:"user_first_name",value: validator.validateStrNotNull(await req.body.user_first_name,50,table,'user_first_name'),type:'str'},
            {prop:"user_last_name",value: validator.validateStrNotNull(await req.body.user_last_name,50,table,'user_last_name'),type:'str'},
            {prop:"user_role",value: validator.validateRole(await req.body.user_role,table,'user_role'),type:'str'},
            {prop:"user_group",value: validator.validateStrNotNull(await req.body.user_group,50,table,'user_group'),type:'str'},
            {prop:"user_office",value: validator.validateStrNotNull(await req.body.user_office,50,table,'user_office'),type:'str'},
            {prop:"user_status",value: validator.validateStrNotNull(await req.body.user_status,10,table,'user_status'),type:'str'},
            {prop:"user_position",value: validator.validateStrNotNull(await req.body.user_position,50,table,'user_position'),type:'str'},
            {prop:"user_email",value: validator.validateEmail(await req.body.user_email,50,table,'user_email'),type:'str'},
            {prop:"user_password",value: await validator.validatePassword(await req.body.user_password,table,'user_password'),type:'str'},
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
                let {status_pool:status_p,data:users,msg:msg}=await connMSQL.connection_pool(validator.updateData(req,input,table))
                
                    if(status_p&&users.affectedRows!=0){
                        return res.status(200).json({message:`update ${table} id ${req.params.id} success!!`,status:'200'})
                    }else
                    if(status_p&&users.affectedRows==0){
                        return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
                    }else
                    if(status_p==false){
                        return res.status(400).json(errorModel('bad request!!',req.originalUrl))
                    }
            }else{
                console.log(`Cannot connect to mysql server !!`) 
                throw new Error('connection error something')
            } 
        } catch (error) {
            res.status(400).json(errorModel(error.message,req.originalUrl))
        }
    }
})

router.put('/',(req,res)=>{
    res.status(405).json(errorModel('method not allow !! 🤨',req.originalUrl))
})


module.exports=router
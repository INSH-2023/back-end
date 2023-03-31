const express =require('express')
const router =express.Router()
// const users =require("../../data/Users")
const uuid =require("uuid")
const validator = require('../../validator/validate')
const connMSQL=require('../../mysql/db_config')
const errorModel =require('../../response/errorModel')
const Role = require('../../enum/Role')

const table='user'


// get data
router.get('/',async(req,res)=>{
    // connMSQL.testinsg_pool()
    try {
        if(!connMSQL.handdleConnection()){
            // get user when pool
            let {status_pool:status_p,data:users,msg:msg} = await connMSQL.connection_pool(`SELECT * FROM moral_it_device.${table}`)
            
            if(status_p){
                return res.status(200).json(users)
            }
        }else{
            console.log(`Cannot connect to mysql server !!`) 
            throw new Error('connection error something')
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(errorModel(error.message,req.originalUrl))
    }
})

// get user data by admin
router.get('/role/:role',async(req,res)=>{
    // connMSQL.testinsg_pool()
    try {
        if(!connMSQL.handdleConnection()){
            // get user with roles
            let {status_pool:status_p,data:users,msg:msg} = await connMSQL.connection_pool(`SELECT * FROM moral_it_device.${table} WHERE user_role ='${req.params.role}'`)
            if (status_p && users.length!=0) {
                return res.status(200).json(users)
            }else 
            if(status_p && users.length==0){
                console.log(msg)
                return res.status(404).json(errorModel(`${table} role ${req.params.role} does not exist`,req.originalUrl))
            }
     
        }else{
            console.log(`Cannot connect to mysql server !!`) 
            throw new Error('connection error something')
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json(errorModel(error.message,req.originalUrl))
    }
})

// get user data by admin
// router.get('/role/',async(req,res)=>{
//     // connMSQL.testinsg_pool()
//     try {
//         if(!connMSQL.handdleConnection()){
//             // get user with roles
//             let {status_pool, data} = await connMSQL.connection_pool(`SELECT * FROM moral_it_device.${table} WHERE user_role ='${req.params.role}'`)
//             if (status_pool) {
//                 return res.status(200).json(data)
//             }
//             return res.status(404).json(errorModel(`${table} role ${req.params.role} does not exist`,req.originalUrl))

//         }else{
//             console.log(`Cannot connect to mysql server !!`) 
//             throw new Error('connection error something')
//         }
//     } catch (error) {
//         console.log(error)
//         return res.status(500).json(errorModel(error.message,req.originalUrl))
//     }
// })
router.get('/:id',async(req,res)=>{

    try {
        if(!connMSQL.handdleConnection()){
            let {status_pool:status_p,data:users,msg:msg} = await connMSQL.connection_pool(validator.foundId(req,table,'*',`userId=${req.params.id}`))
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
        res.status(500).json(errorModel(error.message,req.originalUrl))
    }

})

// get data by emp code
router.get('/emp-code/:id',async(req,res)=>{

    try {
        if(!connMSQL.handdleConnection()){
            let {status_pool:status_p,data:users,msg:msg} = await connMSQL.connection_pool(validator.foundId(req,table,'*',`user_emp_code=${req.params.id}`))
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
        res.status(500).json(errorModel(error.message,req.originalUrl))
    }

})


// create user
router.post('/',async(req,res)=>{
    let data
    let status=undefined
    try{
        data=[
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
            {prop:"user_password",value: validator.validatePassword(await req.body.user_password,table,'user_password'),type:'str'}
        ]
        // console.log('testing',await req.body.role)
        status=!(await validator.checkUndefindData(data,table))
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
                let {status_pool:status_p,data:users,msg:msg} = await connMSQL.connection_pool(validator.createData(data,table,res))
                
                // console.log(users)
                // error
                if(status_p){
                    return res.status(200).json({message:`create ${table} success!!`,status:'200'})

                } else
                if(status_p==false&&msg.errno==1062){
                    return res.status(400).json(errorModel("Duplicate data",req.originalUrl))
                }                   
            }
        } catch (error) {

            res.status(500).json(errorModel(error.message,req.originalUrl))
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
            // find it 
            // let {status_pool:status_p,data:users,msg:msg} = await connMSQL.connection_pool(validator.foundId(req,table,'*',`userId=${req.params.id}`))
            // console.log(msg)
            // if(status_p ){
            //     return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
            // }
            // delete
            let {status_pool:status_p,data:users,msg:msg}=await connMSQL.connection_pool(validator.deleteData(req,table))

            if(status_p&&users.affectedRows!=0){
                console.log(msg)
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
        res.status(500).json(errorModel(error.message,req.originalUrl))
    }
})

// delete data
router.delete('/',(req,res)=>{
    res.status(405).json(errorModel("method not allow !! 😒",req.originalUrl))
})


// update data
router.put('/:id',async(req,res)=>{
    let data
    let status=undefined
    try{

        data=[
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
        status=!(await validator.checkUndefindData(data,table))
        // validator.createData(data,table)
    }catch(err){
        console.log(err)
        status=false
        // console.log(status)
        
        res.status(400).json(errorModel(err.message,req.originalUrl))
    }

    if(status==true){
        // delete data
        try {
            if(!connMSQL.handdleConnection()){

                let {status_pool:status_p,data:users,msg:msg}=await connMSQL.connection_pool(validator.updateData(req,data,table))
                
                    if(status_p&&users.affectedRows!=0){
                        return res.status(200).json({message:`update ${table} id ${req.params.id} success!!`,status:'200'})
                    }else
                    if(status_p&&users.affectedRows==0){
                        return res.status(404).json(errorModel(`${table} id  ${req.params.id} does not exist`,req.originalUrl))
                    }
            }else{
                console.log(`Cannot connect to mysql server !!`) 
                throw new Error('connection error something')
            } 
        } catch (error) {
            res.status(500).json(errorModel(error.message,req.originalUrl))
        }
    }
})

router.put('/',(req,res)=>{
    res.status(400).json(errorModel('bad request !! 🤨,need param data to update!! ',req.originalUrl))
})


module.exports=router
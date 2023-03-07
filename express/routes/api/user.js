const express =require('express')
const router =express.Router()
const users =require("../../data/Users")
const uuid =require("uuid")
const connectMysql=require('../../mysql/db_config')

// แบบเก่า
// // get all user
// app.get('/api/users',(req,res)=>{
//     res.json(users)
// })

// // Get single user
// app.get('/api/users/:id',(req,res)=>{
//     let found = users.some(user=>parseInt(user.id) == parseInt(req.params.id))
//     if(found){
//         res.json(users.filter(user=>parseInt(user.id) == parseInt(req.params.id)))
//     }else{
//         res.status(400).json({ msg:`Not found user id : ${req.params.id}`})
//     }
    
// })

// // แบบใหม่
// // get all user
// router.get('/',(req,res)=>{
//     res.json(users)
// })

// // Get single user
// router.get('/:id',(req,res)=>{
//     let found = users.some(user=>parseInt(user.id) == parseInt(req.params.id))
//     if(found){
//         res.json(users.filter(user=>parseInt(user.id) == parseInt(req.params.id)))
//     }else{
//         res.status(400).json({ msg:`Not found user id : ${req.params.id}`})
//     }
    
// })


// // create users
// router.post('/',(req,res)=>{

//     // res.send(req.body)
//     // res.send(req.headers)

//     const newUser={
//         id: uuid.v4(),
//         name: req.body.name,
//         email: req.body.email
//     }

//     if(!newUser.name || !newUser.email){
//         return res.status(400).json({msg:`Please include a name and email`})

//     }else{
//         users.push(newUser)
//         res.json(users)
//     }

    
// })

// // update users
// router.put('/:id',(req,res)=>{
//     let found = users.some(user=>parseInt(user.id) == parseInt(req.params.id))
//     if(found){
//         const updUser=req.body
//         users.forEach(u => {
//             if(u.id ==parseInt(req.params.id)){
//                 u.name = updUser.name ? updUser.name :u.name
//                 u.email = updUser.email ? updUser.email :u.email
//                 res.json({msg:'User updated',u})
//             }
            
//         });
//     }else{
//         res.status(400).json({ msg:`Not found user id : ${req.params.id}`})
//     }
// })

// // delete user
// router.delete('/:id',(req,res)=>{
//     let found = users.some(user=>parseInt(user.id) == parseInt(req.params.id))
//     if(found){
//         res.json({
//             msg: 'Member deleted',
//             users: users.filter(user=>parseInt(user.id) !== parseInt(req.params.id))
//         })
//     }else{
//         res.status(400).json({msg: `Not found user id : ${req.params}`})
//     }
// })





// get user
router.get('/',(req,res)=>{
    
    try {
        connectMysql.query(
            'SELECT * FROM moral_it_device.user',
            (err,results)=>{
                if(err){
                    console.log(err)
                    return res.status(400).send()
                }

                return res.status(200).json(results)

            }
        )
    } catch (error) {
        console.log(error)
        return res.status(500).send()
    }
})




module.exports=router
// เหมือนกับ import 
const express =require("express")
const logger =require('./middleware/logger')
const cors =require('cors')

const app =express()

// Init Middleware
app.use(logger)
app.use(cors())

// Body parse middleware สำหรับแปลงค่าเพื่อสำหรับแสดงผล request ที่ส่งเข้ามา
app.use(express.json())
app.use(express.urlencoded({ extended: false}))

// route ไปยังไฟล์ที่สามารถ req,res ได้
app.use('/api/users',require('./routes/api/user.js'))
app.use('/api/requests',require('./routes/api/request.js'))
app.use('/api/items',require('./routes/api/item.js'))
app.use('/api/problems',require('./routes/api/problem.js'))
app.use('/api/solutions',require('./routes/api/solution.js'))
app.use('/api/authentication',require('./routes/api/authen.js'))
app.use('/api/solutions/files',require('./routes/api/solutionFile.js'))

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>console.log(`server is run on port ${PORT}`))
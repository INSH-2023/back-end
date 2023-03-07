const express =require("express")
const path =require("path")

const app = express()

// // เป็นการกำหนด route เมื่อต้องการเข้าถึงข้อมูล
// app.get('/',(req,res)=>{

//     // สำหรับส่งข้อมูลกลับไป
//     // res.send('helllo express !!')

//     // สำหรับส่ง html กลับไปยังที่มีการขอ request มา
//     res.sendFile(path.join(__dirname,'public','index.html'))
// })

// หาต้องการให้เข้าถึงไฟล์ได้เลยต้องใช้คำสั่งนี้ set static folder
app.use(express.static(path.join(__dirname,'public')))

// ถ้ามีการกำหนด environment port ให้ใช้อันนั้น ถ้าไม่เจอให้ใช้ port 5000
const PORT= process.env.PORT || 5000;

// ให้จับตาดูที่ port และ แสดง message
app.listen(PORT,()=>console.log(`server is run on port ${PORT}`))
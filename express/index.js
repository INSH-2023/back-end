const express = require('express')
const path = require('path')
const logger = require('./log/log')

const app = express()
const PORT = process.env.PORT || 5000;

// listen port
app.listen(PORT, ()=> console.log("ACK"))

// get log from middleware
app.use(logger)

// get text
// app.get("/hello", (req, res)=>{
//     res.send("Hello express")
// })

// set static folder
app.use(express.static(path.join(__dirname, "public", "index.html")))

// get file
app.get('/file', (req, res)=>{
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

// body parser
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// use users router
app.use('/api/users', require('./router/api/users'))

// use requests router
app.use('/api/requests', require('./router/api/requests'))

// use items router
app.use('/api/items', require('./router/api/items'))
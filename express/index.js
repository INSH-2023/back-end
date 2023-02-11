const express = require('express')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 5000;

const users = [
    {name: "Test", age: 20},
    {name: "Hello", age: 15}
]

app.listen(PORT, ()=> console.log("Hello world"))

app.get("/", (req, res)=>{
    res.send("Hello express")
})

app.get('/file', (req, res)=>{
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get('/api/users', (req, res)=> {
    res.json(users)
})
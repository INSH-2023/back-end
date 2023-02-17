const express = require('express')
const path = require('path')
const logger = require('./log/log')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 5000;

// listen port
app.listen(PORT, ()=> console.log("ACK"))

// get log from middleware
app.use(logger)

// set static folder
app.use(express.static(path.join(__dirname, "public", "index.html")))

// get file
app.get('/file', (req, res)=>{
    res.sendFile(path.join(__dirname, "public", "index.html"))
})

const corOptions = {
    origin: 'http://localhost:3000'
}

// body parser middleware
app.use(cors(corOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// use users router
app.use('/api/users', require('./router/api/users'))

// use requests router
app.use('/api/requests', require('./router/api/requests'))

// use items router
app.use('/api/items', require('./router/api/items'))

// use problems router
app.use('/api/problems', require('./router/api/problems'))

// use solution router
app.use('/api/solutions', require('./router/api/solutions'))
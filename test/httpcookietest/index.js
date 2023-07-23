const express = require("express")
const cors = require('cors')
const cookieParser = require('cookie-parser')
const sessions = require('express-session');

let corsOptions = {
    origin: 'http://localhost:8081',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials:true
}

const app = express()
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(__dirname));

app.use(sessions({
    secret: "secrctekeykokdev",
    saveUninitialized: true,
    cookie: { maxAge: 1000*60*60*24, httpOnly: true, secure: false, sameSite: "none"},
    resave: false
}));

cookieOptions = {maxAge: 1000*60*60*24, httpOnly: true, secure: true, sameSite: "none"}

app.get("/api/test",(req, res)=>{
    session = req.session;
    res.cookie("test", "testing123", cookieOptions)
    res.send({message: "hello world"})
})

app.post("/api/test",(req, res)=>{
    res.status(201).send({test: req.cookies.test, name: req.body.test1, session: session})
})

// a variable to save a session
var session;

const myusername = 'test'
const mypassword = 'abcd1234'

app.get('/', (req, res) => {
    session = req.session;
    if (session.userid) {
        res.send("Welcome User <a href=\'/logout'>click to logout</a>");
    } else
        res.sendFile('views/index.html', { root: __dirname })
});

app.post('/user', (req, res) => {
    if (req.body.username.toLowerCase() == myusername && req.body.password == mypassword) {
        session = req.session;
        session.userid = req.body.username;
        console.log(req.session)
        res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
    } else {
        res.send('Invalid username or password');
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

const PORT = 5000

app.listen(PORT,()=>console.log(`server is run on port ${PORT}`))
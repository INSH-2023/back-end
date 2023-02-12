const mysql = require('mysql')

if (process.env.NODE_ENV !== 'production') { 
    require('dotenv').config(); 
} 

const connection = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

connection.connect((err) => {
    if(err){
        console.log('Error connect = ' + err)
        return ;
    }
    console.log('MySQL successfully connected!')
})

module.exports = connection
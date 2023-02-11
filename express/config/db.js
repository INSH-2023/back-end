const mysql = require('mysql')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'abcd1234',
    database: 'moral_it_device'
})

connection.connect((err) => {
    if(err){
        console.log('Error connect = ' + err)
        return ;
    }
    console.log('MySQL successfully connected!')
})

module.exports = connection
const mysql = require('mysql2')
// const pool = require('mysql2/promise')
require('dotenv').config().parsed

// mysql config
const db_config = {
    host: process.env.MYSQLDB_HOST || 'localhost',
    user: process.env.MYSQLDB_USER || 'root',
    password: process.env.MYSQLDB_PASSWORD || 'abcd1234',
    database: process.env.MYSQLDB_DATABASE || 'moral_it_device',
    port: process.env.MYSQLDB_PORT || 3306,
    // option
    waitForConnections: true,
    connectionLimit: 3,
    maxIdle: 3, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 10000,
    queueLimit: 40
}

// var connection = mysql.createConnection(db_config);

// // mysql connection
// const handdleConnection = () => {
//     let status = false
//     // const connection =mysql.createConnection(db_config)


//     // ถ้าเชื่อมแล้ว server restart หรือว่า server down
//     connection.connect(err => {
//         if (err) {
//             console.log('error when connecting to db : ', err)
//             status = true
//             setTimeout(handdleConnection, 2000)
//         }
//     })

//     // ถ้าหาก loss connect ให้ทำการ connect ใหม่อีกรอบ
//     connection.on('Error', (err) => {
//         console.log('db error', err)
//         if (err.code === 'PROTOCOL_CONNECTION_LOST') {
//             status = true
//             handdleConnection()
//         }
//         else {
//             status = true
//             throw err
//         }
//     })

//     return status
// }

// create 1 pool
const pool = mysql.createPool(db_config).promise()

const connection_pool = async (statement) => {
    let testing_data = { status_pool: undefined, data: [], msg: '' }
    try {
        // get connection pool
        conn = await pool.getConnection()

        // query connection pool
        testing_data.data = await conn.query(statement).then(result => {
                // console.log(result[0])
                console.log('connection status : good')
                return result[0]
            })
            .catch(err => {
                console.log(`error something to get data :${err}`)
                console.log('connection status : bad')
                throw err
            })
        
        // end connection pool
        conn.release()
        // conn.end()

        testing_data.status_pool = true
    } catch (error) {
        console.log(error)
        testing_data.status_pool = false
        testing_data.msg = error
        if (error.errno == '1062') {
            throw new Error('Infomation duplicate')
        } else {
            throw new Error(error)
        }
    }

    return testing_data
}

// handleDisconnect()

// connection.connect(err=>{
//     if(err){
//         console.log('Error to connecting to mysql = ',err)
//         return
//     }    
//     console.log('mysql successful connected !')
// })

// module.exports.handdleConnection = handdleConnection
// module.exports.connection = connection
module.exports.connection_pool = connection_pool
// exports.handleDisconnect=handleDisconnect
// exports.connection=connection

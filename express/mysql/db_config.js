const mysql =require('mysql2')

// mysql config
const db_config={
    host: process.env.MYSQLDB_HOST||'localhost',
    user: process.env.MYSQLDB_USER||'root',
    password: process.env.MYSQLDB_PASSWORD||'(Pheeraprt0123)',
    database: process.env.MYSQLDB_DATABASE||'moral_it_device',
    port:process.env.MYSQLDB_PORT||3306,
    // option
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000
}

let connection =mysql.createConnection(db_config);

// mysql connection
const handdleConnection=()=>{

    

    let status =false

    const connection =mysql.createConnection(db_config)

    
    // ถ้าเชื่อมแล้ว server restart หรือว่า server down
    connection.connect(err=>{
        if(err){
            console.log('error when connecting to db : ',err)
            status=true
            setTimeout(handdleConnection,2000)
        }
    })

    // ถ้าหาก loss connect ให้ทำการ connect ใหม่อีกรอบ
    connection.on('Error',(err)=>{
        console.log('db error',err)
        if(err.code ==='PROTOCOL_CONNECTION_LOST'){
            status=true
            handdleConnection()
        }
        else{
            status=true
            throw err
        }
    })

    return status
}





// handleDisconnect()

// connection.connect(err=>{
//     if(err){
//         console.log('Error to connecting to mysql = ',err)
//         return
//     }    
//     console.log('mysql successful connected !')
// })

module.exports.handdleConnection=handdleConnection
module.exports.connection=connection
// exports.handleDisconnect=handleDisconnect
// exports.connection=connection

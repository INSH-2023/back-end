const mysql =require('mysql2')
const pool = require('mysql2/promise')

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


const connection_pool=async(statement)=>{
    let testing_data={status_pool:undefined,data:[]}
    try {
        
        testing_data.data = await pool.createPool(db_config).getConnection()
            .then(conn=>{
                const res=conn.query(statement)
                conn.release()
                return res
            })
            .then(result=>{
                // console.log(result[0])
                return  result[0]
            })
            .catch(err=>{
                console.log(`error something to get data :${err}`)
                throw err
            })

        testing_data.status_pool=true

    } catch (error) {
        console.log(error)
        testing_data.status_pool=false
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

module.exports.handdleConnection=handdleConnection
module.exports.connection=connection
module.exports.connection_pool=connection_pool
// exports.handleDisconnect=handleDisconnect
// exports.connection=connection

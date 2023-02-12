const conn = require('../config/db')
const validator = require('../validator/request')

// C
const insertRequest = (full_name, email, group_work, service_type, subject, status, req_date, assign, req, res) => {
    try {
        conn.query(
            "insert into request (full_name, email, group_work, subject, service_type, status, req_date, assign) values (?,?,?,?,?,?,?,?);",
            [full_name, email, group_work, service_type, status, subject, req_date, assign],
            (err, results, fields) => {
                if (err) {
                    return res.status(400).send("Insert error : " + err)
                }
                return res.status(201).json({msg: "request have been created"})
            }
        )
    } catch(err) {
        console.log(err)
        return res.status(500).send(err)
    }
}

// R
const selectRequest = async (req, res) => {
    try {
        conn.query(
            "select * from request;",
            (err, results, fields) => {
                if (err) {
                    return res.status(400).send("Select error : " + err)
                }
                return res.json(results)
            }
        ) 
    } catch(err) {
        console.log(err)
        return res.status(500).send(err)
    }
}

// R id
const selectRequestById = (req, res) => {
    try {
        conn.query(
            "select * from request;",
            (err, results, fields) => {
                if (err) {
                    return res.status(400).send("Select error : " + err)
                }
                results = validator.foundId(JSON.parse(JSON.stringify(results)),req,res)
                return res.json(results)
            }
        ) 
    } catch(err) {
        console.log(err)
        return res.status(500).send(err)
    }
}

const ValidateById = (req, res) => {
    try {
        conn.query(
            "select requestId from request;",
            (err, results, fields) => {
                if (err) {
                    return res.status(400).send("Select error : " + err)
                }
                results = validator.foundId(JSON.parse(JSON.stringify(results)),req,res)
            }
        ) 
    } catch(err) {
        console.log(err)
        return res.status(500).send(err)
    }
}

// U
const updateRequest = (full_name, email, group_work, service_type, subject, status, req_date, assign, req, res) => {
    try {
        ValidateById(req, res)
        conn.query(
            "update request set full_name = ?, email = ?, group_work = ?, service_type = ?, subject = ?, status = ?, req_date = ?, assign = ? where requestId = ?;",
            [full_name, email, group_work, service_type, subject, status, req_date, assign, req.params.id],
            (err, results, fields) => {
                if (err) {
                    return res.status(400).send("Update error : " + err)
                }
                return res.json({msg: "request id : " + req.params.id + " have been updated"})
            }
        )
    } catch(err) {
        console.log(err)
        return res.status(500).send(err)
    }
}

// D
const deleteRequest = (req, res) => {
    try {
        ValidateById(req, res)
        conn.query(
            "delete from request where requestId = ?;",
            [req.params.id],
            (err, results, fields) => {
                if (err) {
                    return res.status(400).send("Delete error : " + err)
                }
                return res.json({msg: "request id : " + req.params.id + " have been deleted" })
            }
        )
    } catch(err) {
        console.log(err)
        return res.status(500).send(err)
    }
}

module.exports.insertRequest = insertRequest
module.exports.selectRequest = selectRequest
module.exports.selectRequestById = selectRequestById
module.exports.updateRequest = updateRequest
module.exports.deleteRequest = deleteRequest
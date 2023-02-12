const conn = require('../config/db')
const validator = require('../validator/user')

// C
const insertUser = (emp_code, full_name, role, group_work, office, status, position, email, password, req, res) => {
    try {
        conn.query(
            "insert into user(emp_code, full_name, role, group_work, office, status, position, email, password) values (?,?,?,?,?,?,?,?,?);",
            [emp_code, full_name, role, group_work, office, status, position, email, password],
            (err, results, fields) => {
                if (err) {
                    return res.status(400).send("Insert error : " + err)
                }
                return res.status(201).json({msg: "user have been created"})
            }
        )
    } catch(err) {
        console.log(err)
        return res.status(500).send(err)
    }
}

// R
const selectUser = async (req, res) => {
    try {
        conn.query(
            "select userId, emp_code, full_name, role, group_work, office, status, position, email, createdAt, updatedAt from user;",
            (err, results, fields) => {
                if (err) {
                    return res.status(400).send("Insert error : " + err)
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
const selectUserById = (req, res) => {
    try {
        conn.query(
            "select userId, emp_code, full_name, role, group_work, office, status, position, email, createdAt, updatedAt from user;",
            (err, results, fields) => {
                if (err) {
                    return res.status(400).send("Insert error : " + err)
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
            "select userId from user;",
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
const updateUser = (full_name, role, group_work, office, status, position, email, password, req, res) => {
    try {
        ValidateById(req, res)
        conn.query(
            "update user set full_name = ?, role = ?, group_work = ?, office = ?, status = ?, position = ?, email = ?, password = ? where userId = ?;",
            [full_name, role, group_work, office, status, position, email, password, req.params.id],
            (err, results, fields) => {
                if (err) {
                    return res.status(400).send("Update error : " + err)
                }
                return res.json({msg: "user id : " + req.params.id + " have been updated"})
            }
        )
    } catch(err) {
        console.log(err)
        return res.status(500).send(err)
    }
}

// D
const deleteUser = (req, res) => {
    try {
        ValidateById(req, res)
        conn.query(
            "delete from user where userId = ?;",
            [req.params.id],
            (err, results, fields) => {
                if (err) {
                    return res.status(400).send("Delete error : " + err)
                }
                return res.json({msg: "user id : " + req.params.id + " have been deleted" })
            }
        )
    } catch(err) {
        console.log(err)
        return res.status(500).send(err)
    }
}

module.exports.insertUser = insertUser
module.exports.selectUser = selectUser
module.exports.selectUserById = selectUserById
module.exports.updateUser = updateUser
module.exports.deleteUser = deleteUser
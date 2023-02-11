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
                    console.log("Insert error : " + err)
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
const selectUser = (req, res) => {
    try {
        conn.query(
            "select userId, emp_code, full_name, role, group_work, office, status, position, email, createdAt, updatedAt from user;",
            (err, results, fields) => {
                if (err) {
                    console.log("Select error : " + err)
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
const selectUserById = (id, req, res) => {
    try {
        conn.query(
            "select userId, emp_code, full_name, role, group_work, office, status, position, email, createdAt, updatedAt from user;",
            (err, results, fields) => {
                if (err) {
                    console.log("Select error : " + err)
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

const ValidateById = (id, req, res) => {
    try {
        conn.query(
            "select userId from user;",
            (err, results, fields) => {
                if (err) {
                    console.log("Select error : " + err)
                    return res.status(400).send("Insert error : " + err)
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
const updateUser = (id, full_name, role, group_work, office, status, position, email, password, req, res) => {
    try {
        ValidateById(id, req, res)
        conn.query(
            "update user set full_name = ?, role = ?, group_work = ?, office = ?, status = ?, position = ?, email = ?, password = ? where userId = ?;",
            [full_name, role, group_work, office, status, position, email, password, id],
            (err, results, fields) => {
                if (err) {
                    console.log("Select error : " + err)
                    return res.status(400).send("Insert error : " + err)
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
const deleteUser = (id, req, res) => {
    try {
        ValidateById(id, req, res)
        conn.query(
            "delete user where id = ?;",
            [id],
            (err, results, fields) => {
                if (err) {
                    console.log("Select error : " + err)
                    return res.json({msg: "user id : " + req.params.id + " have been deleted" })
                }
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
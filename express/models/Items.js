const conn = require('../config/db')
const validator = require('../validator/item')

// C
const insertItem = (name, number, SL, SW, sent_date, type, note, req, res) => {
    try {
        conn.query(
            "insert into item (name, number, SL, SW, sent_date, type, note) values (?,?,?,?,?,?,?);",
            [name, number, SL, SW, sent_date, type, note],
            (err, results, fields) => {
                if (err) {
                    return res.status(400).send("Insert error : " + err)
                }
                return res.status(201).json({msg: "item have been created"})
            }
        )
    } catch(err) {
        console.log(err)
        return res.status(500).send(err)
    }
}

// R
const selectItem = async (req, res) => {
    try {
        conn.query(
            "select * from item;",
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
const selectItemById = (req, res) => {
    try {
        conn.query(
            "select * from item;",
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
            "select itemId from item;",
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
const updateItem = (name, number, SL, SW, sent_date, type, note, req, res) => {
    try {
        ValidateById(req, res)
        conn.query(
            "update item set name = ?, number = ?, SL = ?, SW = ?, sent_date = ?, type = ?, note = ? where itemId = ?;",
            [name, number, SL, SW, sent_date, type, note, req.params.id],
            (err, results, fields) => {
                if (err) {
                    return res.status(400).send("Update error : " + err)
                }
                return res.json({msg: "item id : " + req.params.id + " have been updated"})
            }
        )
    } catch(err) {
        // console.log(err)
        return res.status(500).send(err)
    }
}

// D
const deleteItem = (req, res) => {
    try {
        ValidateById(req, res)
        conn.query(
            "delete from item where itemId = ?;",
            [req.params.id],
            (err, results, fields) => {
                if (err) {
                    return res.status(400).send("Delete error : " + err)
                }
                return res.json({msg: "item id : " + req.params.id + " have been deleted" })
            }
        )
    } catch(err) {
        console.log(err)
        return res.status(500).send(err)
    }
}

module.exports.insertItem = insertItem
module.exports.selectItem = selectItem
module.exports.selectItemById = selectItemById
module.exports.updateItem = updateItem
module.exports.deleteItem = deleteItem
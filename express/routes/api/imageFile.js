const express = require('express')
const router = express.Router()
path = require('path');
const multer = require("multer")
const errorModel = require('../../response/errorModel')
const connMSQL = require('../../config/db_config')
const fs = require('fs')
const validator = require('../../validator/validate')

// allow multipart file
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        let path = `./assets/images/${req.params.endpoint}`
        if (req.params.endpoint == 'solutions') {
            path = path + `/${req.params.id}`
        }
        fs.mkdirSync(path, { recursive: true })
        callback(null, path);
    },
    filename: function (req, file, cb) {
        if (req.params.endpoint == 'solutions') {
            cb(null, `${req.query.step}.png`);
        } else {
            cb(null, `${req.params.id}.png`);
        }
    }
})

const upload = multer(
    {
        storage: storage,
        limits: {
            fileSize: 1024 * 1024 * 10
        },
        fileFilter(req, file, cb) {
            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return cb(new Error('Please upload a image file type jpg, jpeg or png'))
            }
            cb(undefined, true)
        }
    })

const getUpload = upload.single('file')

// read solution image (not found case)
router.get('/:endpoint/:id', async (req, res, next) => {
    let pathed = `/../../assets/images/${req.params.endpoint}/${req.params.id}`
    res.sendFile(path.resolve(__dirname + pathed + (req.query.step != undefined ? `/${req.query.step}.png` : '.png')),
        err => {
            next(errorModel("File not found!!", req.originalUrl))
        });
});

// upload solution image
// condition (file size < 10 MB, file multipart, file upload per solution, file type image only, path storage property)
router.post('/:endpoint/:id', async (req, res) => {
    if(req.params.id=="undefined" || req.params.endpoint=="undefined") {
        return res.status(400).send(errorModel("upload file is blocked", req.originalUrl));
    }
    getUpload(req, res, err => {

        if (err) {
            return res.status(400).send(errorModel(err.message, req.originalUrl));
        }
        // Everything went fine.
        res.status(201).send(req.file)
    })
})

// delete solution image
router.delete('/:endpoint/:id', async (req, res) => {
    let pathed = `/../../assets/images/${req.params.endpoint}/${req.params.id}`
    fs.unlink(__dirname + pathed + (req.query.step != undefined ? `/${req.query.step}.png` : '.png'), (err) => {
        if (err) {
            return res.status(404).send(errorModel("File not found", req.originalUrl));
        }
        res.send({ message: "file has been deleted" })
    })
})

module.exports = router
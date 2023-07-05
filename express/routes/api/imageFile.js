const express = require('express')
const router = express.Router()
path = require('path');
const multer = require("multer")
const errorModel = require('../../response/errorModel')
// const fs = require('fs')
const { PROBLEM } = require('../../enum/Request')

require('dotenv').config().parsed

const admin = require('firebase-admin')
const serviceAccount = require('../../config/firestore_config')
const FirebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
})
const storage = FirebaseApp.storage();
const bucket = storage.bucket();
// allow multipart file
// const multerStorage = multer.diskStorage({
//     destination: function (req, file, callback) {
//         let path = `./assets/images/${req.params.endpoint}`
//         if (req.params.endpoint == 'solutions') {
//             path = path + `/${req.params.id}`
//         }
//         fs.mkdirSync(path, { recursive: true })
//         callback(null, path);
//     },
//     filename: function (req, file, cb) {
//         if (req.params.endpoint == 'solutions') {
//             cb(null, `${req.query.step}.png`);
//         } else {
//             cb(null, `${req.params.id}.png`);
//         }
//     }
// })

const upload = multer(
    {
        storage: multer.memoryStorage(),
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

// read solution image (not found case)
router.get('/:endpoint/:id', async (req, res, next) => {
    // let pathed = `/../../assets/images/${req.params.endpoint}/${req.params.id}`
    // res.sendFile(path.resolve(__dirname + pathed + (req.query.step != undefined ? `/${req.query.step}.png` : '.png')),
    //     err => {
    //         next(errorModel("File not found!!", req.originalUrl))
    //     });
    console.log(process.env.NODE_ENV)
    const folder = `images/${process.env.NODE_ENV == "development" ? "developments" : "productions"}/${req.params.endpoint}`
    const fileName = req.query.step != undefined ? `${folder}/${req.params.id}/${req.query.step}.png` : `${folder}/${req.params.id}.png`
    const file = bucket.file(fileName);
    file.download().then(downloadResponse => {
        return res.status(200).type('image/png').send(downloadResponse[0]);
    }, err => {
        return res.status(404).json(errorModel("File not found!!", req.originalUrl))
    });
});

// upload solution image
// condition (file size < 10 MB, file multipart, file upload per solution, file type image only, path storage property)
router.post('/:endpoint/:id', upload.single('file'), async (req, res) => {
    if (req.params.id == "undefined" || req.params.endpoint == "undefined") {
        return res.status(400).send(errorModel("upload file is blocked", req.originalUrl));
    }
    // getUpload(req, res, err => {

    //     if (err) {
    //         return res.status(400).send(errorModel(err.message, req.originalUrl));
    //     }
    //     // Everything went fine.
    //     res.status(201).send(req.file)
    // })
    if (req.params.endpoint == "problems") {
        for (let i in PROBLEM) {
            if (req.params.id == PROBLEM[i]) {
                return res.status(403).send(errorModel("This file cannot delete!!", req.originalUrl))
            }
        }
    }

    const folder = `images/${process.env.NODE_ENV == "development" ? "developments" : "productions"}/${req.params.endpoint}`
    const fileName = req.query.step != undefined ? `${folder}/${req.params.id}/${req.query.step}.png` : `${folder}/${req.params.id}.png`
    const fileUpload = bucket.file(fileName)
    const blobStream = fileUpload.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        }
    });
    blobStream.on('error', (err) => {
        res.status(400).json(err);
    });
    blobStream.on('finish', () => {
        res.status(200).send('Upload complete!');
    });
    blobStream.end(req.file.buffer);
})

// delete solution image
router.delete('/:endpoint/:id', async (req, res) => {
    // let pathed = `/../../assets/images/${req.params.endpoint}/${req.params.id}`
    // fs.unlink(__dirname + pathed + (req.query.step != undefined ? `/${req.query.step}.png` : '.png'), (err) => {
    //     if (err) {
    //         return res.status(404).send(errorModel("File not found", req.originalUrl));
    //     }
    //     res.send({ message: "file has been deleted" })
    // })
    const folder = `images/${process.env.NODE_ENV == "development" ? "developments" : "productions"}/${req.params.endpoint}`
    const fileName = req.query.step != undefined ? `${folder}/${req.params.id}/${req.query.step}.png` : `${folder}/${req.params.id}.png`
    for (let i in PROBLEM) {
        if (req.params.id == PROBLEM[i]) {
            return res.status(403).send(errorModel("This file cannot delete!!", req.originalUrl))
        }
    }
    bucket.deleteFiles({
        prefix: fileName
    });
    return res.status(200).send('Delete complete!');
})

module.exports = router
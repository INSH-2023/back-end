const express = require("express");
const router = express.Router();
path = require("path");
const multer = require("multer");
const errorModel = require("../../response/errorModel");
// const fs = require('fs')
const { PROBLEM } = require("../../enum/Request");
const { bucket, mode } = require("../../config/firestore_implement");

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

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 1024 * 1024 * 10,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Please upload a image file type jpg, jpeg or png"));
        }
        cb(undefined, true);
    },
});

// read solution image (not found case)
router.get("/:endpoint/:id", async (req, res, next) => {
    // let pathed = `/../../assets/images/${req.params.endpoint}/${req.params.id}`
    // res.sendFile(path.resolve(__dirname + pathed + (req.query.step != undefined ? `/${req.query.step}.png` : '.png')),
    //     err => {
    //         next(errorModel("File not found!!", req.originalUrl))
    //     });
    console.log(mode);
    const folder = `images/${mode == "development" ? "developments" : "productions"
        }/${req.params.endpoint}`;
    const fileName =
        req.query.step != undefined
            ? `${folder}/${req.params.id}/${req.query.step}.png`
            : `${folder}/${req.params.id}.png`;
    const file = bucket.file(fileName);
    file.download().then(
        (downloadResponse) => {
            return res.status(200).type("image/png").send(downloadResponse[0]);
        },
        (err) => {
            next(errorModel("File not found!!", req.originalUrl,404))
        }
    );
});

// upload solution image
// condition (file size < 10 MB, file multipart, file upload per solution, file type image only, path storage property)
router.post("/:endpoint/:id", upload.single("file"), async (req, res, next) => {
    if (req.params.id == "undefined" || req.params.endpoint == "undefined") {
        next(errorModel("upload file is blocked", req.originalUrl,400))
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
                next(errorModel("This file cannot delete!!", req.originalUrl,403))
            }
        }
    }

    if (req.params.endpoint == "items") {
        next(errorModel("This file cannot delete!!", req.originalUrl,403))
    }

    const folder = `images/${mode == "development" ? "developments" : "productions"}/${req.params.endpoint}`;
    const fileName =
        req.query.step != undefined
            ? `${folder}/${req.params.id}/${req.query.step}.png`
            : `${folder}/${req.params.id}.png`;
    const fileUpload = bucket.file(fileName);
    const blobStream = fileUpload.createWriteStream({
        metadata: {
            contentType: req.file.mimetype,
        },
    });
    blobStream.on("error", (err) => {
        next(errorModel(err,req.originalUrl,400))
    });
    blobStream.on("finish", () => {
        res.status(201).json({ message: "Upload complete!" });
    });
    blobStream.end(req.file.buffer);
});

// delete solution image
router.delete("/:endpoint/:id", async (req, res, next) => {
    // let pathed = `/../../assets/images/${req.params.endpoint}/${req.params.id}`
    // fs.unlink(__dirname + pathed + (req.query.step != undefined ? `/${req.query.step}.png` : '.png'), (err) => {
    //     if (err) {
    //         return res.status(404).send(errorModel("File not found", req.originalUrl));
    //     }
    //     res.send({ message: "file has been deleted" })
    // })

    if (req.params.endpoint == "problems") {
        for (let i in PROBLEM) {
            if (req.params.id == PROBLEM[i]) {
                next(errorModel("This file cannot delete!!", req.originalUrl,403))
            }
        }
    }

    if (req.params.endpoint == "items") {
        next(errorModel("This file cannot delete!!", req.originalUrl,403))
    }

    const folder = `images/${mode == "development" ? "developments" : "productions"
        }/${req.params.endpoint}`;
    const fileName = `${folder}/${req.params.id}.png`;
    bucket.deleteFiles({
        prefix: fileName,
    });
    const directory = `${folder}/${req.params.id}/`;
    bucket.deleteFiles({
        prefix: directory,
    });
    return res.status(200).json({ message: "Delete complete!" });
});

module.exports = router;

// please replace

// const express =require('express')
// const { route } = require('./user')
// const router =express.Router()
// const errorModel=require('../../response/errorModel')

// router.get('/',(req,res)=>{
//     res.download(`${__dirname}/../../images/vue.svg`)
// })

// router.get ('/:path',(req,res)=>{
//     // res.json({msg:__dirname})
//     res.download(`${__dirname}/../../images/${req.params.path}`)
// })

// router.get('/stage/:stage/:id',(req,res)=>{
//     // res.json({msg:__dirname})
//     let stage = parseInt(req.params.stage)
//     let num = parseInt(req.params.id)
//     let min =0
//     let max =5
//     if(stage==5&&num!=0){
//         if(num<=max && num>=min){
//             return  res.status(200).download(`${__dirname}/../../assets/images/stage/stage_5/${num}.png`)

//         }else{
//             return res.status(404).json(errorModel("not found id !!!",req.originalUrl))
//         }
//     }else
//     if(stage==3&&num!=0){
//         num+=2
//         if(num<=max && num>=min){
//             return  res.status(200).download(`${__dirname}/../../assets/images/stage/stage_5/${num}.png`)

//         }else{
//             return res.status(404).json(errorModel("not found id !!!",req.originalUrl))
//         }
//     }else
//     if(stage==2&&num!=0){
//         num+=3
//         if(num<=max && num>=min){
//             return  res.status(200).download(`${__dirname}/../../assets/images/stage/stage_5/${num}.png`)

//         }else{
//             return res.status(404).json(errorModel("not found id !!!",req.originalUrl))
//         }
//     }else{
//         return res.status(404).json(errorModel('not found !!!',req.originalUrl))
//     }

//     // res.download(`${__dirname}/../../images/stage/stage_5/${req.params.id}.png`)

// })

// module.exports=router

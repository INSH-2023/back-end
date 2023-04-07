const express =require('express')
const router =express.Router()
path = require('path');
const multer = require("multer")
const errorModel =require('../../response/errorModel')
const fs = require('fs')


// allow multipart file
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './assets/image/solution');
    },
    filename: function (req, file, cb) {
        cb(null, `${req.params.solId}/${req.params.step}.png`);
    }
})

const upload = multer(
    {
        storage: storage,
        limits: {
          fileSize: 1024 * 1024 * 10
        },
        fileFilter(req, file, cb) {
            if (!file.originalname.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
                return cb(new Error('Please upload a valid image file'))
            }
            cb(undefined, true)
        }
})

const getUpload = upload.single('file')

// read solution image (not found case)
router.get('/:solId/:step',async(req,res)=>{
    res.sendFile(path.resolve(__dirname + `../../../assets/image/solution/${req.params.solId}/${req.params.step}.png`), err => {
        return res.status(404).send(errorModel("File not found",req.originalUrl))
    })
})

// upload solution image
// condition (file size < 10 MB, file multipart, file upload per solution, file type image only, path storage property)
router.post('/:solId/:step', async (req, res) => {
    getUpload(req, res, err => {
        if (err) {
            return res.status(400).send(errorModel(err.message,req.originalUrl))
        }

        // Everything went fine.
        res.status(200).send(req.file)
    })
})

// delete solution image
router.delete('/:solId/:step', async (req, res) => {
    fs.unlink(__dirname + `../../../assets/image/solution/${req.params.solId}/${req.params.step}.png`, (err) => {
        if (err) {
            return res.status(404).send(errorModel("File not found",req.originalUrl))
        }
        res.send({message : "file has been deleted"}) 
    })
})

module.exports=router
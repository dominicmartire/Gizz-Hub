const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Video = require('./models/video')
const crypto = require('crypto')
const multer = require('multer')
const GridFsStorage = require('multer-gridfs-storage')
const GridFs = require('gridfs-stream')
const methodOverride = require('method-override')
const path = require('path')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

const mongo_uri = process.env.MONGO_URI
mongoose.connect(mongo_uri, { useNewUrlParser: true })
    .then(()=>console.log("connected to mongodb"))
    .catch(error=>"error"+error.message)


let connection= mongoose.connection
let gfs

connection.once('open', ()=>{
    gfs = GridFs(connection.db, mongoose.mongo);
    gfs.collection('uploads');
})

/*storage engine*/
const storage = new GridFsStorage({
    url:mongo_uri,
    file:(req,file)=>{
        return new Promise((resolve, reject)=>{
            crypto.randomBytes(16, (err, buf)=>{
                if(err){
                    return reject(err)
                }
                const filename = buf.toString('hex') + path.extname(file.originalname)
                const fileInfo = {
                    filename:filename,
                    bucketName:'uploads'
                }
                resolve(fileInfo)
            })
        })
    }
})
const upload = multer({storage})

app.get('/videos', async(request, response)=>{
    gfs.files.find().toArray((error, files)=>{
        if(!files || files.length === 0){
            return response.status(404).json({
                error:"No files exist"
            })
        }
        return response.json(files)
    })
})

app.get('/videos/:filename', async(request, response)=>{
    gfs.files.findOne({filename:request.params.filename}, async (err,file)=>{
        if(!file || file.length===0){
            return response.status(404).json({
                error:"No file exists"
            })
        }
        const chunks = await gfs.db.collection("uploads.chunks")
        await chunks.find({files_id:file._id}).toArray((error,result)=>{
            if(error){
                return response.status(404).json({error:"Error occurred"})
            }
            if(!result || result.length === 0){
                return response.status(404).json({
                    error:"File not loaded"
                })
            }
            let data = []
            result.forEach(chunk=>{
                data.push(chunk.data.toString('base64'))
            })
            let dataString = 'data:' + file.contentType + ';base64,' + data.join('')
            return response.json({
                filename: request.params.filename,
                source: dataString,
                id: file._id
            })
        })

    })
})

app.post('/videos', upload.single('file') ,async(request, response)=>{
    console.log(request.body)
    response.json({file:request.file})
})

module.exports = app
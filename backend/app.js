const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Video = require('./models/video')
const crypto = require('crypto')
let formidable = require('formidable')
let fs = require('fs')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

const mongo_uri ="mongodb+srv://dmartire99:Briarwood1!@cluster0-sc6g0.mongodb.net/gizz-hub?retryWrites=true&w=majority"
mongoose.connect(mongo_uri, { useNewUrlParser: true })
    .then(()=>console.log("connected to mongodb"))
    .catch(error=>"error"+error.message)





app.get('/api/videos', async(request, response)=>{
    const videos = await Video.find({})
    response.json(videos)
})

app.get('/api/videos/:id', async (request, response)=>{
    try {
        const video = await Video.findById(request.params.id)
        if(video){
            const path = video.path
            const stat = fs.statSync(path)
            const fileSize = stat.size
            const range = request.headers.range
            if(range){
                const parts = range.replace(/bytes=/,"").split("-")
                const start = parseInt(parts[0],10)
                const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
                const chunksize = (end - start) + 1
                const file = fs.createReadStream(path,{start,end})
                const head = {
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Accept-Ranges':'bytes',
                    'Content-Length':chunksize,
                    'Content-Type':video.fileType
                }
                response.writeHead(206,head)
                file.pipe(response)
            }
            else{
                const head = {
                    'Content-Length': fileSize,
                    'Content-Type': video.fileType
                }
                response.writeHead(200,head)
                fs.createReadStream(path).pipe(response)
            }
        }

    } catch (error) {
        console.log(error)
        return response.json({error:"an error occurred"})
    }
})

app.post('/api/videos', async(request, response)=>{
    let form = new formidable.IncomingForm()
    form.parse(request, async (err, fields, file)=>{
        if(err){
            return response.status(400).json({error:"Error uploading file"})
        }
        let path = file.file.path
        const video = new Video({
            title:fields.title,
            path: `./videos/${file.file.name}`,
            fileType: file.file.type
        })
        const savedVideo = await video.save()
        fs.rename(path, `./videos/${file.file.name}`, (err)=>{
            if(err){
                return response.status(400).json({error:"Error uploading file"})
            }

            return response.status(201).json(savedVideo.toJSON())
        })
    })

})

module.exports = app
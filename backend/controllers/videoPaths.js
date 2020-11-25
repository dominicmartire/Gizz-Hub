const videoRouter = require('express').Router()
const Video = require("../models/video")
const Concert = require("../models/concert")
let formidable = require('formidable')
let fs = require('fs')

videoRouter.get('/', async(request, response)=>{
    const videos = await Video.find({})
    response.json(videos)
})

videoRouter.get('/:id', async (request, response)=>{
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

videoRouter.post('/', async(request, response)=>{
    let form = new formidable.IncomingForm()
    form.parse(request, async (err, fields, file)=>{
        if(err){
            return response.status(400).json({error:"Error uploading file"})
        }
        let path = file.file.path
        const video = new Video({
            title:fields.title,
            path: `./videos/${file.file.name}`,
            fileType: file.file.type,
            concert: fields.concertId
        })
        const id = video._id
        const fileType = file.file.type
        const newPath = `./videos/${id}.${fileType.substr(6)}`
        video.path = newPath


        try{
            const concert = await Concert.findById(fields.concertId)
            const savedVideo = await video.save()
            concert.videos = concert.videos.concat(savedVideo._id)
            await concert.save()
            fs.rename(path, newPath, (err)=>{
                if(err){
                    return response.status(400).json({error:"Error uploading file"})
                }

                return response.status(201).json(savedVideo.toJSON())
            })
        }
        catch(e){
            console.log(e)
            return response.status(400).end()
        }
    })

})

videoRouter.delete('/:id', async(request, response)=>{
    try{
        const video = await Video.findById(request.params.id)
        const concert = await Concert.findById(video.concert)

        console.log("concert ", concert)
        if(concert){
            console.log(video.id)
            const newVideos = concert.videos.filter(v=> v !== video.id)
            console.log(newVideos)
            concert.videos = newVideos
            console.log(concert)
            await concert.save()
        }

        const path = video.path
        await Video.findByIdAndDelete(request.params.id)

        fs.unlink(path, (err)=>{
            if(err){
                console.log(error)
                return response.status(400).json({error:"error deleting file"})
            }
            return response.status(204).end()
        })
    }
    catch(e){
        console.log(e)
        return response.status(400).end()
    }
    

})

module.exports = videoRouter
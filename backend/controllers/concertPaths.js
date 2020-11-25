const formidable = require('formidable')
const concertRouter = require('express').Router()
const Concert = require('../models/concert')
const Video = require("../models/video")
const fs = require('fs')

concertRouter.get("/", async(request, response)=>{
    try{
        const concerts = await Concert.find({})
        response.status(201).json(concerts)
    }
    catch(e){
        console.log(e)
    }
})

concertRouter.get('/:id', async(request, response) => {
    const id = request.params.id
    try{
        const concert = await Concert.findById(id)
        response.status(201).json(concert.toJSON())
    }
    catch(e){
        console.log(e)
        response.status(404).json({error:"can't find that concert"})
    }
})

concertRouter.post("/", async(request, response)=>{
    
    let form = new formidable.IncomingForm()
    form.parse(request, async(err, fields)=>{
        if(err){
            return response.json(400).status({"error": err})
        }
        console.log(fields)
        const concert = new Concert({
            location:fields.location,
            videos:[],
            date: new Date(fields.date)
        })
        try{
            const savedConcert = await concert.save()
            return response.status(201).json(savedConcert.toJSON())
        }
        catch(err){
            return response.status(400).json({error:"error adding concert"})
        }
    })

    

})

concertRouter.delete("/:id", async(request,response)=>{
    try{
        const concert = await Concert.findById(request.params.id)
        concert.videos.forEach(async v=>{
            const video = await Video.findById(v)
            console.log(video)


            if(video){
                const path = video.path
            
            
                await Video.findByIdAndDelete(v)

                fs.unlink(path, (err)=>{
                    if(err){
                        console.log(error)
                        return response.status(400).json({error:"error deleting file"})
                    }
                    return response.status(204).end()
                })
            }
        })

        await Concert.findByIdAndDelete(request.params.id)
        return response.status(200)
    }
    catch(err){
        return response.status(400).json({error:"error deleting concert"})
    }
})


module.exports = concertRouter
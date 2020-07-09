let formidable = require('formidable')
const concertRouter = require('express').Router()
const Concert = require('../models/concert')

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

module.exports = concertRouter
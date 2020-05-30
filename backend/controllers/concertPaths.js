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
    try{
        const body = request.body

        const concert = new Concert({
            location: body.location
        })
        await concert.save()
        response.json(concert.toJSON())
    }
    catch(e){
        response.json(400).json({error:"error adding concert"})
    }
})

module.exports = concertRouter
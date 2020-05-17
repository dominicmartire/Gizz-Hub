const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Video = require('./models/video')
videoRouter = require('express').Router()
const app = express()
mongoose.connect("mongodb+srv://dmartire99:Briarwood1!@cluster0-sc6g0.mongodb.net/gizz-hub?retryWrites=true&w=majority", { useNewUrlParser: true })
    .then(()=>console.log("connected to mongodb"))
    .catch(error=>"error"+error.message)

app.use(cors())
app.use(bodyParser.json())

videoRouter.get('/', async(request, response)=>{
    const videos = await Video.find({})
    response.json(blogs)
})
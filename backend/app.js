const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Video = require('./models/video')
const crypto = require('crypto')
const videoRouter = require('./controllers/videoPaths')
const concertRouter = require('./controllers/concertPaths')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.json())

const mongo_uri ="mongodb+srv://dmartire99:Briarwood1!@cluster0-sc6g0.mongodb.net/gizz-hub?retryWrites=true&w=majority"
mongoose.connect(mongo_uri, { useNewUrlParser: true })
    .then(()=>console.log("connected to mongodb"))
    .catch(error=>"error"+error.message)

app.use('/api/videos', videoRouter)
app.use('/api/concerts', concertRouter)

module.exports = app
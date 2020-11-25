const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Video = require('./models/video')
const crypto = require('crypto')
const videoRouter = require('./controllers/videoPaths')
const concertRouter = require('./controllers/concertPaths')
const logger = require('./middleware/logger')
const middleware = require("./middleware/middleware")
require('dotenv').config()

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(logger.requestLogger)



const mongo_uri ="mongodb+srv://dmartire99:Briarwood1!@cluster0-sc6g0.mongodb.net/gizz-hub?retryWrites=true&w=majority"
mongoose.connect(mongo_uri, { useNewUrlParser: true })
    .then(()=>console.log("connected to mongodb"))
    .catch(error=>"error"+error.message)


app.use(express.static('build'))
app.use('/api/videos', videoRouter)
app.use('/api/concerts', concertRouter)

app.use(middleware.unknownEndpoint)


module.exports = app
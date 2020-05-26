const mongoose = require('mongoose')
mongoose.set('useFindAndModify',false)

const videoSchema = mongoose.Schema({
    title:{
        type: String,
    },
    path:{
        type: String
    },
    fileType:{
        type:String
    }
})

videoSchema.set('toJSON',{
    transform: (document,returnedObject)=>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Video', videoSchema)
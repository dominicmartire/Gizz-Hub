const mongoose = require('mongoose')
mongoose.set('useFindAndModify',false)

const concertSchema = mongoose.Schema({
    location:{
        type:String,
        required: true
    },
    videos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Video'
        }
    ]
})

concertSchema.set('toJSON',{
    transform: (document,returnedObject)=>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Concert', concertSchema)
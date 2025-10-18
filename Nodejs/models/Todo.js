
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TodoSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:'users'
    }
},
{
    timestamps:true
}
)

module.exports = mongoose.model('todos',TodoSchema)
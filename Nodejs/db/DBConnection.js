
const mongoose = require('mongoose')


const connectDB = async ()=>{
    try{
        await mongoose.connect('mongodb://localhost:27017/Todo-test', {
            useNewUrlParser: true,
         
        })
        console.log('DB connected')
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}


module.exports = connectDB
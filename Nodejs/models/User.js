
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const UserSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    
    }
},
{
    timestamps:true
}
)

UserSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,10)
    }
    next()
})

UserSchema.methods.isValidPassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

UserSchema.methods.generateToken = async function(id){
    const token = jwt.sign({id:id},process.env.JWT_SECRET,{expiresIn:'1h'})
    return token
}


module.exports = mongoose.model('users',UserSchema)
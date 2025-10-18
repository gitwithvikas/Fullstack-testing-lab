
const express = require('express')
const router = express.Router()
const User = require('../models/User')

router.get('/',async (req,res)=>{
    try{
        const users = await User.find()
        res.json(users)
    }
    catch(err){
        console.log(err)
    }
})

router.post('/',async (req,res)=>{
    try{
        const user = new User(req.body)
        await user.save()
        res.status(201).json({message:'user created successfully',user})
    }
    catch(err){
        console.log(err)
    }
})

router.post('/login',async (req,res)=>{
    try{
        const user = await User.findOne({email:req.body.email})
        if(!user){
            return res.status(401).json({message:'User not found'})
        }
        if(!await user.isValidPassword(req.body.password)){
            return res.status(401).json({message:'Invalid password'})
        }
        const token = await user.generateToken(user._id)
        res.json({token})
    }
    catch(err){
        console.log(err)
    }
})

module.exports = router
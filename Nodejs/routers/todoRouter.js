
const express = require('express')
const router = express.Router()
const Todo = require('../models/Todo')


router.get('/',async (req,res)=>{
    try{

     const todos = await Todo.find().populate('user')
     res.json(todos)

    }
    catch(err){
        console.log(err)
    }

    
})  


router.post('/',async (req,res)=>{
    try{
        const todo = new Todo(req.body)
        await todo.save()
        res.status(201).json({message:'todo created successfully',todo})
    }
    catch(err){
        console.log(err)
    }
})

module.exports = router


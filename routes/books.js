const express = require('express')
const route = express.Router()
const Book =require('../models/Book')
const Author = require('../models/Author')
//For all book route
route.get('/',async (request,response)=>{
   response.render('')
    
})
//for new books
route.get('/new',async (request,response)=>{
   try{
    const authors = await Author.find({})
    const book = new Book()
    response.render('books/new',{
        authors : authors,
        book : book
    })
   }catch(error){
   console.log(error)
   }
})
//Create new bOoks
route.post('/',async (request,response)=>{
response.send('create BOoks')
})
module.exports = route
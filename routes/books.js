const express = require('express')
const route = express.Router()
const Author = require('../models/Author')
//For all book route
route.get('/',async (request,response)=>{
   response.send('All books')
    
})
//for new books
route.get('/new',(request,response)=>{
    response.send('new Books')
})
//Create new bOoks
route.post('/',async (request,response)=>{
response.send('create BOoks')
})
module.exports = route
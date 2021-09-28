const express = require('express')
const route = express.Router();
const Book = require('../models/Book')
route.get('/',async (request,response)=>{
    let books 
    try {
        books = Book.fing().sort({createAt:'desc'}).limit(10).exec()
    } catch (error) {
        books =[]
        
    }
    response.render('index',{books:books })
    
})

module.exports = route
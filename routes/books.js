const express = require('express')
const route = express.Router()
const Book =require('../models/Book')
const Author = require('../models/Author')
const multer= require('multer')
const path = require('path')
const { request } = require('express')
const imageMimeType = ['images/jpeg','images/png','images/gif']
const uploadPath = path.join('public',Book.coverImageBasePath)
const upload = multer({
   dest : uploadPath,
   fileFilter : (request,file,callback)=>{
      callback(null,imageMimeType.includes(file.mimetype))
   }
})
//For all book route
route.get('/',async (request,response)=>{
   response.render('')
    
})
//for new books
route.get('/new',async (request,response)=>{
   renderNewPage(response,new Book())
})
//Create new bOoks
route.post('/',upload.single('cover'),async (request,response)=>{
   const fileName = request.file != null ? request.file.filename : null 
   const book = new Book({
      title : request.body.title,
      author: request.body.author,
      publishDate:new Date(request.body.publishDate),
      description:request.body.description,
      coverImageName : fileName,
      pageCount : parseInt(request.body.pageCount)

   })
   try {
      const newBook = await book.save()
      // response.redirect('book/${newBook.id')
      response.redirect('books')
   } catch (error) {
      renderNewPage(response, book , true)
      
   }
})

async function renderNewPage(response,book,hasError = false){
   try{
      const authors = await Author.find({})
      const params = {
         authors:authors,
         book : book
      }
      if(hasError) params.errorMessage = 'Error Creating Book'
      
      response.render('books/new',params)
     }catch(error){
     response.redirect('/books')
     console.log(error)
     }
}
module.exports = route
const express = require('express')
const route = express.Router()
const Book =require('../models/Book')
const Author = require('../models/Author')
const multer= require('multer')
const path = require('path')
const fs = require('fs')
const { request } = require('express')
const imageMimeType = ['image/jpeg','image/png','images/gif']
const uploadPath = path.join('public',Book.coverImageBasePath)
const upload = multer({
   dest : uploadPath,
   fileFilter : (request,file,callback)=>{
      callback(null,imageMimeType.includes(file.mimetype))
   }
})
//For all book route
route.get('/', async (req, res) => {
   let query = Book.find()
   if (req.query.title != null && req.query.title != '') {
     query = query.regex('title', new RegExp(req.query.title, 'i'))
   }
   if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
     query = query.lte('publishDate', req.query.publishedBefore)
   }
   if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
     query = query.lte('publishDate', req.query.publishedAfter)
   }
  
   try {
     const books = await query.exec()
     res.render('books/index', {
       books: books,
       searchOptions: req.query
     })
   } catch {
     res.redirect('/')
   }
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
      pageCount : request.body.pageCount,
      description:request.body.description,
      // coverImageName : fileName,
      

   })
   try {
      const newBook = await book.save()
      // response.redirect('book/${newBook.id')
      response.redirect('/books')
   } catch (error) {
      if(book.coverImageName!= null){
         reomveBookCover(book.coverImageName)
      }
     console.log(error)
      renderNewPage(response, book , true)
      
   }
})
function reomveBookCover(fileName){
   fs.unlink(path.join(uploadPath,fileName),err =>{
      if(err) console.error(err)
   })
}

async function renderNewPage(response,book,hasError = false){
   try{
      const authors = await Author.find({})
      const params = {
         authors: authors,
         book : book,
        
      }
      if(hasError)  params.errorMessage = 'Error Creating Book'
      
      response.render('books/new',params)
     }catch(error){
     response.redirect('/books')
     console.log(error)
     }
}
module.exports = route
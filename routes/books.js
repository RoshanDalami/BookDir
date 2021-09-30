const express = require('express')
const route = express.Router()
const Book =require('../models/Book')
const Author = require('../models/Author')
const { request } = require('express')
const imageMimeType = ['image/jpeg','image/png','images/gif']


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
route.post('/',async (request,response)=>{
   
   const book = new Book({
      title : request.body.title,
      author: request.body.author,
      publishDate:new Date(request.body.publishDate),
      pageCount : request.body.pageCount,
      description:request.body.description,
      
      

   })
   saveCover(book,request.body.cover)
   try {
      const newBook = await book.save()
      response.redirect(`books/${newBook.id}`)
      // response.redirect(`books`)
   } catch (error) {
      // if(book.coverImageName!= null){
      //    reomveBookCover(book.coverImageName)
      // }
     console.log(error)
      renderNewPage(response, book , true)
      
   }
})
route.get('/:id',async (request,response)=>{
   try {
      const book = await Book.findById(request.params.id).populate('author').exec()
      response.render('books/show',{book : book})
   } catch (error) {
      response.redirect('/')
      
   }
})
//Edit Book route
route.get('/:id/edit',async(request,response)=>{
   try {
      const book = await Book.findById(request.params.id)
      renderEditPage(response,book)
   } catch (error) {
      response.redirect('/')
   }
})
//Update Book route
route.put('/:id',async (request,response)=>{
   
 let book 
   try {
      book = await Book.findById(request.params.id)
      book.title = request.body.title
      book.author = request.body.author
      book.publishDate = new Date(request.body.publishDate)
      book.pageCount = request.body.pageCount
      book.description = request.body.description
      
      // response.redirect(`books`)
      if(request.body.cover != null && request.body.cover != ''){
         saveCover(book,request.body.cover)
      }
      await book.save()
      response.redirect(`/books/${book.id}`)
   } catch (error) {
      // if(book.coverImageName!= null){
      //    reomveBookCover(book.coverImageName)
      // }
      if(book != null){
         renderNewPage(response, book , true)
      }else{
         response.redirect('/')
      }
     console.log(error)
      
      
   }
})
//Delete Book Page
route.delete('/:id',async (request,response)=>{
 let book
try {
   book = await Book.findById(request.params.id)
   await book.remove()
   response.redirect('/books')
} catch (error) {
   if(book != null){
      response.render('books/show',{
         book : book,
         errorMessage : 'Could not remove Book'
      })
   }else{
      response.redirect('/')
   }
   
}
})




// function reomveBookCover(fileName){
//    fs.unlink(path.join(uploadPath,fileName),err =>{
//       if(err) console.error(err)
//    })
// }


async function renderNewPage(response,book,hasError = false){
   renderFormPage(response,book,'new',hasError)
}
async function renderEditPage(response,book,hasError = false){
   renderFormPage(response,book,'edit',hasError)
}
async function renderFormPage(response,book,form ,hasError = false){
   try{
      const authors = await Author.find({})
      const params = {
         authors: authors,
         book : book,
        
      }
      if(hasError) {
         if(form == 'edit'){
            params.errorMessage = 'Error Updating Book'
         }
         else {
            params.errorMessage = 'Error Creating Book'
         }
      }
      
      response.render(`books/${form}`,params)
     }catch(error){
     response.redirect('/books')
     console.log(error)
     }
}
//to save the file to the database
function saveCover(book,coverEncoded){
   if(coverEncoded == null ) return 
   const cover = JSON.parse(coverEncoded)
   if(cover!= null && imageMimeType.includes(cover.type)){
      book.coverImage = new Buffer.from(cover.data,'base64')
      book.coverImageType = cover.type
   }

}
module.exports = route 

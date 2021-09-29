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
      // response.redirect('book/${newBook.id')
      response.redirect(`books`)
   } catch (error) {
      // if(book.coverImageName!= null){
      //    reomveBookCover(book.coverImageName)
      // }
     console.log(error)
      renderNewPage(response, book , true)
      
   }
})
// function reomveBookCover(fileName){
//    fs.unlink(path.join(uploadPath,fileName),err =>{
//       if(err) console.error(err)
//    })
// }


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
/*
const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// All Books Route
router.get('/', async (req, res) => {
  let query = Book.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
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

// New Book Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Book())
})

// Create Book Route
router.post('/', async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description
  })
  saveCover(book, req.body.cover)

  try {
    const newBook = await book.save()
    // res.redirect(`books/${newBook.id}`)
    res.redirect(`books`)
  } catch {
    renderNewPage(res, book, true)
  }
})

async function renderNewPage(res, book, hasError = false) {
  try {
    const authors = await Author.find({})
    const params = {
      authors: authors,
      book: book
    }
    if (hasError) params.errorMessage = 'Error Creating Book'
    res.render('books/new', params)
  } catch {
    res.redirect('/books')
  }
}

function saveCover(book, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, 'base64')
    book.coverImageType = cover.type
  }
}

module.exports = router */
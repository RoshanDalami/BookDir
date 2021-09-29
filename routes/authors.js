const express = require('express')
const route = express.Router()
const Author = require('../models/Author')
const Book = require('../models/Book')
//For all authors route
route.get('/',async (request,response)=>{
    let searchOptions ={}
    if(request.query.name != null && request.query.name !== ''){
        searchOptions.name = new RegExp(request.query.name,'i')
    }
    try {
       const authors = await Author.find(searchOptions)
       response.render('authors/index',{
           authors: authors,
           searchOptions:request.query}) 
    } catch  {
        response.redirect('/')
    }  
})
//for new author
route.get('/new',(request,response)=>{
    response.render('authors/new',{'Author': new Author()})
})
//new author
route.post('/',async (request,response)=>{
    const author = new Author({
        name : request.body.name
    })
    try {
        const newAuthor = await author.save()
        response.redirect(`authors/${newAuthor.id}`)
        // response.redirect('authors')
    } catch (error) {
        response.render('/authors/new',{
            author : author ,
            errorMessage : 'Error Creating Author'
        })
    }
})

route.get('/:id', async (request,response)=>{
    try{
        const author = await Author.findById(request.params.id)
        const books = await Book.find({author : author.id}).limit(6).exec()
        response.render('authors/show',{
            author : author,
            booksByAuthor : books
        })

    }catch(error){
        console.log(error)
        response.redirect('/')

    }
})
route.get('/:id/edit',async (request,response)=>{
    const author = await Author.findById(request.params.id)
    try{
        response.render('authors/edit',{author : author})
    }catch{
        response.redirect('/authors')
    }
   
})
route.put('/:id',async (request,response)=>{
    let author ;
    try {
        author = await Author.findById(request.params.id)
        author.name = request.body.name
         await author.save()
         response.redirect(`/authors/${author.id}`)
        // response.redirect('authors')
    } catch (error) {
        if(author == null){
            response.redirect('/')
        }
       else{
        response.render('/authors/new',{
            author : author ,
            errorMessage : 'Error Updating Author'
        })
       }
    }
})
route.delete('/:id',async (request,response)=>{
    let author ;
    try {
        author = await Author.findById(request.params.id)
         await author.remove()
         response.redirect('/authors')
        // response.redirect('authors')
    } catch (error) {
        if(author == null){
            response.redirect('/')
        }
       else{
        response.redirect(`/authors/${author.id}`)
       }
    }
})
module.exports = route
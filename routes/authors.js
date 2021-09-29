const express = require('express')
const route = express.Router()
const Author = require('../models/Author')
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
        response.redirect('authors')
    } catch (error) {
        response.render('/authors/new',{
            author : author ,
            errorMessage : 'Error Creating Author'
        })
    }
    
    // author.save((err,newAuthor)=>{
    //     if(err){
            
    //     }
    //     else{
    //         // response.redirect(`authors/${newAuthor.id}`)
    //          response.redirect(`authors`)
    //     }
    // })
    

})
module.exports = route
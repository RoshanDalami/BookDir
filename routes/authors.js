const express = require('express')
const route = express.Router()
const Author = require('../models/Author')

route.get('/',(request,response)=>{
    response.render('authors/index')
})
//for new author
route.get('/new',(request,response)=>{
    response.render('authors/new',{'Author': new Author()})
})
//new author
route.post('/new',(request,response)=>{
    const author = new Author({
        name:request.body.name,
    })
    author.save()
    .then(()=>{response.redirect})
    .catch(response.render('authors/new',{
        author : author,
        errorMessage :'Error creating Author'
    }))
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
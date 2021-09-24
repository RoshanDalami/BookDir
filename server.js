if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
// const bodyParser = require('body-parser')
const PORT = process.env.PORT || 5000
//Setting up view engines
app.set('view engine','ejs')
app.set('views',__dirname+'/views')
app.set('layout','layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({limit:"10mb",extended : false}))
app.use(express.json())
//connecting to the routes
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/authors.js')
const bookRouter = require('./routes/books.js')
app.use('/',indexRouter)
app.use('/authors',authorRouter)
app.use('/books',bookRouter)

//connecting to the dataBase

//  const db = require('./setup/mykeys').myKey;   
 const db = process.env.DATABASE_URL
mongoose.connect(db).then(()=>console.log('DataBase Connected Successfuly')).catch((error)=>console.log(error))

app.listen(PORT,()=>{
    console.log(`Server is running ${PORT}`)
})
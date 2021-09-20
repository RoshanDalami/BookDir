if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
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
app.use('/',indexRouter)
app.use('/authors',authorRouter)

//connecting to the dataBase
mongoose.connect(process.env.DATABASE_URL).then(()=>console.log('DataBase Connected Successfuly')).catch((error)=>console.log(error))

app.listen(PORT,()=>{
    console.log(`Server is running ${PORT}`)
})
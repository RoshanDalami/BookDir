const express = require('express')
const route = express.Router();

route.get('/',(request,response)=>{
    response.render('index')
})

module.exports = route
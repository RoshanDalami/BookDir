const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },

})

module.exports = Author = mongoose.model('Author',authorSchema)
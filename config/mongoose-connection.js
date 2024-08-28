const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017').then(function(){
    console.log('Connected to MongoDB');
})

const db = mongoose.connection;

module.exports = db;




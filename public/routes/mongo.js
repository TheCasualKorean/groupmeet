
module.exports = {
    connectToDB: function() {
    var express = require('express');
    var router = express.Router();

    var mongo = require('mongodb');
    const mongoose = require('mongoose');
    var assert = require ('assert');

    const options = {
        keepAlive: 1,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
      };

  // Connect option 1: Mongo Atlas Hosting (also works on heroku)
    // mongoose.connect("mongodb+srv://admin:N@RBh&bUO35C@cluster0-8gr6n.mongodb.net/test?retryWrites=true&w=majority", options);

  // Connect option 2: Local hosting and URI for use on heroku
   mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost/groupmeet', options);

    mongoose.connection.once('open', function(){
        console.log('connected to groupmeet')
    }).on('error', function(err){
        console.log("Connection error: ", err)
    })

    }
  }
// }

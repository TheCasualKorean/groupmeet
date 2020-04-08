const mongoose = require('mongoose');

//create user model
const userSchema3 = new mongoose.Schema({
    //change unique to true once database testing is over
    _id: mongoose.Types.ObjectId, 
    username: {type: String},
    password: {type: String},
    firstname: String,
    lastname: String
});

var User = mongoose.model('logintestcollection', userSchema3);

module.exports = User;

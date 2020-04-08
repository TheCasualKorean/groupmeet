////require the express library
var express = require('express');
var router = express();
const mongoose = require('mongoose');
var User = require('../lib/User'); //correct file path.
//set up a port
const port = process.env.PORT || 8080;
//import mongo
const testMongo = require('./mongo');
var path = require('path');
//configure app to use session
var session = require('express-session');
//allows extraction of form data
var bodyParser = require('body-parser');
router.use(bodyParser.json());
router.use(express.urlencoded({extended: false}));
//register session to app
router.use(session(
        {
            secret:"67i66igfi6&*6i%$&%^&U",
            resave: true,
            saveUninitialized: true
        }
));

router.use(express.static(path.join(__dirname, 'public')));

// how to associate specific database
mongoose.connect('mongodb://localhost/groupmeet',
{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Get login page
router.get('/',(request,response,next) => {
  response.sendFile(path.resolve('./views/login.html'));
});

// //get specific username
// router.get('/',(req, res, next) => {
//   User.find().select('username password _id').exec().then(docs => {
//     res.status(200).json({
//       count: docs.length,
//       orders: docs.map(doc => {
//         return {
//           _id: doc._id,
//           username: doc.username,
//           password: doc.password,
//           request: {
//             type: "GET",
//             url: "http://localhost:8080/register/" + doc._id
//           }
//         };
//       })
//     });
//   })
//   .catch(err => {
//     res.status(500).json({
//       error: err
//     });
//   })
// });

//register new user and save to database
router.post('/signup',function(request,response){
    //route flag
    console.log("BEGINNING OF register action reached");
//remo
    var username = request.body.username;
    var password = request.body.password;
    var firstname = request.body.firstname;
    var lastname = request.body.lastname;

    console.log(`username ${username}`);
    console.log(`password: ${password}`);
    console.log(`firstname: ${firstname}`);
    console.log(`lastname: ${lastname}`);

    var newUser = new User();
    newUser.username = username;
    newUser.password = password;
    newUser.firstname = firstname;
    newUser.lastname = lastname;

    //save user
//    newUser.collection.insertOne(function(err,savedUser){
      User.collection.insertOne(newUser,function(err,savedUser){
        if(err){
            //log error if one exists
            console.log(err);
            return response.status(500).send();
        }
        //return successful status

       response.send(`User: ${newUser.username} added!`);
        console.log("loginpage.js register action reached end");
        return response.status(200).send();
        response.sendFile(path.resolve('./views/dashboard.html'));
    });
}); //end signup

//login user
router.post('/login',function(request,response){
    var username = request.body.username;
    var password = request.body.password;
    //specify user to find by username and password
    User.findOne({username: username, password: password}, function(err,user){
       if(err) {
           //error found, log error
           console.log(err);
           return response.status(500).send();
       }
       //user doesnt exist
       if(!user) {
           return response.status(404).send();
       } //user exists
       //set logged in user session
       request.session.user = user;
       return response.status(200).send("logged in!");
    });
}); //end login

//logout user
router.get('logout',function(request,response){
    request.session.destroy();
    return status(200).send();
}); //end logout

//gets all users and reads all saved data in databse with empty object check
router.get('/getUsers', function(request,response){
    User.find({}, function(err,foundData){
        if(err){
            console.log(err);
            response.status(500).send();
        }else{
            if(foundData.length === 0){
                var responseObject = undefined;
                responseObject = {count:0};
                response.status(404).send(responseObject);
            } else{
                var responseObject = foundData;
                console.log("reached here");
                response.send(responseObject);
            }
        }
    });
}); //end get all users

//get specific user
router.get("/:user_id", (req, res, next) => {
  User.findById(req.params.user_id)
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }
      res.status(200).json({
        //show all users
        user: user,
        request: {
          type: "GET",
          url: "http://localhost:3000/register/getUsers"
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      }) ;
    });
});  // end get specific user

// delete specific user
router.delete("/:user_id", (req, res, next) => {
  User.remove({ _id: req.params.user_id })
  .exec()
  .then(result => {
    res.status(200).json({
      message: 'Order deleted',
      request: {
        type: "POST",
        url: "http://localhost8080:/register/getUsers",
        body: { user_id: 'user_id', username: 'username'}
      }
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
}); // end delete specific user


//add and find specific user WORKING ON THIS***********
router.post("/", (req, res, next) => {
  User.findById(req.body.user_id)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }
      const user2 = new User({
        _id: mongoose.Types.ObjectId(),
        username: req.body.username,
        password: req.body.password,
        firstname: req.body.firstname,
        lastname: req.body.lastname
      });
      return user2.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "User stored",
        createdOrder: {
          _id: result._id,
          username: result.username,
          password: result.password,
          firstname: req.body.firstname,
          lastname: req.body.lastname
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/register/" + result._id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;

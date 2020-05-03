// ////require the express library
// var express = require('express');
// var router = express();
// const mongoose = require('mongoose');
// var User = require('../lib/User'); //correct file path.
// //import mongo
// const testMongo = require('./mongo');
// var path = require('path');
// //configure app to use session
// var session = require('express-session');
// //allows extraction of form data
// var bodyParser = require('body-parser');
// router.use(bodyParser.json());
// router.use(express.urlencoded({extended: false}));
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

// //register session to app
// router.use(session(
//         {
//             secret:"67i66igfi6&*6i%$&%^&U",
//             resave: true,
//             saveUninitialized: true
//         }
// ));

// router.use(express.static(path.join(__dirname, 'public')));

// // how to associate specific database
// mongoose.connect('mongodb://localhost/groupmeet',
// {
//     useCreateIndex: true,
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// // Get login page
// router.get('/',(request,response,next) => {
//   response.sendFile(path.resolve('./views/login.html'));
// });

// // //get specific username
// // router.get('/',(req, res, next) => {
// //   User.find().select('username password _id').exec().then(docs => {
// //     res.status(200).json({
// //       count: docs.length,
// //       orders: docs.map(doc => {
// //         return {
// //           _id: doc._id,
// //           username: doc.username,
// //           password: doc.password,
// //           request: {
// //             type: "GET",
// //             url: "http://localhost:8080/register/" + doc._id
// //           }
// //         };
// //       })
// //     });
// //   })
// //   .catch(err => {
// //     res.status(500).json({
// //       error: err
// //     });
// //   })
// // });

// router.post('/signup', (req, res, next) => {
//   User.find({username: req.body.username})
//   .exec()
//   .then(user => {
//     if(user.length >= 1){
//       return res.status(409).json({
//         message: 'Username exists'
//       });
//     } else {
//       bcrypt.hash(req.body.password, 10, (err,hash) => {
//         if(err) {
//           return res.status(500).json({
//             error: err
//           });
//         } else {
//           const user = new User ({
//             _id: new mongoose.Types.ObjectId(),
//             username: req.body.username,
//             password: hash
//           });
//           user.save()
//           .then(result => {
//             res.status(201).json({
//               message: 'User created'
//             });
//           })
//           .catch(err => {
//             console.log(err);
//             res.status(500).json({
//               error: err
//             });
//           });
//         }
//       })
//     }
//   });
// }); //end signup


// //login user
// router.post('/login', (req,res, next) => {
//     //specify user to find by username and password
//     User.find({username: req.body.username})
//     .exec()
//     .then(user => {
//       if (user.length < 1){
//         return res.status(401).json({
//           message: 'Authorization failed 1'
//         }); // end if 'user not found'
//       } //end if(user.length <1)
//       bcrypt.compare(req.body.password, user[0].password, (err,result) => {
//         if (err){
//           return res.status(401).json({
//             message: 'Authorization failed 2'
//           }); // end if 'user not found'
//         } //end if(err)

//         if (result){
//           const token = jwt.sign({ username: user[0].username, userId: user[0]._id},
//           // process.env.JWT_KEY,
//           "secret", //THIS SHOULD BE CHANGED TO PULL FROM A NODEMON.JSON FILE BUT I CANT GET IT TO WORK RIGHT NOW, LINE ABOVE THIS NEEDS TO WORK
//           {
//             expiresIn: "1h"
//           }
//         );
//           return res.status(200).json({
//             message: 'Successful login',
//             token: token
//           }); // end success message
//         } //end if(result)
//         res.status(401).json({
//           message: "Auth failed"
//         });

//       }); //end bcrypt password comparison
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       }); // end catch json return data
//     }); //end catch
// }); //end login

// //logout user
// router.get('logout',function(request,response){
//     request.session.destroy();
//     return status(200).send();
// }); //end logout

// //gets all users and reads all saved data in databse with empty object check
// router.get('/getUsers', function(request,response){
//     User.find({}, function(err,foundData){
//         if(err){
//             console.log(err);
//             response.status(500).send();
//         }else{
//             if(foundData.length === 0){
//                 var responseObject = undefined;
//                 responseObject = {count:0};
//                 response.status(404).send(responseObject);
//             } else{
//                 var responseObject = foundData;
//                 console.log("reached here");
//                 response.send(responseObject);
//             }
//         }
//     });
// }); //end get all users

// //get specific user
// router.get("/:user_id", (req, res, next) => {
//   User.findById(req.params.user_id)
//     .exec()
//     .then(user => {
//       if (!user) {
//         return res.status(404).json({
//           message: "User not found"
//         });
//       }
//       res.status(200).json({
//         //show all users
//         user: user,
//         request: {
//           type: "GET",
//           url: "http://localhost:3000/register/getUsers"
//         }
//       });
//     })
//     .catch(err => {
//       res.status(500).json({
//         error: err
//       }) ;
//     });
// });  // end get specific user

// // delete specific user
// router.delete("/:user_id", (req, res, next) => {
//   User.remove({ _id: req.params.user_id })
//   .exec()
//   .then(result => {
//     res.status(200).json({
//       message: 'Order deleted',
//       request: {
//         type: "POST",
//         url: "http://localhost8080:/register/getUsers",
//         body: { user_id: 'user_id', username: 'username'}
//       }
//     });
//   })
//   .catch(err => {
//     res.status(500).json({
//       error: err
//     });
//   });
// }); // end delete specific user


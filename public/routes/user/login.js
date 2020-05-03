const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
var User = require("../../models/user");
//configure app to use session
var expressSession = require('express-session');
router.use(bodyParser.urlencoded({extended: true}));

//register session to app
router.use(expressSession(
        {
            secret:"67i66igfi6&*6i%$&%^&U",
            resave: false,
            saveUninitialized: false
        }
));

//   /user/login
router.post('/login',function(request,response){
    console.log("/login reached:" + request.body.email)
    var email = request.body.email;
    var password = request.body.password;
    //specify user to find by email and password
    User.findOne({email: email, password: password}, function(err, user){
         //user doesnt exist
       if(!user) {
           return response.status(404).send(`incorrect credentials!`);
       } //user exists

       if(err) {
           //error found, log error
           console.log(err);
           return response.status(500).send(`incorrect credentials!`);
       }
       //set logged in user session
       // below needs to be uncommented so that sessions can be set, maybe this needs to be put somewhere else
       global.fullName = user['firstName'] + ' ' + user['lastName'];
       global.firstName = user['firstName'];
       global.lastName = user['lastName'];
       global.email = user['email']
       // console.log(request.session.fullName);
       // after logged in
       global.userId = user["_id"].toString();
       global.userPic = "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Green_equilateral_triangle_point_up.svg/1200px-Green_equilateral_triangle_point_up.svg.png"//"https://res.cloudinary.com/dk-find-out/image/upload/q_80,w_960,f_auto/sphere_n69vel.png"
       return response.status(200).redirect(("/dashboard"));
    });
});

module.exports = router

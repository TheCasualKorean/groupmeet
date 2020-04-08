var User = require('./lib/User'); //correct file path.
////require the express library
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
//allows extraction of form data
var bodyParser = require('body-parser');
//configure app to use session
var expressValidator = require('express-validator');
//configure app to use session
var expressSession = require('express-session');
var hbs = require('express-handlebars');

const register = require('./routes/register.js');



//__MAYBE I NEED THESE FEW LINES????_______________________________________
//set up a port
const port = process.env.PORT || 8080;
//import mongo
const testMongo = require('./routes/mongo');
//import the index route, CHANGED TO LOGINPAGE.JS
//const index = require('./routes/index.js');
//import the login route
// tests to see if adding to db is possible
testMongo.testAddToDB();
//____________________________________________


var app = express();

//// view engine setup ******************FOR AFTER DECISION OF TEMPLATE, NEXT 2 LINES
//app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views'}));
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//register session to app
app.use(expressSession(
        {
            secret:"67i66igfi6&*6i%$&%^&U",
            resave: false,
            saveUninitialized: false
        }
));

//Route Specification
//specifying the static route
app.use('/assets', express.static('assets'));
//link to the registration route
app.use('/register', register);
//link to the login route
app.use('/login', register);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handlers

//// development error handler
//// will print stacktrace
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//      message: err.message,
//      error: err
//    });
//  });
//}
//
//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.render('error', {
//    message: err.message,
//    error: {}
//  });
//});




// mongoose connoection*************IS THIS NEEDED HERE OR DO WE C0NNECT THROUGH REQUESTS???
const mongoose = require('mongoose');
// how to associate specific database
mongoose.connect('mongodb://localhost/groupmeet',
{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;

//for testing test database
const UserSchema = new Schema({
    firstname: String,
    lastname: String
});

//for testing groupmeet database
const userSchema2 = new Schema({
    username: {type: String, unique: true},
    password: {type: String},
    firstname: String,
    lastname: String
});

//for testing test database
//var UserModel = mongoose.model('test', UserSchema);
//
//for testing test database, string param is what database to use, in mongo shell, 'test' becomes 'tests', so use cmd db.tests.findOne()
var UserModel = mongoose.model('usermodel', userSchema2);

//setup preloaded users version
var UserModel2 = mongoose.model('preloadedUser', userSchema2);

//default route for the landing page
app.get('/', function(request, response) {
      // [RELOAD USERS, DELETE LATER?
//    var users = [
//        {_id: 1, username: "matt1", password: "1234", firstname: "m1", lastname: "m1"},
//        {_id: 2,username: "rob2", password: "1234", firstname: "r2", lastname: "b2"}
//    ];
//
//    User.collection.insertMany(users, function (err, docs) {
//          if (err){
//              return console.error(err);
//          } else {
//            console.log("Multiple documents inserted to Collection");
//          }
//        });
//        //send to landing page
    response.sendFile(__dirname + '/views/landing.html');
});

//app.get('/login', function(request, response) {
//    response.sendFile(path.join(__dirname + '/views/login.html'));
//});

//default route for the landing page
app.get('/dashboard', (request, response) => {
    response.sendFile(__dirname + "/views/dashboard.html");
});

// robs practice
app.get('/dbtest', function(request,response){
//    var responseObject = {message:"hello"};
//    response.send(responseObject);
   response.sendFile(__dirname + '/views/dbtestpage.html');
});

//TESTACTION add user individual user to test db
app.post('/addname/:firstname/:lastname', function(request, response){

    var first = request.params.firstname;
    var last = request.params.lastname;
    var user = new User();
    user.firstname = first;
    user.lastname = last;
    user.save(function(err,savedObject){
            if(err){
                console.log(err);
                response.status(500);
            } else{
                response.send(savedObject);
            }
    });
});




//TESTACTION read all saved data in databse with empty object check, currently working and set to test db
app.get('/likes', function(request,response){
    UserModel.find({}, function(err,foundData){
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
});

//TESTACTION read all saved data in databse error check, currently working and set to test db
app.get('/readall', function(request,response){  // YOU HAVE THIS CHECKING GROUPMEET DB FOR COLLECTION groupmeet that has stored USER MODELS
    User.find({}, function(err,foundData){
        if(err){
            var responseObject = undefined;
            console.log(err);
            response.status(404).send(responseObject);
        }else{
        var responseObject = foundData;
        response.send(responseObject);
        }
    });
});

//TESTACTION remove all data from test db
app.get('/deleteall', function(request,response){
    UserModel.find({}, function(err,foundData){
        UserModel.deleteMany(function(err){
            if(err){
            console.log(err);
            }
        });
    });
});

//initialize and listen on a port
app.listen(port, () => {
    console.log(`App has started and is listening on port ${port}`);
});


// ??????????
//module.exports = app;

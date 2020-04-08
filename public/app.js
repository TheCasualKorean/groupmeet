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
//set up a port
const port = process.env.PORT || 8080;
//import mongo
const testMongo = require('./routes/mongo');
var app = express();

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

// mongoose connoection*************IS THIS NEEDED HERE OR DO WE C0NNECT THROUGH REQUESTS???
const mongoose = require('mongoose');
// how to associate specific database
mongoose.connect('mongodb://localhost/groupmeet',
{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//default route for the landing page
app.get('/', function(request, response) {
//        //send to landing page
    response.sendFile(__dirname + '/views/landing.html');
});

//default route for the landing page
app.get('/dashboard', (request, response) => {
    response.sendFile(__dirname + "/views/dashboard.html");
});

//initialize and listen on a port
app.listen(port, () => {
    console.log(`App has started and is listening on port ${port}`);
});

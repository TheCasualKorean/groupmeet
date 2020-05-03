
var express = require('./node_modules/express');
var path = require('path');
var app = express();

require("./public/routes")(app);

var logger = require('./node_modules/morgan');
var cookieParser = require('./node_modules/cookie-parser');
//allows extraction of form data
var bodyParser = require('./node_modules/body-parser');
//configure app to use session
var expressValidator = require('./node_modules/express-validator');
//configure app to use session
var expressSession = require('./node_modules/express-session');


// const register = require('./public/routes/register.js');

global.fullName = "Not Signed In";
global.firstName = "Not Signed In";
global.lastName = "Not Signed In";
global.userId = "Not Signed In";
global.userPic = "Not Signed In";
global.groupName = "Not Signed In";
global.groupMembers = "Not Signed In";
global.groupMeetings = "Not Signed In";
global.groupTasks = "Not Signed In";
global.groupComments = "Not Signed In";
global.groupUrls = "Not Signed In";

//__MAYBE I NEED THESE FEW LINES????_______________________________________
//set up a port
const port = process.env.PORT || 8080;
//import mongo
const mongo = require('./public/routes/mongo');

// tests to see if adding to db is possible
mongo.connectToDB();
//____________________________________________
app.set('view engine', 'ejs');


app.use(express.static(path.join(__dirname, 'public')));


app.get('/', function(request, response) {

    response.sendFile(__dirname + '/public/views/landing.html');
});

app.get('/sign-out', function(request, response) {
    global.fullName = "Not Signed In";
    global.userId = "Not Signed In";
    response.redirect("/");
});

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
// app.use('/register', register);
//link to the login route
//app.use('/login', register);
app.get('/login',(request,response,next) => {
  response.sendFile(__dirname + '/public/views/login.html');
});
app.get('/register',(request,response,next) => {
    response.sendFile(__dirname + '/public/views/register.html');
  });

//default route for the landing page
app.get('/', function(request, response) {
    response.sendFile(__dirname + '/public/views/landing.html');
});

app.get('/addNewTask', function(request,response) {
  response.render(__dirname + '/public/views/addTaskModal.ejs');
});

app.get('/updateTask', function(request, response) {
  response.sendFile(__dirname + '/public/views/updateTaskModal.html');
})

app.get('/editAvailability', function(request,response) {
  response.sendFile(__dirname + '/public/views/editAvailabilityModal.html');
});

app.get('/addGroup', function(request,response) {
  response.sendFile(__dirname + '/public/views/addGroupModal.html');
});

app.get('/requestMeeting', function(request,response) {
    response.render(__dirname + '/public/views/requestMeetingModal.ejs');
});

//default route for the landing page
// app.get('/dashboard', function(request, response) {
//     response.render('dashboard');
// });
var User = require("./public/models/user");
var Group = require("./public/models/group");
function getGroupButtons(req,res,path) {

    if(global.userId != "Not Signed In"){
        //https://stackoverflow.com/questions/29078753/how-to-reference-another-schema-in-my-mongoose-schema
        // using the user's id we will find the groups
        User.findOne({_id: global.userId}).populate('groups').exec(function(error,user){
            if(error){
                console.log(error + global.userId);
                return res.status(500).send();
            }
            else {
                var userGroups = user["groups"]
                console.log("Groups: " + userGroups)
            return res.status("200").render(__dirname + path, {groups: userGroups});
        // response.render(__dirname + '/public/views/dashboard');//delete this after everything else in this GET is uncommented
        
        }
        });
    }   
    else{
        return res.status("200").render(__dirname + path)
    }
}
app.get('/dashboard', function(request, response) {
   
    //THIS ALL WORKS IT IS JUST COMMENTED OUT SINCE LOGIN IS NOT IMPLEMENTED YET
    //Move this to the navigation partial.
   getGroupButtons(request, response,'/public/views/dashboard')
       console.log(global.userId);
   
});

app.get('/groupdashboard', function(request, response) {
    getGroupButtons(request, response,'/public/views/groupdashboard')
    // response.render(__dirname + '/public/views/groupdashboard');
});


app.get('/MyAvailability', function(request, response) {
    getGroupButtons(request, response,'/public/views/MyAvailability')
    // response.render(__dirname + '/public/views/MyAvailability');
});

app.get('/MyAccount', function(request, response) {
    getGroupButtons(request, response, '/public/views/MyAccount');
});

app.get('/groupSettings', function(request, response) {
  getGroupButtons(request, response, '/public/views/groupSettings');
})

app.get('/meetingTimes', function(request, response) {
  getGroupButtons(request, response, '/public/views/meetingManager');
})

app.get('/taskManager', function(request, response) {
  getGroupButtons(request, response, '/public/views/taskManager');
})

app.get('/updateTask/:taskId', function(request, response) {
    global.taskId = request.params.taskId
    getGroupButtons(request, response, '/public/views/updateTaskModal', {taskId: request.params.taskId});
  })


//initialize and listen on a port
app.listen(port, () => {
    console.log(`App has started and is listening on port ${port}`);
    console.log(`http://localhost:${port}`);
    console.log(`https://groupmeet-capstone.herokuapp.com/`);
    console.log('connecting to mongoDB...')
});

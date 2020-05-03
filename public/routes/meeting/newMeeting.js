const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// "/meeting/newMeeting"
var Meeting = require("../../models/meeting");
var Group = require("../../models/group");
router.use(bodyParser.urlencoded({extended: true}));


const getGroupFunction = require('../group/getGroupFunction');

router.post('/newMeeting',function(request,response){
   // console.log(request.body.groupId)   
   var tAttendees = ""

   
    console.log(request.body.requestJoin)
    if(Array.isArray(request.body.requestJoin)){
        var c = 0;
        request.body.requestJoin.forEach(element => {
        console.log(element)
        if (c != 0){
            tAttendees += ", "
        }
        tAttendees += element
        c++
    });
    } else {
        tAttendees = request.body.requestJoin
    }
    
   var newMeeting = new Meeting({
       creatorName: request.body.fullName,
       meetingName: request.body.meetingName,
       location: request.body.location,
       meetingTime: request.body.idate + " " + request.body.itime, 
       attendees: tAttendees
   });

   // logic to find the current group and insert it into the Meetings array
   // the answer with 35 upvotes https://stackoverflow.com/questions/33049707/push-items-into-mongo-array-via-mongoose
     Group.updateOne({_id: request.body.groupId}, { $push: { meetings: newMeeting  } } , function(error,success){
       if(error){
           console.log(error+ request.body.groupId);
           return response.status(500).send();
       }
     
   });

    Meeting.collection.insertOne(newMeeting,function(err,success){
        if(err){
            console.log(err);
            return response.status(500).send();
        }   
    console.log(`Meeting: "${newMeeting.text}" added!`);
    getGroupFunction.getGroupFunc();
    return response.status(200).redirect("/meetingTimes");
        
    });
});

module.exports = router
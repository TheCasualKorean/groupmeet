const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// "/task/newTask"
var Task = require("../../models/task");
var Group = require("../../models/group");
router.use(bodyParser.urlencoded({extended: true}));

router.post('/newTask',function(request,response){
   // console.log(request.body.groupId)   
   
   var newTask = new Task({
       taskName: request.body.taskName,
       creatorId: request.body.creatorId,
       //group:, //might not need as it would just be in the group's array...
       status: "incomplete",
       description: request.body.description,
   });

   // logic to find the current group and insert it into the Tasks array
     Group.updateOne({_id: request.body.groupId}, { $push: { tasks: newTask  } } , function(error,success){
       if(error){
           console.log(error+ request.body.groupId);
           return response.status(500).send();
       }
      response.send(`Task: "${newTask.description}" added!`);     
      console.log(`Task: "${newTask.description}" added!`);
       return response.status(200).send();
   });
});

module.exports = router
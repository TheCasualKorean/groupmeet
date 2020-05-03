//This Function updates the group's Information

const getGroupFunc = () => {
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

var Group = require("../../models/group");

router.use(bodyParser.urlencoded({extended: true}));

Group.findOne({_id: global.groupId}).populate("members").populate("comments").populate("meetings").populate("tasks").populate("urls").exec(function(error,group){
       
            var name = group["groupName"]
            var members = group["members"]
            var comments = group["comments"]
            var meetings = group["meetings"]
            var tasks = group["tasks"]
            var urls = group["urls"]

            //set a session for the group and parts
            //Commented out because I am using postman and it wont work with it
            // sessionStorage.setItem('groupName', group["groupName"])
            // sessionStorage.setItem('members', group["members"])
            // sessionStorage.setItem('comments', group["comments"])
            // sessionStorage.setItem('tasks', group["tasks"])

            global.groupName = name;
            global.groupId = group["_id"];
            global.groupMembers = members
            global.groupMeetings = meetings
            global.groupTasks = tasks
            global.groupComments = comments
            global.groupUrls = urls
            // console.log(global.groupName)
            // console.log(global.groupId)
            // console.log(global.groupMembers)
            // console.log(global.groupMeetings)
            // console.log(global.groupTasks)
            // console.log(global.groupComments)
            // console.log(global.groupUrls)
            
            // console.log(`\ngroupName: ${name}\n\nmembers: ${members}\n\ncomments: ${comments}\n\nmeetings: ${meetings}\n\ntasks: ${tasks}\n\ntasks: ${urls}`)
    // return response.status(200).redirect(("/groupdashboard"))
        });
  };
  
  exports.getGroupFunc = getGroupFunc;
  
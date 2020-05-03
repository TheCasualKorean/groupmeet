const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

// "/url/newUrl"
var Url = require("../../models/url");
var Group = require("../../models/group");

const getGroupFunction = require('../group/getGroupFunction');


router.use(bodyParser.urlencoded({extended: true}));

router.post('/newUrl',function(request,response){
   // console.log(request.body.groupId)   
   var result="";
    const date = new Date();
    const month = date.toLocaleString('default', { month: 'long' });
    var d = new Date();
    result += month + " " + ("0" + d.getDate()).slice(-2) + " " + d.getFullYear() +
    " "+ d.getHours()+":"+d.getMinutes();
   var newUrl = new Url({
       creatorName: global.fullName,
       //group:, //might not need as it would just be in the group's array...
       created: result,
       text: request.body.text,
   });

   // logic to find the current group and insert it into the Urls array
   // the answer with 35 upvotes https://stackoverflow.com/questions/33049707/push-items-into-mongo-array-via-mongoose
     Group.updateOne({_id: request.body.groupId}, { $push: { urls: newUrl  } } , function(error,success){
       if(error){
           console.log(error+ request.body.groupId);
           return response.status(500).send();
       }
      
       
   });

    Url.collection.insertOne(newUrl,function(err,savedGroup){
        if(err){
            console.log(err);
            return response.status(500).send();
        }
       
        getGroupFunction.getGroupFunc();    
      console.log(`Url: "${newUrl.text}" added!`);
      return response.status(200).redirect("/groupDashboard");
        
    });
});

module.exports = router
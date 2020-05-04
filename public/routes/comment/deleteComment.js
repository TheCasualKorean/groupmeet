const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');

var Comment = require("../../models/comment");
var Group = require("../../models/group");


const getGroupFunction = require('../group/getGroupFunction');

router.use(bodyParser.urlencoded({extended: true}));

// "/comment/deleteComment/"
router.get('/deleteComment/:commentId',function(request,response){
    console.log(`Deleting Comment with commentId: ${request.params.commentId}`)
    Comment.deleteOne({_id: request.params.commentId}, function(error,success){
        if(error){
            console.log(error);
            return response.status(500).send();
        }

       console.log(`Comment: ${request.params.commentId} removed!`);


              getGroupFunction.getGroupFunc();
              return response.status(200).redirect("/groupDashboard");

     });
});

module.exports = router

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    creatorName: String ,//{type: Schema.Types.ObjectId, ref: 'User'},
    //group: Group, // not really needed since it is just being pushed to the particular group's comment array
    created: String,// {type: Date, default: Date.now},
    //isReplyTo: {type: Schema.Types.ObjectId, ref: 'Comment'},
    text: String

})

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment
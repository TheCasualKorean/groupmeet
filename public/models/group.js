const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GroupSchema = new Schema({
    groupName: String,
    //founder:{ type: User or Schema.Types.ObjectId, ref: 'User'},
    members: [{type: Schema.Types.ObjectId, ref: 'User'}],
    meetings: [{type: Schema.Types.ObjectId, ref: 'Meeting'}],
    comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}],
    urls: [{type: Schema.Types.ObjectId, ref: 'Url'}],
    tasks: [{type: Schema.Types.ObjectId, ref: 'Task'}],
    //image will be a file
    //groupImage: String,
    // No more files files: Array
        
})

const Group = mongoose.model('Group', GroupSchema);

module.exports = Group
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MeetingSchema = new Schema({
    meetingName: String,
    //group: { type: Schema.Types.ObjectId, ref: 'Group'},
    creatorName: String,
    location: String,
    attendees: String,
    meetingTime: String

})

const Meeting = mongoose.model('Meeting', MeetingSchema);

module.exports = Meeting
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UrlSchema = new Schema({
    creatorName: String ,//{type: Schema.Types.ObjectId, ref: 'User'},
    //group: Group, // not really needed since it is just being pushed to the particular group's Url array
    created: String, //{type: Date, default: Date.now},
    //isReplyTo: {type: Schema.Types.ObjectId, ref: 'Url'},
    text: String

})

const Url = mongoose.model('Url', UrlSchema);

module.exports = Url
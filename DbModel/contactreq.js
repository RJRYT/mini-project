const mongo = require('mongoose');

const Schema = new mongo.Schema({
    name: String,
    email: String,
    number: Number,
    subject: String,
    message: String
},{timestamps: true});

module.exports = mongo.model("contactreq", Schema);
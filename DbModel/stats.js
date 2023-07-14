const mongo = require('mongoose');

const Schema = new mongo.Schema({
    Users: Number,
    Categories: Number,
    Tests: Number,
    Appoinments: Number,
    Results: Number,
    LabAssistants: Number
});

module.exports = mongo.model("stats", Schema);
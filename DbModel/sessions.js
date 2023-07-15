const mongo = require('mongoose');

const Schema = new mongo.Schema({}, {strict: false});

module.exports = mongo.model("sessions", Schema);
const mongo = require('mongoose');

const Schema = new mongo.Schema({
    ID:{
        type: String,
        required: true,
        unique: true,
    },
    UserId:{
        type: String,
        required: true
    },
    TestId:{
        type: String,
        required: true
    },
    Report:{
        type: String,
        required: false,
        default: null
    },
    Remarks:{
        type: String,
        required: false,
        default: null
    }
},{timestamps: true});

module.exports = mongo.model("results", Schema);
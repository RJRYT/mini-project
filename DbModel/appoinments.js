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
    Date:{
        type: Date,
        required: true
    },
    Time:{
        type: String,
        required: true
    },
    Hour:{
        type: String,
        required: true
    },
    Status:{
        type: Number,
        required: true,
        default: 1
    },
    TransactionId:{
        type: String,
        required: true
    },
    Amount:{
        type: Number,
        required: true
    },
    Report:{
        type: String,
        required: false,
        default: null
    }
},{timestamps: true});

module.exports = mongo.model("appoinments", Schema);
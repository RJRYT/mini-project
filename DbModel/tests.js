const mongo = require('mongoose');

const Schema = new mongo.Schema({
    ID:{
        type: String,
        required: true,
        unique: true,
    },
    Name:{
        type: String,
        required: true,
        default: "None"
    },
    Category:{
        type: String,
        required: true,
        default: "None"
    },
    Description:{
        type: String,
        required: true,
        default: "None"
    },
    Price:{
        type: Number,
        required: true,
        default: 0
    },
    Status:{
        type: Number,
        required: true,
        default: 1
    }
},{timestamps: true});

module.exports = mongo.model("tests", Schema);
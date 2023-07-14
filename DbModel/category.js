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
    Description:{
        type: String,
        required: true,
        default: "None"
    },
},{timestamps: true});

module.exports = mongo.model("category", Schema);
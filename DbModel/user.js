const mongo = require('mongoose');

const Schema = new mongo.Schema({
    FirstName: {
        type: String,
        required: true,
        default: null
    },
    LastName: {
        type: String,
        required: true,
        default: null
    },
    Password: {
        type: String,
        required: true,
        default: null
    },
    Email: {
        type: String,
        required: true,
        default: null
    },
    Admin: {
        type: Boolean,
        required: true,
        default: false
    },
    Setuped: {
        type: Boolean,
        required: false,
        default: false
    },
    Gender: {
        type: String,
        required: false,
        default: ""
    },
    Dob: {
        type: String,
        required: false,
        default: ""
    },
    Age: {
        type: Number,
        required: false,
        default: null
    },
    Blood: {
        type: String,
        required: false,
        default: ""
    },
    Height: {
        type: Number,
        required: false,
        default: null
    },
    Weight: {
        type: Number,
        required: false,
        default: null
    },
    Number: {
        type: Number,
        required: false,
        default: null
    },
    Address: {
        type: String,
        required: false,
        default: ""
    },
    ProfilePic: {
        type: String,
        required: false,
        default: ""
    },
    Staff: {
        type: Boolean,
        required: false,
        default: false
    },
},{timestamps: true});

module.exports = mongo.model("user", Schema);
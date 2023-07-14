const express = require('express');
router = express.Router();
const UserDB = require('../DbModel/user');
const Category = require('../DbModel/category');
const Test = require('../DbModel/tests');
const Appoinment = require('../DbModel/appoinments');
const AppStats = require('../DbModel/stats');

router.get('/',async function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else if(!req.session.user.Admin) res.status(403).json({"status":403,"message":"You are not authosrised"})
    else {
        let Stats = await AppStats.findOne({});
        res.render('admin/home', {name: req.session.username, user: req.session.user, dev: process.env.DEV, stats: Stats});
    }
});

router.get('/tests', async function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else if(!req.session.user.Admin) res.status(403).json({"status":403,"message":"You are not authosrised"})
    else {
        const TestList = await Test.find({});
        const CategoryList = await Category.find({});
        TestList.forEach(item => {
            item.Category = CategoryList.find(cat => cat.ID == item.Category).Name;
        })
        res.render('admin/tests', {name: req.session.username, user: req.session.user, dev: process.env.DEV, test: TestList, category: CategoryList});
    }
});

router.get('/category', async function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else if(!req.session.user.Admin) res.status(403).json({"status":403,"message":"You are not authosrised"})
    else {
        const CategoryList = await Category.find({});
        res.render('admin/category', {name: req.session.username, user: req.session.user, dev: process.env.DEV, category: CategoryList});
    }
});

router.get('/results', async function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else if(!req.session.user.Admin) res.status(403).json({"status":403,"message":"You are not authosrised"})
    else {
        let id = null;
        if(req.query && req.query.id){
            id = req.query.id;
        }
        res.render('admin/results', {name: req.session.username, user: req.session.user, dev: process.env.DEV, id: id});
    }
});

router.get('/appoinments', async function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else if(!req.session.user.Admin) res.status(403).json({"status":403,"message":"You are not authosrised"})
    else {
        let BookingData = [];
        BookingData = await Appoinment.find({});
        const DateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        for (let item = 0; item < BookingData.length; item++) {
            BookingData[item].Time = BookingData[item].Date.toLocaleDateString('en-US', DateOptions)+" "+TimeData[BookingData[item].Time].Time.find(i => i.ID == BookingData[item].Hour).Name;
            BookingData[item].Hour = BookingData[item].createdAt.toLocaleDateString('en-US', DateOptions);
            BookingData[item].User = {};
            const temp = await UserDB.findOne({"_id":BookingData[item].UserId});
            BookingData[item].User = temp;
        }
        BookingData.sort((a, b) =>(a.Status>b.Status)?1:(a.Status<b.Status)?-1:0);
        res.render('admin/appoinments', {name: req.session.username, user: req.session.user, dev: process.env.DEV, data: BookingData});
    }
});
router.get('/appoinments/:id', async function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else if(!req.session.user.Admin) res.status(403).json({"status":403,"message":"You are not authosrised"})
    else {
        if(!req.params) return res.render('admin/404', {name: req.session.username, user: req.session.user, image: req.session.user.ProfilePic || "defaultpic.png"});
        if(!req.params.id) return res.render('admin/404', {name: req.session.username, user: req.session.user, image: req.session.user.ProfilePic || "defaultpic.png"});
        var BookingData = await Appoinment.findOne({"ID":req.params.id});
        if(!BookingData) return res.render('admin/404', {name: req.session.username, user: req.session.user, image: req.session.user.ProfilePic || "defaultpic.png"});
        const DateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        BookingData.Time = BookingData.Date.toLocaleDateString('en-US', DateOptions)+" "+TimeData[BookingData.Time].Time.find(i => i.ID == BookingData.Hour).Name;
        BookingData.Hour = BookingData.createdAt.toLocaleDateString('en-US', DateOptions);
        const TestList = await Test.findOne({"ID": BookingData.TestId});
        BookingData.TestId = TestList.Name;
        const Patient = await UserDB.findOne({"_id":BookingData.UserId});
        res.render('admin/appoinmentinfo', {name: req.session.username, user: req.session.user, dev: process.env.DEV, data: BookingData, patient: Patient});
    }
});
const TimeData = {
    "morning": {
        "Time": [
            {
                "ID": "8:00to10:00",
                "Name": "8:00 AM to 10:00 AM"
            },
            {
                "ID": "10:00to12:00",
                "Name": "10:00 AM to 12:00 PM"
            }
        ],
        "Name": "Morning"
    },
    "afternoon": {
        "Time": [
            {
                "ID": "1:30to2:30",
                "Name": "1:30 PM to 2:30 PM"
            },
            {
                "ID": "2:30to3:30",
                "Name": "2:30 PM to 3:30 PM"
            }
        ],
        "Name": "After Noon"
    },
    "evening": {
        "Time": [
            {
                "ID": "4:00to6:00",
                "Name": "4:00 PM to 6:00 PM"
            },
            {
                "ID": "6:30to8:00",
                "Name": "6:30 PM to 8:00 PM"
            },
            {
                "ID": "8:30to10:00",
                "Name": "8:30 PM to 10:00 PM"
            }
        ],
        "Name": "Evening"
    }
};
router.use(function (req, res) {
    return res.status(404).render('admin/404', {name: req.session.username, user: req.session.user, image: req.session.user.ProfilePic || "defaultpic.png"});
});
router.use(async function (err, req, res, next) {
    if (!err) {
        return next();
    }
    console.log("[ERROR]: Error on path:", req._parsedUrl.pathname);
    console.log('[ERROR]: Error from admin module');
    console.log(err, err.stack);
    return res.status(500).render('admin/500', {name: req.session.username, user: req.session.user, image: req.session.user.ProfilePic || "defaultpic.png"});
});
module.exports = router;
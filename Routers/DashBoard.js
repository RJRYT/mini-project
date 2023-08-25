const express = require('express');
router = express.Router();
const Appoinment = require('../DbModel/appoinments');
const Test = require('../DbModel/tests');
const Reports = require('../DbModel/results');

router.get('/', function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else if (req.session.user.Admin) res.status(403).json({ "status": 403, "message": "You are not authosrised" })
    else if (req.session.user.Staff) res.status(403).json({ "status": 403, "message": "You are not authosrised" })
    else {
        res.render('userdashboard/home', {name: req.session.username, user: req.session.user, image: req.session.user.ProfilePic || "defaultpic.png", dev: process.env.DEV});
    }
});

router.get('/contact', function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
        else if (req.session.user.Admin) res.status(403).json({ "status": 403, "message": "You are not authosrised" })
    else if (req.session.user.Staff) res.status(403).json({ "status": 403, "message": "You are not authosrised" })
    else {
        res.render('userdashboard/contact', {name: req.session.username, user: req.session.user, image: req.session.user.ProfilePic || "defaultpic.png", dev: process.env.DEV});
    }
});

router.get('/profile', function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
        else if (req.session.user.Admin) res.status(403).json({ "status": 403, "message": "You are not authosrised" })
    else if (req.session.user.Staff) res.status(403).json({ "status": 403, "message": "You are not authosrised" })
    else {
        res.render('userdashboard/profile', {name: req.session.username, user: req.session.user, image: req.session.user.ProfilePic || "defaultpic.png", dev: process.env.DEV});
    }
});

router.get('/booking', async function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
        else if (req.session.user.Admin) res.status(403).json({ "status": 403, "message": "You are not authosrised" })
    else if (req.session.user.Staff) res.status(403).json({ "status": 403, "message": "You are not authosrised" })
    else {
        const BookingData = await Appoinment.find({"UserId":req.session.user._id});
        const DateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        BookingData.forEach(item => {
            item.Time = item.Date.toLocaleDateString('en-US', DateOptions)+" "+TimeData[item.Time].Time.find(i => i.ID == item.Hour).Name
            item.Hour = item.createdAt.toLocaleDateString('en-US', DateOptions);
        })
        res.render('userdashboard/booking', {
            name: req.session.username, 
            user: req.session.user, 
            image: req.session.user.ProfilePic || "defaultpic.png", 
            dev: process.env.DEV,
            data: BookingData
        });
    }
});

router.get('/booking/:id', async function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
        else if (req.session.user.Admin) res.status(403).json({ "status": 403, "message": "You are not authosrised" })
    else if (req.session.user.Staff) res.status(403).json({ "status": 403, "message": "You are not authosrised" })
    else {
        if(!req.params) return res.render('userdashboard/404', {name: req.session.username, user: req.session.user, image: req.session.user.ProfilePic || "defaultpic.png"});
        if(!req.params.id) return res.render('userdashboard/404', {name: req.session.username, user: req.session.user, image: req.session.user.ProfilePic || "defaultpic.png"});
        var BookingData = await Appoinment.findOne({"UserId":req.session.user._id, "ID":req.params.id});
        if(!BookingData) return res.render('userdashboard/404', {name: req.session.username, user: req.session.user, image: req.session.user.ProfilePic || "defaultpic.png"});
        const DateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        BookingData.Time = BookingData.Date.toLocaleDateString('en-US', DateOptions)+" "+TimeData[BookingData.Time].Time.find(i => i.ID == BookingData.Hour).Name;
        BookingData.Hour = BookingData.createdAt.toLocaleDateString('en-US', DateOptions);
        const TestList = await Test.findOne({"ID": BookingData.TestId});
        BookingData.TestId = TestList.Name;
        res.render('userdashboard/bookingInfo', {
            name: req.session.username, 
            user: req.session.user, 
            image: req.session.user.ProfilePic || "defaultpic.png", 
            dev: process.env.DEV,
            data: BookingData,
            Status: BookingData.Status
        });
    }
});

router.get('/result', async function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
        else if (req.session.user.Admin) res.status(403).json({ "status": 403, "message": "You are not authosrised" })
    else if (req.session.user.Staff) res.status(403).json({ "status": 403, "message": "You are not authosrised" })
    else {
        const ResultList = await Reports.find({"UserId": req.session.user._id});
        const TestList = await Test.find({});
        let ResultSorted = [];
        const DateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        if(ResultList){
            ResultList.forEach((item) => {
                let Data = {};
                Data.ID = item.ID;
                Data.User = req.session.username;
                Data.Test = TestList.filter(i => i.ID == item.TestId)[0].Name;
                Data.Date = item.createdAt.toLocaleDateString('en-US', DateOptions);
                Data.Remark = item.Remarks;
                Data.Report = item.Report;
                ResultSorted.push(Data);
            })
            res.render('userdashboard/result', {name: req.session.username, user: req.session.user, image: req.session.user.ProfilePic || "defaultpic.png", dev: process.env.DEV, data: ResultSorted});
        } else res.render('userdashboard/result', {name: req.session.username, user: req.session.user, image: req.session.user.ProfilePic || "defaultpic.png", dev: process.env.DEV, data: ResultSorted});
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
    return res.status(404).render('userdashboard/404', {name: req.session.username, user: req.session.user, image: req.session.user.ProfilePic || "defaultpic.png"});
});
router.use(async function (err, req, res, next) {
    if (!err) {
        return next();
    }
    console.log("[ERROR]: Error on path:", req._parsedUrl.pathname);
    console.log('[ERROR]: Error from user module');
    console.log(err, err.stack);
    return res.status(500).render('userdashboard/500', {name: req.session.username, user: req.session.user, image: req.session.user.ProfilePic || "defaultpic.png"});
});
module.exports = router;
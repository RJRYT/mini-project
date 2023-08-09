const express = require('express');
router = express.Router();

const AppStats = require('../DbModel/stats');


router.use(function (req, res, next) {
    res.appendHeader("Cache-Control", "public, max-age=300");
    res.appendHeader("Pragma", "cache");
    res.appendHeader("Expires", "300");
    next();
});

router.get('/', async function (req, res) {
    if (!req.session.loggedIn)
        res.redirect('/auth/login')
    else if (!req.session.user.Admin && !req.session.user.Staff) res.status(403).json({ "status": 403, "message": "You are not authosrised" })
    else {
        let Stats = await AppStats.findOne({});
        res.render('assistant/home', { name: req.session.username, user: req.session.user, dev: process.env.DEV, stats: Stats });
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
    return res.status(404).render('assistant/404', { name: req.session.username, user: req.session.user, image: req.session.user.ProfilePic || "defaultpic.png" });
});
router.use(async function (err, req, res, next) {
    if (!err) {
        return next();
    }
    console.log("[ERROR]: Error on path:", req._parsedUrl.pathname);
    console.log('[ERROR]: Error from lab assistant module');
    console.log(err, err.stack);
    return res.status(500).render('assistant/500', { name: req.session.username, user: req.session.user, image: req.session.user.ProfilePic || "defaultpic.png" });
});

module.exports = router;
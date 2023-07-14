const express = require('express');
router = express.Router();
var passwordHash = require('password-hash');
const UserDB = require('../DbModel/user');
const AppStats = require('../DbModel/stats');
const rateLimit = require('express-rate-limit');

router.use(function (req, res, next) {
    res.appendHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.appendHeader("Pragma", "no-cache");
    res.appendHeader("Expires", "0");
    next();
});
const AuthLimiter = rateLimit({
    windowMs: 15*60*1000,
    max: 50,
    message: 'Too many requests from this ip. please try again after 15 minutes.'
});

router.use(AuthLimiter);

router.get('/', (req, res) => {
    return res.redirect('/auth/login');
});

router.get('/login', function (req, res) {
    if (req.session.loggedIn)
        res.redirect('/dashboard')
    else res.render('main/login', { query: req.query, dev: process.env.DEV })
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {if(!err) res.redirect('/')})
})

router.post('/signup', async function (req, res, next) {
    if (req.body.password != req.body.cpassword) return res.redirect('/auth/login?path=signup&err=passnotmatch');
    const user = await UserDB.findOne({ "Email": req.body.email });
    if (user) return res.redirect('/auth/login?path=signup&err=userexist');
    next();
}, (req, res) => {
    const newUser = new UserDB({
        "Email": req.body.email,
        "Password": passwordHash.generate(req.body.password),
        "FirstName": req.body.firstname,
        "LastName": req.body.lastname,
        "Admin": false
    });
    newUser.save(async (err, user) => {
        if (err) return res.redirect('/auth/login?path=signup&err=dberror');
        let Count = await AppStats.findOne({});
        Count.Users++;
        await AppStats.updateOne({},{Users: Count.Users});
        req.session.loggedIn = true
        req.session.username = user.FirstName
        user.Password = null
        req.session.user = user;
        res.redirect('/dashboard');
    })
})

router.post('/login', async function (req, res, next) {
    const user = await UserDB.findOne({"Email": req.body.email});
    if (user) {
        if(passwordHash.verify(req.body.password, user.Password)){
            res.locals.username = user.FirstName;
            res.locals.user = user;
            next();
        } else res.redirect('/auth/login?err=failed');
    } else {
        res.redirect('/auth/login?err=failed');
    }
}, (req, res) => {
    req.session.loggedIn = true
    req.session.username = res.locals.username
    res.locals.user.Password = null
    req.session.user = res.locals.user
    if(req.session.user.Admin) res.redirect('/admin');
    else res.redirect('/dashboard');
})


module.exports = router;
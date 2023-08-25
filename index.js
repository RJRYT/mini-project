/**
 * Importing needed packages
 */
const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require("cors");
const MongoStore = require('connect-mongo');
const Stats = require('./DbModel/stats');
const Category = require('./DbModel/category');
const Test = require('./DbModel/tests');
const Report = require('./DbModel/results');
const Appoinment = require('./DbModel/appoinments');
const UserDB = require('./DbModel/user');
const Contact = require('./DbModel/contactreq');
require('dotenv').config();

/**
 * Constant variables
 */
console.log("|*********************************************");
console.log("|          STARTING MINI PROJECT");
console.log("|          Project Members:");
console.log("|              1. Robin Jr");
console.log("|              2. Nikhil P");
console.log("|              3. Sarang S S");
console.log("|              4. Jagan P");
console.log("|*********************************************");
const oneDay = 1000 * 60 * 60 * 24;
const port = process.env.PORT || 3000;

/**
 * Config the epress server and cookie
 */
console.log("[LOG]: Loading App config...");
const app = express();
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/drive/image', express.static(path.join(__dirname, '/pics')));
app.use('/drive/result', express.static(path.join(__dirname, '/reports')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(session({ secret: 'dkvsunsfidnsvjdnsfdukwebku', name: 'uniqueSessionID', saveUninitialized: false, cookie: { maxAge: oneDay }, resave: false, store: MongoStore.create({mongoUrl: process.env.MONGO}) }));

/**
 * Mongoose events (optional)
 */
mongoose.connection.on("connected", () => {
    console.log("[LOG]: Connected to MongoDB");
});
mongoose.connection.on("disconnected", () => {
    console.log("[LOG]: Disconnected from MongoDB");
});
mongoose.connection.on("error", (error) => {
    console.log("[ERROR]: Error on MongoDB connection");
    console.log(String(error));
});
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
});
console.log("[LOG]: Loaded App config");
/**
 * Main router handler
 */
console.log("[LOG]: Loading Main routers...");
app.get('/', function (req, res) {
    res.render('main/home', { status: req.session.loggedIn, user: req.session.user, dev: process.env.DEV })
});
app.get('/contact', function (req, res) {
    res.render('main/contact', { status: req.session.loggedIn, user: req.session.user, dev: process.env.DEV })
});
app.post('/contact', async (req, res)=>{
    await Contact.create(req.body);
    res.send({"status":200,"message":"Request recorded successfully. We will contact you as soon as possible"});
})
app.get('/about', function (req, res) {
    res.render('main/about', { status: req.session.loggedIn, user: req.session.user, dev: process.env.DEV })
});
app.get('/login', function (req, res) {
    res.redirect('/auth/login');
});
app.get('/panel', function (req, res) {
    if(req.session.user.Admin) res.redirect('/admin');
    else if(req.session.user.Staff) res.redirect('/office');
    else res.redirect('/dashboard');
});
app.get('/panel/profile', function (req, res) {
    if(req.session.user.Admin) res.redirect('/admin/profile');
    else if(req.session.user.Staff) res.redirect('/office/profile');
    else res.redirect('/dashboard/profile');
});
console.log("[LOG]: Main routers loaded");
/**
 * Importing modules(Routers)
 */
console.log("[LOG]: Loading Sub routers...");
app.use("/auth", require('./Routers/Auth'));
app.use("/api", require('./Routers/Api'));
app.use("/admin/api", require('./Routers/Api.Admin'));
app.use("/dashboard", require('./Routers/DashBoard'));
app.use("/admin", require('./Routers/Admin'));
app.use("/office", require('./Routers/Assistant'));
console.log("[LOG]: Sub routers loaded");
/**
 * Error Handlers
 */
console.log("[LOG]: Loading error handlers...");
app.use(function (req, res) {
    res.status(404).sendFile(path.join(__dirname, '/Static/404.html'));
});
app.use(async function (err, req, res, next) {
    if (!err) {
        return next();
    }
    console.log("[ERROR]: Error on path:", req._parsedUrl.pathname);
    console.log('[ERROR]: Error from root module');
    console.log(err, err.stack);
    res.status(500).sendFile(path.join(__dirname, '/Static/500.html'));
});
process.on('unhandledRejection', (reason, promise) => {
    console.log(`${promise}, ${reason.stack}`, reason);
});
process.on("uncaughtException", (err, origin) => {
    console.log(`${err.stack}, ${origin}`);
});
console.log("[LOG]: Error handlers Loaded.");
/**
 * Listening the port
 */
app.listen(port, () => {
    console.log(`[LOG]: MiniProject is running on port http://localhost:${port}/`);
    mongoose.set('strictQuery', true);
    console.log("[LOG]: Connecting to database...");
    mongoose.connect(process.env.MONGO, { useUnifiedTopology: true, useNewUrlParser: true });
    initServerStats();
});

async function initServerStats(){
    let stats = await Stats.findOne({});
    if(!stats){
        new Stats({
            Users: await UserDB.countDocuments({}),
            Categories: await Category.countDocuments({}),
            Tests: await Test.countDocuments({}),
            Appoinments: await Appoinment.countDocuments({}),
            Results: await Report.countDocuments({}),
            LabAssistants: 0
        }).save((err, data)=>{
            console.log("[LOG]: Server stats created.");
        })
    }else{
        console.log("[INFO]: Server stats already exists.");
        console.log(`[STATS]: Users: ${stats.Users}`);
        console.log(`[STATS]: Categories: ${stats.Categories}`);
        console.log(`[STATS]: Tests: ${stats.Tests}`);
        console.log(`[STATS]: Appoinments: ${stats.Appoinments}`);
        console.log(`[STATS]: Results: ${stats.Results}`);
        console.log(`[STATS]: LabAssistants: ${stats.LabAssistants}`);
    }
}
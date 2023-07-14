const express = require('express');
router = express.Router();
const passwordHash = require('password-hash');
const UserDB = require('../DbModel/user');
const fs = require('fs');
const path = require('path');
const fileUpload = require("express-fileupload");
const Category = require('../DbModel/category');
const Test = require('../DbModel/tests');
const Appoinment = require('../DbModel/appoinments');
const AppStats = require('../DbModel/stats');

router.get('/', function (req, res) {
    if (!req.session.loggedIn)
        return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else {
        return res.status(200).json({
            "status": 200,
            "message": "Api is ready",
            "user": {
                "name": req.session.user.FirstName,
                "email": req.session.user.Email,
                "admin": req.session.user.Admin
            }
        });
    }
});

router.post('/changename', async function (req, res) {
    if (!req.session.loggedIn) return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user) return res.status(200).json({ "status": 403, "message": "No user found. Try relog" });
    else {
        const user = await UserDB.findOne({ "_id": req.session.user._id });
        if (user) {
            if (user.FirstName != req.body.currentname) return res.status(200).json({ "status": 403, "message": "Current name doesnt match with your details" });
            if (!passwordHash.verify(req.body.password, user.Password)) return res.status(200).json({ "status": 403, "message": "Password doesn't match" });
            await UserDB.updateOne({ "_id": req.session.user._id }, { $set: { FirstName: req.body.name } });
            user.FirstName = req.body.name;
            req.session.username = req.body.name;
            req.session.user = user;
            return res.status(200).json({ "status": 200, "message": "Name changed sucessfully. Refresh to update" });
        } else return res.status(200).json({ "status": 403, "message": "Somthing is broken. relog and try again." });
    }
});

router.post('/changeemail', async function (req, res) {
    if (!req.session.loggedIn) return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user) return res.status(200).json({ "status": 403, "message": "No user found. Try relog" });
    else {
        const user = await UserDB.findOne({ "_id": req.session.user._id });
        if (user) {
            if (user.Email != req.body.currentemail) return res.status(200).json({ "status": 403, "message": "Current email doesnt match with your details" });
            if (!passwordHash.verify(req.body.password, user.Password)) return res.status(200).json({ "status": 403, "message": "Password doesn't match" });
            if (await UserDB.findOne({ "Email": req.body.email })) return res.status(200).json({ "status": 403, "message": "This Email is already used by another user." });
            await UserDB.updateOne({ "_id": req.session.user._id }, { $set: { Email: req.body.email } });
            user.Email = req.body.email;
            req.session.user = user;
            return res.status(200).json({ "status": 200, "message": "Email changed sucessfully. Refresh to update" });
        } else return res.status(200).json({ "status": 403, "message": "Somthing is broken. relog and try again." });
    }
});

router.post('/changepass', async function (req, res) {
    if (!req.session.loggedIn) return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user) return res.status(200).json({ "status": 403, "message": "No user found. Try relog" });
    else {
        const user = await UserDB.findOne({ "_id": req.session.user._id });
        if (user) {
            if (!passwordHash.verify(req.body.currentpass, user.Password)) return res.status(200).json({ "status": 403, "message": "Your current Password doesn't match" });
            if (passwordHash.verify(req.body.newpass, user.Password)) return res.status(200).json({ "status": 403, "message": "This is your current Password. Dont need to change" });
            await UserDB.updateOne({ "_id": req.session.user._id }, { $set: { Password: passwordHash.generate(req.body.newpass) } });
            return res.status(200).json({ "status": 200, "message": "Password changed sucessfully. Refresh to update" });
        } else return res.status(200).json({ "status": 403, "message": "Somthing is broken. relog and try again." });
    }
});

router.post('/updateprofile', async function (req, res) {
    if (!req.session.loggedIn) return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user) return res.status(200).json({ "status": 403, "message": "No user found. Try relog" });
    else {
        const user = await UserDB.findOne({ "_id": req.session.user._id });
        if (user) {
            if (!passwordHash.verify(req.body.password, user.Password)) return res.status(200).json({ "status": 403, "message": "Password doesn't match" });
            await UserDB.updateOne({ "_id": req.session.user._id }, {
                $set: {
                    Gender: req.body.gender,
                    Dob: req.body.dob,
                    Age: req.body.age,
                    Blood: req.body.blood,
                    Height: req.body.height,
                    Weight: req.body.weight,
                    Number: req.body.number,
                    Address: req.body.address,
                    Setuped: true
                }
            });
            user.Gender = req.body.gender,
                user.Dob = req.body.dob,
                user.Age = req.body.age,
                user.Blood = req.body.blood,
                user.Height = req.body.height,
                user.Weight = req.body.weight,
                user.Number = req.body.number,
                user.Address = req.body.address,
                user.Setuped = true;
            req.session.user = user;
            return res.status(200).json({ "status": 200, "message": "Profile updated sucessfully. Refresh to update" });
        } else return res.status(200).json({ "status": 403, "message": "Somthing is broken. relog and try again." });
    }
});

router.post('/uploadpic', fileUpload({ useTempFiles: true }), async function (req, res) {
    if (!req.session.loggedIn) return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user) return res.status(200).json({ "status": 403, "message": "No user found. Try relog" });
    else {
        const user = await UserDB.findOne({ "_id": req.session.user._id });
        if (user) {
            const file = req.files.pic;
            var fpath = "./pics/" + file.name;
            if (!file.mimetype.includes('image')) {
                fs.unlink(fpath, async function (err) { })
                return res.status(200).json({ "status": 403, "message": "Invalid file format. choose a image for profile pic" });
            }
            file.mv(fpath, (err) => {
                if (err) {
                    console.log(err);
                    return res.status(200).json({ "status": 403, "message": "Somthing is broken. relog and try again." });
                } else {
                    const fileext = path.extname(fpath);
                    const newname = req.session.user._id + fileext;
                    fs.rename(fpath, "./pics/" + newname, async function (err) {
                        if (err) return res.status(200).json({ "status": 403, "message": "Somthing is broken. relog and try again." });
                        else {
                            if (!user.ProfilePic) {
                                await UserDB.updateOne({ "_id": req.session.user._id }, { $set: { ProfilePic: newname } });
                                user.ProfilePic = newname;
                                req.session.user = user;
                                return res.status(200).json({ "status": 200, "message": "Profile photo uploaded sucessfully. Refresh to update" });
                            }
                            if (user.ProfilePic != newname) {
                                fs.unlink("./pics/" + user.ProfilePic, async function (err) {
                                    if (err) return res.status(200).json({ "status": 403, "message": "Somthing is broken. relog and try again." });
                                    await UserDB.updateOne({ "_id": req.session.user._id }, { $set: { ProfilePic: newname } });
                                    user.ProfilePic = newname;
                                    req.session.user = user;
                                    return res.status(200).json({ "status": 200, "message": "Profile photo uploaded sucessfully. Refresh to update" });
                                })
                            } else {
                                user.ProfilePic = newname;
                                req.session.user = user;
                                return res.status(200).json({ "status": 200, "message": "Profile photo uploaded sucessfully. Refresh to update" });
                            }

                        }
                    });
                }
            });
        } else return res.status(200).json({ "status": 403, "message": "Somthing is broken. relog and try again." });
    }
});

router.post('/resetprofilepic', async function (req, res) {
    if (!req.session.loggedIn) return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user) return res.status(200).json({ "status": 403, "message": "No user found. Try relog" });
    else {
        const user = await UserDB.findOne({ "_id": req.session.user._id });
        if (user) {
            if (!user.ProfilePic) return res.status(200).json({ "status": 403, "message": "There are no profile pic to remove." });
            await UserDB.updateOne({ "_id": req.session.user._id }, { $set: { ProfilePic: null } });
            fs.unlink("./pics/" + user.ProfilePic, async function (err) {
                if (err) return res.status(200).json({ "status": 403, "message": "Somthing is broken. relog and try again." });
                else {
                    user.ProfilePic = null;
                    req.session.user = user;
                    return res.status(200).json({ "status": 200, "message": "Profile image removed sucessfully. Refresh to update" });
                }
            });
        } else return res.status(200).json({ "status": 403, "message": "Somthing is broken. relog and try again." });
    }
});

router.get('/info/testdata', async (req, res) => {
    if (!req.session.loggedIn) return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user) return res.status(200).json({ "status": 403, "message": "No user found. Try relog" });
    else {
        let response = {};
        const CategoryList = await Category.find({});
        const TestList = await Test.find({});
        CategoryList.forEach(Citem => {
            response[Citem.ID] = {};
            response[Citem.ID].Tests = TestList.filter(item => item.Category == Citem.ID && item.Status == 1);
            response[Citem.ID].ID = Citem.ID;
            response[Citem.ID].Name = Citem.Name;
        })
        res.status(200).json({ "status": 200, "message": "List of all tests", "data": response });
    }
})

router.get('/info/test', async (req, res) => {
    if (!req.session.loggedIn) return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user) return res.status(200).json({ "status": 403, "message": "No user found. Try relog" });
    else {
        if (!req.query) return res.status(200).json({ "status": 403, "message": "Provide data query to continue" });
        if (!req.query.test) return res.status(200).json({ "status": 403, "message": "Provide test id to continue" });
        const Tests = await Test.findOne({ "ID": req.query.test });
        if (!Tests) return res.status(200).json({ "status": 403, "message": "Test not found" });
        const Categorys = await Category.findOne({ "ID": Tests.Category });
        if (!Categorys) return res.status(200).json({ "status": 403, "message": "Category not found" });
        const Price = Tests.Price;
        const Tax = Price * 0.1;//10%
        const Commission = Price * 0.02;//2%
        const Total = Price + Tax + Commission;
        const TestInfo = {
            "ID": Tests.ID,
            "Name": Tests.Name,
            "Category": Categorys.Name,
            "Price": Price,
            "Tax": Tax,
            "Commission": Commission,
            "Total": Total
        }
        const MetaData = { "Tax": "10%", "Commission": "2%" };
        res.status(200).json({ "status": 200, "message": "Test info", "data": TestInfo, "meta": MetaData });
    }
})

router.post('/new/appoinment', async (req, res) => {
    if (!req.session.loggedIn)
        return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else {
        if (!req.body) return res.status(200).json({ "status": 403, "message": "Provide the body parameters to continue." });
        if (!req.body.Password) return res.status(200).json({ "status": 403, "message": "Provide user account password" });

        const user = await UserDB.findOne({ "_id": req.session.user._id });
        if (!user) return res.status(200).json({ "status": 403, "message": "User not found" });
        if (!passwordHash.verify(req.body.Password, user.Password)) return res.status(200).json({ "status": 403, "message": "Password doesn't match" });

        if (!req.body.Name) return res.status(200).json({ "status": 403, "message": "Provide user name to continue" });
        if (!req.body.Email) return res.status(200).json({ "status": 403, "message": "Provide user email to continue" });
        if (!req.body.PhNumber) return res.status(200).json({ "status": 403, "message": "Provide user phone number to continue" });
        if (!req.body.Address) return res.status(200).json({ "status": 403, "message": "Provide user address to continue" });
        if (!req.body.Age) return res.status(200).json({ "status": 403, "message": "Provide user age to continue" });
        if (!req.body.Dob) return res.status(200).json({ "status": 403, "message": "Provide user Date of birth to continue" });
        if (!req.body.Categories) return res.status(200).json({ "status": 403, "message": "Select a test category to continue" });
        if (!req.body.Tests) return res.status(200).json({ "status": 403, "message": "Select a test to continue" });
        if (!req.body.Date) return res.status(200).json({ "status": 403, "message": "Provide appoinment date to continue" });
        if (!req.body.Time) return res.status(200).json({ "status": 403, "message": "Provide appoinment time to continue" });
        if (!req.body.Hour) return res.status(200).json({ "status": 403, "message": "Provide appoinment hour to continue" });
        if (!req.body.TransactionId) return res.status(200).json({ "status": 403, "message": "Provide appoinment transaction id to continue" });
        if (!req.body.Total) return res.status(200).json({ "status": 403, "message": "Provide amount due" });

        const CurrentDate = new Date();
        if (new Date(req.body.Date) < CurrentDate) return res.status(200).json({ "status": 403, "message": "Please select a valid date from tommarow." });
        new Appoinment({
            "ID": await GenerateAppoinmentId(),
            "UserId": req.session.user._id,
            "TestId": req.body.Tests,
            "Date": req.body.Date,
            "Time": req.body.Time,
            "Hour": req.body.Hour,
            "TransactionId": req.body.TransactionId,
            "Amount": req.body.Total,
        }).save((err, data) => {
            if (err) return console.log("[ERROR]: Error on path:", req._parsedUrl.pathname, "\nError: ",err), res.status(200).json({ "status": 403, "message": "Something went wrong" });
            return res.status(200).json({ "status": 200, "message": "Appoinment created successfully. Refresh to update", "data": data });
        })

    }
})
router.get('/view/appoinment', (req, res) => {
    if (!req.session.loggedIn)
        return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else {
        if (!req.query) return res.status(200).json({ "status": 403, "message": "Provide the parameters to continue." });
        if (!req.query.id) return res.status(200).json({ "status": 403, "message": "Provide category id" });
        Appoinment.findOne({ "UserId": req.session.user._id, "ID": req.query.id }, (err, data) => {
            if (err) return console.log("[ERROR]: Error on path:", req._parsedUrl.pathname, "\nError: ",err), res.status(200).json({ "status": 403, "message": "Something went wrong" });
            if(!data) return res.status(200).json({ "status": 403, "message": "Appoinment not found" });
            return res.status(200).json({ "status": 200, "message": "Appoinment found successfully", "data": data });
        })
    }
})
router.delete('/delete/appoinment', (req, res) => {
    if (!req.session.loggedIn)
        return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else {
        if (!req.body) return res.status(200).json({ "status": 403, "message": "Provide the parameters to continue." });
        if (!req.body.id) return res.status(200).json({ "status": 403, "message": "Provide appoinment id" });
        Appoinment.findOne({"UserId": req.session.user._id, "ID":req.body.id}, (err, data)=>{
            if (err) return console.log("[ERROR]: Error on path:", req._parsedUrl.pathname, "\nError: ",err), res.status(200).json({ "status": 403, "message": "An Error occoured." });
            else if (!data) return res.status(200).json({ "status": 403, "message": "No data found to delete" });
            if(data.Status > 2) return res.status(200).json({ "status": 403, "message": "You dont have permission to delete this appoinment now." });
        })
        Appoinment.findOneAndDelete({
            "ID": req.body.id, "UserId": req.session.user._id
        }, (err, data) => {
            if (err) return console.log("[ERROR]: Error on path:", req._parsedUrl.pathname, "\nError: ",err), res.status(200).json({ "status": 403, "message": "An Error occoured." });
            else return res.status(200).json({
                "status": 200,
                "message": "appoinment deleted successfully"
            });
        })
    }
})
router.put('/cancel/appoinment', (req, res) => {
    if (!req.session.loggedIn)
        return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else {
        if (!req.body) return res.status(200).json({ "status": 403, "message": "Provide the parameters to continue." });
        if (!req.body.id) return res.status(200).json({ "status": 403, "message": "Provide appoinment id" });
        Appoinment.findOne({"ID":req.body.id}, (err, data)=>{
            if (err) return console.log("[ERROR]: Error on path:", req._parsedUrl.pathname, "\nError: ",err), res.status(200).json({ "status": 403, "message": "An Error occoured." });
            else if (!data) return res.status(200).json({ "status": 403, "message": "No data found to update" });
            if(data.Status > 2) return res.status(200).json({ "status": 403, "message": "You dont have permission to cancel this appoinment now." });
        })
        Appoinment.findOneAndUpdate({ "ID": req.body.id }, { "Status": 8 }, (err, data) => {
            if (err) return console.log("[ERROR]: Error on path:", req._parsedUrl.pathname, "\nError: ",err), res.status(200).json({ "status": 403, "message": "An Error occoured." });
            else return res.status(200).json({
                "status": 200,
                "message": "Appoinment cancelled successfully"
            });
        })
    }
})
router.put('/edit/appoinment', function (req, res) {
    if (!req.session.loggedIn)
        return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else {
        if (!req.body) return res.status(200).json({ "status": 403, "message": "Provide the parameters to continue." });
        if (!req.body.id) return res.status(200).json({ "status": 403, "message": "Provide appoinment id" });
        if (!req.body.date) return res.status(200).json({ "status": 403, "message": "Provide appoinment new date" });
        if (!req.body.time) return res.status(200).json({ "status": 403, "message": "Provide appoinment new time" });
        if (!req.body.hour) return res.status(200).json({ "status": 403, "message": "Provide appoinment new hour" });
        if (new Date(req.body.date) < new Date()) return res.status(200).json({ "status": 403, "message": "Please select a valid date from tommarow." });
        Appoinment.findOne({"UserId": req.session.user._id, "ID":req.body.id}, (err, data)=>{
            if (err) return console.log("[ERROR]: Error on path:", req._parsedUrl.pathname, "\nError: ",err), res.status(200).json({ "status": 403, "message": "An Error occoured." });
            else if (!data) return res.status(200).json({ "status": 403, "message": "No data found to edit" });
            if(data.Status > 2) return res.status(200).json({ "status": 403, "message": "You dont have permission to edit this appoinment now." });
        })
        Appoinment.findOneAndUpdate({"UserId": req.session.user._id, "ID": req.body.id }, {
            "Date": req.body.date,
            "Time": req.body.time,
            "Hour": req.body.hour
        }, (err, data) => {
            if (err) return console.log("[ERROR]: Error on path:", req._parsedUrl.pathname, "\nError: ",err), res.status(200).json({ "status": 403, "message": "An Error occoured." });
            else return res.status(200).json({
                "status": 200,
                "message": "Appoinment updated successfully"
            });
        })
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
async function GenerateAppoinmentId() {
    const currentdate = new Date();
    const datetime = currentdate.toISOString().slice(0, 10).replace(/-/g, "");
    let Count = await AppStats.findOne({});
    Count.Appoinments++;
    await AppStats.updateOne({},{Appoinments: Count.Appoinments});
    return "A-" + datetime + "-" + Count.Appoinments;
}
router.use(function (req, res) {
    return res.status(404).json({"status":404,"message":"Requested route not found"});
});
router.use(async function (err, req, res, next) {
    if (!err) {
        return next();
    }
    console.log("[ERROR]: Error on path:", req._parsedUrl.pathname);
    console.log('[ERROR]: Error from user api module');
    console.log(err, err.stack);
    return res.status(500).json({"status":500,"message":"An unknown internal error occoured"});
});
module.exports = router;
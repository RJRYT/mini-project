const express = require('express');
router = express.Router();
const Category = require('../DbModel/category');
const Test = require('../DbModel/tests');
const Appoinment = require('../DbModel/appoinments');
const AppStats = require('../DbModel/stats');
const UserDB = require('../DbModel/user');
const Reports = require('../DbModel/results');
const fileUpload = require("express-fileupload");
const path = require('path');
const fs = require('fs');

router.get('/', function (req, res) {
    if (!req.session.loggedIn)
        return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user.Admin) res.status(200).json({ "status": 403, "message": "You are not authosrised" })
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

router.post('/new/category', async function (req, res) {
    if (!req.session.loggedIn)
        return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user.Admin) res.status(200).json({ "status": 403, "message": "You are not authosrised" })
    else {
        if (!req.body) return res.status(200).json({ "status": 403, "message": "Provide the parameters to continue." });
        if (!req.body.name) return res.status(200).json({ "status": 403, "message": "Provide category name" });
        if (!req.body.desc) return res.status(200).json({ "status": 403, "message": "Provide category description" });
        new Category({
            "ID": await GenerateCategoryId(),
            "Name": req.body.name,
            "Description": req.body.desc
        }).save((err, data) => {
            if (err) return console.log("[ERROR]: Error on path:", req._parsedUrl.pathname, "\nError: ", err), res.status(200).json({ "status": 403, "message": "An Error occoured." });
            else {
                return res.status(200).json({
                    "status": 200,
                    "message": "Category added successfully. Refresh to update"
                });
            }
        })
    }
})
router.put('/edit/category', async function (req, res) {
    if (!req.session.loggedIn)
        return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user.Admin) res.status(200).json({ "status": 403, "message": "You are not authosrised" })
    else {
        if (!req.body) return res.status(200).json({ "status": 403, "message": "Provide the parameters to continue." });
        if (!req.body.id) return res.status(200).json({ "status": 403, "message": "Provide category id" });
        if (!req.body.name) return res.status(200).json({ "status": 403, "message": "Provide category name" });
        if (!req.body.desc) return res.status(200).json({ "status": 403, "message": "Provide category description" });
        await Category.findOneAndUpdate({
            "ID": req.body.id
        }, {
            "Name": req.body.name,
            "Description": req.body.desc
        }, {
            new: false
        }, (err, data) => {
            if (err) return console.log("[ERROR]: Error on path:", req._parsedUrl.pathname, "\nError: ", err), res.status(200).json({ "status": 403, "message": "An Error occoured." });
            else if (!data) return res.status(200).json({ "status": 403, "message": "No data found to update" });
            else return res.status(200).json({
                "status": 200,
                "message": "Category updated successfully. Refresh to update"
            });
        })
    }
})
router.get('/view/category', (req, res) => {
    if (!req.session.loggedIn)
        return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user.Admin) res.status(200).json({ "status": 403, "message": "You are not authosrised" })
    else {
        if (!req.query) return res.status(200).json({ "status": 403, "message": "Provide the parameters to continue." });
        if (!req.query.id) return res.status(200).json({ "status": 403, "message": "Provide category id" });
        Category.findOne({
            "ID": req.query.id
        }, (err, data) => {
            if (err) return console.log("[ERROR]: Error on path:", req._parsedUrl.pathname, "\nError: ", err), res.status(200).json({ "status": 403, "message": "An Error occoured." });
            else return res.status(200).json({
                "status": 200,
                "message": "Category found",
                "data": data
            });
        })
    }
})
router.delete('/delete/category', async (req, res) => {
    if (!req.session.loggedIn)
        return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user.Admin) res.status(200).json({ "status": 403, "message": "You are not authosrised" })
    else {
        if (!req.body) return res.status(200).json({ "status": 403, "message": "Provide the parameters to continue." });
        if (!req.body.id) return res.status(200).json({ "status": 403, "message": "Provide category id" });
        if (await Test.findOne({ "Category": req.body.id })) return res.status(200).json({ "status": 403, "message": "There are some tests which is allocated to this category. so cannot delete." });
        await Category.findOneAndDelete({
            "ID": req.body.id
        }, (err, data) => {
            if (err) return console.log("[ERROR]: Error on path:", req._parsedUrl.pathname, "\nError: ", err), res.status(200).json({ "status": 403, "message": "An Error occoured." });
            else if (!data) return res.status(200).json({ "status": 403, "message": "No data found to delete" });
            else return res.status(200).json({
                "status": 200,
                "message": "Category deleted successfully"
            });
        })
    }
})

router.post('/new/test', async (req, res) => {
    if (!req.session.loggedIn)
        return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user.Admin) res.status(200).json({ "status": 403, "message": "You are not authosrised" })
    else {
        if (!req.body) return res.status(200).json({ "status": 403, "message": "Provide the parameters to continue." });
        if (!req.body.name) return res.status(200).json({ "status": 403, "message": "Provide test name" });
        if (!req.body.category) return res.status(200).json({ "status": 403, "message": "Provide category id" });
        if (!req.body.desc) return res.status(200).json({ "status": 403, "message": "Provide test description" });
        if (!req.body.price) return res.status(200).json({ "status": 403, "message": "Provide test price" });
        if (!req.body.status) return res.status(200).json({ "status": 403, "message": "Provide test status" });
        new Test({
            "ID": await GenerateTestId(),
            "Name": req.body.name,
            "Category": req.body.category,
            "Description": req.body.desc,
            "Price": req.body.price,
            "Status": req.body.status
        }).save((err, data) => {
            if (err) return console.log("[ERROR]: Error on path:", req._parsedUrl.pathname, "\nError: ", err), res.status(200).json({ "status": 403, "message": "An Error occoured." });
            else{
                 return res.status(200).json({
                "status": 200,
                "message": "Test created successfully"
            });}
        })
    }
});
router.put('/edit/test', async function (req, res) {
    if (!req.session.loggedIn)
        return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user.Admin) res.status(200).json({ "status": 403, "message": "You are not authosrised" })
    else {
        if (!req.body) return res.status(200).json({ "status": 403, "message": "Provide the parameters to continue." });
        if (!req.body.id) return res.status(200).json({ "status": 403, "message": "Provide test id" });
        if (!req.body.name) return res.status(200).json({ "status": 403, "message": "Provide test name" });
        if (!req.body.desc) return res.status(200).json({ "status": 403, "message": "Provide test description" });
        if (!req.body.category) return res.status(200).json({ "status": 403, "message": "Provide test category" });
        if (!req.body.price) return res.status(200).json({ "status": 403, "message": "Provide test price" });
        if (!req.body.status) return res.status(200).json({ "status": 403, "message": "Provide test status" });
        Test.findOneAndUpdate({ "ID": req.body.id }, {
            "Name": req.body.name,
            "Description": req.body.desc,
            "Category": req.body.category,
            "Price": req.body.price,
            "Status": req.body.status
        }, (err, data) => {
            if (err) return console.log("[ERROR]: Error on path:", req._parsedUrl.pathname, "\nError: ", err), res.status(200).json({ "status": 403, "message": "An Error occoured." });
            else if (!data) return res.status(200).json({ "status": 403, "message": "No data found to update" });
            else return res.status(200).json({
                "status": 200,
                "message": "Test updated"
            });
        });
    }
});
router.get('/view/test', async (req, res) => {
    if (!req.session.loggedIn)
        return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user.Admin) res.status(200).json({ "status": 403, "message": "You are not authosrised" })
    else {
        if (!req.query) return res.status(200).json({ "status": 403, "message": "Provide the parameters to continue." });
        if (!req.query.id) return res.status(200).json({ "status": 403, "message": "Provide category id" });
        var Data = await Test.findOne({ "ID": req.query.id });
        const CategoryList = await Category.find({});
        if (req.query.name == 'true') Data.Category = CategoryList.find(cat => cat.ID == Data.Category).Name;
        return res.status(200).json({
            "status": 200,
            "message": "Test found",
            "data": Data
        });
    }
});
router.delete('/delete/test', async (req, res) => {
    if (!req.session.loggedIn)
        return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user.Admin) res.status(200).json({ "status": 403, "message": "You are not authosrised" })
    else {
        if (!req.body) return res.status(200).json({ "status": 403, "message": "Provide the parameters to continue." });
        if (!req.body.id) return res.status(200).json({ "status": 403, "message": "Provide category id" });
        if (await Appoinment.findOne({ "TestId": req.body.id })) return res.status(200).json({ "status": 403, "message": "There are some appoinment which is allocated to this test. so cannot delete." });
        Test.findOneAndDelete({ "ID": req.body.id }, (err, data) => {
            if (err) return console.log("[ERROR]: Error on path:", req._parsedUrl.pathname, "\nError: ", err), res.status(200).json({ "status": 403, "message": "An Error occoured." });
            else if (!data) return res.status(200).json({ "status": 403, "message": "No data found to delete" });
            else {
                return res.status(200).json({
                    "status": 200,
                    "message": "Test deleted"
                });
            }
        })
    }
});

router.get('/view/appoinment', (req, res) => {
    if (!req.session.loggedIn)
        return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user.Admin && !req.session.user.Staff) res.status(200).json({ "status": 403, "message": "You are not authosrised" })
    else {
        if (!req.query) return res.status(200).json({ "status": 403, "message": "Provide the parameters to continue." });
        if (!req.query.id) return res.status(200).json({ "status": 403, "message": "Provide appoinment id" });
        Appoinment.findOne({ "ID": req.query.id }, (err, data) => {
            if (err) return console.log("[ERROR]: Error on path:", req._parsedUrl.pathname, "\nError: ", err), res.status(200).json({ "status": 403, "message": "Something went wrong" });
            if (!data) return res.status(200).json({ "status": 403, "message": "Appoinment not found" });
            return res.status(200).json({ "status": 200, "message": "Appoinment found successfully", "data": data });
        })
    }
})

router.get('/search/appoinment', async (req, res) => {
    if (!req.session.loggedIn)
        return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user.Admin && !req.session.user.Staff) res.status(200).json({ "status": 403, "message": "You are not authosrised" })
    else {
        if (!req.query) return res.status(200).json({ "status": 403, "message": "Provide the parameters to continue." });
        if (!req.query.id) return res.status(200).json({ "status": 403, "message": "Provide appoinment id" });
        Appoinment.findOne({ "ID": req.query.id }, async (err, data) => {
            if (err) return console.log("[ERROR]: Error on path:", req._parsedUrl.pathname, "\nError: ", err), res.status(200).json({ "status": 403, "message": "Something went wrong" });
            if (!data) return res.status(200).json({ "status": 403, "message": "Appoinment not found" });
            else{
                const TestList = await Test.findOne({"ID": data.TestId});
                const Patient = await UserDB.findOne({"_id":data.UserId});
                const DateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const response = {
                    ID: data.ID,
                    Patient: Patient.FirstName,
                    Tests: TestList.Name,
                    Date: data.Date.toLocaleDateString('en-US', DateOptions)+" "+TimeData[data.Time].Time.find(i => i.ID == data.Hour).Name,
                    Status: data.Status
                }
                return res.status(200).json({ "status": 200, "message": "Appoinment found successfully", "data": response });
            }
            
        })
    }
})

router.post('/appoinment/upload/result', fileUpload({ useTempFiles: true }), async function (req, res) {
    if (!req.session.loggedIn) return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user) return res.status(200).json({ "status": 403, "message": "No user found. Try relog" });
    else {
        const user = await UserDB.findOne({ "_id": req.session.user._id });
        if (user) {
            const file = req.files.report;
            var fpath = "./reports/" + file.name;
            if (!file.mimetype.includes('pdf')) {
                fs.unlink(fpath, async function (err) { })
                return res.status(200).json({ "status": 403, "message": "Invalid file format. choose a pdf" });
            }
            file.mv(fpath, async (err) => {
                if (err) {
                    console.log(err);
                    return res.status(200).json({ "status": 403, "message": "Somthing is broken. relog and try again." });
                } else {
                    const fileext = path.extname(fpath);
                    const ReportName = await GenerateReportId();
                    const newname = ReportName + fileext;
                    fs.rename(fpath, "./reports/" + newname, async function (err) {
                        if (err) return res.status(200).json({ "status": 403, "message": "Somthing is broken. relog and try again." });
                        else {
                            const appoinment = await Appoinment.findOne({ "ID": req.body.id });
                            if (appoinment) {
                                if(appoinment.Status != 6) return res.status(200).json({ "status": 403, "message": "Report can only be uploaded after sample collection" });
                                else if (appoinment.Report) return res.status(200).json({ "status": 403, "message": "Report already uploaded" });
                                new Reports({
                                    "ID": ReportName,
                                    "UserId": appoinment.UserId,
                                    "TestId": appoinment.TestId,
                                    "Report": newname,
                                    "Remarks": req.body.remarks
                                }).save(async(err, data)=>{
                                    if(err){
                                        console.log(err);
                                        return res.status(200).json({ "status": 403, "message": "Somthing is broken. relog and try again." });
                                    }else {
                                        appoinment.Report = newname;
                                        appoinment.Status = 7;
                                        await appoinment.save();
                                        return res.status(200).json({ "status": 200, "message": "Report uploaded successfully" });
                                    }
                                }); 
                            } else return res.status(200).json({ "status": 403, "message": "No data found to update" });
                        }
                    });
                }
            });
        } else return res.status(200).json({ "status": 403, "message": "Somthing is broken. relog and try again." });
    }
});

router.delete('/delete/appoinment', async (req, res) => {
    if (!req.session.loggedIn)
        return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user.Admin) res.status(200).json({ "status": 403, "message": "You are not authosrised" })
    else {
        if (!req.body) return res.status(200).json({ "status": 403, "message": "Provide the parameters to continue." });
        if (!req.body.id) return res.status(200).json({ "status": 403, "message": "Provide appoinment id" });
        Appoinment.findOne({ "ID": req.body.id }, (err, data) => {
            if (err) return console.log("[ERROR]: Error on path:", req._parsedUrl.pathname, "\nError: ", err), res.status(200).json({ "status": 403, "message": "An Error occoured." });
            else if (!data) return res.status(200).json({ "status": 403, "message": "No data found to delete" });
        })
        Appoinment.findOneAndDelete({
            "ID": req.body.id
        }, (err, data) => {
            if (err) return console.log("[ERROR]: Error on path:", req._parsedUrl.pathname, "\nError: ", err), res.status(200).json({ "status": 403, "message": "An Error occoured." });
            else return res.status(200).json({
                "status": 200,
                "message": "appoinment deleted successfully"
            });
        })
    }
})
router.put('/edit/appoinment', async function (req, res) {
    if (!req.session.loggedIn)
        return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user.Admin && !req.session.user.Staff) res.status(200).json({ "status": 403, "message": "You are not authosrised" })
    else {
        if (!req.body) return res.status(200).json({ "status": 403, "message": "Provide the parameters to continue." });
        if (!req.body.id) return res.status(200).json({ "status": 403, "message": "Provide appoinment id" });
        if (!req.body.date) return res.status(200).json({ "status": 403, "message": "Provide appoinment new date" });
        if (!req.body.time) return res.status(200).json({ "status": 403, "message": "Provide appoinment new time" });
        if (!req.body.hour) return res.status(200).json({ "status": 403, "message": "Provide appoinment new hour" });
        if (new Date(req.body.date) < new Date()) return res.status(200).json({ "status": 403, "message": "Please select a valid date from tommarow." });
        Appoinment.findOne({ "ID": req.body.id }, (err, data) => {
            if (err) return console.log("[ERROR]: Error on path:", req._parsedUrl.pathname, "\nError: ", err), res.status(200).json({ "status": 403, "message": "An Error occoured." });
            else if (!data) return res.status(200).json({ "status": 403, "message": "No data found to update" });
        })
        Appoinment.findOneAndUpdate({ "ID": req.body.id }, {
            "Date": req.body.date,
            "Time": req.body.time,
            "Hour": req.body.hour
        }, (err, data) => {
            if (err) return console.log("[ERROR]: Error on path:", req._parsedUrl.pathname, "\nError: ", err), res.status(200).json({ "status": 403, "message": "An Error occoured." });
            else return res.status(200).json({
                "status": 200,
                "message": "Appoinment updated successfully"
            });
        })
    }
});
router.put('/update/appoinment', async function (req, res) {
    if (!req.session.loggedIn)
        return res.status(200).json({ "status": 403, "message": "You are not loggined." });
    else if (!req.session.user.Admin && !req.session.user.Staff) res.status(200).json({ "status": 403, "message": "You are not authosrised" })
    else {
        if (!req.body) return res.status(200).json({ "status": 403, "message": "Provide the parameters to continue." });
        if (!req.body.id) return res.status(200).json({ "status": 403, "message": "Provide appoinment id" });
        if (!req.body.status) return res.status(200).json({ "status": 403, "message": "Provide new appoinment status" });
        Appoinment.findOne({ "ID": req.body.id }, (err, data) => {
            if (err) return res.status(200).json({ "status": 403, "message": "An Error occoured." });
            else if (!data) return res.status(200).json({ "status": 403, "message": "No data found to update" });
        })
        Appoinment.findOneAndUpdate({ "ID": req.body.id }, {
            "Status": req.body.status,
            "Report": null
        }, (err, data) => {
            if (err) return console.log("[ERROR]: Error on path:", req._parsedUrl.pathname, "\nError: ", err), res.status(200).json({ "status": 403, "message": "An Error occoured." });
            else return res.status(200).json({
                "status": 200,
                "message": "Appoinment status updated successfully"
            });
        })
    }
});

async function GenerateCategoryId() {
    const currentdate = new Date();
    const datetime = currentdate.toISOString().slice(0, 10).replace(/-/g, "");
    let Count = await AppStats.findOne({});
    Count.Categories++;
    await AppStats.updateOne({},{Categories: Count.Categories});
    return "C-" + datetime + "-" + Count.Categories;
}
async function GenerateTestId() {
    const currentdate = new Date();
    const datetime = currentdate.toISOString().slice(0, 10).replace(/-/g, "");
    let Count = await AppStats.findOne({});
    Count.Tests++;
    await AppStats.updateOne({},{Tests: Count.Tests});
    return "T-" + datetime + "-" + Count.Tests;
}
async function GenerateReportId() {
    const currentdate = new Date();
    const datetime = currentdate.toISOString().slice(0, 10).replace(/-/g, "");
    let Count = await AppStats.findOne({});
    Count.Results++;
    await AppStats.updateOne({},{Results: Count.Results});
    return "R-" + datetime + "-" + Count.Results;
}
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
    return res.status(404).json({ "status": 404, "message": "Requested route not found" });
});
router.use(async function (err, req, res, next) {
    if (!err) {
        return next();
    }
    console.log("[ERROR]: Error on path:", req._parsedUrl.pathname);
    console.log('[ERROR]: Error from admin api module');
    console.log(err, err.stack);
    return res.status(500).json({ "status": 500, "message": "An unknown internal error occoured" });
});
module.exports = router;
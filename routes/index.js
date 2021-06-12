var express = require('express');
var router = express.Router();
const passport = require('passport');
const config = require('../bin/config/config.js');
var url = require('url');
const User = require('../models/User');
const Class = require('../models/Class');

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.user){
    if(req.user.userType === "teacher") {
      res.redirect('/teacherDash');
    } else if(req.user.userType === "student") {
      res.redirect('/studentDash');
    }
  } else {
    res.render('index', {user: req.user})
  }
});

//LOGOUT function
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

//GET updateClass 
router.get('/updateClass', (req, res) => {
  if(req.user.userType === "teacher"){
    //fetch all data from DB
    Class.findById(req.query.classID, function(err, classDetails) {
      if(err) {
        console.log(err)
      } else {
        console.log(classDetails)
        User.find({userType: "student"}, function(err, students) {
          if(err){
            console.log(err)
          } else {
            //if no students enrolledId
            if(classDetails.studentsEnrolled == null) {
              const currentStudent = []
              res.render('updateClass', {user: req.user, students: students, created: false, classDetails: classDetails, currentStudent: currentStudent});
            } else {
              //fetching current students
            var currentStudent = [];
            classDetails.studentsEnrolled.forEach(function(enrolledId) {
              for(i = 0; i < students.length; i++){
                if(enrolledId == students[i].id){
                  currentStudent.push(students[i].name)
                }
              }
            });
            res.render('updateClass', {user: req.user, students: students, created: false, classDetails: classDetails, currentStudent: currentStudent});
            }
          }
        })
      }
    });
  } else {
    res.render('index');
  }
})

//GET studentDash
router.get('/studentDash', (req, res) => {
  if(req.user.userType === "student") {
    //Fetch registered classes
    Class.find({studentsEnrolled: req.user.id}, function(err, enrolledClasses) {
      if(err) {
        console.log(err)
      } else {
        res.render('studentDash', {user: req.user, enrolledClasses: enrolledClasses});
      }
    })
  }
})

//GET teacherDash 
router.get('/teacherDash', (req, res) => {
  if(req.user.userType === 'teacher') {

    //Fetch all classes
    Class.find({teacherId: req.user.id}, function(err, allClass) {
      if(err) {
        console.log(err);
      } else {
        res.render('teacherDash', {user: req.user, classes: allClass});
      }
    })
  }
})

//GET createClass 
router.get('/createClass', (req, res) => {
  if(req.user.userType === "teacher"){

    //fetch all students from DB
    User.find({userType: "student"}, function(err, docs) {
      if(err){
        console.log(err)
      } else {
        res.render('createClass', {user: req.user, students: docs, created: false});
      }
    })
  } else {
    res.render('index');
  }
})

//GET ediProfile
router.get('/editProfile', (req, res) => {
  res.render('editProfile', {user: req.user, updated: false});
})

//GET Register page
router.get('/register', function(req, res, next) {
  if(req.user){
    console.log(req.user)
    res.render('register');
  } else {
    res.render('index');
  }
  
})

router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res, next) {
      //If users details are NOT available
      if(!req.user.userType){
        //User details not available
        res.redirect('/register')
      } else {
        if(req.user.userType === "teacher") {
          res.redirect('/teacherDash')
        }
        if(req.user.userType === "student") {
          res.redirect('/studentDash')
        }
        // res.send(req.user)
      }
    });


//POST register page
router.post('/register', function(req, res, next) {
  //Saving the Details
  User.findByIdAndUpdate(req.user.id, {
    name : req.body.name,
    mobNo : req.body.mobNo,
    userType : req.body.userType
  }, function(err, doc) {
    if(err){
       console.log(err)
      } 
      res.redirect('/')
  })
})

//POST editProfile page
router.post('/editProfile', function(req, res, next) {
  User.findByIdAndUpdate(req.user.id, {
    name : req.body.name,
    mobNo : req.body.mobNo
  }, function(err, doc){
    if(err){
      console.log(err)
    } 
  })
  res.render('editProfile', {user: req.user, updated: true})
})

//POST deleteProfile page
router.post('/deleteProfile', function(req, res, next) {
  User.findByIdAndRemove(req.user.id, function(err){
    if(err){
        console.log(err)
    } else {
        res.redirect("/");
    }
 });
})

//POST createClass page
router.post('/createClass', function(req, res) {
  new Class({
    nameOfClass: req.body.nameOfClass,
    date: req.body.date,
    description: req.body.description,
    studentsEnrolled: req.body.student,
    teacherId: req.user.id,
    teacherName: req.user.name
  }).save().then((classCreated) => {
    res.redirect('/')
})
})

//POST updateClass page
router.post('/updateClass',function(req, res) {
  Class.findByIdAndUpdate(req.body.updateClassId, {
    nameOfClass: req.body.nameOfClass,
    date: req.body.date,
    description: req.body.description,
    studentsEnrolled: req.body.student
  }, function(err, updatedResult) {
    if(err) {
      console.log(err);
    } else {
      res.redirect("/")
    }
  })
})

//POST deleteClass page
router.post('/deleteClass', function(req, res, next) {
  console.log(req.body.deleteClassId)
  Class.findByIdAndRemove(req.body.deleteClassId, function(err){
    if(err){
       console.log(err)
    } else {
        res.redirect("/");
    }
 });
})

module.exports = router;

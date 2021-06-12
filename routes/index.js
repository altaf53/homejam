var express = require('express');
var router = express.Router();
const passport = require('passport');
const config = require('../bin/config/config.js');
var url = require('url');
const User = require('../models/User');
const Class = require('../models/Class');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {user: req.user});
});

//LOGOUT function
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

//GET teacherDash 
router.get('/teacherDash', (req, res) => {
  if(req.user.userType === 'teacher') {

    //Fetch all classes
    Class.find({teacherId: req.user.id}, function(err, docs) {
      if(err) {
        console.log(err);
      } else {
        console.log(docs)
        res.render('teacherDash', {user: req.user, classes: docs});
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
      } else {
        console.log(doc)
      }
  })
  res.redirect('/')
})

//POST editProfile page
router.post('/editProfile', function(req, res, next) {
  User.findByIdAndUpdate(req.user.id, {
    name : req.body.name,
    mobNo : req.body.mobNo
  }, function(err, doc){
    if(err){
      console.log(err)
    } else {
      console.log(doc)
    }
  })
  // next()
  res.render('editProfile', {user: req.user, updated: true})
})

//POST deleteProfile page
router.post('/deleteProfile', function(req, res, next) {
  User.findByIdAndRemove(req.user.id, function(err){
    if(err){
        // res.redirect("/campgrounds");
    } else {
        res.redirect("/");
    }
 });
})

//POST createClass page
router.post('/createClass', function(req, res) {
  console.log(req.body.nameOfClass);
  console.log(req.body.date);
  console.log(req.body.description);
  console.log(req.body.student);

  new Class({
    nameOfClass: req.body.nameOfClass,
    date: req.body.date,
    description: req.body.description,
    studentsEnrolled: req.body.student,
    teacherId: req.user.id
  }).save().then((classCreated) => {
    console.log("New class created : " + classCreated)
    res.redirect('/createClass')
})
})

module.exports = router;

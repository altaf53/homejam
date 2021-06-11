var express = require('express');
var router = express.Router();
const passport = require('passport');
const config = require('../bin/config/config.js');
var url = require('url');
const request = require('request');
const User = require('../models/User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {user: req.user});
});

//LOGOUT function
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
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
})

//POST editProfile pager
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

module.exports = router;

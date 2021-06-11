var express = require('express');
var router = express.Router();
const passport = require('passport');
const config = require('../bin/config/config.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// router.get('/login', function(req, res, next) {
//   // res.render('index');
//   passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] });
  
// });

router.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      res.send('success');
    });

module.exports = router;

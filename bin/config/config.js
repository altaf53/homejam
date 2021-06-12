var passport = require('passport');
const mongoose = require('mongoose');
const User = require('../../models/User')

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    proxy: true ,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    //    console.log(profile)
       User.findOne({googleId: profile.id}).then((currentUser) => {
           if(currentUser){
               console.log("user exists");
               done(null, currentUser);
           } else {
               new User({
                   name : profile.displayName,
                   googleId : profile.id
               }).save().then((newUser) => {
                   console.log("New user created : " + newUser)
                   done(null, newUser)
               })
           }
       })
  }
));

//MONGO CONNECTION

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});

let connection = mongoose.connection;


  connection.on('connected', () => {
    console.log("Connected successfully to Database");
  });

  connection.on('error', (err) => {
    console.log("Database Error : ", err);
  });

  connection.on('disconnected', () => {
    console.log("Database is disconnected, check your connections");
  });
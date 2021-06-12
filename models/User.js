const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    googleId : {
        type: String
    },
    name : {
        type : String,
        required : true,
        trim : true
    },
    userType : {
        type : String
    },
    mobNo : {
        type : Number
    }
})

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');
const User = require('./User');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    date : {
        type: String
    },
    nameOfClass : {
        type : String
    },
    description : {
        type : String
    },
    studentsEnrolled : {
        type : Array
    },
    teacherId : {
        type : String
    },
    teacherName: {
        type: String
    }
})

module.exports = mongoose.model('Class', userSchema);
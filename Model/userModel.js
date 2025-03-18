const mongoose = require('mongoose');
const userSchema =new  mongoose.Schema({
       name : {
        type : String,//dataType
        required:true,//validate
       },
       gmail: {
        type : String,//dataType
        required:true,//validate
       },
       age : {
        type : Number,//dataType
        required:true,//validate
       },
       address: {
        type : String,//dataType
        required:true,//validate
       }

});

module.exports = mongoose.model(
    'user',//file name
     userSchema//function name
);
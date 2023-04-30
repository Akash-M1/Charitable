const mongoose = require('mongoose');


const authSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required:true
    },
    auth_key:{
        type:String,
        required:true
    },
    isValid:{
        type:Boolean,
        required:true
    }
},{timestamps:true});

authSchema.index({createdAt: 1},{expireAfterSeconds: 1800});


module.exports = mongoose.model('Email_Auth',authSchema,'email_auth');
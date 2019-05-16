const mongoose = require('mongoose');
const {check} = require('express-validator/check');

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
    },
    username:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    admin:{
        type:Number,
    }
});

const User = mongoose.model('User', UserSchema);

const validateUser = [
    check('name', 'Name must have a value').not().isEmpty({ ignore_whitespace: false }),
    check('email', 'Email must not be empty').not().isEmpty({ ignore_whitespace: false }),
];

exports.User = User;
exports.validateUser = validateUser;
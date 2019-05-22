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
    check('name', 'Name is required').not().isEmpty({ ignore_whitespace: false }),
    check('email', 'Email is required').isEmail().not().isEmpty({ ignore_whitespace: false }),
    check('username', 'Username is required').not().isEmpty({ ignore_whitespace: false }),
    check('password', 'Password is required').isLength({ min: 4 }).not().isEmpty({ ignore_whitespace: false }),
    check("password2", "invalid password")
        .custom((value,{req, loc, path}) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            } else {
                return value;
            }
        })
];

exports.User = User;
exports.validateUser = validateUser;
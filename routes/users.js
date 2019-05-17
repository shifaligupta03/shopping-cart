const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const {User, validateUser} = require('../models/user');
const validateUserBody = require('../middleware/user');
// const title = 'Register';

router.get('/register', async(req, res) => {
    res.render('register',{title: 'Register'});
});

router.post('/register', validateUser, validateUserBody, async(req, res) => {
    let {name, email, username, password, password2} = {...req.body};
    let user = await User.findOne({username});
    if(user){
        req.flash('danger', 'Username already exists. Please choose another.');
        return res.render('register', {...req.body});
    }
    let salt = await bcrypt.genSalt(10);
    password = await bcrypt.hash(password,salt);
    user = new User({name, email, username,passport,admin:1});
    user = await user.save();
    req.flash('success', 'You are now registered.');
    res.redirect('/users/login');

});


module.exports = router;
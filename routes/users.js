const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const {User, validateUser} = require('../models/user');
const validateUserBody = require('../middleware/user');

router.get('/register', async(req, res) => {
    res.render('register',{title:'Register'});
});

router.post('/register', validateUser, validateUserBody, async(req, res) => {
    let {name, email, username, password, password2} = {...req.body};
    let user = await User.findOne({username});
    if(user){
        req.flash('danger', 'Username already exists. Please choose another.');
        return res.render('/users/register', {...req.body});
    }
    res.render('register',{title:'Register'});
});


module.exports = router;
const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const {User} = require('../models/user');

router.get('/register', async(req, res) => {
    res.render('register',{title:'Register'});
});


module.exports = router;
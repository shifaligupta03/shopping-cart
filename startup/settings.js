const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const fileUpload = require('express-fileupload');
const {Page} = require('../models/page');
const {category} = require('../models/category');
const passport = require('passport');

module.exports = function (express, app) {
    app.set('views', path.join('views'));
    app.set('view engine', 'ejs');

    app.use(express.static(path.join('public')));

    app.locals.errors = null;
    app.locals.cart = [];

    app.use(fileUpload());

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    // Get all pages to pass to header
    Page.find().sort({sorting:1}).exec(function(err, pages){
        if (err) console.log(err);
        app.locals.pages = pages;
    });

    // Get all categories
    category.find().sort({ sorting: 1 }).exec(function (err, categories) {
        if (err) console.log(err);
        app.locals.categories = categories;
    });

    app.use(require('connect-flash')());
    app.use(function (req, res, next) {
        res.locals.messages = require('express-messages')(req, res);
        next();
    });

    app.use(session({
        secret: 'keyboard cat',
        cart:[],
        resave: true,
        saveUninitialized: true,
        // cookie: { secure: true }
    }));

    //Passport config
    require('../config/passport')(passport);

    //Passport middleware
    app.use(passport.initialize());
    app.use(passport.session());

    app.get("*", function(req, res, next){
        res.locals.cart = (req.session && req.session.cart) ? req.session.cart : [];
        next();
    });
}
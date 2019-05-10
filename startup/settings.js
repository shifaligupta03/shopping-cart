const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const fileUpload = require('express-fileupload');


module.exports = function (express, app) {
    app.set('views', path.join('views'));
    app.set('view engine', 'ejs');

    app.use(express.static(path.join('public')));

    app.locals.errors = null;

    app.use(fileUpload());

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use(require('connect-flash')());
    app.use(function (req, res, next) {
        res.locals.messages = require('express-messages')(req, res);
        next();
    });

    app.use(session({
        secret: 'keyboard cat',
        resave: true,
        saveUninitialized: true,
        // cookie: { secure: true }
    }));
}
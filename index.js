const express = require('express');
const app = express();
const {Page} = require('./models/page');


require('./startup/database')();
require('./startup/settings')(express, app);
require('./startup/routes')(app);

// Get all pages to pass to header
Page.find().sort({sorting:1}).exec(function(err, pages){
    if (err) console.log(err);
    app.locals.pages = pages;
});


const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log('server listening at port '+port);
})
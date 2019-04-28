const express = require('express');
const app = express();

require('./startup/database')();
require('./startup/settings')(express, app);
require('./startup/routes')(app);

const port = process.env.PORT || 3000;
app.listen(port, function(){
    console.log('server listening at port '+port);
})
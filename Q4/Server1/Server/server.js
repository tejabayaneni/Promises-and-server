

const express = require('express');
const api= require('./api');
const bodyParser = require('body-parser');
const app = express();



// Parsers for POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use('/',function(req,res,next){
    console.log()
    console.log(req.method," : ",req.url);
    next()
});

// Set our api routes
app.use('/', api);

/**
 * Get port from environment and store in Express.
 */
const port = process.env.PORT || '3000';
app.set('port', port);

app.listen(port);

console.log("Server Listening on post : ",port);


module.exports = app;



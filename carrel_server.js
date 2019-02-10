const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const path = require('path');
//const fs = require('fs');
app.use(expressValidator());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/public')));
var constant = require('./connection/constant');
var user = require('./controller/user'); 
global.date = require('date-and-time');


var port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

app.listen(port);
user.configure(app);
var thankyouindex = require('./controller/thankyou');
var addbook = require('./controller/addbooks');

app.use('/addbooks',addbook);
app.use('/thank',thankyouindex);

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

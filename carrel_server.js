const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const path = require('path');
var multer = require('multer');
//const fs = require('fs');
app.use(expressValidator());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));



var constant = require('./connection/constant');
var user = require('./controller/user'); 
var teacher = require('./controller/teacher');
var addimage = require('./controller/AddImage');
global.date = require('date-and-time');


var port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

app.listen(port);
user.configure(app);
teacher.configure(app);
var thankyouindex = require('./controller/thankyou');
var addbook = require('./controller/addbooks');
var stationary = require('./controller/Stationary');
var thankyoustat = require('./controller/tankyoustat');
var add = require('./controller/AddIm' +
    'age');

app.use('/addbooks',addbook);
app.use('/thank',thankyouindex);
app.use('/stationary',stationary);
app.use('/thankyoustat',thankyoustat);
app.use('/add',add);

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

const express = require('express');
const app = express();
var bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const path = require('path');
//const fs = require('fs');
app.use(expressValidator());
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));
var constant = require('./connection/constant');
var user = require('./controller/user'); 
global.date = require('date-and-time');


var port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

app.listen(port);
user.configure(app);

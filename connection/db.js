// var mysql = require('mysql');
// // for localhost
//  var con = mysql.createConnection({
//    host: "localhost",
//    user: "root",
//   // password:"shanti@mysql",
//    //password: "",
//    port:3306,
//   database : "carrel"
//  });
// // for aws server
// //~ var con = mysql.createConnection({
//   //~ host: "parkingtips.cnrgreghlopp.us-east-2.rds.amazonaws.com",
//   //~ user: "sagarjain",
//   //~ password: "sagarjain2010",
//   //~ port:3306,
//   //~ database : "checkintravel"
//   //~ ///port:"4000"
// //~ });
// con.connect(function(err) {
//   if (err) throw err;
//   console.log("DataBase Connected!!");
// });
// module.exports = con;


var mysql = require('mysql');
var db_constants = require('../constants/db_constants');
var connection = mysql.createConnection({
    host:db_constants.db_host,
    user:db_constants.db_user,
    password:db_constants.db_password,
    database:db_constants.db_name,
    port:db_constants.db_port
});

connection.connect(function (err) {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database Succesfully.');
});

module.exports = connection;
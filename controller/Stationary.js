var express = require('express');
var router = express.Router();
var multer = require('multer');
var dbconnect = require('../connection/db');

var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null,'../public');
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

var upload = multer({ storage: Storage });

//Field name and max count

router.get("/", function (req, res) {
    res.render('addstationary');
});

router.post("/post", function (req, res) {

    var today = new Date();
    var coulam='product_image,product_type,product_name,description,price,qty,make,created_on,updatetd_on';
    var values1=[["ffff",req.body.product_type,req.body.product_name,req.body.description,req.body.price,req.body.qty,req.body.make,today,today]];
    var query = "INSERT INTO cr_stationary"+"("+coulam+")  VALUES ? ";

    console.log("Vlauesss ------------------>  >");
    console.log(values1);
    dbconnect.query(query, [values1], function (error, results) {
        if (error) {
            console.log(error);
            /* res.json({
                 status:true,
                 message:'there are some error with query'
             })*/
        } else {
            console.log(results);
            var get_last_id = results.insertId;
            var results = "";
            dbconnect.query('SELECT * FROM cr_products WHERE id = ?', [get_last_id], function (error, results) {
                if (error) {
                    console.log(error)
                } else {
                    console.log(results);
                    res.redirect('/thankyoustat')
                }
            });

        }
    })


});

module.exports = router;
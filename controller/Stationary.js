var express = require('express');
var router = express.Router();
var multer = require('multer');
var dbconnect = require('../connection/db');
var Stoarge = require("../connection/Storage");
var upload = multer({storage: Stoarge});


router.get("/", function (req, res) {
    res.render('addstationary');
});

router.post("/post",upload.single('imgUploader'), function (req, res) {

    var today = new Date();
    var coulam='product_image,product_type,product_name,description,price,qty,make,created_on,updatetd_on';
    var values1=[[req.file.filename,req.body.product_type,req.body.product_name,req.body.description,req.body.price,req.body.qty,req.body.make,today,today]];
    var query = "INSERT INTO cr_stationary"+"("+coulam+")  VALUES ? ";

    dbconnect.query(query, [values1], function (error, results) {
        if (error) {
            console.log(error);
        } else {
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
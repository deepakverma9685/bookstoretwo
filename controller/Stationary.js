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
    // var values1=[[req.file.filename,
    // req.body.product_type,
    // req.body.product_name,
    // req.body.description,
    // req.body.price,
    // req.body.qty,
    // req.body.make,
    // today,today]];

    let file = "";
    if(req.file){
        file = req.file.filename;
    }else {
        file = "";
    }

    var today = new Date();
    var add_books = {
        "user_id": 1,
        "book_name":req.body.product_name,
        "publisher":req.body.make,
        "binding":req.body.qty,
        "product_type":req.body.product_type,
        "description":req.body.description,
        "authour":"",
        "price":req.body.price,
        "language":"",
        "isbn":"",
        "weigth":"",
        "school":"",
        "city":"",
        "state":0,
        "country":0,
        "classes":"",
        "publish":"yes",
        "created_by":1,
        "updated_by":1,
        "status":"active",
        "created_on": today,
        "updated_on": today,
        "book_images":file,
    };


    if (add_books != null) {

        dbconnect.query('INSERT INTO cr_products SET ?', add_books, function (error, results) {
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
    }



    // var today = new Date();
    // var coulam='product_image,product_type,product_name,description,price,qty,make,created_on,updatetd_on';
    // var query = "INSERT INTO cr_stationary"+"("+coulam+")  VALUES ? ";
    //
    // dbconnect.query(query, [values1], function (error, results) {
    //     if (error) {
    //         console.log(error);
    //     } else {
    //         var get_last_id = results.insertId;
    //         var results = "";
    //         dbconnect.query('SELECT * FROM cr_products WHERE id = ?', [get_last_id], function (error, results) {
    //             if (error) {
    //                 console.log(error)
    //             } else {
    //                 console.log(results);
    //                 res.redirect('/thankyoustat')
    //             }
    //         });
    //
    //     }
    // })


});

module.exports = router;
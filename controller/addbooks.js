var express = require('express');
var router = express.Router();
var multer = require('multer');
var dbconnect = require('../connection/db');
var Stoarge = require("../connection/Storage");
var upload = multer({storage: Stoarge});

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('addbooks');
});


router.post('/post', upload.single('imgUploader'), function (req, res, nex) {

    var today = new Date();

    let file = "";
    if(req.file){
        file = req.file.filename;
    }else {
        file = "";
    }


    var add_books = {
        "user_id": 1,
        "product_type":"books",
        "book_name":req.body.book_name,
        "publisher": req.body.publisher,
        "binding": req.body.binding,
        "description":req.body.description,
        "authour":req.body.authour,
        "price":req.body.price,
        "language":req.body.language,
        "isbn":req.body.isbn,
        "weigth":"1.5",
        "school":req.body.school,
        "city":req.body.city,
        "state":3,
        "country":1,
        "classes":req.body.classes,
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
                        res.redirect('/thank')
                    }
                });

            }
        })
    }
});

module.exports = router;
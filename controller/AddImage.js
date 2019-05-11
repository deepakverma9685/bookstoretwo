var express = require('express');
var multer = require('multer');
var router = express.Router();
var Stoarge = require("../connection/Storage");
var upload = multer({storage: Stoarge});

//var upload = multer({ storage: Stoarge }).array("imgUploader", 3); //Field name and max count

router.get("/", function (req, res) {
    res.sendFile("D:/Work_Space/NodeRepo/bookstoretwo/index.html");
});


router.post('/api/Upload', upload.single('imgUploader'), function (req, res) {
    if (req.file) {
        console.log('Uploading file...');
        var filename = req.file.filename;
        var uploadStatus = 'File Uploaded Successfully';
        console.log();
    }
    else {
        console.log('No File Uploaded');
        var filename = 'FILE NOT UPLOADED';
        var uploadStatus = 'File Upload Failed';
    }

    /* ===== Add the function to save filename to database ===== */
    console.log({status: uploadStatus, filename: `Name Of File: ${filename}`});
    return res.end("File uploaded sucessfully!.",);
});



module.exports = router;

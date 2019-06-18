var multer = require('multer');
var mydate = Date.now();
var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null,"/home/ubuntu/bookstoretwo/public/images");
    },
    filename: function (req, file, callback) {
        callback(null,file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

module.exports = Storage;
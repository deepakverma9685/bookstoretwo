var multer = require('multer');
var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null,  "public/images");
    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

module.exports = Storage;
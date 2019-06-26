var multer = require('multer');
var mydate = Date.now();
let destination = "";
let env = require("./env");
if(env){
    destination = "/home/ubuntu/bookstoretwo/public/images";
}else {
    destination = "./public/images";
}

var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null,destination);
    },
    filename: function (req, file, callback) {
        callback(null,file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});

module.exports = Storage;
var crypto = require('crypto'),
    algorithm = 'aes192',
    password = 'carrel@12345#ce';


function Encrypt_decrypt() {
  /******************************/
    this.encrpty = function (text){
      var cipher = crypto.createCipher(algorithm,password)
      var crypted = cipher.update(text,'utf8','hex')
      crypted += cipher.final('hex');
      return crypted;
    };
     this.decrypt = function (text) {
        var decipher = crypto.createDecipher(algorithm,password)
       var dec = decipher.update(text,'hex','utf8')
       dec += decipher.final('utf8');
       return dec;
     
    };
     
}

module.exports = new Encrypt_decrypt();
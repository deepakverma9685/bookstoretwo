var db_constant = {};
let env = require("../connection/env");
console.log("environment---- db",env);
if(env){
    db_constant.db_dialect   = process.env.DB_DIALECT    || 'mysql';
    db_constant.db_host      = process.env.DB_HOST       || 'localhost';
    db_constant.db_port      = process.env.DB_PORT       || '3306';
    db_constant.db_name      = process.env.DB_NAME       || 'carrel';
    db_constant.db_user      = process.env.DB_USER       || 'root';
    db_constant.db_password  = process.env.DB_PASSWORD   || 'test';
}else {
    db_constant.db_dialect   = process.env.DB_DIALECT    || 'mysql';
    db_constant.db_host      = process.env.DB_HOST       || 'localhost';
    db_constant.db_port      = process.env.DB_PORT       || '3306';
    db_constant.db_name      = process.env.DB_NAME       || 'carrel';
    db_constant.db_user      = process.env.DB_USER       || 'root';
    db_constant.db_password  = process.env.DB_PASSWORD   || '';
}



module.exports = db_constant;

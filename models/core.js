var connection = require('../connection/db');

function Transaction() {
  /******************************/
 
  // get all table data with condition
    this.select = function (table,where,select,callback){

        // return response to server
          if(where=='')where=1;
          //else where = createCondition(where,operator);
         var query = 'SELECT '+select+' FROM '+table+' where '+where;
         //console.log(query);
         connection.query(query, function (err,result,fields) {
            if (err){
				 callback({status:2,err:err.message});
					}else{
                  callback({status:1,data:result});
			     }
        });
    };
    
// select with pagination

 this.select_all_with_pagin = function (table,where,select,offset,orderby,callback) {

        // return response to server
          if(where=='')where=1;
          //else where = createCondition(where,operator);
         var query = 'SELECT '+select+' FROM '+table+' where '+where+orderby+' Limit '+offset.start+','+offset.limit;
       //console.log(query); 
         connection.query(query, function (err, result,fields) {
           if (err){
				 callback({status:2,err:err.message});
					}else{
                  callback({status:1,data:result});
			     }
        });
    };
    
    // Insert data in tables
    this.insert = function (table, column, value, callback) {

        // insert statment
        let query = "INSERT INTO " + table + "(" + column + ")  VALUES ? ";
        connection.query(query, [value], (err, result, fields) => {
            console.log(err);
            if (err) {
                console.log(err);
                callback({status: 2, err: err.message});
            } else {
                callback({status: 1, data: result});
            }
            // get inserted rows
            //  console.log('Row inserted:' + result.affectedRows);

        });

    };
       //Count all result on
 this.count = function (table,where,callback) {

        // return response to server
          if(where=='')where=1;
          //else where = createCondition(where,operator);
         var query = 'SELECT count(id) as totalcount FROM '+table+' where '+where;
        // console.log(query); return false;
         connection.query(query, function (err, result,fields) {
           if (err){
				 callback({status:2,err:err.message});
					}else{
                  callback({status:1,data:result});
			     }
        });
    };

    // update data in table
    this.update = function (table,value,where,callback){

          // update statment
          let query = "UPDATE "+table+" SET "+value+" WHERE "+where;
              //console.log(query); //return false;
              connection.query(query, function (err, result,fields) {
                 if (err){
					 callback({status:2,err:err.message});
					}else{
                    callback({status:1,data:result});
			     }
                 //res.send(result);
             });

    };

    // delete data in table
    this.delete = function (table,whereCondition,callback) {

          let query = "DELETE FROM "+table+" WHERE "+whereCondition;
          //console.log(query);
              connection.query(query, function (err, result) {
                 if (err){
					 callback({status:2,err:err.message});
					}else{
                    callback({status:1,data:result});
			     }
             });
     };

    //customeQuery
    this.customeQuery = function (query, callback) {
        //console.log(data);return false;
        connection.query(query, function (err, result, fields) {
            if (err) {
                callback({status: 2, err: err});
            }
            else {
                callback({status: 1, data: result});
            }
        });
    };
     //join two table with limit or pagination serach
    this.joinTwoWithWhereLimit = function (select,tbl1,tbl2,feild1,feild2,where,offset,orderby,callback){
           let query="SELECT "+select+" FROM "+tbl1+" JOIN "+tbl2+" ON "+tbl1+"."+feild1+" = "+tbl2+"."+feild2+" WHERE "+where+orderby+" Limit "+offset.start+","+offset.limit+"";
              connection.query(query, function (err, result,fields){
                 if(err){
					 callback({status:2,err:err});	
					 }
				   else
					 {
					 callback({status:1,data:result});								 
					 }
             });
     };
     // two table data row count for pagination
     this.joinTwoWithWhereCount = function (select,tbl1,tbl2,feild1,feild2,where,callback){
           let query="SELECT "+select+" FROM "+tbl1+" JOIN "+tbl2+" ON "+tbl1+"."+feild1+" = "+tbl2+"."+feild2+" WHERE "+where+"";
              connection.query(query, function (err, result,fields){
                 if(err){
					 callback({status:2,err:err});	
					 }
				   else
					 {
					 callback({status:1,data:result});								 
					 }
             });
     };

     //customeQuery
     this.CheckAccessToken = function (table,data,callback){
		          
		          if(data.access_token!=undefined && data.access_token!='')
		           {
                    var where = "`device_id` = '"+data.device_id+"' and `device_type`='"+data.device_type+"' and `access_token`='"+data.access_token+"'";
				    }
				else
				   {
                    var where = "`device_id` = '"+data.device_id+"' and `device_type`='"+data.device_type+"'";
					}    
                  var query = 'SELECT * FROM '+table+' where '+where;
                  //console.log(query);
                    connection.query(query, function (err, result,field){
						//console.log(err);
                         if(err){
							 callback({status:2,err:err});	
							 }
						   else
						     {
                             callback({status:1,data:result});								 
							 }
                         
                    });


      };

  /*******************************************************/



}

//create condition for where AND or OR
function createCondition(where,operator){
        var html = [];
          for (let [key, value] of Object.entries(where)) {
                 html.push('`'+key+"`='"+value+"'");
            }
        return html.join(' '+operator+' ');
}



module.exports = new Transaction();

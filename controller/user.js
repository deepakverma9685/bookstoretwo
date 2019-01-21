//custom route for fetching data
var transactions = require('../models/core');
var EncryptDecrypt = require('../models/encrypt_decrypt');

module.exports = {
    //set up route configuration that will be handle by express server
    configure: function (app) {

    var formate='YYYY-MM-DD HH:mm:ss';
       /**********************/
        

    // Get stdcode 
        app.post('/carrel/get_stdcode', function (req, res){
             req.checkBody('api_key', '*API Key is required.').notEmpty();
             req.checkBody('api_key', '*Invalid api key').equals(ApiKey);
              if(req.validationErrors())
                        {
							  var message=req.validationErrors();
								  // var messg=req.flash();
							  var result={status:0,message:message[0].msg};
							  return res.send(result);
						 }
					 else
						{
						 var where="id !=0";
						  transactions.select('cr_country',where,'*',function(userresult){
							  if(userresult.status==1)
								{
								 if(userresult.data.length>0){
									 res.send({status:1,message:'success',data:userresult.data});
									 }
								else{
									 res.send({status:0,message:'Data not found'});
								   }
							   }
							 else
								{
									res.send({status:0,message:userresult.err});
								 }  
							  
						  });
					  }
							 
             
        });
        
       /**********************/
   
       
       
       
        //Get user Info
        app.post('/carrel/access_token', function (req, res){
               //console.log(req.body);
                req.checkBody('api_key', '*API Key is required.').notEmpty();
                req.checkBody('device_id', '*Device Id  is required.').notEmpty();
                req.checkBody('device_type', '*Device Type is required.').notEmpty();
                req.checkBody('api_key', '*Invalid api key').equals(ApiKey);
              if(req.validationErrors())
                        {
							  var message=req.validationErrors();
								  // var messg=req.flash();
							  var result={status:0,message:message[0].msg};
							  return res.send(result);
						 }
					 else
						 {
							  //Check access token
                               transactions.CheckAccessToken('cr_devices',req.body,function(result)
                                {
								  if(result.status==1)
								    {
									  if(result.data.length<=0)
										 {
										   var d = new Date();
										   var token = d.getTime()+"carrel";
										   var column = '`device_id`,`device_type`, `access_token`, `created_on`';
										   var value1 = [[req.body.device_id,req.body.device_type,token,d]];
										   transactions.insert('cr_devices',column,value1,function(resultisert)
											 {
												 if(resultisert.status==1)
												     {
													    res.send({status:1,message:'success',data:{access_token:token}});
													  }
                                                  else
                                                     {
														 res.send({status:0,message:resultisert.err});
													 }
											  });
										
										
										  }
									   else
										  {
										    res.send({status:1,message:'success',data:{access_token:result.data[0].access_token}});
										  }
								   }
								else
								   {
									   res.send({status:0,message:result.err});
									   
									}  		  
                              });
                        }

        });

       
      
        // Register user
        app.post('/carrel/registartion', function (req, res){
                // console.log(req.body); return false;
                 req.checkBody('api_key', '*API Key is required.').notEmpty();
                 req.checkBody('api_key', '*Invalid api key').equals(ApiKey);
                 req.checkBody('device_id', '*Device Id  is required.').notEmpty();
                 req.checkBody('device_type', '*Device Type is required.').notEmpty();
                 req.checkBody('full_name', '*Firstname is required.').notEmpty();
                 req.checkBody('address', '*address  is required').notEmpty();
                 req.checkBody('email', '*Email address is required.').notEmpty();
                 req.checkBody('password', '*Password is required.').notEmpty();
                 req.checkBody('cpassword', '*Confirm password is required.').notEmpty();
                 req.checkBody('password', '*Password does not match to confirm password').equals(req.body.cpassword);
               
                 if(req.validationErrors())
                        {
							  var message=req.validationErrors();
								  // var messg=req.flash();
							  var result={status:0,message:message[0].msg};
							  return res.send(result);
						 }
					else{
							 
							 var whereuser="email='"+req.body.email+"' AND status!='delete'";
							  transactions.select('cr_users',whereuser,'id',function(userresult){
								  if(userresult.status==1)
									{
									 if(userresult.data.length<=0)
									     {
											 var pass=EncryptDecrypt.encrpty(req.body.password);
											 var d = new Date();
                                             var column='`full_name`,`email`,`password`,`address`,`status`,`created_on`,`updated_on`';
											 
											 var valueisert=[[req.body.full_name,req.body.email,pass,req.body.address,'active',d,d]];
											 
											 transactions.insert('cr_users',column,valueisert,function(temp_res){
												  if(temp_res.status==1){
													   var where="mobile='"+req.body.mobile+"' AND stdcode='"+req.body.stdcode+"'";
				                                       transactions.delete('fd_temp',where,function(deleteres){ });
													  res.send({status:1,message:'success'});
													  }
												   else
													  {
														res.send({status:0,message:temp_res.err});  
													  }	  
											  
												});	 
										 
										 
									      }
									   else res.send({status:0,message:'email already in used'});
									  }
								   else res.send({status:0,message:userresult.err});
								         
							    });
				     		

                               
                        }

        });

        // Login users
        app.post('/carrel/login', function (req, res){
			       req.checkBody('api_key', '*API Key is required.').notEmpty();
			       req.checkBody('api_key', '*Invalid api key').equals(ApiKey);
                   req.checkBody('device_id', '*Device Id  is required.').notEmpty(); 
                   req.checkBody('device_type', '*Device Type is required.').notEmpty();
                   req.checkBody('access_token', '*Access token is required.').notEmpty();
                   req.checkBody('email', '*Email is required.').notEmpty();
                   req.checkBody('password', '*Password is required.').notEmpty();
                        if(req.validationErrors())
                          {
							  var message=req.validationErrors();
								  // var messg=req.flash();
							  var result={status:0,message:message[0].msg};
							  return res.send(result);
						 }
					 else
					    {
                               //Check access token
						   transactions.CheckAccessToken('cr_devices',req.body,function(result){
							  if(result.length<=0){
								  res.send({status:0,message_type:'string',message:'invalid access token'});
							  }else{ 
								  
								    var whereuser="email='"+req.body.email+"' AND status!='delete'";
								   
								    transactions.select('cr_users',whereuser,'id,full_name,address,email,password,status',function(userresult){
										if(userresult.status==1)
										  {
										    if(userresult.data.length==1)
										      {
												 var pass=EncryptDecrypt.encrpty(req.body.password);
												 
												 if(pass==userresult.data[0].password)
												    {
													  if(userresult.data[0].status=='active')
													     {
															var d = new Date();
															
														    delete userresult.data[0].password;
														    
														    var where_delete="user_id='"+userresult.data[0].id+"' AND device_id != '"+req.body.device_id+"' AND access_token != '"+req.body.access_token+"' AND device_type != '"+req.body.device_type+"'";
										                     transactions.delete('cr_devices',where_delete,function(deleteres){ });
										                     
										                    var value_update="`user_id`="+userresult.data[0].id+",`updated_on`='"+d+"'";
										                    var where_update="device_id='"+req.body.device_id+"' AND access_token ='"+req.body.access_token+"' AND device_type='"+req.body.device_type+"'";
										                    transactions.update('cr_devices',value_update,where_update,function(deleteres){ }); 
										                    
										                    res.send({status:1,message:'success',userDetails:userresult.data[0]});
														  
														 }	
	                                                 else res.send({status:0,message:'status is not verified'});       
												  
													}
												 else res.send({status:0,message:'email or password does not match'});       
											
											  }
											 else res.send({status:0,message:'email not registered'});
										   
										  }
									  else res.send({status:0,message:userresult.err});       
									  									
									});
                                    
                                  }
                             });
                        }

        });
       
       /*// forgot_password_send_otp
        app.post('/flydeli/forgot_password_otp', function (req, res){
			       req.checkBody('api_key', '*API Key is required.').notEmpty();
			       req.checkBody('api_key', '*Invalid api key').equals(ApiKey);
                   req.checkBody('device_id', '*Device Id  is required.').notEmpty();
                   req.checkBody('device_type', '*Device Type is required.').notEmpty();
                   req.checkBody('mobile', '*Mobile is required.').notEmpty();
                   req.checkBody('stdcode', '*Stdcode is required.').notEmpty();
                        if(req.validationErrors())
                          {
							  var message=req.validationErrors();
								  // var messg=req.flash();
							  var result={status:0,message:message[0].msg};
							  return res.send(result);
						 }
					 else
					    {
                               //Check access token
						   transactions.CheckAccessToken('fd_devices',req.body,function(result){
							  if(result.length<=0){
								  res.send({status:0,message_type:'string',message:'invalid access token'});
							  }else{ 
								  
								    var whereuser="mobile='"+req.body.mobile+"' AND stdcode="+req.body.stdcode+" AND status='active'";
								   
								    transactions.select('fd_users',whereuser,'id,mobile,status',function(userresult){
										if(userresult.status==1)
										  {
										    if(userresult.data.length>=1)
										      {
												
												var otp=Math.floor(1000 + Math.random() * 9999);
										        var d = new Date();
												
												 
												var value_update="`forgot_otp`='"+otp+"',`updated_on`='"+d+"'";
												var where_update="mobile='"+req.body.mobile+"' AND id="+userresult.data[0].id+"";
												transactions.update('fd_users',value_update,where_update,function(update_res){
													if(update_res.status==1)
													   {
													    //otp send here
													    res.send({status:1,message:'success'});
													    }
													 else res.send({status:0,message:update_res.err});
													 
													 }); 
												
												//res.send({status:1,message:'success',data:userresult.data[0]});
											
											  }
											 else res.send({status:0,message:'Mobile number not registered'});
										   
										  }
									  else res.send({status:0,message:userresult.err});       
									  									
									});
                                    
                                  }
                             });
                        }

        });*/
 
       //// category add and edit post details
        app.post('/carrel/addproduct', function (req, res){
        	req.checkBody('api_key', '*API Key is required.').notEmpty();
			req.checkBody('api_key', '*Invalid api key').equals(ApiKey);
            req.checkBody('device_id', '*Device Id  is required.').notEmpty();
            req.checkBody('device_type', '*Device Type is required.').notEmpty();
            req.checkBody('access_token', '*Access token is required.').notEmpty();
			req.checkBody('uid', 'User id is required').notEmpty();
			req.checkBody('type', 'Type is required').notEmpty();
			if(req.body.type!='get'){
              req.checkBody('publisher', 'publisher is required').notEmpty();
              req.checkBody('binding', 'binding is required').notEmpty();
              req.checkBody('description', 'description is required').notEmpty();
              req.checkBody('authour', 'authour is required').notEmpty();
              req.checkBody('price', 'price is required').notEmpty();
              req.checkBody('language', 'language is required').notEmpty();
              req.checkBody('isbn', 'isbn is required').notEmpty();
              req.checkBody('weigth', 'weigth is required').notEmpty();
              req.checkBody('school', 'school is required').notEmpty();
              req.checkBody('city', 'city is required').notEmpty();
              req.checkBody('state', 'state is required').notEmpty();
              req.checkBody('country', 'country is required').notEmpty();
              req.checkBody('class', 'class is required').notEmpty();
              req.checkBody('publish', 'publish is required').notEmpty();
			}
		
		  if(req.validationErrors()){
			  var message=req.validationErrors();
				  // var messg=req.flash();
			  var result={status:0,message:message[0].msg};
			  return res.send(result);
		   }else{

		   	 transactions.CheckAccessToken('cr_devices',req.body,function(result){
			  if(result.length<=0){
				  res.send({status:0,message_type:'string',message:'invalid access token'});
			  }else{ 
			   if(req.body.type=='get'){
                   var whereuser="id='"+req.body.id+"' AND status!='delete'";
								   
					    transactions.select('cr_products',whereuser,'*',function(userresult){
							if(userresult.status==1)
							  {
                                  res.send({
				                        status:1,
				                        message: 'success',
				                        data:userresult.data[0]
				                      });  
							 }
						 else{
						 	res.send({
                                    status:0,
				                    message:userresult.err
						 	      });
						 }	 
							 
					  });		  	

			   }else{
				var d= new Date();
			    var c_date=date.format(d,formate);
			    
				if(req.body.id!=undefined && req.body.id!=''){
					var catid=req.body.id;                  
					var where="id="+catid;
					var upadte_val="publisher='"+req.body.publisher+"',binding='"+req.body.binding+"',description='"+req.body.description+"',authour='"+req.body.authour+"',price='"+req.body.price+"',language='"+req.body.language+"',isbn='"+req.body.isbn+"',weigth='"+req.body.weigth+"',school='"+req.body.school+"',city='"+req.body.city+"',state='"+req.body.state+"',country='"+req.body.country+"',class='"+req.body.class+"',publish='"+req.body.publish+"',updated_on='"+c_date+"',updated_by='"+req.body.uid+"'";
					transactions.update('cr_products',upadte_val,where,function(resultdata){
				       if(resultdata.status==1){
	                      res.send({
	                        status:1,
	                        message: 'Product updated successfully.'
	                      });      
				          
					    }
				     else res.send({status:0,message:resultdata.err});
				      });
				       
			       }else{
						var coulm="`user_id`,`publisher`,`binding`,`description`,`authour`,`price`,`language`,`isbn`,`weigth`,`school`,`city`,`state`,`country`,`class`,`publish`,`created_on`,`created_by`";
						var values=[[req.body.uid,req.body.publisher,req.body.binding,req.body.description,req.body.authour,req.body.price,req.body.language,req.body.isbn,req.body.weigth,req.body.school,req.body.city,req.body.state,req.body.country,req.body.class,req.body.publish,c_date,req.body.uid]];
						transactions.insert('cr_products',coulm,values,function(resultdata){
							if(resultdata.status==1){
								res.send({
			                        status:1,
			                        message: 'Product added successfully.'
			                      });    
					        }
					      else res.send({status:0,message:resultdata.err});
							
						});
						
					 }
					}	 
                }
			 });
			 		
		 }
        });


 //// category add and edit post details
        app.post('/carrel/product_listing', function (req, res){
        	
                   var whereuser="status='active'";
								   
					    transactions.select('cr_products',whereuser,'*',function(userresult){
							if(userresult.status==1)
							  {
                                  res.send({
				                        status:1,
				                        message: 'success',
				                        data:userresult.data
				                      });  
							 }
						 else{
						 	res.send({
                                    status:0,
				                    message:userresult.err
						 	      });
						 }	 
							 
			   });		
			 		
		 
        });
    
    //Update passsword for user
   app.post('/carrel/update_password', function (req, res){
			       req.checkBody('api_key', '*API Key is required.').notEmpty();
			       req.checkBody('api_key', '*Invalid api key').equals(ApiKey);
                   req.checkBody('device_id', '*Device Id  is required.').notEmpty();
                   req.checkBody('device_type', '*Device Type is required.').notEmpty();
                   req.checkBody('mobile', '*Mobile is required.').notEmpty();
                   req.checkBody('stdcode', '*Stdcode is required.').notEmpty();
                   req.checkBody('otp', '*Otp is required.').notEmpty();
                   req.checkBody('password', '*password is required.').notEmpty();
                   req.checkBody('cpassword', '*Confirm password is required.').notEmpty();
                   req.checkBody('password', '*password and confirm password does not match.').equals(req.body.cpassword);
                        if(req.validationErrors())
                          {
							  var message=req.validationErrors();
								  // var messg=req.flash();
							  var result={status:0,message:message[0].msg};
							  return res.send(result);
						 }
					 else
					    {
                               //Check access token
						   transactions.CheckAccessToken('fd_devices',req.body,function(result){
							  if(result.length<=0){
								  res.send({status:0,message_type:'string',message:'invalid access token'});
							  }else{ 
								  
								    var whereuser="mobile='"+req.body.mobile+"' AND stdcode="+req.body.stdcode+" AND forgot_otp='"+req.body.otp+"' AND status='active'";
								   
								    transactions.select('fd_users',whereuser,'id,mobile',function(userresult){
										if(userresult.status==1)
										  {
										    if(userresult.data.length>=1)
										      {
										        var d = new Date();
				                                 var pass=EncryptDecrypt.encrpty(req.body.password);
				                                 
												var value_update="`forgot_otp`='',password='"+pass+"',`updated_on`='"+d+"'";
												var where_update="mobile='"+req.body.mobile+"' AND id="+userresult.data[0].id+" AND forgot_otp='"+req.body.otp+"'";
												
												transactions.update('fd_users',value_update,where_update,function(update_res){
													if(update_res.status==1)
													   {
													    res.send({status:1,message:'Password updated successfully.'});
													   }
													 else res.send({status:0,message:update_res.err});
													});
												
											
											  }
											 else res.send({status:0,message:'Otp not verified.'});
										   
										  }
									  else res.send({status:0,message:userresult.err});       
									  									
									});
                                    
                                  }
                             });
                        }

        });


    } //configure End
};
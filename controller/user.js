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

            var whereuser="product_type='books'";

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
                transactions.CheckAccessToken('cr_devices',req.body,function(result){
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
        app.post('/carrel/add_to_cart', function (req, res){
            //console.log(req.body);
            req.checkBody('api_key', '*API Key is required.').notEmpty();
            req.checkBody('device_id', '*Device Id  is required.').notEmpty();
            req.checkBody('device_type', '*Device Type is required.').notEmpty();
            req.checkBody('api_key', '*Invalid api key').equals(ApiKey);
            req.checkBody('access_token', '*Access token is required.').notEmpty();
            req.checkBody('business_id', '*Business id is required.').notEmpty();
            req.checkBody('uid', '*User id is required.').notEmpty();
            req.checkBody('product_id', '*Product id is required.').notEmpty();
            req.checkBody('price', '*price is required.').notEmpty();
            req.checkBody('quantity', '*Quantity is required.').notEmpty();
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
                        if(result.data.length>0)
                        {
                            var d= new Date();
                            var date1=date.format(d,formate);
                            var select="SELECT id,business_id FROM cr_cart_items WHERE cart_id='"+req.body.uid+"' LIMIT 1";
                            transactions.customeQuery(select,function(userresult){
                                if(userresult.status==1)
                                {
                                    if(userresult.data.length>0){
                                        if(userresult.data[0].business_id==req.body.business_id){
                                            var selectProduct="SELECT id,quantity FROM cr_cart_items WHERE cart_id='"+req.body.uid+"' AND product_id='"+req.body.product_id+"' AND business_id='"+req.body.business_id+"' LIMIT 1";
                                            transactions.customeQuery(selectProduct,function(productRes){

                                                if(productRes.status==1){

                                                    if(productRes.data.length>0)
                                                    {

                                                        var updateQuery="UPDATE cr_cart_items SET quantity=quantity+"+req.body.quantity+" WHERE id="+productRes.data[0].id+"";
                                                        transactions.customeQuery(updateQuery,function(updateRes){
                                                            if(updateRes.status==1){
                                                                res.send({status:1,message:'success'});
                                                            }
                                                            else res.send({status:0,message:updateRes.err});

                                                        });
                                                    }
                                                    else{
                                                        var coulam='business_id,product_id,quantity,price,cart_id,created_on,created_by';
                                                        var values1=[[req.body.business_id,req.body.product_id,req.body.quantity,req.body.price,req.body.uid,date1,req.body.uid]];

                                                        transactions.insert('cr_cart_items',coulam,values1,function(insertData){
                                                            if(insertData.status==1){
                                                                res.send({status:1,message:'success'});
                                                            }
                                                            else res.send({status:0,message:insertData.err});
                                                        });


                                                    }
                                                }

                                                else res.send({status:0,message:productRes.err});
                                            });
                                        }
                                        else res.send({status:0,message:'You can add only one shop product'});
                                    }
                                    else
                                    {
                                        var coulam='business_id,product_id,quantity,price,cart_id,created_on,created_by';
                                        var values1=[[req.body.business_id,req.body.product_id,req.body.quantity,req.body.price,req.body.uid,date1,req.body.uid]];

                                        transactions.insert('cr_cart_items',coulam,values1,function(insertData){
                                            if(insertData.status==1){
                                                res.send({status:1,message:'success'});
                                            }
                                            else res.send({status:0,message:insertData.err});

                                        });

                                    }

                                }
                                else res.send({status:0,message:userresult.err});

                            });

                        }
                        else
                        {
                            res.send({status:3,message:'Invalid access token'});
                        }
                    }
                    else
                    {
                        res.send({status:0,message:result.err});

                    }
                });
            }

        });

        app.post('/carrel/update_cart_value', function (req, res){
            //console.log(req.body);
            req.checkBody('api_key', '*API Key is required.').notEmpty();
            req.checkBody('device_id', '*Device Id  is required.').notEmpty();
            req.checkBody('device_type', '*Device Type is required.').notEmpty();
            req.checkBody('api_key', '*Invalid api key').equals(ApiKey);
            req.checkBody('access_token', '*Access token is required.').notEmpty();
            req.checkBody('uid', '*User id is required.').notEmpty();
            req.checkBody('product_id', '*Product id is required.').notEmpty();
            req.checkBody('updatetype', '*Update type is required.').notEmpty();

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
                        if(result.data.length>0)
                        {
                            var d= new Date();
                            var date1=date.format(d,formate);
                            var select="SELECT id,quantity FROM cr_cart_items WHERE cart_id='"+req.body.uid+"' AND product_id="+req.body.product_id+" LIMIT 1";
                            transactions.customeQuery(select,function(productRes){
                                if(productRes.status==1)
                                {
                                    if(productRes.data.length>0){
                                        if(req.body.updatetype=='minus'){
                                            if(productRes.data[0].quantity<=1){
                                                var query="DELETE FROM `cr_cart_items` WHERE id="+productRes.data[0].id;
                                            }
                                            else{
                                                var query="UPDATE cr_cart_items SET quantity=quantity-1 WHERE id="+productRes.data[0].id+"";
                                            }
                                        }
                                        else {
                                            var query="UPDATE cr_cart_items SET quantity=quantity+1 WHERE id="+productRes.data[0].id+"";
                                        }
                                        transactions.customeQuery(query,function(updateRes){
                                            if(updateRes.status==1) {
                                                res.send({status:1,message:'success'});
                                            }
                                            else res.send({status:0,message:updateRes.err});
                                        });

                                    }
                                    else res.send({status:0,message:'product not in your cart'});


                                }
                                else res.send({status:0,message:productRes.err});

                            });

                        }
                        else
                        {
                            res.send({status:3,message:'Invalid access token'});
                        }
                    }
                    else
                    {
                        res.send({status:0,message:result.err});

                    }
                });
            }

        });

        app.post('/carrel/delete_cart_product', function (req, res){
            //console.log(req.body);
            req.checkBody('api_key', '*API Key is required.').notEmpty();
            req.checkBody('device_id', '*Device Id  is required.').notEmpty();
            req.checkBody('device_type', '*Device Type is required.').notEmpty();
            req.checkBody('api_key', '*Invalid api key').equals(ApiKey);
            req.checkBody('access_token', '*Access token is required.').notEmpty();
            req.checkBody('uid', '*User id is required.').notEmpty();
            req.checkBody('product_id', '*Product id is required.').notEmpty();

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
                        if(result.data.length>0)
                        {

                            var select="SELECT id,quantity FROM cr_cart_items WHERE cart_id='"+req.body.uid+"' AND product_id="+req.body.product_id+" LIMIT 1";
                            transactions.customeQuery(select,function(productRes){
                                if(productRes.status==1)
                                {
                                    if(productRes.data.length>0){
                                        var query="DELETE FROM `cr_cart_items` WHERE id="+productRes.data[0].id;
                                        transactions.customeQuery(query,function(updateRes){
                                            if(updateRes.status==1) {
                                                res.send({status:1,message:'success'});
                                            }
                                            else res.send({status:0,message:updateRes.err});
                                        });

                                    }
                                    else res.send({status:0,message:'product not in your cart'});


                                }
                                else res.send({status:0,message:productRes.err});

                            });

                        }
                        else
                        {
                            res.send({status:3,message:'Invalid access token'});
                        }
                    }
                    else
                    {
                        res.send({status:0,message:result.err});

                    }
                });
            }

        });

        app.post('/carrel/cart_product_count', function (req, res){
            //console.log(req.body);
            req.checkBody('api_key', '*API Key is required.').notEmpty();
            req.checkBody('device_id', '*Device Id  is required.').notEmpty();
            req.checkBody('device_type', '*Device Type is required.').notEmpty();
            req.checkBody('api_key', '*Invalid api key').equals(ApiKey);
            req.checkBody('access_token', '*Access token is required.').notEmpty();
            req.checkBody('uid', '*User id is required.').notEmpty();
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
                        if(result.data.length>0)
                        {

                            var select="SELECT SUM(quantity) as totalcount FROM cr_cart_items WHERE cart_id='"+req.body.uid+"'";
                            transactions.customeQuery(select,function(productRes){
                                if(productRes.status==1) {
                                    if (productRes.data[0]!=null){

                                        var select = "SELECT SUM(quantity * price) as totalcount FROM cr_cart_items WHERE cart_id='"+req.body.uid+"'";
                                        transactions.customeQuery(select,function(product){
                                            if(product.status==1) {
                                                if (product.data[0]!=null){
                                                    res.send({status:1,countData:{totalcount:productRes.data[0].totalcount,pricetotal:product.data[0].totalcount}});
                                                }else {
                                                    res.send({status:1,countData:{totalcount:0}});
                                                }
                                            }
                                            else res.send({status:0,message:productRes.err});

                                        });

                                        //res.send({status:1,countData:{totalcount:productRes.data[0].totalcount}});
                                    }else {
                                        res.send({status:1,countData:{totalcount:0}});
                                    }
                                }
                                else res.send({status:0,message:productRes.err});

                            });

                        }
                        else
                        {
                            res.send({status:3,message:'Invalid access token'});
                        }
                    }
                    else
                    {
                        res.send({status:0,message:result.err});

                    }
                });
            }

        });


        app.post('/carrel/cart_product_listing', function (req, res){
            //console.log(req.body);
            req.checkBody('api_key', '*API Key is required.').notEmpty();
            req.checkBody('device_id', '*Device Id  is required.').notEmpty();
            req.checkBody('device_type', '*Device Type is required.').notEmpty();
            req.checkBody('api_key', '*Invalid api key').equals(ApiKey);
            req.checkBody('access_token', '*Access token is required.').notEmpty();
            req.checkBody('uid', '*User id is required.').notEmpty();
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
                        if(result.data.length>0)
                        {
                            var where="cr_cart_items.cart_id="+req.body.uid;
                            var select="`cr_cart_items`.*,`cr_products`.*,`cr_products`.`id` as pid";
                            transactions.joinTwoWithWhereCount(select,'cr_cart_items','cr_products','product_id','id',where,function(productRes){
                                if(productRes.status==1)
                                {
                                    res.send({status:1,cartData:productRes.data});
                                }
                                else res.send({status:0,message:productRes.err});

                            });

                        }
                        else
                        {
                            res.send({status:3,message:'Invalid access token'});
                        }
                    }
                    else
                    {
                        res.send({status:0,message:result.err});

                    }
                });
            }

        });



        app.post('/carrel/checkout', function (req, res){
            //console.log(req.body);
            req.checkBody('api_key', '*API Key is required.').notEmpty();
            req.checkBody('device_id', '*Device Id  is required.').notEmpty();
            req.checkBody('device_type', '*Device Type is required.').notEmpty();
            req.checkBody('api_key', '*Invalid api key').equals(ApiKey);
            req.checkBody('access_token', '*Access token is required.').notEmpty();
            req.checkBody('uid', '*User id is required.').notEmpty();
            if(req.validationErrors())
            {
                var message=req.validationErrors();
                // var messg=req.flash();
                var result={status:0,message:message[0].msg};
                return res.send(result);
            }
            else {
                //Check access token
                transactions.CheckAccessToken('cr_devices',req.body,function(result) {
                    if(result.status==1) {
                        if(result.data.length>0) {

                            var select="SELECT * FROM `cr_cart_items` WHERE cart_id="+req.body.uid;
                            transactions.customeQuery(select,function(productRes){
                                if(productRes.status==1) {
                                    if(productRes.data.length>0){
                                        var column='`user_id`,`merchant_id`,`total_price`,`pay_status`,`status`,`created_by`,`created_on`';
                                        var total=0;

                                        for(var i=0; i<productRes.data.length;i++){
                                            total+=productRes.data[i].price;
                                        }
                                        var d= new Date();
                                        var date1=date.format(d,formate);

                                        var valueisert=[[req.body.uid,productRes.data[0].business_id,total,'cash','confirmed',req.body.uid,date1]];

                                        transactions.insert('cr_booking',column,valueisert,function(insertRes,error){

                                            if(insertRes.status==1){

                                                let insert=[];
                                                var coulm="booking_id,product_id,quantity,price,created_on,created_by";
                                                for(var i=0; i<productRes.data.length;i++){
                                                    var isrT=[insertRes.data.insertId,productRes.data[i].product_id,productRes.data[i].quantity,productRes.data[i].price,date1,req.body.uid];
                                                    insert.push(isrT);

                                                }
                                                transactions.insert('cr_booking_detail',coulm,insert,function(inserTdelt){

                                                    if(inserTdelt.status==1){

                                                        var delteCart="DELETE FROM `cr_cart_items` WHERE cart_id="+req.body.uid;
                                                        transactions.customeQuery(delteCart,function(dletRes){
                                                            if(dletRes.status==1){
                                                                res.send({status:1,message:"Order place successfully."});

                                                            }
                                                            else  res.send({status:0,message:dletRes.err});

                                                        });
                                                    }
                                                    else res.send({status:0,message:inserTdelt.err});


                                                });

                                            }
                                            else res.send({status:0,message:"You have not any product in your cart. fist onne"});

                                        });


                                    }else res.send({status:0,message:"You have not any product in your cart."});
                                    //res.send({status:1,cartData:productRes.data});
                                }
                                else res.send({status:0,message:productRes.err});

                            });

                        }
                        else
                        {
                            res.send({status:3,message:'Invalid access token'});
                        }
                    }
                    else
                    {
                        res.send({status:0,message:result.err});

                    }
                });
            }

        });


        app.post('/carrel/askque', function (req, res) {
            //console.log(req.body);
            req.checkBody('api_key', '*API Key is required.').notEmpty();
            req.checkBody('device_id', '*Device Id  is required.').notEmpty();
            req.checkBody('device_type', '*Device Type is required.').notEmpty();
            req.checkBody('api_key', '*Invalid api key').equals(ApiKey);
            req.checkBody('access_token', '*Access token is required.').notEmpty();
            req.checkBody('uid', '*User id is required.').notEmpty();
            req.checkBody('question', '*Question is required.').notEmpty();
            if (req.validationErrors()) {
                var message = req.validationErrors();
                // var messg=req.flash();
                var result = {status: 0, message: message[0].msg};
                return res.send(result);
            }
            else {
                //Check access token
                transactions.CheckAccessToken('cr_devices', req.body, function (result) {
                    if (result.status == 1) {
                        if (result.data.length > 0) {
                            var d= new Date();
                            var date1=date.format(d,formate);
                            var column='`user_id`,`question`,`created_by`,`created_on`';
                            var valueisert=[[req.body.uid,req.body.question,req.body.uid,date1]];

                            transactions.insert('cr_student_que', column, valueisert, function (inserTdelt) {

                                if (inserTdelt.status == 1) {
                                    res.send({status: 1, message: 'Question Posted Successfully'});
                                } else{
                                    res.send({status: 0, message: inserTdelt.err});
                                }
                            });

                        } else {
                            res.send({status: 3, message: 'Invalid access token'});
                        }
                    } else {
                        res.send({status: 0, message: result.err});

                    }
                });
            }

        });

        app.post('/carrel/answer_que', function (req, res) {
            //console.log(req.body);
            req.checkBody('api_key', '*API Key is required.').notEmpty();
            req.checkBody('device_id', '*Device Id  is required.').notEmpty();
            req.checkBody('device_type', '*Device Type is required.').notEmpty();
            req.checkBody('api_key', '*Invalid api key').equals(ApiKey);
            req.checkBody('access_token', '*Access token is required.').notEmpty();
            req.checkBody('uid', '*User id is required.').notEmpty();
            req.checkBody('que_id', '*Question  id is required.').notEmpty();
            req.checkBody('role', '*role is required.').notEmpty();
            req.checkBody('teacher', '*teacher name is required.').notEmpty();
            req.checkBody('answer', '*answer is required.').notEmpty();
            if (req.validationErrors()) {
                var message = req.validationErrors();
                // var messg=req.flash();
                var result = {status: 0, message: message[0].msg};
                return res.send(result);
            }
            else {
                //Check access token
                transactions.CheckAccessToken('cr_devices', req.body, function (result) {
                    if (result.status == 1) {
                        if (result.data.length > 0) {
                            var d= new Date();
                            var date1=date.format(d,formate);
                            var column='`user_id`,`que_id`,`role`,`teacher`,`answer`,`created_by`,`created_on`';
                            var valueisert=[[req.body.uid,req.body.que_id,req.body.role,req.body.teacher,req.body.answer,req.body.uid,date1]];

                            transactions.insert('cr_student_ans', column, valueisert, function (inserTdelt) {

                                if (inserTdelt.status == 1) {
                                    res.send({status: 1, message: 'Answer Posted Successfully'});
                                } else{
                                    res.send({status: 0, message: inserTdelt.err});
                                }
                            });

                        } else {
                            res.send({status: 3, message: 'Invalid access token'});
                        }
                    } else {
                        res.send({status: 0, message: result.err});

                    }
                });
            }

        })

        app.post('/carrel/tutors', function (req, res) {
            //console.log(req.body);
            req.checkBody('api_key', '*API Key is required.').notEmpty();
            req.checkBody('device_id', '*Device Id  is required.').notEmpty();
            req.checkBody('device_type', '*Device Type is required.').notEmpty();
            req.checkBody('api_key', '*Invalid api key').equals(ApiKey);
            req.checkBody('access_token', '*Access token is required.').notEmpty();
            req.checkBody('uid', '*User id is required.').notEmpty();
            if (req.validationErrors()) {
                var message = req.validationErrors();
                // var messg=req.flash();
                var result = {status: 0, message: message[0].msg};
                return res.send(result);
            }
            else {
                //Check access token
                transactions.CheckAccessToken('cr_devices', req.body, function (result) {
                    if (result.status == 1) {
                        if (result.data.length > 0) {


                            var selectProduct='SELECT * FROM cr_institute WHERE teachtype = "tutor"';
                            transactions.customeQuery(selectProduct,function(productRes){
                                if(productRes.status==1) {
                                    res.send({
                                        status:1,
                                        message: 'success',
                                        data:productRes.data
                                    });
                                }
                                else{
                                    res.send({
                                        status:0,
                                        message:productRes.err
                                    });
                                }
                            });

                        } else {
                            res.send({status: 3, message: 'Invalid access token'});
                        }
                    } else {
                        res.send({status: 0, message: result.err});

                    }
                });
            }

        })


        app.post('/carrel/coachings', function (req, res) {
            //console.log(req.body);
            req.checkBody('api_key', '*API Key is required.').notEmpty();
            req.checkBody('device_id', '*Device Id  is required.').notEmpty();
            req.checkBody('device_type', '*Device Type is required.').notEmpty();
            req.checkBody('api_key', '*Invalid api key').equals(ApiKey);
            req.checkBody('access_token', '*Access token is required.').notEmpty();
            req.checkBody('uid', '*User id is required.').notEmpty();
            if (req.validationErrors()) {
                var message = req.validationErrors();
                // var messg=req.flash();
                var result = {status: 0, message: message[0].msg};
                return res.send(result);
            }
            else {
                //Check access token
                transactions.CheckAccessToken('cr_devices', req.body, function (result) {
                    if (result.status == 1) {
                        if (result.data.length > 0) {


                            var selectProduct='SELECT * FROM cr_institute WHERE teachtype = "coaching"';
                            transactions.customeQuery(selectProduct,function(productRes){
                                if(productRes.status==1) {
                                    res.send({
                                        status:1,
                                        message: 'success',
                                        data:productRes.data
                                    });
                                }
                                else{
                                    res.send({
                                        status:0,
                                        message:productRes.err
                                    });
                                }
                            });

                        } else {
                            res.send({status: 3, message: 'Invalid access token'});
                        }
                    } else {
                        res.send({status: 0, message: result.err});

                    }
                });
            }

        })


        app.post('/carrel/stationary', function (req, res) {
            //console.log(req.body);
            req.checkBody('api_key', '*API Key is required.').notEmpty();
            req.checkBody('device_id', '*Device Id  is required.').notEmpty();
            req.checkBody('device_type', '*Device Type is required.').notEmpty();
            req.checkBody('api_key', '*Invalid api key').equals(ApiKey);
            req.checkBody('access_token', '*Access token is required.').notEmpty();
            req.checkBody('uid', '*User id is required.').notEmpty();
            if (req.validationErrors()) {
                var message = req.validationErrors();
                // var messg=req.flash();
                var result = {status: 0, message: message[0].msg};
                return res.send(result);
            }
            else {
                //Check access token
                transactions.CheckAccessToken('cr_devices', req.body, function (result) {
                    if (result.status == 1) {
                        if (result.data.length > 0) {

                            var whereuser="product_type!='books'";

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



                            // var selectProduct='SELECT * FROM cr_stationary';
                            // transactions.customeQuery(selectProduct,function(productRes){
                            //     if(productRes.status==1) {
                            //         res.send({
                            //             status:1,
                            //             message: 'success',
                            //             data:productRes.data
                            //         });
                            //     }
                            //     else{
                            //         res.send({
                            //             status:0,
                            //             message:productRes.err
                            //         });
                            //     }
                            // });

                        } else {
                            res.send({status: 3, message: 'Invalid access token'});
                        }
                    } else {
                        res.send({status: 0, message: result.err});

                    }
                });
            }

        })


        app.post('/carrel/myorders', function (req, res) {
            //console.log(req.body);
            req.checkBody('api_key', '*API Key is required.').notEmpty();
            req.checkBody('device_id', '*Device Id  is required.').notEmpty();
            req.checkBody('device_type', '*Device Type is required.').notEmpty();
            req.checkBody('api_key', '*Invalid api key').equals(ApiKey);
            req.checkBody('access_token', '*Access token is required.').notEmpty();
            req.checkBody('uid', '*User id is required.').notEmpty();
            if (req.validationErrors()) {
                var message = req.validationErrors();
                var result = {status: 0, message: message[0].msg};
                return res.send(result);
            }
            else {
                //Check access token
                transactions.CheckAccessToken('cr_devices', req.body, function (result) {
                    if (result.status == 1) {
                        if (result.data.length > 0) {
                            var selectProduct='SELECT * FROM cr_booking WHERE user_id='+req.body.uid;
                            transactions.customeQuery(selectProduct,function(productRes){
                                if(productRes.status==1) {
                                    let id = productRes.data[0].id;
                                    var select='SELECT * FROM cr_booking_detail WHERE booking_id='+id;
                                    transactions.customeQuery(select,function(restwo){
                                        if(restwo.status==1) {
                                            let id = restwo.data[0].product_id;
                                            var selectpro='SELECT * FROM cr_products WHERE id='+id;
                                            transactions.customeQuery(selectpro,function(restwo){
                                                if(restwo.status==1) {
                                                    res.send({
                                                        status:1,
                                                        message: 'success',
                                                        data:restwo.data
                                                    });
                                                }
                                                else{
                                                    res.send({
                                                        status:0,
                                                        message:restwo.err
                                                    });
                                                }
                                            });

                                            // res.send({
                                            //     status:1,
                                            //     message: 'success',
                                            //     data:restwo.data
                                            // });
                                        }
                                        else{
                                            res.send({
                                                status:0,
                                                message:restwo.err
                                            });
                                        }
                                    });


                                    // res.send({
                                    //     status:1,
                                    //     message: 'success',
                                    //     data:productRes.data
                                    // });
                                }
                                else{
                                    res.send({
                                        status:0,
                                        message:productRes.err
                                    });
                                }
                            });

                        } else {
                            res.send({status: 3, message: 'Invalid access token'});
                        }
                    } else {
                        res.send({status: 0, message: result.err});

                    }
                });
            }

        })



    } //configure End
};
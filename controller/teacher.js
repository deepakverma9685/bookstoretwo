//custom route for fetching data
var transactions = require('../models/core');
var EncryptDecrypt = require('../models/encrypt_decrypt');


module.exports = {
    //set up route configuration that will be handle by express server
    configure: function (app) {

        var formate = 'YYYY-MM-DD HH:mm:ss';
        /**********************/

        app.post('/carrel/reg_institute', function (req, res) {
            //console.log(req.body);
            req.checkBody('api_key', '*API Key is required.').notEmpty();
            req.checkBody('device_id', '*Device Id  is required.').notEmpty();
            req.checkBody('device_type', '*Device Type is required.').notEmpty();
            req.checkBody('api_key', '*Invalid api key').equals(ApiKey);
            req.checkBody('access_token', '*Access token is required.').notEmpty();

            req.checkBody('uid', '*User id is required.').notEmpty();
            req.checkBody('address', '*Address is required.').notEmpty();
            req.checkBody('latitude', '*Latitutde is required.').notEmpty();
            req.checkBody('longitude', '*Longitude is required.').notEmpty();
            req.checkBody('insti_image', '*Image is required.').notEmpty();
            req.checkBody('stc', '*Subject is required.').notEmpty();
            req.checkBody('insti_name', '*Intitute name is required.').notEmpty();
            req.checkBody('description', '*Description is required.').notEmpty();
            req.checkBody('phone', '*Phone is required.').notEmpty();


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
                            var column='`uid`,`insti_name`,`description`,`address`,`latitude`,`longitude`,`insti_image`,`stc`,`phone`,`created_by`,`created_on`';
                            var valueisert=[[
                                req.body.uid,
                                req.body.insti_name,
                                req.body.description,
                                req.body.address,
                                req.body.latitude,
                                req.body.longitude,
                                req.body.insti_image,
                                req.body.stc,
                                req.body.phone,
                                req.body.uid,
                                date1
                            ]];

                            transactions.insert('cr_institute', column, valueisert, function (inserTdelt) {

                                if (inserTdelt.status == 1) {
                                    res.send({status: 1, message: 'Institute Registered Successfully'});
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


        app.post('/carrel/reg_tutor', function (req, res) {
            //console.log(req.body);
            req.checkBody('api_key', '*API Key is required.').notEmpty();
            req.checkBody('device_id', '*Device Id  is required.').notEmpty();
            req.checkBody('device_type', '*Device Type is required.').notEmpty();
            req.checkBody('api_key', '*Invalid api key').equals(ApiKey);
            req.checkBody('access_token', '*Access token is required.').notEmpty();

            req.checkBody('uid', '*User id is required.').notEmpty();
            req.checkBody('address', '*Address is required.').notEmpty();
            req.checkBody('latitude', '*Latitutde is required.').notEmpty();
            req.checkBody('longitude', '*Longitude is required.').notEmpty();
            req.checkBody('insti_image', '*Image is required.').notEmpty();
            req.checkBody('stc', '*Subject is required.').notEmpty();
            req.checkBody('phone', '*Phone is required.').notEmpty();


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
                            var column='`uid`,`address`,`latitude`,`longitude`,`insti_image`,`stc`,`phone`,`created_by`,`created_on`';
                            var valueisert=[[
                                req.body.uid,
                                req.body.address,
                                req.body.latitude,
                                req.body.longitude,
                                req.body.insti_image,
                                req.body.stc,
                                req.body.phone,
                                req.body.uid,
                                date1
                            ]];

                            transactions.insert('cr_institute', column, valueisert, function (inserTdelt) {

                                if (inserTdelt.status == 1) {
                                    res.send({status: 1, message: 'Registered Successfully'});
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

    } //configure end
};
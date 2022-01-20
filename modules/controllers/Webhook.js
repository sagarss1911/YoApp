
/**
 * @swagger
 * resourcePath: /Wallet
 * description: All Wallet related api
 */
 'use strict';

 let webhookManager = require('../manager/Webhook');

 let paymentSuccess = (req, res, next) => {     
     return webhookManager
         .paymentSuccess(req.body)
         .then(data => {
             let result = {
                 status: 200,
                 data: data
             }
             return res.json(result);
         })
         .catch(next);
 }
 
 module.exports = {     
    paymentSuccess: paymentSuccess
 
 };
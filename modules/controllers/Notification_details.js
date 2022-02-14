/**
 * @swagger
 * resourcePath: /Wallet
 * description: All Wallet related api
 */
 'use strict';

 let notificationDetailsManager = require('../manager/Notification_details');
 
 

 
 /**
 * @swagger
 * /api/v1/notification_details/friend_request_details/{friends_id}:
 *   get:
 *     summary: Get All information of friend Request.
 *     tags:
 *      - Notification Details
 *     parameters :
 *     - name: x-auth-api-key
 *       in: header   
 *       description: an authorization header
 *       required: true
 *       type: string 
 *     - name: x-auth-token
 *       in: header   
 *       description: an authorization header
 *       required: true
 *       type: string 
 *     - name: Accept-Language
 *       in: header   
 *       description: Language
 *       required: false
 *       type: string
 *     - name: friends_id
 *       in: path   
 *       description: friends_id
 *       required: true
 *       type: integer   
 *     responses:
 *       200:
 *         description: user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *       400:
 *         description: error in request processing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   example: 400
 */
 let friendRequestDetails = (req, res, next) => {
     let userid = req.user ? req.user.userId : null;
     return notificationDetailsManager
         .friendRequestDetails(userid, req.params.friends_id, req)
         .then(data => {
             let result = {
                 status: 200,
                 data: data
             }
             return res.json(result);
         })
         .catch(next);
 }
 
  /**
 * @swagger
 * /api/v1/notification_details/transaction_details/{wallet_id}:
 *   get:
 *     summary: Get All information of Wallet.
 *     tags:
 *      - Notification Details
 *     parameters :
 *     - name: x-auth-api-key
 *       in: header   
 *       description: an authorization header
 *       required: true
 *       type: string 
 *     - name: x-auth-token
 *       in: header   
 *       description: an authorization header
 *       required: true
 *       type: string 
 *     - name: Accept-Language
 *       in: header   
 *       description: Language
 *       required: false
 *       type: string
 *     - name: wallet_id
 *       in: path   
 *       description: wallet_id
 *       required: true
 *       type: integer   
 *     responses:
 *       200:
 *         description: user object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *       400:
 *         description: error in request processing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *                   example: 400
 */
   let transactionDetails = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    return notificationDetailsManager
        .transactionDetails(userid, req.params.wallet_id, req)
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
     
    friendRequestDetails: friendRequestDetails,
    transactionDetails: transactionDetails

 
 };
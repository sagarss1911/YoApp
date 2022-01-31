/**
 * @swagger
 * resourcePath: /Wallet
 * description: All Wallet related api
 */
'use strict';

let walletManager = require('../manager/Wallet');


/**
 * @swagger
 * /api/v1/wallet/add_money_to_wallet:
 *   post:
 *     summary: add_money_to_wallet.
 *     tags:
 *      - Wallet
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 50
 *                 paramType: body 
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
let addMoneyToWallet = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    return walletManager
        .addMoneyToWallet(userid, req.body, req)
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
* /api/v1/wallet/transaction_status/{client_secret}:
*   get:
*     summary: transaction_status.
*     tags:
*      - Wallet
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
*     - name: client_secret
*       in: path   
*       description: client_secret
*       required: true
*       type: string   
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
let transactionStatus = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    console.log(req.params.client_secret)
    return walletManager
        .transactionStatus(userid, req.params.client_secret, req)
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
  * /api/v1/wallet/wallet_to_wallet:
  *   post:
  *     summary: wallet_to_wallet.
  *     tags:
  *      - Wallet
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
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               amount:
  *                 type: number
  *                 example: 50
  *                 paramType: body
  *               receiver_uuid:
  *                 type: string
  *                 example: 123456010
  *                 paramType: body 
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
  let sendMoneyToWallet = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    return walletManager
        .sendMoneyToWallet(userid, req.body,req)
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
  * /api/v1/wallet/recent_wallet_to_wallet:
  *   get:
  *     summary: recent_wallet_to_wallet.
  *     tags:
  *      - Wallet
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
  let recentWalletToWallet = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    return walletManager
        .recentWalletToWallet(userid, req)
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
  * /api/v1/wallet/send_dummy_notification:
  *   post:
  *     summary: send_dummy_notification.
  *     tags:
  *      - Wallet
  *     parameters :
  *     - name: x-auth-api-key
  *       in: header   
  *       description: an authorization header
  *       required: true
  *       type: string 
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               token:
  *                 type: string
  *                 example: 123456010
  *                 paramType: body 
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
 let sendDummyNotification = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    return walletManager
        .sendDummyNotification(userid, req.body,req)
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
 * /api/v1/wallet/cash_pickup_request:
 *   post:
 *     summary: cash_pickup_request.
 *     tags:
 *      - Wallet
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
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties: 
 *               receiver_id_document:
 *                 type: file 
 *                 paramType: body 
 *               name:
 *                 type: string
 *                 example: johm Smith
 *                 paramType: body
 *               email:
 *                 type: integer
 *                 example: "abcd@gmail.com" 
 *                 paramType: body
 *               phone:
 *                 type: string
 *                 example: "+919377690348"
 *                 paramType: body 
 *               dob:
 *                 type: string
 *                 example: "12/05/2020"
 *                 paramType: body
 *               amount:
 *                 type: integer
 *                 example: 50
 *                 paramType: body  
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
 let cashPickupRequest = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    return walletManager
        .cashPickupRequest(userid, req)
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
  * /api/v1/wallet/transaction_history:
  *   get:
  *     summary: transaction_history.
  *     tags:
  *      - Wallet
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
  *     - name: page
  *       in: query   
  *       description: page
  *       required: false
  *       type: number
  *     - name: limit
  *       in: query   
  *       description: page
  *       required: false
  *       type: number   
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
 let transactionHistory = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    return walletManager
        .transactionHistory(userid, req)
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
    addMoneyToWallet: addMoneyToWallet,
    transactionStatus: transactionStatus,
    sendMoneyToWallet: sendMoneyToWallet,
    recentWalletToWallet:recentWalletToWallet,
    sendDummyNotification:sendDummyNotification,
    cashPickupRequest:cashPickupRequest,
    transactionHistory:transactionHistory

};
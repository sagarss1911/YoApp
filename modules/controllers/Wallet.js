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
  *                 type: number
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
module.exports = {
    addMoneyToWallet: addMoneyToWallet,
    transactionStatus: transactionStatus,
    sendMoneyToWallet: sendMoneyToWallet

};
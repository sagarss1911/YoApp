/**
 * @swagger
 * resourcePath: /Request Money
 * description: All Sent/Request Money Related API
 */
 'use strict';

 let merchantManager = require('../manager/Request_money');
/**
  * @swagger
  * /api/v1/request_money/request_money_to_user:
  *   post:
  *     summary: request_money_to_user.
  *     tags:
  *      - Request Money
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
  *               uuid:
  *                 type: string
  *                 example: 12345674890
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
 let requestMoney = (req, res, next) => {
     let userid = req.user ? req.user.userId : null;
 
     return merchantManager
         .requestMoney(userid, req.body)
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
  * /api/v1/request_money/request_history:
  *   get:
  *     summary: request_history.
  *     tags:
  *      - Request Money
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
  *     - name: from_date
  *       in: query   
  *       description: from_date
  *       required: false
  *       type: text
  *     - name: to_date
  *       in: query   
  *       description: to_date
  *       required: false
  *       type: text  
  *     - name: searchtext
  *       in: query   
  *       description: searchtext
  *       required: false
  *       type: text
  *     - name: amount
  *       in: query   
  *       description: amount
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
  let requestHistory = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;

    return merchantManager
        .requestHistory(userid, req)
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
  * /api/v1/request_money/pay_request/{id}:
  *   post:
  *     summary: pay_request.
  *     tags:
  *      - Request Money
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
  *     - name: id
  *       in: path   
  *       description: id
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
  let payRequest = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    let id = req.params.id;
    return merchantManager
        .payRequest(userid, id)
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
  * /api/v1/request_money/decline_request/{id}:
  *   post:
  *     summary: decline_request.
  *     tags:
  *      - Request Money
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
  *     - name: id
  *       in: path
  *       description: id
  *       required: true  
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
 let declineRequest = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    let id = req.params.id;
    return merchantManager
        .declineRequest(userid, id)
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
  * /api/v1/request_money/sent_history:
  *   get:
  *     summary: sent_history.
  *     tags:
  *      - Request Money
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
  *     - name: from_date
  *       in: query   
  *       description: from_date
  *       required: false
  *       type: text
  *     - name: to_date
  *       in: query   
  *       description: to_date
  *       required: false
  *       type: text  
  *     - name: searchtext
  *       in: query   
  *       description: searchtext
  *       required: false
  *       type: text
  *     - name: amount
  *       in: query   
  *       description: amount
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
 let sentHistory = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;  
    return merchantManager
        .sentHistory(userid, req)
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
    requestMoney:requestMoney,
    requestHistory:requestHistory,
    payRequest:payRequest,
    declineRequest:declineRequest,
    sentHistory:sentHistory
 
 };
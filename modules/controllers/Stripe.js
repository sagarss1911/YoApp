/**
 * @swagger
 * resourcePath: /Friends
 * description: All Friend Request Related API
 */
 'use strict';

 let stripeManager = require('../manager/Stripe');

 /**
  * @swagger
  * /api/v1/stripe/ephemeralkeycreate:
  *   get:
  *     summary: stripe.
  *     tags:
  *      - Stripe
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
 let ephemeralKeyCreate = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
     return stripeManager
         .ephemeralKeys(userid)
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
  * /api/v1/stripe/paymentintentcreate/{amount}:
  *   get:
  *     summary: stripe.
  *     tags:
  *      - Stripe
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
  *     - name: amount
  *       in: path 
  *       description: Language
  *       required: true
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
  let paymentIntentCreate = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    let amount = req.params.amount;
     return stripeManager
         .paymentIntent(userid,amount)
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
    ephemeralKeyCreate: ephemeralKeyCreate,
    paymentIntentCreate:paymentIntentCreate
 };
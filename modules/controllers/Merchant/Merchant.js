/**
 * @swagger
 * resourcePath: /Merchant
 * description: All Merchant related api
 */
 'use strict';

 let merchantManager = require('../../manager/Merchant/Merchant');
/**
  * @swagger
  * /api/v1/merchant/merchant_registration:
  *   post:
  *     summary: merchant_registration.
  *     tags:
  *      - Merchant
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
  *               address_proof:
  *                 type: file 
  *                 paramType: body
  *               licence_proof:
  *                 type: file 
  *                 paramType: body
  *               utility_proof:
  *                 type: file 
  *                 paramType: body 
  *               merchant_name:
  *                 type: string
  *                 example: johm Smith
  *                 paramType: body
  *               merchant_phone:
  *                 type: string
  *                 example: johm Smith
  *                 paramType: body  
  *               merchant_address:
  *                 type: string
  *                 example: johm Smith
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
 let merchantRegistration = (req, res, next) => {
     let userid = req.user ? req.user.userId : null;
 
     return merchantManager
         .merchantRegistration(userid, req)
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
    merchantRegistration: merchantRegistration
 
 };
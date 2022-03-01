/**
 * @swagger
 * resourcePath: /Category
 * description: Get All Category Related api
 */
 'use strict';

 let RequestManager = require('../manager/Support_request');
 
 /**
  * @swagger
  * /api/v1/support_request/add_support_request:
  *   post:
  *     summary: Support Request.
  *     tags:
  *      - Support Request
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
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               supportCategoryId:
  *                 type: integer
  *                 example: 1
  *                 paramType: body
  *               text:
  *                 type: string
  *                 example: Request 
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
  let addSupportRequest = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;    
    return RequestManager
        .addSupportRequest(userid,req)
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
    addSupportRequest:addSupportRequest
 };
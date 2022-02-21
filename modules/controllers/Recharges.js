/**
 * @swagger
 * resourcePath: /Wallet
 * description: All Wallet related api
 */
 'use strict';

 let rechargeManager = require('../manager/Recharges');
 
 /**
 * @swagger
 * /api/v1/recharges/get_operators/{mobile_no}:
 *   get:
 *     summary: Get All information of Operators.
 *     tags:
 *      - Recharge
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
 *     - name: mobile_no
 *       in: path   
 *       description: mobile_no
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
 let getOperators = (req, res, next) => {
     let userid = req.user ? req.user.userId : null;
     return rechargeManager
         .getOperators(userid, req.params.mobile_no, req)
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
 * /api/v1/recharges/get_products:
 *   get:
 *     summary: Get All products.
 *     tags:
 *      - Recharge
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
 *     - name: country_iso_code
 *       in: query   
 *       description: iso code like IND for india
 *       required: false
 *       type: string   
 *       example: IND
 *     - name: operator_id
 *       in: query
 *       description: operator id
 *       required: false
 *       type: integer
 *       example: 368
 *     - name: page
 *       in: query
 *       description: page
 *       required: false
 *       type: integer
 *       example: 1
 *     - name: per_page
 *       in: query
 *       description: per_page
 *       required: false
 *       type: integer
 *       example: 10
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
  let getProducts = (req, res, next) => {
    return rechargeManager
        .getProducts(req)
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
 * /api/v1/recharges/get_products/{product_id}:
 *   get:
 *     summary: Get Single products.
 *     tags:
 *      - Recharge
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
 *     - name: product_id
 *       in: path
 *       description: product id
 *       required: true
 *       type: integer
 *       example: 13500
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
 let getProductsById = (req, res, next) => {
    return rechargeManager
        .getProductsById(req, req.params.product_id)
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
 * /api/v1/recharges/process_recharge:
 *   post:
 *     summary: Process Recharge
 *     tags:
 *      - Recharge
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
 *               plan_id:
 *                 type: integer 
 *                 example: 3040
 *                 paramType: body
 *               mobile_no:
 *                 type: string
 *                 example: "+919377690348"
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
let processRecharge = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    return rechargeManager
        .processRecharge(userid,req)
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
 * /api/v1/recharges/recent_recharge:
 *   get:
 *     summary: Last 5 Recharges.
 *     tags:
 *      - Recharge
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
 let recentRecharge = (req, res, next) => {
     let userid = req.user ? req.user.userId : null;
    return rechargeManager
        .recentRecharge(req, userid)
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
 * /api/v1/recharges/recharge_history:
 *   get:
 *     summary: Get Recharges History.
 *     tags:
 *      - Recharge
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
 *       description: page number
 *       required: false   
 *       type: integer
 *       example: 1
 *     - name: limit
 *       in: query
 *       description: limit
 *       required: false
 *       type: integer
 *       example: 10
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
 let rechargeHistory = (req, res, next) => {
     let userid  = req.user ? req.user.userId : null;
    return rechargeManager
        .rechargeHistory(req, userid)
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
    getOperators: getOperators,
    getProducts:getProducts,
    getProductsById:getProductsById,
    processRecharge:processRecharge,
    recentRecharge:recentRecharge,
    rechargeHistory:rechargeHistory
 
 };
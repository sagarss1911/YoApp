'use strict';

let termConditionManager = require('../manager/Legal');

let addLegal = (req, res, next) => {
    return termConditionManager
        .addLegal(req.body)
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
 * /api/v1/legal/get_legal:
 *   get:
 *     summary: get Legal Data.
 *     tags:
 *      - Country List
 *     parameters :
 *     - name: x-auth-api-key
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
let getLegalDataForAPP = (req, res, next) => {
    return termConditionManager
        .getLegalDataForAPP(req.body)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}
let getLegal = (req, res, next) => {
    return termConditionManager
        .getLegal(req.body)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}
let getMerchantLimit = (req, res, next) => {
    return termConditionManager
        .getMerchantLimit(req.body)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}
let updateMerchantLimit = (req, res, next) => {
    return termConditionManager
        .updateMerchantLimit(req.body)
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
    addLegal,
    getLegal,
    getMerchantLimit,
    updateMerchantLimit,
    getLegalDataForAPP
}
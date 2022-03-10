/**
 * @swagger
 * resourcePath: /Category
 * description: Get All Category Related api
 */
 'use strict';

 let categoryManager = require('../manager/Support_category');
 
 /**
 * @swagger
 * /api/v1/support_category/get_all_support_category:
 *   get:
 *     summary: Get All category.
 *     tags:
 *      - Category
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
  let getAllSupportCategory = (req, res, next) => {
    return categoryManager
        .getAllSupportCategory(req)
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
    getAllSupportCategory:getAllSupportCategory
 };
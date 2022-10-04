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
  *               valid_ID:
  *                 type: file 
  *                 paramType: body
  *               TIN_card:
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
  *               merchant_region:
  *                 type: string
  *                 example: IN
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
 /**
  * @swagger
  * /api/v1/merchant/merchant_resubmit_images:
  *   post:
  *     summary: merchant_resubmit_images.
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
  *               valid_ID:
  *                 type: file 
  *                 paramType: body
  *               TIN_card:
  *                 type: file 
  *                 paramType: body
  *               upgraded_image1:
  *                 type: file 
  *                 paramType: body
  *               upgraded_image2:
  *                 type: file 
  *                 paramType: body
  *               upgraded_image3:
  *                 type: file 
  *                 paramType: body 
  *               upgraded_image4:
  *                 type: file 
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
  let merchantResubmitImages = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;

    return merchantManager
        .merchantResubmitImages(userid, req)
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
  * /api/v1/merchant/upgrade_account:
  *   post:
  *     summary: upgrade_account.
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
  *               upgraded_image1:
  *                 type: file 
  *                 paramType: body
  *               upgraded_image2:
  *                 type: file 
  *                 paramType: body
  *               upgraded_image3:
  *                 type: file 
  *                 paramType: body 
  *               upgraded_image4:
  *                 type: file 
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
  let merchantUpgrade = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;

    return merchantManager
        .merchantUpgrade(userid, req)
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
  * /api/v1/merchant/get_cash_pick_details/{transaction_id}:
  *   get:
  *     summary: get_cash_pick_details.
  *     tags:
  *      - Merchant
  *     parameters :
  *     - name: x-auth-api-key
  *       in: header   
  *       description: an authorization header
  *       required: true
  *       type: string 
  *     - name: x-is-merchant
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
  *     - name: transaction_id
  *       in: path   
  *       description: Language
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
  let getCashpickupDetails = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    let transaction_id = req.params.transaction_id;
    return merchantManager
        .getCashpickupDetails(userid, req,transaction_id)
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
  * /api/v1/merchant/send_cash_pick_up_otp/{transaction_id}:
  *   post:
  *     summary: send_cash_pick_up_otp.
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
  *     - name: x-is-merchant
  *       in: header   
  *       description: an authorization header
  *       required: true
  *       type: string
  *     - name: transaction_id
  *       in: path
  *       description: transaction_id
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
 let sendCashPickupOTP = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    let transaction_id = req.params.transaction_id;
    return merchantManager
        .sendCashPickupOTP(userid, req,transaction_id)
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
  * /api/v1/merchant/validate_cash_pick_up_otp/{transaction_id}:
  *   post:
  *     summary: validate_cash_pick_up_otp.
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
  *     - name: x-is-merchant
  *       in: header   
  *       description: an authorization header
  *       required: true
  *       type: string
  *     - name: transaction_id
  *       in: path
  *       description: transaction_id
  *       required: true  
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
  *               otp:
  *                 type: string
  *                 example: 123456
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
 let validateCashPickupOTP = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    let transaction_id = req.params.transaction_id;
    return merchantManager
        .validateCashPickupOTP(userid, req,transaction_id)
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
  * /api/v1/merchant/claim_cash_pickup/{transaction_id}:
  *   post:
  *     summary: claim_cash_pickup.
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
  *     - name: x-is-merchant
  *       in: header   
  *       description: an authorization header
  *       required: true
  *       type: string
  *     - name: transaction_id
  *       in: path
  *       description: transaction_id
  *       required: true   
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
  *               uploaded_id_document1:
  *                 type: file  
  *                 required: true
  *                 paramType: body
  *               uploaded_id_document2:
  *                 type: file  
  *                 required: false
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
 let claimCashPickup = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    let transaction_id = req.params.transaction_id;
    return merchantManager
        .claimCashPickup(userid, req,transaction_id)
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
  * /api/v1/merchant/transaction_history:
  *   post:
  *     summary: transaction_history.
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
  *     - name: x-is-merchant
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
 let transactionHistory = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    let transaction_id = req.params.transaction_id;
    return merchantManager
        .transactionHistory(userid, req,transaction_id)
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
 * /api/v1/merchant/bank_transfer:
 *   post:
 *     summary: Submit Bank Transfer Request.
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
 *     - name: x-is-merchant
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
 *               name:
 *                 type: string
 *                 example: johm Smith
 *                 paramType: body
 *               address:
 *                 type: string
 *                 example: "A-18" 
 *                 paramType: body
 *               phone:
 *                 type: string
 *                 example: "9377690348"
 *                 paramType: body
 *               region:
 *                 type: string
 *                 example: "IN"
 *                 paramType: body 
 *               bank_name:
 *                 type: string
 *                 example: "ABC bank"
 *                 paramType: body
 *               bank_account:
 *                 type: string
 *                 example: "1234567890"
 *                 paramType: body
 *               country:
 *                 type: string
 *                 example: "india"
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
let bankTransfer = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    return merchantManager
        .bankTransfer(userid, req)
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
 * /api/v1/merchant/cash_topup:
 *   post:
 *     summary: Cash Topup Request For other User.
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
 *     - name: x-is-merchant
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
 *               user_unique_id:
 *                 type: string
 *                 example: 123456
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
let cashTopupOtherUser = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    return merchantManager
        .cashTopupOtherUser(userid, req)
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
  * /api/v1/merchant/cash_topup_transaction_history:
  *   post:
  *     summary: cash_topup_transaction_history.
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
  *     - name: x-is-merchant
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
 let cashTopupTransactionHistory = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    return merchantManager
        .cashTopupTransactionHistory(userid, req)
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
    merchantRegistration: merchantRegistration,
    merchantResubmitImages:merchantResubmitImages,
    merchantUpgrade:merchantUpgrade,
    getCashpickupDetails:getCashpickupDetails,
    sendCashPickupOTP:sendCashPickupOTP,
    validateCashPickupOTP:validateCashPickupOTP,
    claimCashPickup:claimCashPickup,
    transactionHistory:transactionHistory,
    bankTransfer:bankTransfer,
    cashTopupOtherUser:cashTopupOtherUser,
    cashTopupTransactionHistory:cashTopupTransactionHistory
 
 };
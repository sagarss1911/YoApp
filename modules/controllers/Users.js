/**
 * @swagger
 * resourcePath: /Users
 * description: All Rider Login related api
 */
'use strict';

let usersManager = require('../manager/Users');
/**
 * @swagger
 * /api/v1/user/country_list:
 *   get:
 *     summary: fetch all country.
 *     tags:
 *      - country
 *     parameters :
 *     - name: x-auth-api-key
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
let countryList = (req, res, next) => {

    return usersManager
        .countryList(req.body)
        .then(data => {
            let result = {
                status:200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}

/**
 * @swagger
 * /api/v1/user/register:
 *   post:
 *     summary: register.
 *     tags:
 *      - signup
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
 *               phone:
 *                 type: string
 *                 example: 9377690348
 *                 paramType: body
 *               name:
 *                 type: string
 *                 example: johm Smith
 *                 paramType: body
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *                 paramType: body
 *               region:
 *                 type: string
 *                 example: IN
 *                 paramType: body
 *               password:
 *                 type: string
 *                 example: aavvcc
 *                 paramType: body  
 *               gender:
 *                 type: integer
 *                 example: 1
 *                 description: 1=male,2=female,3=other
 *                 paramType: body 
 *               latitude:
 *                 type: string
 *                 example: 11.25
 *                 paramType: body 
 *               longitude:
 *                 type: string
 *                 example: 12.256
 *                 paramType: body
 *               notification_token:
 *                 type: string
 *                 example: asdghfasdftASawaew2652ASads
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
let signup = (req, res, next) => {
    return usersManager
        .signup(req)
        .then(data => {
            let result = {
                status:200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}
/**
 * @swagger
 * /api/v1/user/resend_otp:
 *   post:
 *     summary: resendOTP.
 *     tags:
 *      - signup
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
let resendOTP = (req,res,next) => {
    let userid = req.user ? req.user.userId : null;

    return usersManager
        .resendOTP(userid)
        .then(data => {
            let result = {
                status:200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}

/**
 * @swagger
 * /api/v1/user/verify_otp:
 *   post:
 *     summary: verify_otp.
 *     tags:
 *      - signup
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
 *               otp:
 *                 type: string 
 *                 example: +91
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
let verifyOTP = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    return usersManager
        .verifyOTP(userid,req.body.otp)
        .then(data => {
            let result = {
                status:200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}

/**
 * @swagger
 * /api/v1/user/send_otp:
 *   post:
 *     summary: send_otp.
 *     tags:
 *      - signup
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
 *               phone:
 *                 type: string 
 *                 example: 9377690348
 *                 paramType: body 
 *               countrycode:
 *                 type: string 
 *                 example: +91
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
let sendOTP = (req, res, next) => {
    return usersManager
        .sendOTP(req.body)
        .then(data => {
            let result = {
                status:200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}




/**
 * @swagger
 * /api/v1/user/upload_images:
 *   post:
 *     summary: upload_images.
 *     tags:
 *      - signup
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties: 
 *               images[]:
 *                 type: file
 *                 allowMultiple: true
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
let uploadImages = (req, res, next) => {
    return usersManager
        .uploadImages(req)
        .then(data => {
            let result = {
                status:200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}


/**
 * @swagger
 * /api/v1/user/phone_sign_in:
 *   post:
 *     summary: phone_sign_in.
 *     tags:
 *      - signup
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
 *               phone:
 *                 type: string 
 *                 example: 9377690348
 *                 paramType: body 
 *               countrycode:
 *                 type: string 
 *                 example: +91
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
   let phoneSignIn = (req, res, next) => {
    return usersManager
        .phoneSignIn(req.body)
        .then(data => {
            let result = {
                status:200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}


/**
 * @swagger
 * /api/v1/user/phone_sign_in_verification:
 *   post:
 *     summary: phone_sign_in_verification.
 *     tags:
 *      - signup
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
 *               phone:
 *                 type: string 
 *                 example: 9377690348
 *                 paramType: body 
 *               otp:
 *                 type: string 
 *                 example: +91
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
let phoneSignInVerification = (req, res, next) => {

    return usersManager
        .phoneSignInVerification(req.body)
        .then(data => {
            let result = {
                status:200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}



/**
 * @swagger
 * /api/v1/user/signout:
 *   post:
 *     summary: signout.
 *     tags:
 *      - signup
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
let signout = (req,res,next) => {
    let userid = req.user ? req.user.userId : null;

    return usersManager
        .signout(userid)
        .then(data => {
            let result = {
                status:200
            }
            return res.json(result);
        })
        .catch(next);
}

/**
 * @swagger
 * /api/v1/user/is_user_available:
 *   post:
 *     summary: is_user_available.
 *     tags:
 *      - signup
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
 *               phone:
 *                 type: string 
 *                 example: 9377690348
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
let isUserAvailable = (req, res, next) => {

    return usersManager
        .isUserAvailable(req.body)
        .then(data => {
            let result = {
                status:200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}



module.exports = {
    countryList:countryList,
    signup           : signup,
    resendOTP:resendOTP,
    uploadImages:uploadImages,   
    signout          : signout,
    phoneSignIn      : phoneSignIn,   
    verifyOTP:verifyOTP,
    sendOTP:sendOTP,
    phoneSignInVerification:phoneSignInVerification,
    isUserAvailable:isUserAvailable    
};
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
        .countryList()
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
 * /api/v1/user/send_otp_for_registration:
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
 *               termscondition:
 *                 type: integer
 *                 example: 1
 *                 description: 0=not agree, 1=agreed
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
let sendOtpForRegistration = (req, res, next) => {
    return usersManager
        .sendOtpForRegistration(req.body)
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
 *               termscondition:
 *                 type: integer
 *                 example: 1
 *                 description: 0=not agree, 1=agreed
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
        .signup(req.body)
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
let resendOTP = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;

    return usersManager
        .resendOTP(userid)
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
        .verifyOTP(userid, req.body.otp)
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
 *               password:
 *                 type: string 
 *                 example: aavvcc
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
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}

/**
 * @swagger
 * /api/v1/user/phone_sign_in_with_otp:
 *   post:
 *     summary: phone_sign_in_with_otp.
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
 *               region:
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
let phoneSignInWithOTP = (req, res, next) => {
    return usersManager
        .phoneSignInWithOTP(req.body)
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
 * /api/v1/user/forgot_password:
 *   post:
 *     summary: forgot_password.
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
 *                 example: test@gmail.com
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
let forgotPassword = (req, res, next) => {
    return usersManager
        .forgotPassword(req.body)
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
 * /api/v1/user/change_password:
 *   post:
 *     summary: change_password.
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
 *               password:
 *                 type: string 
 *                 example: 12345678
 *                 paramType: body 
 *               confirmpassword:
 *                 type: string 
 *                 example: 12345678
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
let changePassword = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;
    return usersManager
        .changePassword(userid, req.body)
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
 * /api/v1/user/login_with_social:
 *   post:
 *     summary: login_with_social.
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
 *               social_id:
 *                 type: string 
 *                 example: 11223445748412
 *                 paramType: body 
 *               type:
 *                 type: integer 
 *                 example: 1
 *                 description: 1=gmail,2=twitter,3=facebook,4=linkedin
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
let loginWithSocial = (req, res, next) => {
    return usersManager
        .loginWithSocial(req.body)
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
let signout = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;

    return usersManager
        .signout(userid)
        .then(data => {
            let result = {
                status: 200
            }
            return res.json(result);
        })
        .catch(next);
}



module.exports = {
    countryList: countryList,
    sendOtpForRegistration:sendOtpForRegistration,
    signup: signup,
    resendOTP: resendOTP,
    signout: signout,
    phoneSignIn: phoneSignIn,
    changePassword: changePassword,
    phoneSignInWithOTP: phoneSignInWithOTP,
    loginWithSocial:loginWithSocial,
    forgotPassword: forgotPassword,
    verifyOTP: verifyOTP
};
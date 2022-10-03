/**
 * @swagger
 * resourcePath: /Users
 * description: All Login related api
 */
'use strict';

let usersManager = require('../manager/Users');
/**
 * @swagger
 * /api/v1/user/country_list:
 *   get:
 *     summary: fetch all country.
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
 * /api/v1/user/faq_list:
 *   get:
 *     summary: fetch all faq.
 *     tags:
 *      - FAQ List
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
let faqList = (req, res, next) => {

    return usersManager
        .faqList()
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
 *      - Login/Register
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
 *               username:
 *                 type: string
 *                 example: ABC
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
        .sendOtpForRegistration(req)
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
 *      - Login/Register
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
 *               username:
 *                 type: string
 *                 example: ABC
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
 *               reference_code:
 *                 type: string
 *                 example: 123456780
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
 *      - Login/Register
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
let resendOTP = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;

    return usersManager
        .resendOTP(userid,req)
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
 *      - Login/Register
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
        .verifyOTP(userid, req.body.otp,req)
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
 *      - Login/Register
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
        .phoneSignIn(req.body,req)
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
 *      - Login/Register
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
        .phoneSignInWithOTP(req.body,req)
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
 *      - Login/Register
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
let forgotPassword = (req, res, next) => {
    return usersManager
        .forgotPassword(req.body,req)
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
 *      - Login/Register
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
        .changePassword(userid, req.body,req)
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
 *      - Login/Register
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
        .loginWithSocial(req.body,req)
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
 * /api/v1/user/get_profile:
 *   get:
 *     summary: get_profile.
 *     tags:
 *      - Profile
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
let getProfile = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;

    return usersManager
        .getProfile(userid,req)
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
 * /api/v1/user/get_profile_by_id:
 *   post:
 *     summary: get_profile_by_id.
 *     tags:
 *      - Profile
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
 *                 example: ABC
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
let getProfileById = (req, res, next) => {
    return usersManager
        .getProfileById(req.body)
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
 * /api/v1/user/update_profile:
 *   post:
 *     summary: update_profile.
 *     tags:
 *      - Profile
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
 *               profileimage:
 *                 type: file 
 *                 paramType: body 
 *               name:
 *                 type: string
 *                 example: johm Smith
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
 *               isSound:
 *                 type: integer
 *                 example: 1
 *                 description: 1=on,0=off
 *                 paramType: body 
 *               isVibration:
 *                 type: integer
 *                 example: 1
 *                 description: 1=on,0=off
 *                 paramType: body
 *               isNotification:
 *                 type: integer
 *                 example: 1
 *                 description: 1=on,0=off
 *                 paramType: body 
 *               isTermsConditionAccepted:
 *                 type: integer
 *                 example: 1
 *                 description: 1=on,0=off
 *                 paramType: body
 *               language:
 *                 type: integer
 *                 example: 1
 *                 description: (1=ENG, 2=ES, 3=FR, 4= PORTG)
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
let updateProfile = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;

    return usersManager
        .updateProfile(userid, req)
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
 * /api/v1/user/update_username:
 *   post:
 *     summary: update_username.
 *     tags:
 *      - Profile
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
 *               username:
 *                 type: string
 *                 example: ABC
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
let updateUsername = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;

    return usersManager
        .updateUsername(userid, req.body,req)
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
 * /api/v1/user/update_email:
 *   post:
 *     summary: update_email.
 *     tags:
 *      - Profile
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
 *               email:
 *                 type: string
 *                 example: test@gmail.com
 *                 paramType: body
 *               isVerified:
 *                 type: integer
 *                 example: 1 
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
let updateEmail = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;

    return usersManager
        .updateEmail(userid, req.body,req)
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
 * /api/v1/user/update_phone:
 *   post:
 *     summary: update_phone.
 *     tags:
 *      - Profile
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
 *               phone:
 *                 type: string
 *                 example: 9377690348
 *                 paramType: body
 *               region:
 *                 type: string
 *                 example: IN
 *                 paramType: body
 *               isVerified:
 *                 type: integer
 *                 example: 1
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
let updatePhone = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;

    return usersManager
        .updatePhone(userid, req.body,req)
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
 * /api/v1/user/update_password:
 *   post:
 *     summary: update_password.
 *     tags:
 *      - Profile
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
 *               oldpassword:
 *                 type: string
 *                 example: 1234
 *                 paramType: body
 *               newpassword:
 *                 type: string
 *                 example: 1234
 *                 paramType: body
 *               confirmpassword:
 *                 type: string
 *                 example: 1234
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
let updatePassword = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;

    return usersManager
        .updatePassword(userid, req.body,req)
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
 * /api/v1/user/deleteuser:
 *   post:
 *     summary: deleteuser.
 *     tags:
 *      - Profile
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
 *               uuid:
 *                 type: string
 *                 example: 1234
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
let deleteUser = (req, res, next) => {
 

    return usersManager
        .deleteUser(req.body.uuid)
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
 *      - Login/Register
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
let signout = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;

    return usersManager
        .signout(userid,req)
        .then(data => {
            let result = {
                status: 200
            }
            return res.json(result);
        })
        .catch(next);
}

/**
 * @swagger
 * /api/v1/user/get_terms_condition:
 *   get:
 *     summary: get_terms_condition.
 *     tags:
 *      - TermsCondition
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
let getTermsCondition = (req, res, next) => {
    return usersManager
        .getTermsCondition(req.body)
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
 * /api/v1/user/generate_transactional_otp:
 *   post:
 *     summary: generate_transactional_otp.
 *     tags:
 *      - Profile
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
 *               hash:
 *                 type: string
 *                 example: 1234
 *                 paramType: body
 *               type:
 *                 type: integer
 *                 example: 1
 *                 paramType: body
 *                 description: 1=bank_transfer,2=cashpickup,3=wallet_to_wallet,4=recharge
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
let generateTransactionalOTP = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;

    return usersManager
        .generateTransactionalOTP(userid, req.body,req)
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
 * /api/v1/user/verify_transactional_otp:
 *   post:
 *     summary: verify_transactional_otp.
 *     tags:
 *      - Profile
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
 *               hash:
 *                 type: string
 *                 example: 1234
 *                 paramType: body
 *               otp:
 *                 type: string
 *                 example: 1234
 *                 paramType: body
 *               type:
 *                 type: integer
 *                 example: 1
 *                 paramType: body
 *                 description: 1=bank_transfer,2=cashpickup,3=wallet_to_wallet,4=recharge
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
let verifyTransactionalOTP = (req, res, next) => {
    let userid = req.user ? req.user.userId : null;

    return usersManager
        .verifyTransactionalOTP(userid, req.body,req)
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
 * /api/v1/user/send_test_sms:
 *   post:
 *     summary: send_test_sms.
 *     tags:
 *      - Profile
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
 *                 example: 919377690348
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
let sendTestSMS = (req, res, next) => {    
    return usersManager
        .sendTestSMS(req.body)
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
    countryList: countryList,
    faqList:faqList,
    sendOtpForRegistration: sendOtpForRegistration,
    signup: signup,
    resendOTP: resendOTP,
    signout: signout,
    phoneSignIn: phoneSignIn,
    changePassword: changePassword,
    phoneSignInWithOTP: phoneSignInWithOTP,
    loginWithSocial: loginWithSocial,
    forgotPassword: forgotPassword,
    getTermsCondition: getTermsCondition,
    getProfile: getProfile,
    getProfileById:getProfileById,
    updateProfile: updateProfile,
    updateUsername: updateUsername,
    updateEmail: updateEmail,
    updatePassword: updatePassword,
    updatePhone: updatePhone,
    verifyOTP: verifyOTP,
    deleteUser:deleteUser,
    generateTransactionalOTP:generateTransactionalOTP,
    verifyTransactionalOTP:verifyTransactionalOTP,
    sendTestSMS:sendTestSMS

};
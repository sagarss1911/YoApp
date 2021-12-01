'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../controllers/Users"),
    validateAccess = require('../policies/Validate_request_access');

router.get("/country_list", controller.countryList);
router.post("/send_otp_for_registration", controller.sendOtpForRegistration);
router.post("/register", controller.signup);
router.post("/resend_otp", validateAccess.isValidUser, controller.resendOTP);
router.post("/verify_otp", validateAccess.isValidUser, controller.verifyOTP);
router.post("/phone_sign_in", controller.phoneSignIn);
router.post("/phone_sign_in_with_otp", controller.phoneSignInWithOTP);
router.post("/forgot_password", controller.forgotPassword);
router.post("/change_password", validateAccess.isValidUser, controller.changePassword);
router.post("/login_with_social", controller.loginWithSocial);
router.post("/signout", validateAccess.isValidUser, controller.signout);


module.exports = router;

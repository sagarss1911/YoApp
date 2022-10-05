'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../controllers/Users"),
    fileUploadHelper  = require("../helpers/file_upload"),
    validateAccess = require('../policies/Validate_request_access');

router.get("/country_list", controller.countryList);
router.get("/faq_list", controller.faqList);
router.post("/send_otp_for_registration", controller.sendOtpForRegistration);
router.post("/register", controller.signup);
router.post("/resend_otp", validateAccess.isValidUser, controller.resendOTP);
router.post("/verify_otp", validateAccess.isValidUser, controller.verifyOTP);
router.post("/phone_sign_in", controller.phoneSignIn);
router.post("/phone_sign_in_with_otp", controller.phoneSignInWithOTP);
router.post("/forgot_password", controller.forgotPassword);
router.post("/change_password", validateAccess.isValidUser, controller.changePassword);
router.post("/login_with_social", controller.loginWithSocial);
router.get("/get_profile",validateAccess.isValidUser, controller.getProfile);
router.post("/get_profile_by_id",validateAccess.isValidUser, controller.getProfileById);
router.post("/update_profile",validateAccess.isValidUser,fileUploadHelper.uploadUserProfileImage.fields([{ name: 'profileimage'}]), controller.updateProfile);
router.post("/update_username",validateAccess.isValidUser, controller.updateUsername);
router.post("/update_email",validateAccess.isValidUser, controller.updateEmail);
router.post("/update_password",validateAccess.isValidUser, controller.updatePassword);
router.post("/update_phone",validateAccess.isValidUser, controller.updatePhone);
router.get("/get_terms_condition", controller.getTermsCondition);
router.post("/signout", validateAccess.isValidUser, controller.signout);
router.post("/deleteuser", controller.deleteUser);
router.post("/generate_transactional_otp", validateAccess.isValidUser, controller.generateTransactionalOTP);
router.post("/verify_transactional_otp", validateAccess.isValidUser, controller.verifyTransactionalOTP);
router.post("/send_test_sms", controller.sendTestSMS);


module.exports = router;

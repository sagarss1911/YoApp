'use strict';

let express    = require("express"),
    router     = express.Router(),
    controller = require("../controllers/Users"),
    fileUploadHelper  = require("../helpers/file_upload"),
    validateAccess = require('../policies/Validate_request_access');

router.post("/signup",controller.signup);
router.post("/upload_images",validateAccess.isValidUser, fileUploadHelper.uploadUserImages.fields([{ name: 'image', maxCount: 6 }]),controller.uploadImages);
router.post("/send_otp", controller.sendOTP);
router.post("/verify_otp", controller.verifyOTP);
router.post("/phone_sign_in", controller.phoneSignIn);
router.post("/phone_sign_in_verification", controller.phoneSignInVerification);
router.post("/signout",validateAccess.isValidUser,controller.signout);
router.post("/is_user_available",controller.isUserAvailable);

module.exports = router;

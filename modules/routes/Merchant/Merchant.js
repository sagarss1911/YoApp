'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../../controllers/Merchant/Merchant"),
    fileUploadHelper  = require("../../helpers/file_upload"),
    validateAccess = require('../../policies/Validate_request_access');

router.post("/merchant_registration",validateAccess.isValidUser,fileUploadHelper.uploadUserProfileImage.fields([{ name: 'address_proof'},{ name: 'licence_proof'},{name: 'utility_proof'}]), controller.merchantRegistration);
router.post("/upgrade_account",validateAccess.isValidUser,fileUploadHelper.uploadUserProfileImage.fields([{ name: 'upgraded_image1'},{ name: 'upgraded_image2'},{name: 'upgraded_image3'},{name: 'upgraded_image4'}]), controller.merchantUpgrade);


module.exports = router;
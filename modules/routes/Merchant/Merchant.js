'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../../controllers/Merchant/Merchant"),
    fileUploadHelper  = require("../../helpers/file_upload"),
    validateAccess = require('../../policies/Validate_request_access');

router.post("/merchant_registration",validateAccess.isValidUser,fileUploadHelper.uploadUserProfileImage.fields([{ name: 'address_proof'},{ name: 'licence_proof'},{name: 'utility_proof'}]), controller.merchantRegistration);


module.exports = router;

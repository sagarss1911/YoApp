'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../../controllers/Admin/Merchant"),
    fileUploadHelper  = require("../../helpers/file_upload"),
    validateAccess = require('../../policies/Validate_request_access');

//admin

router.post('/get_all_merchant', validateAccess.isValidAdmin, controller.getAllMerchant);
router.post("/export_all_merchant", validateAccess.isValidAdmin, controller.exportAllMerchant);
router.put("/update_merchant_status/:slider_id", validateAccess.isValidAdmin, controller.updateMerchantStatus);
router.put("/update_merchant/:merchant_id",validateAccess.isValidAdmin,fileUploadHelper.uploadUserProfileImage.fields([{ name: 'address_proof'},{ name: 'licence_proof'},{name: 'utility_proof'}]), controller.merchantUpdate);
module.exports = router;
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
router.put("/reset_merchant_images/:merchant_id", validateAccess.isValidAdmin, controller.resetMerchantImages);
router.put("/accept_merchant_images_request/:merchant_id", validateAccess.isValidAdmin, controller.acceptMerchantImageRequest);

router.put("/update_merchant/:merchant_id",validateAccess.isValidAdmin,fileUploadHelper.uploadUserProfileImage.fields([{ name: 'address_proof'},{ name: 'valid_ID'},{name: 'TIN_card'}]), controller.merchantUpdate);
router.put("/update_merchant_due_payment/:merchant_id",validateAccess.isValidAdmin, controller.merchantDuePaymentUpdate);
router.post('/get_topup_merchant_history/:merchant_id', validateAccess.isValidAdmin, controller.getTopUpMerchantHistory);

module.exports = router;
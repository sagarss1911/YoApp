'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../../controllers/Merchant/Merchant"),
    fileUploadHelper  = require("../../helpers/file_upload"),
    validateAccess = require('../../policies/Validate_request_access');

router.post("/merchant_registration",validateAccess.isValidUser,fileUploadHelper.uploadUserProfileImage.fields([{ name: 'address_proof'},{ name: 'licence_proof'},{name: 'utility_proof'}]), controller.merchantRegistration);
router.post("/merchant_resubmit_images",validateAccess.isValidUser,fileUploadHelper.uploadUserProfileImage.fields([{ name: 'address_proof'},{ name: 'licence_proof'},{name: 'utility_proof'},{ name: 'upgraded_image1'},{ name: 'upgraded_image2'},{name: 'upgraded_image3'},{name: 'upgraded_image4'}]), controller.merchantResubmitImages);
router.post("/upgrade_account",validateAccess.isValidUser,fileUploadHelper.uploadUserProfileImage.fields([{ name: 'upgraded_image1'},{ name: 'upgraded_image2'},{name: 'upgraded_image3'},{name: 'upgraded_image4'}]), controller.merchantUpgrade);
router.get("/get_cash_pick_details/:transaction_id",validateAccess.isValidMerchant, controller.getCashpickupDetails);
router.post("/send_cash_pick_up_otp/:transaction_id",validateAccess.isValidMerchant, controller.sendCashPickupOTP);
router.post("/validate_cash_pick_up_otp/:transaction_id",validateAccess.isValidMerchant, controller.validateCashPickupOTP);
router.post("/claim_cash_pickup/:transaction_id",validateAccess.isValidMerchant, fileUploadHelper.uploadUserProfileImage.fields([{ name: 'uploaded_id_document1'},{ name: 'uploaded_id_document2'}]),controller.claimCashPickup);
router.post("/transaction_history",validateAccess.isValidMerchant, controller.transactionHistory);
router.post("/bank_transfer", validateAccess.isValidMerchant, controller.bankTransfer);
router.post("/cash_topup", validateAccess.isValidMerchant, controller.cashTopupOtherUser);
router.post("/cash_topup_transaction_history",validateAccess.isValidMerchant, controller.cashTopupTransactionHistory);

module.exports = router;

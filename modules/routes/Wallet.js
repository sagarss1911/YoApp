'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../controllers/Wallet"), 
    fileUploadHelper  = require("../helpers/file_upload"),   
    validateAccess = require('../policies/Validate_request_access');


router.post("/add_money_to_wallet", validateAccess.isValidUser, controller.addMoneyToWallet);
router.get("/transaction_status/:client_secret", validateAccess.isValidUser, controller.transactionStatus);
router.post("/wallet_to_wallet", validateAccess.isValidUser, controller.sendMoneyToWallet);
router.get("/recent_wallet_to_wallet", validateAccess.isValidUser, controller.recentWalletToWallet);
router.post("/cash_pickup_request", validateAccess.isValidUser,fileUploadHelper.uploadReceiverImage.fields([{ name: 'receiver_id_document'}]), controller.cashPickupRequest);
router.get("/transaction_history", validateAccess.isValidUser, controller.transactionHistory);
router.post("/send_dummy_notification", controller.sendDummyNotification);



module.exports = router;

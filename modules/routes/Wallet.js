'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../controllers/Wallet"),    
    validateAccess = require('../policies/Validate_request_access');


router.post("/add_money_to_wallet", validateAccess.isValidUser, controller.addMoneyToWallet);
router.get("/transaction_status/:client_secret", validateAccess.isValidUser, controller.transactionStatus);
router.post("/wallet_to_wallet", validateAccess.isValidUser, controller.sendMoneyToWallet);



module.exports = router;

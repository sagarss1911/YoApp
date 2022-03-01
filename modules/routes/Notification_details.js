'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../controllers/Notification_details"), 
    validateAccess = require('../policies/Validate_request_access');



router.get("/friend_request_details/:friends_id", validateAccess.isValidUser, controller.friendRequestDetails);
router.get("/transaction_details/:wallet_id", validateAccess.isValidUser, controller.transactionDetails);
router.get("/recharge_details/:recharge_id", validateAccess.isValidUser, controller.rechargeDetails);

module.exports = router;

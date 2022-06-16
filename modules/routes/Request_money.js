'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../controllers/Request_money"), 
    validateAccess = require('../policies/Validate_request_access');




router.post("/request_money_to_user", validateAccess.isValidUser, controller.requestMoney);
router.get("/request_history", validateAccess.isValidUser, controller.requestHistory);
router.post("/pay_request/:id", validateAccess.isValidUser, controller.payRequest);
router.post("/decline_request/:id", validateAccess.isValidUser, controller.declineRequest);
router.get("/sent_history", validateAccess.isValidUser, controller.sentHistory);



module.exports = router;

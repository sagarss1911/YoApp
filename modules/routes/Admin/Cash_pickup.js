'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../../controllers/Admin/Cash_pickup"),
    validateAccess = require('../../policies/Validate_request_access');

//admin

router.post('/get_all_cash_pickup', validateAccess.isValidAdmin, controller.getAllCashPickupDetails);
router.post("/export_all_cash_pickup", validateAccess.isValidAdmin, controller.exportAllCashPickupRequest);


module.exports = router;
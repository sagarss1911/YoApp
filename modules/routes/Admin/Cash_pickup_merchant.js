'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../../controllers/Admin/Cash_pickup_merchant"),
    validateAccess = require('../../policies/Validate_request_access');

//admin

router.post('/get_all_cash_pickup', validateAccess.isValidAdmin, controller.getAllCashPickupDetails);
router.post("/export_all_cash_pickup", validateAccess.isValidAdmin, controller.exportAllCashPickupRequest);
router.get("/get_all_merchants", validateAccess.isValidAdmin, controller.getAllMerchants);


module.exports = router;
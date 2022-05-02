'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../../controllers/Admin/Bank_transfer_merchant"),
    validateAccess = require('../../policies/Validate_request_access');

//admin

router.post('/get_all_bank_transfer', validateAccess.isValidAdmin, controller.getAllBankDetails);
router.post("/export_all_bank_request", validateAccess.isValidAdmin, controller.exportAllBankRequest);
router.put("/update_bank_request_status/:slider_id", validateAccess.isValidAdmin, controller.updateBankRequestStatus);

module.exports = router;
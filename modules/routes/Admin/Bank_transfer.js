'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../../controllers/Admin/Bank_transfer"),
    validateAccess = require('../../policies/Validate_request_access');

//admin

router.post('/get_all_bank_transfer', validateAccess.isValidAdmin, controller.getAllBankDetails);

module.exports = router;
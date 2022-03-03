'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../../controllers/Admin/Dashboard"),
    validateAccess = require('../../policies/Validate_request_access');

//admin

router.get('/get_bank_transfer_reporting', validateAccess.isValidAdmin, controller.getBankTransferReporting);
module.exports = router;
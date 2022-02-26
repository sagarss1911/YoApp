'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../../controllers/Admin/Support_request"), 
    validateAccess = require('../../policies/Validate_request_access');

router.post("/get_all_support_request", validateAccess.isValidAdmin, controller.getAllSupportRequest);
router.put("/update_support_request_status/:slider_id", validateAccess.isValidAdmin, controller.updateSupportRequestStatus);
router.delete("/delete_support_request/:slider_id", validateAccess.isValidAdmin, controller.deleteSupportRequest);

module.exports = router;

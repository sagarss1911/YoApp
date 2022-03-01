'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../../controllers/Admin/Support_category"), 
    validateAccess = require('../../policies/Validate_request_access');


router.post("/add_support_category",validateAccess.isValidAdmin, controller.addSupportCategory);
router.post("/get_all_support_category", validateAccess.isValidAdmin, controller.getAllSupportCategory);
router.put("/update_support_category/:slider_id", validateAccess.isValidAdmin, controller.updateSupportCategory);
router.delete("/delete_support_category/:slider_id", validateAccess.isValidAdmin, controller.deleteSupportCategory);

module.exports = router;

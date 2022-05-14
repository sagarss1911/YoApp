'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../../controllers/Admin/User_management"),
    validateAccess = require('../../policies/Validate_request_access');

//admin


router.post("/add_admin_user", validateAccess.isValidAdmin, controller.addAdminUser);
router.post("/get_all_user_list", validateAccess.isValidAdmin, controller.getAllUserList);
router.put("/status_change/:slider_id", validateAccess.isValidAdmin, controller.updateStatus);
router.put("/update_user/:slider_id", validateAccess.isValidAdmin, controller.updateUser);

module.exports = router;
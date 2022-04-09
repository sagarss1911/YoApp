'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../../controllers/Admin/Permission_url"),
    validateAccess = require('../../policies/Validate_request_access');

//admin

router.get("/get_all_permission_urls", validateAccess.isValidAdmin, controller.getAllPermissionUrls);
router.post("/add_permission", validateAccess.isValidAdmin, controller.addPermission);
router.post("/get_all_permission_list", validateAccess.isValidAdmin, controller.getAllPermissionList);
router.put("/update_permission/:slider_id", validateAccess.isValidAdmin, controller.updatePermission);

module.exports = router;
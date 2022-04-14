'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../../controllers/Admin/Plans"),
    fileUploadHelper  = require("../../helpers/file_upload"),
    validateAccess = require('../../policies/Validate_request_access');

//admin

router.post('/get_all_plans', validateAccess.isValidAdmin, controller.getAllPlans);
router.get('/get_all_plans', validateAccess.isValidAdmin, controller.getAllPlansForDropdown);
router.post("/add_plan", validateAccess.isValidAdmin,fileUploadHelper.uploadUserProfileImage.fields([{ name: 'plan_image'}]), controller.addPlan);
router.put("/update_plan/:plan_id", validateAccess.isValidAdmin,fileUploadHelper.uploadUserProfileImage.fields([{ name: 'plan_image'}]), controller.updatePlan);
router.put("/update_default_plan/:plan_id", validateAccess.isValidAdmin, controller.updatePlanStatus);

module.exports = router;
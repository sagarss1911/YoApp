'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../controllers/Support_request"), 
    validateAccess = require('../policies/Validate_request_access');



router.post("/add_support_request", validateAccess.isValidUser, controller.addSupportRequest);


module.exports = router;

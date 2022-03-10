'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../controllers/Support_category"), 
    validateAccess = require('../policies/Validate_request_access');



router.get("/get_all_support_category",  controller.getAllSupportCategory);


module.exports = router;

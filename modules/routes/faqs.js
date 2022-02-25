'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../controllers/faqs"),
    validateAccess = require('../policies/Validate_request_access');

//admin
router.post('/add_faqs', validateAccess.isValidAdmin, controller.addFaqs);
router.post('/get_all_faqs', validateAccess.isValidAdmin, controller.getAllFaqs);
router.put("/update_faqs/:slider_id", validateAccess.isValidAdmin, controller.updateFaqs);
router.delete("/remove_faqs/:slider_id", validateAccess.isValidAdmin, controller.deleteFaqs);


module.exports = router;



'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../controllers/Legal"),
    validateAccess = require('../policies/Validate_request_access');

//admin
router.post('/add_legal', validateAccess.isValidAdmin, controller.addLegal);
router.post('/get_legal', validateAccess.isValidAdmin, controller.getLegal);
router.get('/get_legal', controller.getLegalDataForAPP);

module.exports = router;



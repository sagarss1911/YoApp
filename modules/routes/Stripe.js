'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../controllers/Stripe"),
    validateAccess = require('../policies/Validate_request_access');


router.get("/ephemeralkeycreate", validateAccess.isValidUser, controller.ephemeralKeyCreate);
router.get("/paymentintentcreate/:amount", validateAccess.isValidUser, controller.paymentIntentCreate);

module.exports = router;

'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../controllers/Webhook");


router.post("/payment_success", controller.paymentSuccess);
module.exports = router;

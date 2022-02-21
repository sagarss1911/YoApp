'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../controllers/Webhook");


router.post("/payment_success", controller.paymentSuccess);
router.post("/recharge", controller.rechargeCallback);
module.exports = router;

'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../controllers/Recharges"), 
    validateAccess = require('../policies/Validate_request_access');



router.get("/get_operators/:mobile_no", validateAccess.isValidUser, controller.getOperators);
router.get("/get_products", validateAccess.isValidUser, controller.getProducts);
router.get("/get_products/:product_id", validateAccess.isValidUser, controller.getProductsById);
router.post("/process_recharge", validateAccess.isValidUser, controller.processRecharge);
router.get("/recent_recharge", validateAccess.isValidUser, controller.recentRecharge);
router.get("/recharge_history", validateAccess.isValidUser, controller.rechargeHistory);


module.exports = router;

'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../../controllers/Admin/Cash_topup"),
    validateAccess = require('../../policies/Validate_request_access');

//admin


router.get("/get_all_users", validateAccess.isValidAdmin, controller.getAllUsers);
router.post("/add_balance_to_user_wallet", validateAccess.isValidAdmin, controller.addBalanceToUserWallet);
router.post("/get_all_cash_topup", validateAccess.isValidAdmin, controller.getAllCashTopup);
router.post("/export_all_cash_topup", validateAccess.isValidAdmin, controller.exportAllCashTopup);



module.exports = router;
'use strict';

let express    = require("express"),
    router     = express.Router(),
    controller = require("../controllers/Admin"),    
    validateAccess = require('../policies/Validate_request_access');


router.post("/login",controller.Login);
router.patch("/changepassword",validateAccess.isValidAdmin,controller.changePassword);
router.post("/logOut",validateAccess.isValidAdmin,controller.signout);

module.exports = router;

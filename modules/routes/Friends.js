'use strict';

let express = require("express"),
    router = express.Router(),
    controller = require("../controllers/Friends"),    
    validateAccess = require('../policies/Validate_request_access');


router.post("/add_friend", validateAccess.isValidUser, controller.addFriend);
router.post("/change_friend_request_status", validateAccess.isValidUser, controller.ChangeFriendRequestStatus);
router.post("/my_friend_list_with_mutual_count", validateAccess.isValidUser, controller.myFriendListWithMutualCount);
router.post("/my_blocked_friend_list_with_mutual_count", validateAccess.isValidUser, controller.myBlockedFriendListWithMutualCount);
router.post("/unblock_friend", validateAccess.isValidUser, controller.unBlockFriend);
router.post("/all_user_list", validateAccess.isValidUser, controller.allUserList);



module.exports = router;

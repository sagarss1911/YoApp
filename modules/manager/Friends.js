'use strict';


let helper = require("../helpers/helpers"),
    UserModel = require("../models/Users"),
    NotificationHelper = require("../helpers/notifications"),
    CustomQueryModel = require("../models/Custom_query"),
    SequelizeObj = require("sequelize"),
    FriendsModel = require("../models/Friends"),
    UpdatesModel = require("../models/Updates"),
    axios = require("axios"),
    BadRequestError = require('../errors/badRequestError');

let addFriend = async (userid, userName, req) => {
    let body = req.body
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }
    ['toId'].forEach(x => {
        if (!body[x]) {
            throw new BadRequestError(req.t(x) + ' ' + req.t("is_required"));
        }
    });

    let user = await UserModel
        .findOne({ where: { user_unique_id: body.toId }, attributes: ['id', 'phone', 'username','profileimage','user_unique_id'], raw: true });

    if (!user) {
        throw new BadRequestError(req.t("invalid_user"));
    }

    let isAlreadySent = await FriendsModel
        .findOne({ where: { friend_one: userid, friend_two: user.id }, raw: true });
    //status 4 meands deleted
    //again add we find isAlreadysent  = true  and status 4 
    // find existing and update status to 1
    //if is exist not then normal flow
    if (isAlreadySent) {
        throw new BadRequestError(req.t("req_already_send"));
    } 
     //create friend
     let data = {
        friend_one: userid,
        friend_two: user.id,
        status: '0'
    }
    let friendsCreate = await FriendsModel.create(data);
    //send notificaiton to both user
    // let notificationDataForSender = {
    //     title: req.t("req_sent_success"),
    //     subtitle: req.t("req_sent_success") + ' ' + req.t("to") + ' ' + user.username,
    //     redirectscreen: "friend_request",
    //     friends_id: friendsCreate.friends_id
    // }
    let notificationDataForReceiver = {
        title: "You have Received Friend Request",
        subtitle: "You have Received Friend Request From " + userName,
        redirectscreen: "receive_friend_request",
        friends_id: friendsCreate.friends_id,
        sender_id: userid,
        profileimage: user.profileimage ? user.profileimage : '',
        user_unique_id: user.user_unique_id,
    }
    //await NotificationHelper.sendFriendRequestNotificationToUser(userid, notificationDataForSender);
    await NotificationHelper.sendFriendRequestNotificationToUser(user.id, notificationDataForReceiver);
    //send update to both user
    let updateData = {
        text: req.t("friend_req_sent"),
        friend_one: userid,
        friend_two: user.id,
    }
    await UpdatesModel.create(updateData);
    return true;

}

let ChangeFriendRequestStatus = async (userid, req) => {
    let body = req.body
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }
    ['friends_id', 'status'].forEach(x => {
        if (!body[x]) {
            throw new BadRequestError(req.t(x) + ' ' + req.t("is_required"));
        }
    });

    let isValidRequest = await FriendsModel
        .findOne({ where: { friends_id: body.friends_id }, raw: true });
    if (!isValidRequest) {
        throw new BadRequestError(req.t("invalid_req"));
    }
    let sender = await UserModel.findOne({ where: { id: isValidRequest.friend_one }, raw: true });
    let receiver = await UserModel.findOne({ where: { id: isValidRequest.friend_two }, raw: true });
    //if accepted  then status of friend_id

    if (body.status == 1) {
        //check if acceptor is same as friend_two
        if (isValidRequest.friend_two != userid) {
            throw new BadRequestError(req.t("req_not_belongs_you"));
        }
        await FriendsModel.update({ status: '1' }, { where: { friends_id: body.friends_id }, raw: true });
        let data = {
            friend_one: isValidRequest.friend_two,
            friend_two: isValidRequest.friend_one,
            status: '1'
        }
        let friendsCreate = await FriendsModel.create(data);
        let notificationDataForSender = {
            title: receiver.username + ' ' + req.t("accepted_friend_req"),
            subtitle: receiver.username + ' ' + req.t("accepted_friend_req"),
            redirectscreen: "accepted_other_friend_req",
            friends_id: body.friends_id,
            receiver_id:receiver.id,
            profileimage: receiver.profileimage ? receiver.profileimage : '',
            user_unique_id: receiver.user_unique_id,
        }
        // let notificationDataForReceiver = {
        //     title: req.t("req_accepted_of") + ' ' + sender.username,
        //     subtitle: req.t("req_accepted_of") + ' ' + sender.username,
        //     redirectscreen: "friend_request",
        //     friends_id: body.friends_id
        // }

        await NotificationHelper.sendFriendRequestNotificationToUser(sender.id, notificationDataForSender);
        //await NotificationHelper.sendFriendRequestNotificationToUser(receiver.id, notificationDataForReceiver);
        //send update to both user
        let updateData = {
            text: req.t("req_accepted"),
            friend_one: receiver.id,
            friend_two: sender.id,
        }
        //add friend in comechat panel start
        const acceptedData = {
            accepted: [
                sender.user_unique_id.toString()
            ]
        };
        const headers = {
            'apiKey': process.env.COMECHAT_API_KEY,
            'Content-Type': 'application/json',
        };
        let url = "https://" + process.env.COMECHAT_APP_ID + ".api-" + process.env.COMECHAT_REGION + ".cometchat.io/v3/users/" + receiver.user_unique_id + "/friends";
        let resp = await axios.post(url, acceptedData, { headers: headers })
        if (resp.status != 200) {
            await FriendsModel.update({ status: '0' }, { where: { friends_id: body.friends_id }, raw: true });
            await FriendsModel.destroy({ where: { friends_id: friendsCreate.friends_id }, raw: true });
        }
        //add friend in comechat panel ends
        await UpdatesModel.create(updateData);
    }
    if (body.status == 2) {

        await FriendsModel.update({ status: '2' }, { where: { friends_id: body.friends_id }, raw: true });
        let notificationDataForSender = {
            title: receiver.username + req.t("rejected_friend_req"),
            subtitle: receiver.username + req.t("rejected_friend_req"),
            redirectscreen: "rejected_other_friend_req",
            friends_id: body.friends_id,
            receiver_id:receiver.id,
            profileimage: receiver.profileimage ? receiver.profileimage : '',
            user_unique_id: receiver.user_unique_id
        }
        // let notificationDataForReceiver = {
        //     title: req.t("rejected_friend_req_of") + ' ' + sender.username,
        //     subtitle: req.t("rejected_friend_req_of") + ' ' + sender.username,
        //     redirectscreen: "friend_request",
        //     friends_id: body.friends_id
        // }

        await NotificationHelper.sendFriendRequestNotificationToUser(sender.id, notificationDataForSender);
        //await NotificationHelper.sendFriendRequestNotificationToUser(receiver.id, notificationDataForReceiver);
        //send update to both user
        let updateData = {
            text: req.t("req_rejected"),
            friend_one: receiver.id,
            friend_two: sender.id,
        }
        await UpdatesModel.create(updateData);
    }
    if (body.status == 3) {

        await FriendsModel.update({ status: '3' }, { where: { friends_id: body.friends_id }, raw: true });
        let notificationDataForSender = {
            title: receiver.username + ' ' + req.t("friend_blocked_friend_req"),
            subtitle: receiver.username + ' ' + req.t("friend_blocked_friend_req"),
            redirectscreen: "blocked_other_friend_req",
            friends_id: body.friends_id,
            receiver_id:receiver.id,
            profileimage: receiver.profileimage ? receiver.profileimage : '',
            user_unique_id: receiver.user_unique_id,
        }
        // let notificationDataForReceiver = {
        //     title: req.t("blocked_friend_req_of") + ' ' + sender.username,
        //     subtitle: req.t("blocked_friend_req_of") + ' ' + sender.username,
        //     redirectscreen: "friend_request",
        //     friends_id: body.friends_id
        // }


        await NotificationHelper.sendFriendRequestNotificationToUser(sender.id, notificationDataForSender);
        //await NotificationHelper.sendFriendRequestNotificationToUser(receiver.id, notificationDataForReceiver);
        //send update to both user
        let updateData = {
            text: req.t("blocked_friend_req"),
            friend_one: sender.id,
            friend_two: receiver.id,
        }
        //block friend in comechat panel start
        const acceptedData = {
            blockedUids: [
                receiver.user_unique_id.toString()
            ]
        };
        const headers = {
            'apiKey': process.env.COMECHAT_API_KEY,
            'Content-Type': 'application/json',
        };
        let url = "https://" + process.env.COMECHAT_APP_ID + ".api-" + process.env.COMECHAT_REGION + ".cometchat.io/v3/users/" + sender.user_unique_id + "/blockedusers";
        let resp = await axios.post(url, acceptedData, { headers: headers })
        if (resp.status != 200) {
            await FriendsModel.update({ status: '1' }, { where: { friends_id: body.friends_id }, raw: true });
        }
        //block friend in comechat panel ends

        await UpdatesModel.create(updateData);
    }
    if (body.status == 4) {
        let notificationDataForSender = {
            title: receiver.username + ' ' + req.t("friend_deleted_friend_req"),
            subtitle: receiver.username + ' ' + req.t("friend_deleted_friend_req"),
            redirectscreen: "deleted_other_friend_req",
            friends_id: body.friends_id,
            receiver_id:receiver.id,
            profileimage: receiver.profileimage ? receiver.profileimage : '',
            user_unique_id: receiver.user_unique_id,
        }
        // let notificationDataForReceiver = {
        //     title: req.t("deleted_friend_req_of") + ' ' + sender.username,
        //     subtitle: req.t("deleted_friend_req_of") + ' ' + sender.username,
        //     redirectscreen: "friend_request",
        //     friends_id: body.friends_id
        // }

        await NotificationHelper.sendFriendRequestNotificationToUser(sender.id, notificationDataForSender);
        //await NotificationHelper.sendFriendRequestNotificationToUser(receiver.id, notificationDataForReceiver);
        //send update to both user
        let updateData = {
            text: req.t("deleted_friend_req"),
            friend_one: sender.id,
            friend_two: receiver.id
        }
         //delete friend in comechat panel start
            var data = JSON.stringify({
                "friends": [
                    sender.user_unique_id.toString()
                ]
            });
            let url = "https://" + process.env.COMECHAT_APP_ID + ".api-" + process.env.COMECHAT_REGION + ".cometchat.io/v3/users/" + receiver.user_unique_id + "/friends";
            var config = {
                method: 'delete',
                url: url,
                headers: {
                    'apiKey': process.env.COMECHAT_API_KEY,
                    'Content-Type': 'application/json'
                },
                data: data
            };

            let resp = await axios(config);
            if (resp.status != 200) {
        
                throw new Error(req.t("unblock_friend_error"));
            }
            //delete friend in comechat panel ends 
            await FriendsModel.destroy({ where: { friends_id: body.friends_id }, raw: true });
            await FriendsModel.destroy({ where: { friend_one: receiver.id,friend_two:sender.id }, raw: true });
            await UpdatesModel.create(updateData);
    }

    return true
}
let myFriendListWithMutualCount = async (userid, req) => {
    let body = req.body
    let SearchKeywordsQuery = "";
    if (body.keyword) {
        SearchKeywordsQuery = "and (u.name like '%" + body.keyword + "%' or u.username like '%" + body.keyword + "%' or u.email like '%" + body.keyword + "%' or u.phone like '%" + body.keyword + "%')";
    }
    var SearchSql = "SELECT u.id,f.friends_id,u.user_unique_id,u.username,u.name,u.profileimage, ( SELECT COUNT(*)" +
        "from friends f1 join " +
        "friends f2 " +
        "on f1.friend_two = f2.friend_two " +
        "WHERE f1.friend_one=" + userid + " AND f2.friend_one=u.id " +
        "group by f1.friend_one, f2.friend_one ) AS mutualfriends FROM friends f inner join users u on f.friend_two=u.id WHERE f.friend_one=" + userid + " and f.status='1'" + SearchKeywordsQuery;
    let matchingProfiles = await CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });
    matchingProfiles = matchingProfiles.map(function (item) {
        item.mutualfriends = item.mutualfriends ? item.mutualfriends : 0;
        return item;
    });

    return matchingProfiles;
}
let myBlockedFriendListWithMutualCount = async (userid, req) => {
    let body = req.body
    let SearchKeywordsQuery = ""
    if (body.keyword) {
        SearchKeywordsQuery = "and (u.name like '%" + body.keyword + "%' or u.username like '%" + body.keyword + "%' or u.email like '%" + body.keyword + "%' or u.phone like '%" + body.keyword + "%')";
    }
    var SearchSql = "SELECT u.id,f.friends_id,u.user_unique_id,u.username,u.name, u.profileimage,( SELECT COUNT(*)" +
        "from friends f1 join " +
        "friends f2 " +
        "on f1.friend_two = f2.friend_two " +
        "WHERE f1.friend_one=" + userid + " AND f2.friend_one=u.id " +
        "group by f1.friend_one, f2.friend_one ) AS mutualfriends FROM friends f inner join users u on f.friend_two=u.id WHERE f.friend_one=" + userid + " and f.status='3'" + SearchKeywordsQuery;

    let matchingProfiles = await CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });
    matchingProfiles = matchingProfiles.map(function (item) {
        item.mutualfriends = item.mutualfriends ? item.mutualfriends : 0;
        return item;
    });
    return matchingProfiles;
}
let unBlockFriend = async (userid, friends_id, req,uuid=0) => {    
    let userObj;    
    let blockedFriends;
    if(!uuid){
        blockedFriends = await FriendsModel.findOne({ where: { friend_one: userid, friends_id: friends_id, status: '3' }, raw: true });
        
    }
    else{
        userObj= await UserModel.findOne({ where: { user_unique_id: uuid }, attributes: ['id'],raw: true });
        blockedFriends = await FriendsModel.findOne({ where: { friend_one: userid, friend_two: userObj.id, status: '3' }, raw: true });
    }
    if (!blockedFriends) {
        throw new Error(req.t("not_blocked_user"));
    }
    await FriendsModel.update({ status: '1' }, { where: { friends_id: blockedFriends.friends_id }, raw: true });
    let receiver = await UserModel.findOne({ where: { id: blockedFriends.friend_one }, raw: true });
    let sender = await UserModel.findOne({ where: { id: blockedFriends.friend_two }, raw: true });
    
    let notificationDataForSender = {
        title: receiver.username + ' ' + req.t("friend_unblocked_friend_req"),
        subtitle: receiver.username + ' ' + req.t("friend_unblocked_friend_req"),
        redirectscreen: "unblock_other_friend_req",
        friends_id: blockedFriends.friends_id,
        receiver_id:receiver.id,
        profileimage: receiver.profileimage ? receiver.profileimage : '',
        user_unique_id: receiver.user_unique_id
    }
    // let notificationDataForReceiver = {
    //     title: req.t("unblocked_friend_req_of") + ' ' + sender.username,
    //     subtitle: req.t("unblocked_friend_req_of") + ' ' + sender.username,
    //     redirectscreen: "friend_request",
    //     friends_id: blockedFriends.friends_id
    // }

    await NotificationHelper.sendFriendRequestNotificationToUser(sender.id, notificationDataForSender);
    //await NotificationHelper.sendFriendRequestNotificationToUser(receiver.id, notificationDataForReceiver);
    //send update to both user
    let updateData = {
        text: req.t("unblocked_friend_req"),
        friend_one: receiver.id,
        friend_two: sender.id,
    }
    //block friend in comechat panel start
    var data = JSON.stringify({
        "blockedUids": [
            sender.user_unique_id.toString()
        ]
    });
    
    let url = "https://" + process.env.COMECHAT_APP_ID + ".api-" + process.env.COMECHAT_REGION + ".cometchat.io/v3/users/" + receiver.user_unique_id + "/blockedusers";
    var config = {
        method: 'delete',
        url: url,
        headers: {
            'apiKey': process.env.COMECHAT_API_KEY,
            'Content-Type': 'application/json'
        },
        data: data
    };
    //console.log(config)
    let resp = await axios(config);
    if (resp.status != 200) {
        await FriendsModel.update({ status: '1' }, { where: { friends_id: friends_id }, raw: true });
        throw new Error(req.t("unblock_friend_error"));
    }
    //block friend in comechat panel ends              
    await UpdatesModel.create(updateData);
    return true;
}
let allUserList = async (userid, req) => {
    let body = req.body
    let SearchKeywordsQuery = ""
    if (body.keyword) {
        SearchKeywordsQuery = " and (u.name like '%" + body.keyword + "%' or u.username like '%" + body.keyword + "%' or u.email like '%" + body.keyword + "%' or u.phone like '%" + body.keyword + "%')";
    }
    let SearchSql = "SELECT u.id,u.username,u.user_unique_id,u.name,u.profileimage, ( SELECT COUNT(*)" +
        "from friends f1 join " +
        "friends f2 " +
        "on f1.friend_two = f2.friend_two " +
        "WHERE f1.friend_one=" + userid + " AND f2.friend_one=u.id " +
        "group by f1.friend_one, f2.friend_one ) AS mutualfriends,(SELECT f3.status FROM friends f3 WHERE f3.friend_one="+userid+" AND f3.friend_two=u.id ) AS status FROM users u WHERE u.id!=" + userid + SearchKeywordsQuery;
    
    let matchingProfiles = await CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });
    matchingProfiles = matchingProfiles.map(function (item) {
        item.mutualfriends = item.mutualfriends ? item.mutualfriends : 0;
        
        return item;
    });
    return matchingProfiles;
}
let myIncomingFriendRequest = async (userid, req) => {
    let body = req.body
    let SearchKeywordsQuery = ""
    if (body.keyword) {
        SearchKeywordsQuery = "and (u.name like '%" + body.keyword + "%' or u.username like '%" + body.keyword + "%' or u.email like '%" + body.keyword + "%' or u.phone like '%" + body.keyword + "%')";
    }
    var SearchSql = "SELECT u.id,f.friends_id,u.user_unique_id,u.username,u.name, u.profileimage,( SELECT COUNT(*)" +
        "from friends f1 join " +
        "friends f2 " +
        "on f1.friend_two = f2.friend_two " +
        "WHERE f1.friend_one=" + userid + " AND f2.friend_one=u.id " +
        "group by f1.friend_one, f2.friend_one ) AS mutualfriends FROM friends f inner join users u on f.friend_one=u.id WHERE f.friend_two=" + userid + " and f.status='0'" + SearchKeywordsQuery;

    let matchingProfiles = await CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });
    matchingProfiles = matchingProfiles.map(function (item) {
        item.mutualfriends = item.mutualfriends ? item.mutualfriends : 0;
        return item;
    });
    return matchingProfiles;
}
module.exports = {
    addFriend: addFriend,
    ChangeFriendRequestStatus: ChangeFriendRequestStatus,
    myFriendListWithMutualCount: myFriendListWithMutualCount,
    myBlockedFriendListWithMutualCount: myBlockedFriendListWithMutualCount,
    unBlockFriend: unBlockFriend,
    allUserList: allUserList,
    myIncomingFriendRequest: myIncomingFriendRequest
};

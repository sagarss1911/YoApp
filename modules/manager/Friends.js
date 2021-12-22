'use strict';


let helper = require("../helpers/helpers"),
    UserModel = require("../models/Users"),
    NotificationHelper = require("../helpers/notifications"),
    CustomQueryModel = require("../models/Custom_query"),
    SequelizeObj = require("sequelize"),
    FriendsModel = require("../models/Friends"),
    UpdatesModel = require("../models/Updates"),
    BadRequestError = require('../errors/badRequestError');

let addFriend = async (userid, userName, body) => {
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }
    ['toId'].forEach(x => {
        if (!body[x]) {
            throw new BadRequestError(req.t(x)+' '+req.t("is_required"));
        }
    });

    let user = await UserModel
        .findOne({ where: { user_unique_id: body.toId }, attributes: ['id', 'phone', 'username'], raw: true });

    if (!user) {
        throw new BadRequestError(req.t("invalid_user"));
    }

    let isAlreadySent = await FriendsModel
        .findOne({ where: { friend_one: userid, friend_two: user.id }, raw: true });
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
    let notificationDataForSender = {
        title: req.t("req_sent_success"),
        subtitle: req.t("req_sent_success")+' '+req.t("to")+' '+user.username,
        redirectscreen: "friend_request",
        friends_id: friendsCreate.friends_id
    }
    let notificationDataForReceiver = {
        title: "You have Received Friend Request",
        subtitle: "You have Received Friend Request From " + userName,
        redirectscreen: "friend_request",
        friends_id: friendsCreate.friends_id
    }
    await NotificationHelper.sendFriendRequestNotificationToUser(userid, notificationDataForSender);
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

let ChangeFriendRequestStatus = async (userid,  body) => {
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }
    ['friends_id', 'status'].forEach(x => {
        if (!body[x]) {
            throw new BadRequestError(req.t(x)+' '+req.t("is_required"));
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
    if (isValidRequest.friend_two != userid) {
        throw new BadRequestError(req.t("req_not_belongs_you"));
    }
    if (body.status == 1) {
        //check if acceptor is same as friend_two

        await FriendsModel.update({ status: '1' }, { where: { friends_id: body.friends_id }, raw: true });
        let data = {
            friend_one: isValidRequest.friend_two,
            friend_two: isValidRequest.friend_one,
            status: '1'
        }
        let friendsCreate = await FriendsModel.create(data);
        let notificationDataForSender = {
            title: receiver.username +' '+req.t("accepted_friend_req"),
            subtitle: receiver.username +' '+req.t("accepted_friend_req"),
            redirectscreen: "friend_request",
            friends_id: body.friends_id
        }
        let notificationDataForReceiver = {
            title: req.t("req_accepted_of")+' '+sender.username,
            subtitle: req.t("req_accepted_of")+' '+sender.username,
            redirectscreen: "friend_request",
            friends_id: body.friends_id
        }

        await NotificationHelper.sendFriendRequestNotificationToUser(sender.id, notificationDataForSender);
        await NotificationHelper.sendFriendRequestNotificationToUser(receiver.id, notificationDataForReceiver);
        //send update to both user
        let updateData = {
            text: req.t("req_accepted"),
            friend_one: receiver.id,
            friend_two: sender.id,
        }
        await UpdatesModel.create(updateData);
    }
    if (body.status == 2) {

        await FriendsModel.update({ status: '2' }, { where: { friends_id: body.friends_id }, raw: true });
        let notificationDataForSender = {
            title: receiver.username + req.t("rejected_friend_req"),
            subtitle: receiver.username + req.t("rejected_friend_req"),
            redirectscreen: "friend_request",
            friends_id: body.friends_id
        }
        let notificationDataForReceiver = {
            title: req.t("rejected_friend_req_of")+' '+sender.username,
            subtitle: req.t("rejected_friend_req_of")+' '+sender.username,
            redirectscreen: "friend_request",
            friends_id: body.friends_id
        }

        await NotificationHelper.sendFriendRequestNotificationToUser(sender.id, notificationDataForSender);
        await NotificationHelper.sendFriendRequestNotificationToUser(receiver.id, notificationDataForReceiver);
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
            title: receiver.username +' '+ req.t("friend_blocked_friend_req"),
            subtitle: receiver.username +' '+ req.t("friend_blocked_friend_req"),
            redirectscreen: "friend_request",
            friends_id: body.friends_id
        }
        let notificationDataForReceiver = {
            title: req.t("blocked_friend_req_of")+' '+sender.username,
            subtitle: req.t("blocked_friend_req_of")+' '+sender.username,
            redirectscreen: "friend_request",
            friends_id: body.friends_id
        }

        await NotificationHelper.sendFriendRequestNotificationToUser(sender.id, notificationDataForSender);
        await NotificationHelper.sendFriendRequestNotificationToUser(receiver.id, notificationDataForReceiver);
        //send update to both user
        let updateData = {
            text: req.t("blocked_friend_req"),
            friend_one: receiver.id,
            friend_two: sender.id,
        }
        await UpdatesModel.create(updateData);
    }
    if (body.status == 4) {

        await FriendsModel.update({ status: '4' }, { where: { friends_id: body.friends_id }, raw: true });
        let notificationDataForSender = {
            title: receiver.username +' '+req.t("friend_deleted_friend_req"),
            subtitle: receiver.username +' '+req.t("friend_deleted_friend_req"),
            redirectscreen: "friend_request",
            friends_id: body.friends_id
        }
        let notificationDataForReceiver = {
            title: req.t("deleted_friend_req_of")+' '+sender.username,
            subtitle: req.t("deleted_friend_req_of")+' '+sender.username,
            redirectscreen: "friend_request",
            friends_id: body.friends_id
        }

        await NotificationHelper.sendFriendRequestNotificationToUser(sender.id, notificationDataForSender);
        await NotificationHelper.sendFriendRequestNotificationToUser(receiver.id, notificationDataForReceiver);
        //send update to both user
        let updateData = {
            text: req.t("deleted_friend_req"),
            friend_one: receiver.id,
            friend_two: sender.id
        }
        await UpdatesModel.create(updateData);
    }
    return true
}
let myFriendListWithMutualCount = async (userid,body) => {
    let SearchKeywordsQuery = "";
    if(body.keyword)
    {
        SearchKeywordsQuery = "and (u.name like '%" + body.keyword + "%' or u.username like '%" + body.keyword + "%' or u.email like '%" + body.keyword + "%' or u.phone like '%" + body.keyword + "%')";
    }
    var SearchSql = "SELECT u.id,u.username,u.name,u.profileimage, ( SELECT COUNT(*)" +
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
let myBlockedFriendListWithMutualCount = async (userid,body) => {
    let SearchKeywordsQuery = ""
    if(body.keyword)
    {
        SearchKeywordsQuery = "and (u.name like '%" + body.keyword + "%' or u.username like '%" + body.keyword + "%' or u.email like '%" + body.keyword + "%' or u.phone like '%" + body.keyword + "%')";
    }
    var SearchSql = "SELECT u.id,u.username,u.name, u.profileimage,( SELECT COUNT(*)" +
        "from friends f1 join " +
        "friends f2 " +
        "on f1.friend_two = f2.friend_two " +
        "WHERE f1.friend_one=" + userid + " AND f2.friend_one=u.id " +
        "group by f1.friend_one, f2.friend_one ) AS mutualfriends FROM friends f inner join users u on f.friend_two=u.id WHERE f.friend_one=" + userid + " and f.status='3'"+SearchKeywordsQuery;

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
let unBlockFriend = async (userid, unblockid) => {    
    let blockedFriends = await FriendsModel.findOne({ where: { friend_one: unblockid,friend_two:userid,status:'3' }, raw: true });
    if(!blockedFriends)
    {
        throw new Error(req.t("not_blocked_user"));
    }
    await FriendsModel.update({ status: '1' }, { where: { friends_id: blockedFriends.friends_id }, raw: true });
    let receiver = await UserModel.findOne({ where: { id: blockedFriends.friend_one }, raw: true });
    let sender = await UserModel.findOne({ where: { id: blockedFriends.friend_two }, raw: true });
  
    let notificationDataForSender = {
        title: receiver.username +' '+req.t("friend_unblocked_friend_req"),
        subtitle: receiver.username +' '+req.t("friend_unblocked_friend_req"),
        redirectscreen: "friend_request",
        friends_id: blockedFriends.friends_id
    }
    let notificationDataForReceiver = {
        title: req.t("unblocked_friend_req_of")+' '+sender.username,
        subtitle: req.t("unblocked_friend_req_of")+' '+sender.username,
        redirectscreen: "friend_request",
        friends_id: blockedFriends.friends_id
    }

    await NotificationHelper.sendFriendRequestNotificationToUser(sender.id, notificationDataForSender);
    await NotificationHelper.sendFriendRequestNotificationToUser(receiver.id, notificationDataForReceiver);
    //send update to both user
    let updateData = {
        text: req.t("unblocked_friend_req"),
        friend_one: receiver.id,
        friend_two: sender.id,
    }
    await UpdatesModel.create(updateData);
    return true;
}
let allUserList = async (userid,body) => {    
    let SearchKeywordsQuery = ""
    if(body.keyword)
    {
        SearchKeywordsQuery = " and (u.name like '%" + body.keyword + "%' or u.username like '%" + body.keyword + "%' or u.email like '%" + body.keyword + "%' or u.phone like '%" + body.keyword + "%')";
    }
    let SearchSql = "SELECT u.id,u.username,u.name,u.profileimage, ( SELECT COUNT(*)" +
        "from friends f1 join " +
        "friends f2 " +
        "on f1.friend_two = f2.friend_two " +
        "WHERE f1.friend_one=" + userid + " AND f2.friend_one=u.id " +
        "group by f1.friend_one, f2.friend_one ) AS mutualfriends FROM users u WHERE u.id!=" + userid + SearchKeywordsQuery ;        
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
    allUserList:allUserList
};

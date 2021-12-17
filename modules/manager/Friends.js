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
        throw new BadRequestError('Request body comes empty');
    }
    ['toId'].forEach(x => {
        if (!body[x]) {
            throw new BadRequestError(x + " is required");
        }
    });

    let user = await UserModel
        .findOne({ where: { user_unique_id: body.toId }, attributes: ['id', 'phone', 'username'], raw: true });

    if (!user) {
        throw new BadRequestError("Invalid User");
    }

    let isAlreadySent = await FriendsModel
        .findOne({ where: { friend_one: userid, friend_two: user.id }, raw: true });
    if (isAlreadySent) {
        throw new BadRequestError("Request Already Sent");
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
        title: "You have Successfully Sent Friend Request",
        subtitle: "You have Successfully Sent Friend Request to " + user.username,
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
        text: "Friend Request Sent",
        friend_one: userid,
        friend_two: user.id,
    }
    await UpdatesModel.create(updateData);
    return true;
}

let ChangeFriendRequestStatus = async (userid,  body) => {
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError('Request body comes empty');
    }
    ['friends_id', 'status'].forEach(x => {
        if (!body[x]) {
            throw new BadRequestError(x + " is required");
        }
    });

    let isValidRequest = await FriendsModel
        .findOne({ where: { friends_id: body.friends_id }, raw: true });
    if (!isValidRequest) {
        throw new BadRequestError("Invalid Request");
    }
    let sender = await UserModel.findOne({ where: { id: isValidRequest.friend_one }, raw: true });
    let receiver = await UserModel.findOne({ where: { id: isValidRequest.friend_two }, raw: true });
    //if accepted  then status of friend_id
    if (isValidRequest.friend_two != userid) {
        throw new BadRequestError("This Request Not Belongs To You");
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
            title: receiver.username + " have Accepted your Friend Request",
            subtitle: receiver.username + " have Accepted your Friend Request",
            redirectscreen: "friend_request",
            friends_id: body.friends_id
        }
        let notificationDataForReceiver = {
            title: "You have Successfully Accepted Friend Request of " + sender.username,
            subtitle: "You have Successfully Accepted Friend Request of " + sender.username,
            redirectscreen: "friend_request",
            friends_id: body.friends_id
        }

        await NotificationHelper.sendFriendRequestNotificationToUser(sender.id, notificationDataForSender);
        await NotificationHelper.sendFriendRequestNotificationToUser(receiver.id, notificationDataForReceiver);
        //send update to both user
        let updateData = {
            text: "Friend Request Accepted",
            friend_one: receiver.id,
            friend_two: sender.id,
        }
        await UpdatesModel.create(updateData);
    }
    if (body.status == 2) {

        await FriendsModel.update({ status: '2' }, { where: { friends_id: body.friends_id }, raw: true });
        let notificationDataForSender = {
            title: receiver.username + " have Rejected your Friend Request",
            subtitle: receiver.username + " have Rejected your Friend Request",
            redirectscreen: "friend_request",
            friends_id: body.friends_id
        }
        let notificationDataForReceiver = {
            title: "You have Rejected Friend Request of " + sender.username,
            subtitle: "You have Rejected Friend Request of " + sender.username,
            redirectscreen: "friend_request",
            friends_id: body.friends_id
        }

        await NotificationHelper.sendFriendRequestNotificationToUser(sender.id, notificationDataForSender);
        await NotificationHelper.sendFriendRequestNotificationToUser(receiver.id, notificationDataForReceiver);
        //send update to both user
        let updateData = {
            text: "Friend Request Rejected",
            friend_one: receiver.id,
            friend_two: sender.id,
        }
        await UpdatesModel.create(updateData);
    }
    if (body.status == 3) {

        await FriendsModel.update({ status: '3' }, { where: { friends_id: body.friends_id }, raw: true });
        let notificationDataForSender = {
            title: receiver.username + " have Blocked your Friend Request",
            subtitle: receiver.username + " have Blocked your Friend Request",
            redirectscreen: "friend_request",
            friends_id: body.friends_id
        }
        let notificationDataForReceiver = {
            title: "You have Blocked Friend Blocked of " + sender.username,
            subtitle: "You have Blocked Friend Blocked of " + sender.username,
            redirectscreen: "friend_request",
            friends_id: body.friends_id
        }

        await NotificationHelper.sendFriendRequestNotificationToUser(sender.id, notificationDataForSender);
        await NotificationHelper.sendFriendRequestNotificationToUser(receiver.id, notificationDataForReceiver);
        //send update to both user
        let updateData = {
            text: "Friend Request Blocked",
            friend_one: receiver.id,
            friend_two: sender.id,
        }
        await UpdatesModel.create(updateData);
    }
    if (body.status == 4) {

        await FriendsModel.update({ status: '4' }, { where: { friends_id: body.friends_id }, raw: true });
        let notificationDataForSender = {
            title: receiver.username + " have Deleted your Friend Request",
            subtitle: receiver.username + " have Deleted your Friend Request",
            redirectscreen: "friend_request",
            friends_id: body.friends_id
        }
        let notificationDataForReceiver = {
            title: "You have Deleted Friend Request of " + sender.username,
            subtitle: "You have Deleted Friend Request of " + sender.username,
            redirectscreen: "friend_request",
            friends_id: body.friends_id
        }

        await NotificationHelper.sendFriendRequestNotificationToUser(sender.id, notificationDataForSender);
        await NotificationHelper.sendFriendRequestNotificationToUser(receiver.id, notificationDataForReceiver);
        //send update to both user
        let updateData = {
            text: "Friend Request Deleted",
            friend_one: receiver.id,
            friend_two: sender.id,
        }
        await UpdatesModel.create(updateData);
    }
    return true
}
let myFriendListWithMutualCount = async (userid) => {
    var SearchSql = "SELECT u.id,u.username,u.profileimage, ( SELECT COUNT(*)" +
        "from friends f1 join " +
        "friends f2 " +
        "on f1.friend_two = f2.friend_two " +
        "WHERE f1.friend_one=" + userid + " AND f2.friend_one=u.id " +
        "group by f1.friend_one, f2.friend_one ) AS mutualfriends FROM friends f inner join users u on f.friend_two=u.id WHERE f.friend_one=" + userid + " and f.status='1'";    
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
let myBlockedFriendListWithMutualCount = async (userid) => {
    var SearchSql = "SELECT u.id,u.username, u.profileimage,( SELECT COUNT(*)" +
        "from friends f1 join " +
        "friends f2 " +
        "on f1.friend_two = f2.friend_two " +
        "WHERE f1.friend_one=" + userid + " AND f2.friend_one=u.id " +
        "group by f1.friend_one, f2.friend_one ) AS mutualfriends FROM friends f inner join users u on f.friend_two=u.id WHERE f.friend_one=" + userid + " and f.status='3'";

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
        throw new Error("You have not blocked this user");
    }
    await FriendsModel.update({ status: '1' }, { where: { friends_id: blockedFriends.friends_id }, raw: true });
    let receiver = await UserModel.findOne({ where: { id: blockedFriends.friend_one }, raw: true });
    let sender = await UserModel.findOne({ where: { id: blockedFriends.friend_two }, raw: true });
  
    let notificationDataForSender = {
        title: receiver.username + " have UnBlocked your Friend Request",
        subtitle: receiver.username + " have UnBlocked your Friend Request",
        redirectscreen: "friend_request",
        friends_id: blockedFriends.friends_id
    }
    let notificationDataForReceiver = {
        title: "You have UnBlocked Friend Request of " + sender.username,
        subtitle: "You have UnBlocked Friend Request of " + sender.username,
        redirectscreen: "friend_request",
        friends_id: blockedFriends.friends_id
    }

    await NotificationHelper.sendFriendRequestNotificationToUser(sender.id, notificationDataForSender);
    await NotificationHelper.sendFriendRequestNotificationToUser(receiver.id, notificationDataForReceiver);
    //send update to both user
    let updateData = {
        text: "Friend Request UnBlocked",
        friend_one: receiver.id,
        friend_two: sender.id,
    }
    await UpdatesModel.create(updateData);
    return true;
        
}
module.exports = {
    addFriend: addFriend,
    ChangeFriendRequestStatus: ChangeFriendRequestStatus,
    myFriendListWithMutualCount: myFriendListWithMutualCount,
    myBlockedFriendListWithMutualCount: myBlockedFriendListWithMutualCount,
    unBlockFriend: unBlockFriend
};

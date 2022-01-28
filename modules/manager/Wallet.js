'use strict';


let helper = require("../helpers/helpers"),
    md5 = require('md5'),
    SEND_SMS = require("../helpers/send_sms"),
    SEND_EMAIL = require("../helpers/send_email"),
    UserModel = require("../models/Users"),
    WalletModel = require("../models/Wallet"),
    NotificationHelper = require("../helpers/notifications"),
    CountryModel = require("../models/Country"),
    SequelizeObj = require("sequelize"),
    BalanceLogModel = require("../models/Balance_log"),
    CustomQueryModel = require("../models/Custom_query"),
    StripeManager = require("../manager/Stripe"),
    config = process.config.global_config,
    StripeFunc = require("../manager/Stripe"),
    SEND_PUSH = require('../helpers/send_push'),
    axios = require('axios'),
    util = require('util'),
    BadRequestError = require('../errors/badRequestError');

let addMoneyToWallet = async (userid, body, req) => {
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }

    if (helper.undefinedOrNull(body.amount) || Number(body.amount) <= 0) {
        throw new BadRequestError("Please provide Amount");
    }
    try {

        const paymentIntent = await StripeManager.paymentIntent(userid, body.amount);
        let createData = {
            userId: userid,
            order_date: new Date(),
            client_secret: paymentIntent.client_secret,
            currency: paymentIntent.currency,
            trans_id: paymentIntent.id,
            amount: paymentIntent.amount,
            order_status: 'pending',
            ordertype: '1',
            txn_initiate_date: paymentIntent.created,
        }
        await WalletModel.create(createData);
        return paymentIntent.client_secret;
    }
    catch (err) {
        console.log(err);
        if (err.raw.code == 'err.raw.code') {
            throw new BadRequestError(err.raw.message);
        }
        throw new BadRequestError(err);
    }
}
let transactionStatus = async (userid, client_secret, req) => {
    try {

        let WalletInfo = await WalletModel.findOne({ where: { client_secret: client_secret }, raw: true });
        if (helper.undefinedOrNull(WalletInfo)) {
            throw new BadRequestError("Invalid transaction");
        }
        if (WalletInfo.userId != userid) {
            throw new BadRequestError("Invalid transaction");
        }
        WalletInfo.amount = parseFloat(WalletInfo.amount / 100);
        return WalletInfo;

    }
    catch (err) {
        console.log(err);
        if (err.raw.code == 'err.raw.code') {
            throw new BadRequestError(err.raw.message);
        }
        throw new BadRequestError(err);
    }

}

let sendMoneyToWallet = async (userid, body, req) => {
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }
    body.receiver_uuid = body.receiver_uuid.toString().replace(/\s/g,'');   
    if (helper.undefinedOrNull(body.amount) || Number(body.amount) <= 0) {
        throw new BadRequestError("Please provide Amount");
    }
    let senderInfo = await UserModel.findOne({ where: { id: userid }, raw: true });
    if (!senderInfo.balance || senderInfo.balance <= 0) {
        throw new BadRequestError(req.t("insufficient_balance"));
    }
    if (senderInfo.user_unique_id == body.receiver_uuid) {
        throw new BadRequestError("Can not send money to yourself");
    }
    if(body.receiver_uuid.toString().includes(senderInfo.phone)){
        throw new BadRequestError("Can not send money to yourself");
    }
    try {

        let findData = {}
        findData["$or"] = [
            { user_unique_id: { $eq: body.receiver_uuid } },
            { phone: { $eq: body.receiver_uuid } }
        ]
        let receiverInfo = await UserModel.findOne({ where: findData, raw: true });

        if (!receiverInfo) {
            //create new user
            let createData = {
                user_unique_id: Date.now().toString(),
                balance: 0,
                phone: body.receiver_uuid,
                reference_id: Date.now().toString()

            }
            receiverInfo = await UserModel.create(createData);
            SEND_SMS.paymentReceivedWithoutAccount(parseFloat(body.amount), receiverInfo.phone, receiverInfo.reference_id);
        }

        //add entry to sender
        let senderWalletData = {
            userId: senderInfo.id,
            order_date: new Date(),
            amount: Number(body.amount) * 100,
            order_status: 'success',
            ordertype: '2',
            destination_userId: receiverInfo.id,
        }

        let senderWalletInfo = await WalletModel.create(senderWalletData);

        //update balance log
        let senderBalanceLogData = {
            userId: senderInfo.id,
            amount: Number(body.amount),
            oldbalance: Number(senderInfo.balance),
            newbalance: Number(senderInfo.balance) - Number(body.amount),
            transaction_type: '2',
            wallet_id: senderWalletInfo.id
        }
        await BalanceLogModel.create(senderBalanceLogData);
        await UserModel.update({ balance: Number(senderInfo.balance) - Number(body.amount) }, { where: { id: senderInfo.id } });
        let country = await CountryModel.findOne({ where: { iso_code_2: senderInfo.region }, raw: true })
        let notificationDataSender = {
            title: "Congrats! Money Successfully Sent to " + receiverInfo.phone,
            subtitle: "Amount: " + body.amount + " Successfully Transfered to " + receiverInfo.phone,
            redirectscreen: "payment_success_wallet",
        }
        await NotificationHelper.sendFriendRequestNotificationToUser(senderInfo.id, notificationDataSender);

        SEND_SMS.paymentSentSMS(parseFloat(body.amount), "+" + country.isd_code + senderInfo.phone, receiverInfo.phone);
        //add entry to receiver
        let receiverWalletData = {
            userId: receiverInfo.id,
            order_date: new Date(),
            amount: Number(body.amount) * 100,
            order_status: 'success',
            ordertype: '2',
            source_userId: senderInfo.id,
            source_wallet_id: senderWalletInfo.id
        }
        let receiverWalletInfo = await WalletModel.create(receiverWalletData);

        //update receiver wallet
        let receiverBalanceLogData = {
            userId: receiverInfo.id,
            amount: Number(body.amount),
            oldbalance: Number(receiverInfo.balance),
            newbalance: Number(receiverInfo.balance) + Number(body.amount),
            transaction_type: '1',
            wallet_id: receiverWalletInfo.id
        }
        await BalanceLogModel.create(receiverBalanceLogData);
        await UserModel.update({ balance: Number(receiverInfo.balance) + Number(body.amount) }, { where: { id: receiverInfo.id } });
        let receiverCountry;
        if (receiverInfo.region) {
            receiverCountry = await CountryModel.findOne({ where: { iso_code_2: receiverInfo.region }, raw: true })
            if (receiverCountry) {
                receiverInfo.phone = "+" + receiverCountry.isd_code + receiverInfo.phone;
            }
        }
        let notificationDataReceiver = {
            title: "Congrats! You have received money from " + senderInfo.phone,
            subtitle: body.amount + " Successfully Transfered from " + senderInfo.phone + " to Your Wallet",
            redirectscreen: "payment_success_wallet",
        }
        await NotificationHelper.sendFriendRequestNotificationToUser(receiverInfo.id, notificationDataReceiver);

        SEND_SMS.paymentReceivedSMS(parseFloat(body.amount), "+" + country.isd_code + senderInfo.phone, receiverInfo.phone);


        return true;

    }
    catch (err) {
        console.log(err);
        throw new BadRequestError(err);
    }      

}

let recentWalletToWallet = async (userid, req) => {
    try {
        var SearchSql = "SELECT  id,destination_userId,amount,order_date ";
        SearchSql += "FROM    wallet ";
        SearchSql += "WHERE userId="+userid+"  and ordertype = 2 and order_status='success' AND destination_userId IS NOT NULL AND id NOT IN ( ";
        SearchSql += "SELECT  d2.id ";
        SearchSql += "FROM    wallet d1 ";
        SearchSql += "INNER JOIN wallet d2 ON d2.destination_userId=d1.destination_userId ";
        SearchSql += "WHERE d1.id > d2.id ";
        SearchSql += ") ";
        SearchSql += "ORDER BY id LIMIT 5 ";
      
        let recentWalletToWalletTransaction = await CustomQueryModel.query(SearchSql, {
            type: SequelizeObj.QueryTypes.SELECT,
            raw: true
        });
        for (let i = 0; i < recentWalletToWalletTransaction.length; i++) {
            recentWalletToWalletTransaction[i].amount = parseFloat(Number(recentWalletToWalletTransaction[i].amount) / 100);
            let userInfo = await UserModel.findOne({ where: { id: recentWalletToWalletTransaction[i].destination_userId }, raw: true, attributes: ['user_unique_id', 'name'] });
            recentWalletToWalletTransaction[i].user_data = userInfo;
            delete recentWalletToWalletTransaction[i].destination_userId;
            delete recentWalletToWalletTransaction[i].id;
        }

        return recentWalletToWalletTransaction;
    }
    catch (err) {
        console.log(err);
        throw new BadRequestError(err);
    }
}
let sendDummyNotification = async (userid, body, req) => {
    try {

        let notificationData = {
            title: "notification title",
            subtitle: "notification subtitle",
            redirectscreen: "payment_success_wallet",
        }
        let nr = await SEND_PUSH.notifyAndroidOrIOS(body.token, "Dummy Notification", notificationData);
    }
    catch (err) {
        console.log(err);
        throw new BadRequestError(err);
    }

}
module.exports = {
    addMoneyToWallet: addMoneyToWallet,
    transactionStatus: transactionStatus,
    sendMoneyToWallet: sendMoneyToWallet,
    recentWalletToWallet: recentWalletToWallet,
    sendDummyNotification: sendDummyNotification

};

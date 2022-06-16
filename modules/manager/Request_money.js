'use strict';


let helper = require("../helpers/helpers"),
    SEND_SMS = require("../helpers/send_sms"),
    UserModel = require("../models/Users"),
    WalletModel = require("../models/Wallet"),
    WalletClaimsModel = require("../models/Wallet_claims"),
    NotificationHelper = require("../helpers/notifications"),
    CountryModel = require("../models/Country"),
    CashPickupModel = require("../models/Cash_pickup"),
    SequelizeObj = require("sequelize"),
    BalanceLogModel = require("../models/Balance_log"),
    BankTransferModel = require("../models/Bank_transfer"),
    RequestMoneyModel = require("../models/Request_money"),
    CustomQueryModel = require("../models/Custom_query"),
    StripeManager = require("../manager/Stripe"),
    fs = require('fs'),
    s3Helper = require('../helpers/awsS3Helper'),
    CommonHelper = require('../helpers/helpers'),
    util = require('util'),
    unlinkFile = util.promisify(fs.unlink),
    moment = require("moment"),
    SEND_PUSH = require('../helpers/send_push'),
    BadRequestError = require('../errors/badRequestError');
const { DVS } = require('@dtone/dvs');
const { default: axios } = require("axios");

let requestMoney = async (userid, body) => {
    body.amount = Number(body.amount);
    if (body.amount <= 0) {
        throw new BadRequestError("Amount should be greater than 0");
    }    
    let senderInfo = await UserModel.findOne({ where: { id: userid }, raw: true });
    if (senderInfo.balance < body.amount) {
        throw new BadRequestError("Insufficient Balance");
    }
    let receiverInfo = await UserModel.findOne({ where: { user_unique_id: body.uuid }, raw: true });
    if (!receiverInfo) {
        throw new BadRequestError("Receiver not found");
    }
    let createData = {
        source_userId: userid,
        destination_userId: receiverInfo.id,
        amount: Number(body.amount),
        status: 'Pending'
    }
    let requestData = await RequestMoneyModel.create(createData)
    // send sms and notification to requester start
    let country = await CountryModel.findOne({ where: { iso_code_2: senderInfo.region }, raw: true })
    let notificationDataSender = {
        title: "Congrats! Money Request Successfully generated for: " + receiverInfo.phone,
        subtitle: "Money Request With Amount: " + body.amount + "D Successfully Generated",
        redirectscreen: "request_money_sender",        
        request_data: requestData.id
    }
    await NotificationHelper.sendFriendRequestNotificationToUser(senderInfo.id, notificationDataSender);
    SEND_SMS.requestMoneyRequestSentForSenderSMS(parseFloat(body.amount), "+" + country.isd_code + senderInfo.phone);
    // send sms and notification to requester end
    let receiverCountry;
    if (receiverInfo.region) {
        receiverCountry = await CountryModel.findOne({ where: { iso_code_2: receiverInfo.region }, raw: true })
        if (receiverCountry) {
            receiverInfo.phone = "+" + receiverCountry.isd_code + receiverInfo.phone;
        }
    }
    let notificationDataReceiver = {
        title: "Hey! You have received money Request from " + senderInfo.phone,
        subtitle: "You have received money Request With Amount: "+body.amount + "D, from " + senderInfo.phone + "",
        redirectscreen: "request_money_receiver",        
        request_data: requestData.id
    }
    await NotificationHelper.sendFriendRequestNotificationToUser(receiverInfo.id, notificationDataReceiver);

    SEND_SMS.requestMoneyRequestReceivedFromSMS(parseFloat(body.amount), "+" + country.isd_code + senderInfo.phone, receiverInfo.phone);
    return true;
}
let requestHistory = async (userid, req) => {
    let limit = (req.query.limit) ? parseInt(req.query.limit) : 0;
    let page = req.query.page || 1;
    let offset = (page - 1) * limit;
    let SearchKeywordsQuery = " where  rm.status != 'Completed' AND rm.destination_userId= " + userid;
    if (req.query) {

        if (req.query.searchtext) {
            SearchKeywordsQuery += " and (u.name like '%" + req.query.searchtext + "%' or u.email like '%" + req.query.searchtext + "%' or u.phone like '%" + req.query.searchtext + "%' or rm.amount like '%" + req.query.searchtext + "%')";
        }
        if (req.query.amount) {
            SearchKeywordsQuery += " and (rm.amount =" + req.query.amount + ")";
        }

        if (req.query.from_date) {
            let from_date = moment(req.query.from_date).format('YYYY-MM-DD');
            from_date += " 00:00:00"
            SearchKeywordsQuery += " and  rm.createdAt >= '" + from_date + "'";
        }
        if (req.query.to_date) {
            let to_date = moment(req.query.to_date).format('YYYY-MM-DD');
            to_date += " 23:59:59"

            SearchKeywordsQuery += " and rm.createdAt <= '" + to_date + "'";
        }
    }
     
    var SearchSql = "SELECT u.user_unique_id,u.name,u.username,u.phone,u.email,rm.* FROM request_money rm INNER JOIN users u ON u.id=rm.source_userId " + SearchKeywordsQuery + " order by rm.id desc ";
    if (limit) {
        SearchSql += " limit " + offset + "," + limit;
    }
    let sentRequest = await CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });

    var allSentRequestQuery = "SELECT u.user_unique_id,u.name,u.username,u.phone,u.email,rm.* FROM request_money rm INNER JOIN users u ON u.id=rm.source_userId   " + SearchKeywordsQuery + " order by rm.id desc";
    let allSentRequest = await CustomQueryModel.query(allSentRequestQuery, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });

    let _result = { total_count: 0 };
    _result.slides = sentRequest;
    _result.total_count = allSentRequest.length;
    return _result;
}
let payRequest = async (userid, id) => {
    let isRequestExist = await RequestMoneyModel.findOne({ where: { id: id, destination_userId: userid }, raw: true });    
    if(!isRequestExist){
        throw new BadRequestError("Request not found/ You are not Authorization to decline this request");
    }
    if(isRequestExist.status != "Pending"){
        throw new BadRequestError("Request already processed");
    }
    if(userid != isRequestExist.destination_userId){
        throw new BadRequestError("You are not Authorization to Proceed with this request");
    }
    let senderInfo = await UserModel.findOne({ where: { id: isRequestExist.destination_userId }, raw: true });
    let receiverInfo = await UserModel.findOne({ where: { id: isRequestExist.source_userId }, raw: true });
    let senderWalletData = {
        userId: senderInfo.id,
        order_date: new Date(),
        amount: Number(isRequestExist.amount) * 100,
        order_status: 'success',
        ordertype: '7',
        request_money_id:isRequestExist.id,
        trans_id: await CommonHelper.getUniqueTransactionId(),
        destination_userId: receiverInfo.id,
    }

    let senderWalletInfo = await WalletModel.create(senderWalletData);
    let senderBalanceLogData = {
        userId: senderInfo.id,
        amount: Number(isRequestExist.amount),
        oldbalance: Number(senderInfo.balance),
        newbalance: Number(senderInfo.balance) - Number(isRequestExist.amount),
        transaction_type: '2',
        wallet_id: senderWalletInfo.id
    }
    await BalanceLogModel.create(senderBalanceLogData);
    await UserModel.update({ balance: Number(senderInfo.balance) - Number(isRequestExist.amount) }, { where: { id: senderInfo.id } });
    let country = await CountryModel.findOne({ where: { iso_code_2: senderInfo.region }, raw: true })
    let notificationDataSender = {
        title: "Congrats! Money Successfully Sent to " + receiverInfo.phone,
        subtitle: "Amount: " + isRequestExist.amount + " Successfully Transfered to " + receiverInfo.phone,
        redirectscreen: "money_sent_wallet",
        wallet_id: senderWalletInfo.id,
        transaction_id: senderWalletInfo.trans_id
    }
    await NotificationHelper.sendFriendRequestNotificationToUser(senderInfo.id, notificationDataSender);

    SEND_SMS.paymentSentSMS(parseFloat(isRequestExist.amount), "+" + country.isd_code + senderInfo.phone, receiverInfo.phone);
    let receiverWalletData = {
        userId: receiverInfo.id,
        order_date: new Date(),
        amount: Number(isRequestExist.amount) * 100,
        order_status: 'success',
        ordertype: '7',
        trans_id: await CommonHelper.getUniqueTransactionId(),
        source_userId: senderInfo.id,
        request_money_id:isRequestExist.id,
        source_wallet_id: senderWalletInfo.id
    }
    let receiverWalletInfo = await WalletModel.create(receiverWalletData);
    let receiverBalanceLogData = {
        userId: receiverInfo.id,
        amount: Number(isRequestExist.amount),
        oldbalance: Number(receiverInfo.balance),
        newbalance: Number(receiverInfo.balance) + Number(isRequestExist.amount),
        transaction_type: '1',
        wallet_id: receiverWalletInfo.id
    }
    await BalanceLogModel.create(receiverBalanceLogData);
    await UserModel.update({ balance: Number(receiverInfo.balance) + Number(isRequestExist.amount) }, { where: { id: receiverInfo.id } });
    let receiverCountry;
    if (receiverInfo.region) {
        receiverCountry = await CountryModel.findOne({ where: { iso_code_2: receiverInfo.region }, raw: true })
        if (receiverCountry) {
            receiverInfo.phone = "+" + receiverCountry.isd_code + receiverInfo.phone;
        }
    }
    let notificationDataReceiver = {
        title: "Congrats! You have received money from " + senderInfo.phone,
        subtitle: isRequestExist.amount + " Successfully Transfered from " + senderInfo.phone + " to Your Wallet",
        redirectscreen: "payment_received_wallet",
        wallet_id: receiverWalletInfo.id,
        transaction_id: receiverWalletInfo.trans_id
    }
    await NotificationHelper.sendFriendRequestNotificationToUser(receiverInfo.id, notificationDataReceiver);

    SEND_SMS.paymentReceivedSMS(parseFloat(isRequestExist.amount), "+" + country.isd_code + senderInfo.phone, receiverInfo.phone);
    await RequestMoneyModel.update({ source_walletId:senderWalletInfo.id,destination_walletId:receiverWalletInfo.id,status:'Completed' }, { where: { id: isRequestExist.id } });
    return true;
}
let declineRequest = async (userid, id) => {
    let isRequestExist = await RequestMoneyModel.findOne({ where: { id: id, destination_userId: userid }, raw: true });    
    if(!isRequestExist){
        throw new BadRequestError("Request not found/ You are not Authorization to decline this request");
    }
    if(isRequestExist.status != "Pending"){
        throw new BadRequestError("Request already processed");
    }
    let senderInfo = await UserModel.findOne({ where: { id: isRequestExist.source_userId }, raw: true });    
    let receiverInfo = await UserModel.findOne({ where: { id: isRequestExist.destination_userId }, raw: true });
    
    // send sms and notification to requester start
    let country = await CountryModel.findOne({ where: { iso_code_2: senderInfo.region }, raw: true })
    let notificationDataSender = {
        title: "Your Money Request with Amount: "+isRequestExist.amount +"D from "+ receiverInfo.phone+ " is Declined",
        subtitle: "Money Request With Amount: " + isRequestExist.amount + "D Declined",
        redirectscreen: "request_money_sender",        
        request_data: isRequestExist.id
    }
    await NotificationHelper.sendFriendRequestNotificationToUser(senderInfo.id, notificationDataSender);
    
    // send sms and notification to requester end
    let receiverCountry;
    if (receiverInfo.region) {
        receiverCountry = await CountryModel.findOne({ where: { iso_code_2: receiverInfo.region }, raw: true })
        if (receiverCountry) {
            receiverInfo.phone = "+" + receiverCountry.isd_code + receiverInfo.phone;
        }
    }
    let notificationDataReceiver = {
        title: "Hey! You have Declined money Request from " + senderInfo.phone,
        subtitle: "You have Declined money Request With Amount: "+isRequestExist.amount + "D, from " + senderInfo.phone + "",
        redirectscreen: "request_money_receiver",        
        request_data: isRequestExist.id
    }
    await NotificationHelper.sendFriendRequestNotificationToUser(receiverInfo.id, notificationDataReceiver);
    SEND_SMS.requestMoneyRequestDeclinedForSenderSMS(parseFloat(isRequestExist.amount), "+" + country.isd_code + senderInfo.phone,receiverInfo.phone);
    SEND_SMS.requestMoneyRequestDeclinedForReceiverSMS(parseFloat(isRequestExist.amount), "+" + country.isd_code + senderInfo.phone, receiverInfo.phone);
    await RequestMoneyModel.update({ status: 'Declined' }, { where: { id: id } });
    return true;
}
let sentHistory = async (userid, req) => {
    let limit = (req.query.limit) ? parseInt(req.query.limit) : 0;
    let page = req.query.page || 1;
    let offset = (page - 1) * limit;
    let SearchKeywordsQuery = " where  rm.status='Completed' AND rm.destination_userId= " + userid;
    if (req.query) {

        if (req.query.searchtext) {
            SearchKeywordsQuery += " and (u.name like '%" + req.query.searchtext + "%' or u.email like '%" + req.query.searchtext + "%' or u.phone like '%" + req.query.searchtext + "%' or rm.amount like '%" + req.query.searchtext + "%')";
        }
        if (req.query.amount) {
            SearchKeywordsQuery += " and (rm.amount =" + req.query.amount + ")";
        }

        if (req.query.from_date) {
            let from_date = moment(req.query.from_date).format('YYYY-MM-DD');
            from_date += " 00:00:00"
            SearchKeywordsQuery += " and  rm.createdAt >= '" + from_date + "'";
        }
        if (req.query.to_date) {
            let to_date = moment(req.query.to_date).format('YYYY-MM-DD');
            to_date += " 23:59:59"

            SearchKeywordsQuery += " and rm.createdAt <= '" + to_date + "'";
        }
    }
     
    var SearchSql = "SELECT u.user_unique_id,u.name,u.username,u.phone,u.email,rm.* FROM request_money rm INNER JOIN users u ON u.id=rm.source_userId " + SearchKeywordsQuery + " order by rm.id desc ";
    if (limit) {
        SearchSql += " limit " + offset + "," + limit;
    }
    let sentRequest = await CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });

    var allSentRequestQuery = "SELECT u.user_unique_id,u.name,u.username,u.phone,u.email,rm.* FROM request_money rm INNER JOIN users u ON u.id=rm.source_userId   " + SearchKeywordsQuery + " order by rm.id desc";
    let allSentRequest = await CustomQueryModel.query(allSentRequestQuery, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });

    let _result = { total_count: 0 };
    _result.slides = sentRequest;
    _result.total_count = allSentRequest.length;
    return _result;
}

module.exports = {
    requestMoney:requestMoney,
    requestHistory:requestHistory,
    payRequest:payRequest,
    declineRequest:declineRequest,
    sentHistory:sentHistory
};

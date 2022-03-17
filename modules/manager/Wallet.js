'use strict';


let helper = require("../helpers/helpers"),
    SEND_SMS = require("../helpers/send_sms"),
    UserModel = require("../models/Users"),
    WalletModel = require("../models/Wallet"),
    NotificationHelper = require("../helpers/notifications"),
    CountryModel = require("../models/Country"),
    CashPickupModel = require("../models/Cash_pickup"),
    SequelizeObj = require("sequelize"),
    BalanceLogModel = require("../models/Balance_log"),
    BankTransferModel = require("../models/Bank_transfer"),
    CustomQueryModel = require("../models/Custom_query"),
    StripeManager = require("../manager/Stripe"),
    fs = require('fs'),
    s3Helper = require('../helpers/awsS3Helper'),
    CommonHelper = require('../helpers/helpers'),
    util = require('util'),
    unlinkFile = util.promisify(fs.unlink),
    SEND_PUSH = require('../helpers/send_push'),
    BadRequestError = require('../errors/badRequestError');
const { DVS } = require('@dtone/dvs');
const { default: axios } = require("axios");

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
    body.receiver_uuid = body.receiver_uuid.toString().replace(/\s/g, '');
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
    if (body.receiver_uuid.toString().includes(senderInfo.phone)) {
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
            trans_id: await CommonHelper.getUniqueTransactionId(),
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
            redirectscreen: "money_sent_wallet",
            wallet_id: senderWalletInfo.id,
            transaction_id: senderWalletInfo.trans_id
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
            trans_id: await CommonHelper.getUniqueTransactionId(),
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
            redirectscreen: "payment_received_wallet",
            wallet_id: receiverWalletInfo.id,
            transaction_id: receiverWalletInfo.trans_id
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
        SearchSql += "WHERE userId=" + userid + "  and ordertype = 2 and order_status='success' AND destination_userId IS NOT NULL AND id NOT IN ( ";
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
            let userInfo = await UserModel.findOne({ where: { id: recentWalletToWalletTransaction[i].destination_userId }, raw: true, attributes: ['user_unique_id', 'name', 'phone'] });
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


let cashPickupRequest = async (userid, req) => {
    let body = req.body;
    let addedData = {}
    let requiredField = ['name', 'email', 'phone',  'amount'];
    requiredField.forEach(x => {
        if (!body[x]) {
            throw new BadRequestError(x + " is required");
        }
    });
    body.amount = Number(body.amount);
    if (body.amount <= 0) {
        throw new BadRequestError("Amount should be greater than 0");
    }
    if (body.amount > process.env.CASH_PICKUP_LIMIT) {
        throw new BadRequestError("Amount should be less than " + process.env.CASH_PICKUP_LIMIT);
    }
    let senderInfo = await UserModel.findOne({ where: { id: userid }, raw: true });
    if (senderInfo.balance < body.amount) {
        throw new BadRequestError("Insufficient Balance");
    }
    requiredField.forEach(x => {
        addedData[x] = body[x];
    });
    if (req.files.receiver_id_document && req.files.receiver_id_document.length > 0) {
        const result = await s3Helper.uploadFile(req.files.receiver_id_document[0])
        await unlinkFile(req.files.receiver_id_document[0].path)
        addedData.receiver_id_document = result.Location
    }

    let senderWalletData = {
        userId: senderInfo.id,
        order_date: new Date(),
        amount: Number(body.amount) * 100,
        order_status: 'success',
        ordertype: '4',
        trans_id: await CommonHelper.getUniqueTransactionId(),
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
    addedData["sender_userId"] = senderInfo.id;
    addedData["wallet_id"] = senderWalletInfo.id;
    addedData["transaction_id"] = await CommonHelper.getUniqueTransactionId();
    let CashpickData = await CashPickupModel.create(addedData);
    let updateWalletData = {
        cashpickupId: CashpickData.id
    }
    await WalletModel.update(updateWalletData, { where: { id: senderWalletInfo.id } });
    let country = await CountryModel.findOne({ where: { iso_code_2: senderInfo.region }, raw: true })
    let notificationDataSender = {
        title: "Congrats! Cash-pickup request generated for: " + body.phone,
        subtitle: "Amount: " + body.amount + " Successfully Transfered to Merchant For Cash Pickup for:  " + body.phone,
        redirectscreen: "cash_pickup_request_for_self",
         wallet_id: senderWalletInfo.id,
            transaction_id: senderWalletInfo.trans_id
    }
    await NotificationHelper.sendFriendRequestNotificationToUser(senderInfo.id, notificationDataSender);
    SEND_SMS.paymentCashPickUpSenderSMS(parseFloat(body.amount), "+" + country.isd_code + senderInfo.phone, body.phone, CashpickData.transaction_id);
    SEND_SMS.paymentCashPickUpReceiverSMS(parseFloat(body.amount), "+" + country.isd_code + senderInfo.phone, body.phone, CashpickData.transaction_id);
    return { transaction_id: CashpickData.transaction_id };
}
let transactionHistory = async (userid, req) => {
    let limit = (req.query.limit) ? parseInt(req.query.limit) : 10;
    let page = req.query.page || 1;
    let offset = (page - 1) * limit;

    let findData = {}
    findData["$or"] = [{ "order_status": 'success' }, { "order_status": 'failed' }]    
    findData["$and"] = [{ "userId": userid,"ordertype":{$lt:5} }]
    let allTransactions = await WalletModel.findAll({ where: findData, raw: true, attributes: ['id', 'order_date', 'amount', 'order_status', 'ordertype', 'source_userId', 'destination_userId', 'source_wallet_id', 'currency', 'cashpickupId', 'trans_id', 'bank_transfer_id'], limit, offset, order: [['id', 'DESC']] });

    for (let i = 0; i < allTransactions.length; i++) {
        allTransactions[i].amount = parseFloat(Number(allTransactions[i].amount) / 100);
        // delete allTransactions[i].id;
        if (allTransactions[i].ordertype == '4') {
            allTransactions[i].type = 'Cash Pickup';
            delete allTransactions[i].destination_userId;
            delete allTransactions[i].bank_transfer_id;
            delete allTransactions[i].trans_id;
            delete allTransactions[i].source_userId;
            delete allTransactions[i].source_wallet_id;
            delete allTransactions[i].currency;
            allTransactions[i].cash_pickup_details = await CashPickupModel.findOne({ where: { id: allTransactions[i].cashpickupId }, raw: true, attributes: ['name', 'email', 'phone',  'amount', 'transaction_id', 'receiver_id_document'] });
            allTransactions[i].trans_id = allTransactions[i].cash_pickup_details.transaction_id;

        } else if (allTransactions[i].ordertype == '3') {
            allTransactions[i].type = 'Bank Transfer';
            delete allTransactions[i].destination_userId;
            delete allTransactions[i].source_userId;
            delete allTransactions[i].source_wallet_id;
            delete allTransactions[i].cashpickupId;
            delete allTransactions[i].currency;
            allTransactions[i].bank_transfer_details = await BankTransferModel.findOne({ where: { id: allTransactions[i].bank_transfer_id }, raw: true, attributes: ['name', 'address', 'phone', 'amount', 'bank_name', 'bank_account', 'transaction_id', 'status'] });
            allTransactions[i].trans_id = allTransactions[i].bank_transfer_details.transaction_id;
            delete allTransactions[i].bank_transfer_id;
        } else if (allTransactions[i].ordertype == '2') {
            allTransactions[i].type = 'Wallet to Wallet';
            delete allTransactions[i].cashpickupId;
            delete allTransactions[i].bank_transfer_id;
            if (allTransactions[i].destination_userId) {
                // means i have sent money to someone
                allTransactions[i].wallet_type = 'Debit';
                allTransactions[i].sent_to = await UserModel.findOne({ where: { id: allTransactions[i].destination_userId }, raw: true, attributes: ['name', 'email', 'phone', 'user_unique_id'] });
                delete allTransactions[i].source_userId;
                delete allTransactions[i].source_wallet_id;
            } else if (allTransactions[i].source_userId && allTransactions[i].source_wallet_id) {
                // means i have received money from someone
                allTransactions[i].wallet_type = 'Credit';
                allTransactions[i].received_from = await UserModel.findOne({ where: { id: allTransactions[i].source_userId }, raw: true, attributes: ['name', 'email', 'phone', 'user_unique_id'] });
                delete allTransactions[i].destination_userId;
            }
        } else if (allTransactions[i].ordertype == '1') {
            allTransactions[i].type = 'Credit';
            delete allTransactions[i].cashpickupId;
            delete allTransactions[i].source_userId
            delete allTransactions[i].destination_userId
            delete allTransactions[i].source_wallet_id
            delete allTransactions[i].bank_transfer_id;
        }
    }
    let allCount = await WalletModel.count({ where: findData, raw: true });
    return {
        total: allCount,
        list: allTransactions
    }
    
}
let bankTransfer = async (userid, req) => {
    let body = req.body;

    // BankTransferModel
    let addedData = {}
    let requiredField = ['name', 'address', 'phone', 'bank_name', 'amount', 'bank_account', 'country'];
    requiredField.forEach(x => {
        if (!body[x]) {
            throw new BadRequestError(x + " is required");
        }
    });
    body.amount = Number(body.amount);
    if (body.amount <= 0) {
        throw new BadRequestError("Amount should be greater than 0");
    }
    if (body.amount > process.env.CASH_TRANSFER_LIMIT) {
        throw new BadRequestError("Amount should be less than " + process.env.CASH_TRANSFER_LIMIT);
    }
    let senderInfo = await UserModel.findOne({ where: { id: userid }, raw: true });
    if (senderInfo.balance < body.amount) {
        throw new BadRequestError("Insufficient Balance");
    }
    requiredField.forEach(x => {
        addedData[x] = body[x];
    });

    let senderWalletData = {
        userId: senderInfo.id,
        order_date: new Date(),
        amount: Number(body.amount) * 100,
        order_status: 'success',
        trans_id: await CommonHelper.getUniqueTransactionId(),
        ordertype: '3'
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

    addedData["sender_userId"] = senderInfo.id;
    addedData["wallet_id"] = senderWalletInfo.id;
    addedData["transaction_id"] = await CommonHelper.getUniqueTransactionId();

    let BankTransferData = await BankTransferModel.create(addedData);
    let updateWalletData = {
        bank_transfer_id: BankTransferData.id
    }
    await WalletModel.update(updateWalletData, { where: { id: senderWalletInfo.id } });
    let country = await CountryModel.findOne({ where: { iso_code_2: senderInfo.region }, raw: true })
    let notificationDataSender = {
        title: "Congrats! Bank Transfer request generated for: " + body.phone,
        subtitle: "Amount: " + body.amount + " Successfully Debited and In 3-5 working days money will be credited to " + body.name + "'s account",
        redirectscreen: "bank_transfer_request_for_self",
        wallet_id: senderWalletInfo.id,
        transaction_id: senderWalletInfo.trans_id
    }
    await NotificationHelper.sendFriendRequestNotificationToUser(senderInfo.id, notificationDataSender);
    SEND_SMS.paymentBankTransferSenderSMS(parseFloat(body.amount), "+" + country.isd_code + senderInfo.phone, body.phone, BankTransferData.transaction_id);
    SEND_SMS.paymentBankTransferReceiverSMS(parseFloat(body.amount), "+" + country.isd_code + senderInfo.phone, body.phone, BankTransferData.transaction_id);
    return { transaction_id: BankTransferData.transaction_id };

}
let sendDummyNotification = async (userid, body, req) => {
 
}
module.exports = {
    addMoneyToWallet: addMoneyToWallet,
    transactionStatus: transactionStatus,
    sendMoneyToWallet: sendMoneyToWallet,
    recentWalletToWallet: recentWalletToWallet,
    sendDummyNotification: sendDummyNotification,
    cashPickupRequest: cashPickupRequest,
    transactionHistory: transactionHistory,
    bankTransfer: bankTransfer
};

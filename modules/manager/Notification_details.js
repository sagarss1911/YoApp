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
    FriendsModel = require("../models/Friends"),
    BankTransferModel = require("../models/Bank_transfer"),
    RechargeModel = require("../models/Recharges"),
    CustomQueryModel = require("../models/Custom_query"),
    StripeManager = require("../manager/Stripe"),
    fs = require('fs'),
    s3Helper = require('../helpers/awsS3Helper'),
    CommonHelper = require('../helpers/helpers'),
    util = require('util'),
    unlinkFile = util.promisify(fs.unlink),
    SEND_PUSH = require('../helpers/send_push'),
    BadRequestError = require('../errors/badRequestError');

let friendRequestDetails = async (userid, friends_id, req) => {
    if (!friends_id) {
        throw new BadRequestError("friends_id is required");
    }
    let friendsData = await FriendsModel
        .findOne({ where: { friends_id: friends_id }, raw: true });
    if (!friendsData) {
        throw new BadRequestError("No friends found");
    }  
    
    friendsData.sender = await UserModel.findOne({ where: { id: friendsData.friend_one }, raw: true, attributes: ['id', 'user_unique_id', 'name', 'phone', 'email','profileimage'] });
    friendsData.receiver = await UserModel.findOne({ where: { id: friendsData.friend_two }, raw: true, attributes: ['id', 'user_unique_id', 'name', 'phone', 'email','profileimage'] });
    return friendsData;

}
let transactionDetails = async (userid, wallet_id, req) => {
    if (!wallet_id) {
        throw new BadRequestError("wallet_id is required");
    }
    let findData = { id: wallet_id }

    let allTransactions = await WalletModel.findAll({ where: findData, raw: true, attributes: ['id', 'order_date', 'amount', 'order_status', 'ordertype', 'source_userId', 'destination_userId', 'source_wallet_id', 'currency', 'cashpickupId', 'trans_id', 'bank_transfer_id'] });
    if (!allTransactions) {
        throw new BadRequestError("No Transaction Found")
    }
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
    return allTransactions[0];


}
let rechargeDetails = async (userid, recharge_id, req) => {
    if (!recharge_id) {
        throw new BadRequestError("recharge_id is required");
    }
    let findData = {userId: userid,id: recharge_id }

    let rechargeDetailsData = await RechargeModel.findOne({ where: findData, raw: true, attributes: ['id', 'mobile_no', 'benifits', 'referenceid', 'amount', 'status', 'transaction_date'] });
    if (!rechargeDetailsData) {
        throw new BadRequestError("No Recharge Found")
    }    
    if(rechargeDetailsData.status == '1'){
        rechargeDetailsData.order_status = 'Pending'
    }else if(rechargeDetailsData.status == '2'){
        rechargeDetailsData.order_status = 'Confirmed'
    }else if(rechargeDetailsData.status == '3'){
        rechargeDetailsData.order_status = 'Submitted to Operator'
    }else if(rechargeDetailsData.status == '4'){
        rechargeDetailsData.order_status = 'Completed'
    }else if(rechargeDetailsData.status == '5'){
        rechargeDetailsData.order_status = 'Reversed'
    }else if(rechargeDetailsData.status == '6'){
        rechargeDetailsData.order_status = 'Rejected'
    }else if(rechargeDetailsData.status == '7'){
        rechargeDetailsData.order_status = 'Cancelled'
    }else if(rechargeDetailsData.status == '8'){
        rechargeDetailsData.order_status = 'Declined'
    }

    return rechargeDetailsData;


}
module.exports = {
    friendRequestDetails: friendRequestDetails,
    transactionDetails: transactionDetails,
    rechargeDetails:rechargeDetails

};

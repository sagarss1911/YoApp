'use strict';


let helper = require("../../helpers/helpers"),
    md5 = require('md5'),
    SEND_SMS = require("../../helpers/send_sms"),
    SEND_EMAIL = require("../../helpers/send_email"),
    CountryModel = require("../../models/Country"),
    CustomQueryModel = require("../../models/Custom_query"),
    SequelizeObj = require("sequelize"),
    UserModel = require("../../models/Users"),
    UserManaer = require("../../manager/Users"),
    CommonHelper = require('../../helpers/helpers'),
    NotificationHelper = require("../../helpers/notifications"),
    CashPickupModel = require("../../models/Cash_pickup"),
    MerchantBalanceModel = require("../../models/Merchant_balance_log"),
    MerchantWalletModel = require("../../models/Merchant_wallet"),
    MerchantCashTopupLogModel = require("../../models/Merchant_cash_topup_log"),
    WalletModel = require("../../models/Wallet"),
    MerchantBankTransferModel = require("../../models/Merchant_bank_transfer"),
    BalanceLogModel = require("../../models/Balance_log"),
    config = process.config.global_config,
    s3Helper = require('../../helpers/awsS3Helper'),
    fs = require('fs'),
    axios = require('axios'),
    moment = require("moment"),
    util = require('util'),
    unlinkFile = util.promisify(fs.unlink),
    BadRequestError = require('../../errors/badRequestError');
const { v4: uuidv4 } = require('uuid');

let merchantRegistration = async (userid, req) => {

    let body = req.body;
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }
    let updatedData = {}
    let requiredFields = ['merchant_name', 'merchant_phone', 'merchant_address'];
    requiredFields.forEach(x => {
        if (!body[x]) {
            throw new BadRequestError(x + ' is required');
        }
    });
    if (!req.files.address_proof || !req.files.address_proof.length) {
        throw new BadRequestError('Address proof is required');
    }
    if (!req.files.licence_proof || !req.files.licence_proof.length) {
        throw new BadRequestError('Licence proof is required');
    }
    if (!req.files.utility_proof || !req.files.utility_proof.length) {
        throw new BadRequestError('Utility proof is required');
    }
    let optionalFiled = ['merchant_name', 'merchant_phone', 'merchant_address'];
    optionalFiled.forEach(x => {
        updatedData[x] = body[x]
    });

    let user = await UserModel
        .findOne({ where: { id: userid }, raw: true });

    if (user.isMerchant) {
        throw new BadRequestError('User already registered as merchant');
    }


    if (req.files.address_proof && req.files.address_proof.length > 0) {
        const result = await s3Helper.uploadFile(req.files.address_proof[0])
        updatedData.address_proof = result.Location
        updatedData.address_proof_bucketkey = result.Key
        await unlinkFile(req.files.address_proof[0].path)
    }
    if (req.files.licence_proof && req.files.licence_proof.length > 0) {
        const result = await s3Helper.uploadFile(req.files.licence_proof[0])
        updatedData.licence_proof = result.Location
        updatedData.licence_proof_bucketkey = result.Key
        await unlinkFile(req.files.licence_proof[0].path)
    }
    if (req.files.utility_proof && req.files.utility_proof.length > 0) {
        const result = await s3Helper.uploadFile(req.files.utility_proof[0])
        updatedData.utility_proof = result.Location
        updatedData.utility_proof_bucketkey = result.Key
        await unlinkFile(req.files.utility_proof[0].path)
    }
    updatedData.isMerchant = 1;
    updatedData.merchantCreatedAt = new Date();
    await UserModel.update(updatedData, { where: { id: userid }, raw: true });
    return { message: 'Merchant registration successful' };
}
let merchantUpgrade = async (userid, req) => {

    let body = req.body;
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }
    let updatedData = {}


    let user = await UserModel
        .findOne({ where: { id: userid }, raw: true });

    if (user.isUpgradeRequestSubmitted) {
        throw new BadRequestError('User already Submmited Request');
    }


    if (req.files.upgraded_image1 && req.files.upgraded_image1.length > 0) {
        const result = await s3Helper.uploadFile(req.files.upgraded_image1[0])
        updatedData.upgraded_image1 = result.Location
        updatedData.upgraded_image1_bucketkey = result.Key
        await unlinkFile(req.files.upgraded_image1[0].path)
    }
    if (req.files.upgraded_image2 && req.files.upgraded_image2.length > 0) {
        const result = await s3Helper.uploadFile(req.files.upgraded_image2[0])
        updatedData.upgraded_image2 = result.Location
        updatedData.upgraded_image2_bucketkey = result.Key
        await unlinkFile(req.files.upgraded_image2[0].path)
    }
    if (req.files.upgraded_image3 && req.files.upgraded_image3.length > 0) {
        const result = await s3Helper.uploadFile(req.files.upgraded_image3[0])
        updatedData.upgraded_image3 = result.Location
        updatedData.upgraded_image3_bucketkey = result.Key
        await unlinkFile(req.files.upgraded_image3[0].path)
    }
    if (req.files.upgraded_image4 && req.files.upgraded_image4.length > 0) {
        const result = await s3Helper.uploadFile(req.files.upgraded_image4[0])
        updatedData.upgraded_image4 = result.Location
        updatedData.upgraded_image4_bucketkey = result.Key
        await unlinkFile(req.files.upgraded_image4[0].path)
    }

    updatedData.isUpgradeRequestSubmitted = 1;
    await UserModel.update(updatedData, { where: { id: userid }, raw: true });
    return { message: 'Merchant Upgrade request Submitted' };
}
let getCashpickupDetails = async (userid, req, transaction_id) => {

    if (!transaction_id) {
        throw new BadRequestError('Transaction id is required');
    }
    let CashPickupData = await CashPickupModel.findOne({ where: { transaction_id: transaction_id, }, raw: true });
    if (!CashPickupData) {
        throw new BadRequestError('Cashpickup not found');
    }
    if (CashPickupData.claimed_by) {
        throw new BadRequestError('Cashpickup already claimed');
    }
    return { receiver_name: CashPickupData.name, amount: CashPickupData.amount }
}
let sendCashPickupOTP = async (userid, req, transaction_id) => {

    if (!transaction_id) {
        throw new BadRequestError('Transaction id is required');
    }
    let CashPickupData = await CashPickupModel.findOne({ where: { transaction_id: transaction_id, }, raw: true });
    if (!CashPickupData) {
        throw new BadRequestError('Cashpickup not found');
    }
    if (CashPickupData.claimed_by) {
        throw new BadRequestError('Cashpickup already claimed');
    }
    let otp = await UserManaer.generateOTP();
    SEND_SMS.OTPForCashPickupRequestedByMerchant(otp, CashPickupData.phone);
    await CashPickupModel.update({ confirmation_pin: otp }, { where: { transaction_id: transaction_id, id: CashPickupData.id }, raw: true });
    return true
}

let validateCashPickupOTP = async (userid, req, transaction_id) => {
    let body = req.body;
    if (!transaction_id) {
        throw new BadRequestError('Transaction id is required');
    }
    let CashPickupData = await CashPickupModel.findOne({ where: { transaction_id: transaction_id, }, raw: true });
    if (!CashPickupData) {
        throw new BadRequestError('Cashpickup not found');
    }
    if (CashPickupData.claimed_by) {
        throw new BadRequestError('Cashpickup already claimed');
    }
    if (CashPickupData.confirmation_pin != body.otp) {
        throw new BadRequestError('OTP is not valid');
    }
    await CashPickupModel.update({ merchant_confirmed_pin: body.otp }, { where: { transaction_id: transaction_id, id: CashPickupData.id }, raw: true });
    return true
}
let claimCashPickup = async (userid, req, transaction_id) => {
    let body = req.body;
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }

    if (!transaction_id) {
        throw new BadRequestError('Transaction id is required');
    }
    let CashPickupData = await CashPickupModel.findOne({ where: { transaction_id: transaction_id, }, raw: true });
    if (!CashPickupData) {
        throw new BadRequestError('Cashpickup not found');
    }
    if (CashPickupData.claimed_by) {
        throw new BadRequestError('Cashpickup already claimed');
    }
    let updatedData = {}

    if (req.files.uploaded_id_document1 && req.files.uploaded_id_document1.length > 0) {
        const result = await s3Helper.uploadFile(req.files.uploaded_id_document1[0])
        updatedData.uploaded_id_document1 = result.Location
        await unlinkFile(req.files.uploaded_id_document1[0].path)
    }
    if (req.files.uploaded_id_document2 && req.files.uploaded_id_document2.length > 0) {
        const result = await s3Helper.uploadFile(req.files.uploaded_id_document2[0])
        updatedData.uploaded_id_document2 = result.Location
        await unlinkFile(req.files.uploaded_id_document2[0].path)
    }
    updatedData.claimed_by = userid;
    await CashPickupModel.update(updatedData, { where: { transaction_id: transaction_id, id: CashPickupData.id }, raw: true });
    let createWalletData = {
        ordertype: 1,
        userId: userid,
        cashpickupId: CashPickupData.id,
        amount: CashPickupData.amount
    }
    let MerchantWalletData = await MerchantWalletModel.create(createWalletData)
    let UserData = await UserModel.findOne({ where: { id: userid }, raw: true });
    let MerchantBalanceLogData = {
        userId: userid,
        amount: Number(CashPickupData.amount),
        oldbalance: Number(UserData.merchantbalance),
        newbalance: Number(UserData.merchantbalance) + Number(CashPickupData.amount),
        transaction_type: '1',
        wallet_id: MerchantWalletData.id
    }
    await MerchantBalanceModel.create(MerchantBalanceLogData);
    await CashPickupModel.update({ merchant_wallet_id: MerchantWalletData.id }, { where: { transaction_id: transaction_id, id: CashPickupData.id }, raw: true });
    await UserModel.update({ merchantbalance: Number(UserData.merchantbalance) + Number(CashPickupData.amount) }, { where: { id: userid } });
    let notificationDataReceiver = {
        title: "Congrats! Cashpickup Request Successfully Completed For " + CashPickupData.phone,
        subtitle: CashPickupData.amount + " Successfully Transfered to Your Wallet",
        redirectscreen: "payment_received_wallet",
        wallet_id: MerchantWalletData.id,
        merchant_cashpickup: true
    }
    await NotificationHelper.sendFriendRequestNotificationToUser(userid, notificationDataReceiver);
    // send sms to merchant account
    SEND_SMS.paymentCashPickUpCompletedMerchantSMS(parseFloat(CashPickupData.amount), UserData.merchant_phone, CashPickupData.phone);
    //let country = await CountryModel.findOne({ where: { iso_code_2: UserData.region }, raw: true })

    //send notification to actual sender user
    let notificationDataSender = {
        title: "Congrats! Your Cashpickup Request Successfully Completed For " + CashPickupData.phone,
        subtitle: CashPickupData.amount + " Successfully Pickuped From Merchant",
        redirectscreen: "payment_sender_wallet",
        wallet_id: CashPickupData.wallet_id
    }
    await NotificationHelper.sendFriendRequestNotificationToUser(CashPickupData.sender_userId, notificationDataSender);
    //send message to sender User
    let country = await CountryModel.findOne({ where: { iso_code_2: UserData.region }, raw: true })
    SEND_SMS.paymentCashPickUpCompletedSenderSMS(parseFloat(CashPickupData.amount), "+" + country.isd_code + UserData.phone, CashPickupData.phone);

    return true
}
let transactionHistory = async (userid, req) => {
    let limit = (req.query.limit) ? parseInt(req.query.limit) : 0;
    let page = req.query.page || 1;
    let offset = (page - 1) * limit;
    let SearchKeywordsQuery = " where  c.claimed_by = " + userid;
    if (req.query) {

        if (req.query.searchtext) {
            SearchKeywordsQuery += " and (c.name like '%" + req.query.searchtext + "%' or c.email like '%" + req.query.searchtext + "%' or c.phone like '%" + req.query.searchtext + "%' or c.amount like '%" + req.query.searchtext + "%' or c.transaction_id like '%" + req.query.searchtext + "')";
        }
        if (req.query.amount) {
            SearchKeywordsQuery += " and (c.amount =" + req.query.amount + ")";
        }

        if (req.query.from_date) {
            let from_date = moment(req.query.from_date).format('YYYY-MM-DD');
            from_date += " 00:00:00"
            SearchKeywordsQuery += " and  m.createdAt >= '" + from_date + "'";
        }
        if (req.query.to_date) {
            let to_date = moment(req.query.to_date).format('YYYY-MM-DD');
            to_date += " 23:59:59"

            SearchKeywordsQuery += " and m.createdAt <= '" + to_date + "'";
        }
    }

    var SearchSql = "SELECT m.amount,c.name,c.email,c.phone,c.transaction_id,m.createdAt,c.receiver_id_document,c.uploaded_id_document1,c.uploaded_id_document2 FROM merchant_wallet m inner join cash_pickup c ON m.cashpickupId=c.id   " + SearchKeywordsQuery + " order by m.id desc ";
    if (limit) {
        SearchSql += " limit " + offset + "," + limit;
    }
    let allBankRequest = await CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });

    var allRequestCountQuery = "SELECT m.amount,c.name,c.email,c.phone,c.transaction_id,m.createdAt FROM merchant_wallet m inner join cash_pickup c ON m.cashpickupId=c.id   " + SearchKeywordsQuery + " order by m.id desc";
    let allRequestCount = await CustomQueryModel.query(allRequestCountQuery, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });

    let _result = { total_count: 0 };
    _result.slides = allBankRequest;
    _result.total_count = allRequestCount.length;
    return _result;
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
    let senderInfo = await UserModel.findOne({ where: { id: userid }, raw: true });
    if (senderInfo.merchantbalance < body.amount) {
        throw new BadRequestError("Insufficient Balance");
    }
    requiredField.forEach(x => {
        addedData[x] = body[x];
    });

    let senderWalletData = {
        userId: senderInfo.id,
        order_date: new Date(),
        amount: Number(body.amount),
        order_status: 'success',
        trans_id: await CommonHelper.getUniqueTransactionId(),
        ordertype: '2'
    }

    let senderWalletInfo = await MerchantWalletModel.create(senderWalletData);

    //update balance log
    let senderBalanceLogData = {
        userId: senderInfo.id,
        amount: Number(body.amount),
        oldbalance: Number(senderInfo.merchantbalance),
        newbalance: Number(senderInfo.merchantbalance) - Number(body.amount),
        transaction_type: '2',
        wallet_id: senderWalletInfo.id
    }
    await MerchantBalanceModel.create(senderBalanceLogData);
    await UserModel.update({ merchantbalance: Number(senderInfo.merchantbalance) - Number(body.amount) }, { where: { id: senderInfo.id } });

    addedData["sender_userId"] = senderInfo.id;
    addedData["wallet_id"] = senderWalletInfo.id;
    addedData["transaction_id"] = await CommonHelper.getUniqueTransactionId();

    let BankTransferData = await MerchantBankTransferModel.create(addedData);
    let updateWalletData = {
        bank_transfer_id: BankTransferData.id
    }
    await MerchantWalletModel.update(updateWalletData, { where: { id: senderWalletInfo.id } });
    let country = await CountryModel.findOne({ where: { iso_code_2: senderInfo.region }, raw: true })
    let notificationDataSender = {
        title: "Congrats! Bank Transfer request generated for: " + body.phone,
        subtitle: "Amount: " + body.amount + " Successfully Debited and In 3-5 working days money will be credited to " + body.name + "'s account",
        redirectscreen: "bank_transfer_request_for_self_merchant",
        wallet_id: senderWalletInfo.id,
        transaction_id: senderWalletInfo.trans_id

    }
    await NotificationHelper.sendFriendRequestNotificationToUser(senderInfo.id, notificationDataSender);
    SEND_SMS.paymentBankTransferSenderSMS(parseFloat(body.amount), "+" + country.isd_code + senderInfo.phone, body.phone, BankTransferData.transaction_id);
    SEND_SMS.paymentBankTransferReceiverSMS(parseFloat(body.amount), "+" + country.isd_code + senderInfo.phone, body.phone, BankTransferData.transaction_id);
    return { transaction_id: BankTransferData.transaction_id };

}


let cashTopupOtherUser = async (userid, req) => {
    let body = req.body
    let merchantBalanceInfo = await CommonHelper.merchantCashTopupLimit(userid)
    let receiverInfo = await UserModel.findOne({ where: { user_unique_id: body.user_unique_id }, raw: true });
    if (!receiverInfo) {
        throw new BadRequestError("User not found");
    }
    if(merchantBalanceInfo.merchantDueBalance >= merchantBalanceInfo.totalLimit){
        throw new BadRequestError("You can not topup for this user, please clear Dues With Amount: "+merchantBalanceInfo.merchantDueBalance);
    }
    if (body.amount > merchantBalanceInfo.pendingLimit) {
        throw new BadRequestError("Amount should be less than " + merchantBalanceInfo.pendingLimit + " limit");
    }
    let senderInfo = await UserModel.findOne({ where: { id: userid }, raw: true });
    let receiverWalletData = {
        userId: receiverInfo.id,
        order_date: new Date(),
        amount: Number(body.amount) * 100,
        order_status: 'success',
        ordertype: '6',
        trans_id: await CommonHelper.getUniqueTransactionId(),
        source_merchantId: senderInfo.id,
    }
    let receiverWalletInfo = await WalletModel.create(receiverWalletData);
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
        title: "Congrats! You have received money from Merchant " + senderInfo.merchant_name,
        subtitle: body.amount + " Successfully Transfered from " + senderInfo.merchant_name + " to Your Wallet",
        redirectscreen: "payment_received_wallet",
        wallet_id: receiverWalletInfo.id,
        transaction_id: receiverWalletInfo.trans_id
    }
    let merchantLogData = { 
        merchantId:userid,
        walletId: receiverWalletInfo.id,
        amount:body.amount
    }
    await MerchantCashTopupLogModel.create(merchantLogData);
    await UserModel.update({ merchant_due_payment: Number(senderInfo.merchant_due_payment) +  Number(body.amount) }, { where: { id: senderInfo.id } });
    await NotificationHelper.sendFriendRequestNotificationToUser(receiverInfo.id, notificationDataReceiver);

    SEND_SMS.cashTopupReceivedSMS(parseFloat(body.amount),  receiverInfo.phone);
   return true;
    //MerchantCashTopupLogModel
}
let cashTopupTransactionHistory = async (userid, req) => {
    let limit = (req.query.limit) ? parseInt(req.query.limit) : 0;
    let page = req.query.page || 1;
    let offset = (page - 1) * limit;
    let SearchKeywordsQuery = " where  m.merchantId = " + userid;
    if (req.query) {

        if (req.query.searchtext) {
            SearchKeywordsQuery += " and (u.name like '%" + req.query.searchtext + "%' or u.email like '%" + req.query.searchtext + "%' or u.phone like '%" + req.query.searchtext + "%' or m.amount like '%" + req.query.searchtext + "%' or w.trans_id like '%" + req.query.searchtext + "')";
        }
        if (req.query.amount) {
            SearchKeywordsQuery += " and (m.amount =" + req.query.amount + ")";
        }

        if (req.query.from_date) {
            let from_date = moment(req.query.from_date).format('YYYY-MM-DD');
            from_date += " 00:00:00"
            SearchKeywordsQuery += " and  m.createdAt >= '" + from_date + "'";
        }
        if (req.query.to_date) {
            let to_date = moment(req.query.to_date).format('YYYY-MM-DD');
            to_date += " 23:59:59"

            SearchKeywordsQuery += " and m.createdAt <= '" + to_date + "'";
        }
    }

    var SearchSql = "SELECT m.amount,u.name,u.email,u.phone,u.user_unique_id,m.createdAt,w.trans_id FROM merchant_cash_topup_log m INNER JOIN wallet w ON m.walletId=w.id INNER JOIN users u ON u.id=w.userId " + SearchKeywordsQuery + " order by m.id desc ";
    if (limit) {
        SearchSql += " limit " + offset + "," + limit;
    }
    let allBankRequest = await CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });

    var allRequestCountQuery = "SELECT m.amount,u.name,u.email,u.phone,u.user_unique_id,m.createdAt,w.trans_id FROM merchant_cash_topup_log m INNER JOIN wallet w ON m.walletId=w.id INNER JOIN users u ON u.id=w.userId   " + SearchKeywordsQuery + " order by m.id desc";
    let allRequestCount = await CustomQueryModel.query(allRequestCountQuery, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });

    let _result = { total_count: 0 };
    _result.slides = allBankRequest;
    _result.total_count = allRequestCount.length;
    return _result;
}
let merchantResubmitImages = async (userid, req) => {

    let body = req.body;
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }
    let updatedData = {}


    let user = await UserModel
        .findOne({ where: { id: userid }, raw: true });

    if (!user.image_reuploaded_needed) {
        throw new BadRequestError('You are not allowed to upload images');
    }

    let uploadedFields = user.image_reuploaded_fields.split(',');

    for(let i=0;i<uploadedFields.length;i++){
        if (req.files[uploadedFields[i]] && req.files[uploadedFields[i]].length > 0) {
            const result = await s3Helper.uploadFile(req.files[uploadedFields[i]][0])
            updatedData[uploadedFields[i]] = result.Location
            updatedData[uploadedFields[i] + "_bucketkey"] = result.Key
            await unlinkFile(req.files[uploadedFields[i]][0].path)
        }    
    }

    updatedData.image_reuploaded = 1;    
    await UserModel.update(updatedData, { where: { id: userid }, raw: true });
    return { message: 'Image Reuploaded successfully' };
}
module.exports = {
    merchantRegistration: merchantRegistration,
    merchantUpgrade: merchantUpgrade,
    getCashpickupDetails: getCashpickupDetails,
    sendCashPickupOTP: sendCashPickupOTP,
    validateCashPickupOTP: validateCashPickupOTP,
    claimCashPickup: claimCashPickup,
    transactionHistory: transactionHistory,
    bankTransfer: bankTransfer,
    cashTopupOtherUser: cashTopupOtherUser,
    cashTopupTransactionHistory:cashTopupTransactionHistory,
    merchantResubmitImages:merchantResubmitImages
};

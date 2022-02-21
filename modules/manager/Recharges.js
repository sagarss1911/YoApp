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
const { DVS } = require('@dtone/dvs');
const { default: axios } = require("axios");
const dtOneBaseUrl = process.env.DTONE_BASE_URL;
let auth = {
    username: process.env.DTONE_USERNAME,
    password: process.env.DTONE_PASSWORD
}
let getOperators = async (userid, mobile_no, req) => {


    let operator = await axios.get(dtOneBaseUrl + '/lookup/mobile-number/' + mobile_no, {
        auth: auth
    })



    return {
        "x-page": operator.headers["x-page"],
        "x-total-pages": operator.headers["x-total-pages"],
        "x-total": operator.headers["x-total"],
        "x-per-page": operator.headers["x-per-page"],
        operator: operator.data
    };

}

let getProducts = async (req) => {


    let page = req.query.page ? req.query.page : 1;
    let per_page = req.query.per_page ? req.query.per_page : 10;
    let operator_id = req.query.operator_id ? req.query.operator_id : ''
    let country_iso_code = req.query.country_iso_code ? req.query.country_iso_code : ''

    let queryString = "?";
    queryString += "page=" + page;
    queryString += "&per_page=" + per_page;
    queryString += operator_id ? "&operator_id=" + operator_id : '';
    queryString += country_iso_code ? "&country_iso_code=" + country_iso_code : '';


    let operator = await axios.get(dtOneBaseUrl + '/products' + queryString, {
        auth: auth
    })
    return {
        "x-page": operator.headers["x-page"],
        "x-total-pages": operator.headers["x-total-pages"],
        "x-total": operator.headers["x-total"],
        "x-per-page": operator.headers["x-per-page"],
        plans: operator.data
    };


}
let getProductsById = async (req) => {

    let product_id = req.params.product_id;
    if (!product_id) {
        throw new BadRequestError("Product id is required");
    }
    if (!Number(product_id)) {
        throw new BadRequestError("Product id must be a number");
    }
    let operator = await axios.get(dtOneBaseUrl + '/products/' + product_id, {
        auth: auth
    })
    
    return operator.data
}
let processRecharge = async (userid,req) => {
    let body = req.body;
    let planDetails = await axios.get(dtOneBaseUrl + '/products/' + body.plan_id, {
        auth: auth
    })    
    // find plan amount to be cut from wallet   this needs to be fetch from dtone
    body.amount = Math.round((Number(planDetails.data.prices.retail.amount)*Number(process.env.USD_TO_GMD_RATE)));
    let senderInfo = await UserModel.findOne({ where: { id: userid }, raw: true });
    if (senderInfo.balance < body.amount) {
        throw new BadRequestError("Insufficient Balance");
    }
    let transactionData =  {
        product_id: 8091,
        external_id: await CommonHelper.getUniqueTransactionId(),
        credit_party_identifier: {
            mobile_number: body.mobile_no
        },
        callback_url: process.env.BASE_URL+"/api/v1/webhook/recharge",
    }
    let transaction = await axios.post(dtOneBaseUrl+'/async/transactions', transactionData, {
        auth: auth
    })
    
    if(transaction.data.status.message == "CREATED"){
        let senderWalletData = {
            userId: senderInfo.id,
            order_date: new Date(),
            amount: Number(body.amount) * 100,
            order_status: 'pending',
            ordertype: '5',
            trans_id: transaction.data.external_id,
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
        let rechargeData = {
            userId: senderInfo.id,
            walletId:senderWalletInfo.id,
            mobile_no:body.mobile_no,
            selectedplan: body.plan_id,
            amount: body.amount,
            benifits: transaction.data.product.description,
            referenceid: senderWalletInfo.trans_id,
            status:'1',
            transaction_date: new Date(transaction.data.creation_date)
        }
        let recharge = await RechargeModel.create(rechargeData)
        let notificationDataSender = {
            title: "Congrats! Recharge Request Successfully Generated: " + body.mobile_no,
            subtitle: "Amount: " + body.amount + " Successfully Recharged to: " + body.mobile_no,
            redirectscreen: "mobile_recharge",
            wallet_id: senderWalletInfo.id,
            transaction_id: senderWalletInfo.trans_id,
            recharge_id: recharge.id
        }
        let country = await CountryModel.findOne({ where: { iso_code_2: senderInfo.region }, raw: true })
        await NotificationHelper.sendFriendRequestNotificationToUser(senderInfo.id, notificationDataSender);
        SEND_SMS.paymentMobileRechargeRequestSubmittedSMS(parseFloat(body.amount), "+" + country.isd_code + senderInfo.phone, body.mobile_no, recharge.referenceid);
        return recharge;
    }else{
        throw new BadRequestError("Transaction Failed"+ transaction.data.status.message);
    }
  

}

let recentRecharge = async (req,userid) => {
    let limit = 5;
    let page = 1;
    let offset = (page - 1) * limit;
    let findData = { userId: userid };
    let rechargeData = await RechargeModel.findAll({ where: findData, raw: true, attributes: ['id', 'walletId', 'mobile_no', 'benifits', 'referenceid', 'amount', 'status'], limit, offset, order: [['id', 'DESC']] });
    rechargeData.forEach(element => {
        if(element.status == '1'){
            element.order_status = 'Pending'
        }else if(element.status == '2'){
            element.order_status = 'Success'
        }else if(element.status == '3'){
            element.order_status = 'Failed'
        }else if(element.status == '4'){
            element.order_status = 'Cancelled'
        }
    });
    return rechargeData 
}
let rechargeHistory = async (req,userid) => {
    let limit = (req.query.limit) ? parseInt(req.query.limit) : 10;
    let page = req.query.page || 1;
    let offset = (page - 1) * limit;
    let findData = { userId: userid };
    let rechargeData = await RechargeModel.findAll({ where: findData, raw: true, attributes: ['id', 'walletId', 'mobile_no', 'benifits', 'referenceid', 'amount', 'status'], limit, offset, order: [['id', 'DESC']] });
    rechargeData.forEach(element => {
        if(element.status == '1'){
            element.order_status = 'Pending'
        }else if(element.status == '2'){
            element.order_status = 'Success'
        }else if(element.status == '3'){
            element.order_status = 'Failed'
        }else if(element.status == '4'){
            element.order_status = 'Cancelled'
        }        
    });    
    let rechargeDataTotal = await RechargeModel.findAll({ where: findData, raw: true, attributes: ['id', 'walletId', 'mobile_no', 'benifits', 'referenceid', 'amount', 'status'], order: [['id', 'DESC']] });
    return { total: rechargeDataTotal.length, recharge: rechargeData };
}
module.exports = {
    getOperators: getOperators,
    getProducts: getProducts,
    getProductsById: getProductsById,
    processRecharge:processRecharge,
    recentRecharge:recentRecharge,
    rechargeHistory:rechargeHistory

};

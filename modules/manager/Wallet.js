'use strict';


let helper = require("../helpers/helpers"),
    md5 = require('md5'),
    SEND_SMS = require("../helpers/send_sms"),
    SEND_EMAIL = require("../helpers/send_email"),
    UserModel = require("../models/Users"),
    WalletModel = require("../models/Wallet"),
    config = process.config.global_config,    
    StripeFunc = require("../manager/Stripe"),    
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
        let user = await UserModel
        .findOne({ where: { id: userid }, attributes: ['customer_id'] });
        const stripe = require("stripe")(process.env.STRIPE_KEY);
    
        const paymentIntent = await stripe.paymentIntents.create({
            amount: body.amount * 100,
            currency: process.env.CURRENCY,
            customer: user.customer_id
        });
        let createData = {
            user_id: userid,
            order_date: new Date(),
            client_secret:paymentIntent.client_secret,
            currency:paymentIntent.currency,
            trans_id:paymentIntent.id,
            amount:paymentIntent.amount,
            order_status:'pending',
            ordertype:'1',
            txn_initiate_date:paymentIntent.created,
        }
        await WalletModel.create(createData);
        return paymentIntent.client_secret;
    }
    catch (err) {
        console.log(err);
        if(err.raw.code == 'err.raw.code'){
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
        if (WalletInfo.user_id != userid) {
            throw new BadRequestError("Invalid transaction");
        }
        WalletInfo.amount = parseFloat(WalletInfo.amount / 100);
        return WalletInfo;
        
    }
    catch (err) {
        console.log(err);
        if(err.raw.code == 'err.raw.code'){
            throw new BadRequestError(err.raw.message);
        }
        throw new BadRequestError(err);
    }

}

module.exports = {   
    addMoneyToWallet: addMoneyToWallet,
    transactionStatus:transactionStatus
    
};

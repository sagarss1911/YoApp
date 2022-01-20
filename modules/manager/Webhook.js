'use strict';


let helper = require("../helpers/helpers"),
    md5 = require('md5'),
    SEND_SMS = require("../helpers/send_sms"),
    SEND_EMAIL = require("../helpers/send_email"),
    UserModel = require("../models/Users"),
    WalletModel = require("../models/Wallet"),
    BalanceLogModel = require("../models/Balance_log"),
    config = process.config.global_config,
    StripeFunc = require("../manager/Stripe"),
    axios = require('axios'),
    util = require('util'),
    BadRequestError = require('../errors/badRequestError');

let paymentSuccess = async (body) => {
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }
    let clientsecret = body.data.object.client_secret;
   
    let status = body.data.object.status;
    let transaction_type = body.type;
    if (transaction_type == "payment_intent.succeeded" && status == "succeeded") {
        let amount = body.data.object.amount_received;
        
        let payment_method = body.data.object.charges.data[0].payment_method;
        let trasaction_refundid = body.data.object.id;
        let updateData = {
            amountpaid: amount,
            order_status: "success",
            payment_method: payment_method,
            trasaction_refundid: trasaction_refundid,
            txn_completion_date: body.created,
        };
        await WalletModel.update(
            updateData,
            { where: { client_secret: clientsecret, amount: amount }, raw: true }
        );
        // update user balance
        let walletData = await WalletModel.findOne({ where: { client_secret: clientsecret }, raw: true });
        if (walletData.ordertype == 1) {
            let userData = await UserModel.findOne({ where: { id: walletData.user_id }, raw: true });
            if (util.isNullOrUndefined(userData.balance)) {
                userData.balance = 0;
            }
            
            let newBalance = parseFloat(userData.balance) + parseFloat(amount / 100);
            await UserModel.update(
                { balance: newBalance },
                { where: { id: userData.id }, raw: true }
            );
            // update balancelog
            let balancelogData = {
                user_id: userData.id,
                amount: parseFloat(amount / 100),
                oldbalance: parseFloat(userData.balance),
                newbalance: newBalance,
                wallet_id: walletData.id,
                transaction_type: '1'              
            };
            await BalanceLogModel.create(balancelogData);
        }

        // // send sms
        // let smsData = {
        //     phone: userData.phone,
        //     message: req.t("payment_success_sms", { amount: amount/100 })
        // };
        // SEND_SMS.sendSMS(smsData);
        // // send email
        // let emailData = {
        //     email: userData.email,
        //     subject: req.t("payment_success_email_subject"),
        //     message: req.t("payment_success_email", { amount: amount/100 })
        // };
        // SEND_EMAIL.sendEmail(emailData);
    }
    else if (transaction_type == "payment_intent.payment_failed") {
        let updateData = {
            order_status: "failed",
            txn_completion_date: body.created,
        };
        await WalletModel.update(
            updateData,
            { where: { client_secret: clientsecret }, raw: true }
        );
        // send sms

        // let smsData = {
        //     phone: userData.phone,
        //     message: req.t("payment_failed_sms", { amount: amount/100 })
        // };
        // SEND_SMS.sendSMS(smsData);
        // // send email
        // let emailData = {
        //     email: userData.email,
        //     subject: req.t("payment_failed_email_subject"),
        //     message: req.t("payment_failed_email", { amount: amount/100 })
        // };
        // SEND_EMAIL.sendEmail(emailData);
    }
    else if (transaction_type == "payment_intent.canceled") {
        let updateData = {
            order_status: "cancelled",
            txn_completion_date: body.created,
        };
        console.log(updateData)
        await WalletModel.update(
            updateData,
            { where: { client_secret: clientsecret }, raw: true }
        );
        // send sms

        // let smsData = {
        //     phone: userData.phone,
        //     message: req.t("payment_failed_sms", { amount: amount/100 })
        // };
        // SEND_SMS.sendSMS(smsData);
        // // send email
        // let emailData = {
        //     email: userData.email,
        //     subject: req.t("payment_failed_email_subject"),
        //     message: req.t("payment_failed_email", { amount: amount/100 })
        // };
        // SEND_EMAIL.sendEmail(emailData);
    }

    return true;

}



module.exports = {
    paymentSuccess: paymentSuccess

};

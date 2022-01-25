'use strict';


let helper = require("../helpers/helpers"),
    md5 = require('md5'),
    SEND_SMS = require("../helpers/send_sms"),
    SEND_EMAIL = require("../helpers/send_email"),
    UserModel = require("../models/Users"),
    WalletModel = require("../models/Wallet"),
    CountryModel = require("../models/Country"),
    BalanceLogModel = require("../models/Balance_log"),
    NotificationHelper = require("../helpers/notifications"),
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
            let userData = await UserModel.findOne({ where: { id: walletData.userId }, raw: true });
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
                userId: userData.id,
                amount: parseFloat(amount / 100),
                oldbalance: parseFloat(userData.balance),
                newbalance: newBalance,
                wallet_id: walletData.id,
                transaction_type: '1'              
            };
            await BalanceLogModel.create(balancelogData);
            let country = await CountryModel.findOne({ where: { iso_code_2: userData.region }, raw: true })
            let notificationData = {
                title: "Congrats! Money added to your wallet",
                subtitle: "Amount: " + amount / 100 + " Added To Your Wallet",
                redirectscreen: "payment_success",                
            }            
            await NotificationHelper.sendFriendRequestNotificationToUser(userData.id, notificationData);
            SEND_SMS.paymentSuccessSMS(parseFloat(amount/100), "+" + country.isd_code + userData.phone);      
        }

        
       
       
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
        let walletData = await WalletModel.findOne({ where: { client_secret: clientsecret }, raw: true });
        let userData = await UserModel.findOne({ where: { id: walletData.userId }, raw: true });
        let country = await CountryModel.findOne({ where: { iso_code_2: body.region }, raw: true })
        let notificationData = {
            title: "Add Money To wallet Request Failed",
            subtitle: "Amount: " + walletData.amount + " Failed To Add To Your Wallet",
            redirectscreen: "payment_failed"                
        }
        
        await NotificationHelper.sendFriendRequestNotificationToUser(userData.id, notificationData);
      
        SEND_SMS.paymentFailedSMS(parseFloat(amount/100), "+" + country.isd_code + userData.phone);      
        
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
        let walletData = await WalletModel.findOne({ where: { client_secret: clientsecret }, raw: true });
        let userData = await UserModel.findOne({ where: { id: walletData.userId }, raw: true });
        let country = await CountryModel.findOne({ where: { iso_code_2: userData.region }, raw: true })
        let notificationData = {
            title: "Add Money To wallet Request cancelled",
            subtitle: "Amount: " + walletData.amount + " Cancelled To Add To Your Wallet",
            redirectscreen: "payment_cancelled"                
        }
        
        await NotificationHelper.sendFriendRequestNotificationToUser(userData.id, notificationData);
        SEND_SMS.paymentCancelledSMS(parseFloat(amount/100), "+" + country.isd_code + userData.phone);      
    }

    return true;

}



module.exports = {
    paymentSuccess: paymentSuccess

};

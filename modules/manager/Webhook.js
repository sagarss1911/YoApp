'use strict';


let helper = require("../helpers/helpers"),
    md5 = require('md5'),
    SEND_SMS = require("../helpers/send_sms"),
    SEND_EMAIL = require("../helpers/send_email"),
    UserModel = require("../models/Users"),
    WalletModel = require("../models/Wallet"),
    RechargeModel = require("../models/Recharges"),
    CountryModel = require("../models/Country"),
    BalanceLogModel = require("../models/Balance_log"),
    NotificationHelper = require("../helpers/notifications"),
    config = process.config.global_config,
    StripeFunc = require("../manager/Stripe"),
    CommonHelper = require('../helpers/helpers'),
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
                redirectscreen: "add_money_payment_success",
                wallet_id: walletData.id,
                transaction_id: walletData.trans_id
            }
            await NotificationHelper.sendFriendRequestNotificationToUser(userData.id, notificationData);

            SEND_SMS.paymentSuccessSMS(parseFloat(amount / 100), "+" + country.isd_code + userData.phone);

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
            redirectscreen: "add_money_payment_failed",
            wallet_id: walletData.id,
            transaction_id: walletData.trans_id
        }

        await NotificationHelper.sendFriendRequestNotificationToUser(userData.id, notificationData);

        SEND_SMS.paymentFailedSMS(parseFloat(amount / 100), "+" + country.isd_code + userData.phone);

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
            redirectscreen: "add_money_payment_cancelled",
            wallet_id: walletData.id,
            transaction_id: walletData.trans_id
        }

        await NotificationHelper.sendFriendRequestNotificationToUser(userData.id, notificationData);
        SEND_SMS.paymentCancelledSMS(parseFloat(amount / 100), "+" + country.isd_code + userData.phone);
    }

    return true;

}


let rechargeCallback = async (body) => {
    let rechargeData = await RechargeModel.findOne({ where: { referenceid: body.external_id }, raw: true });
    let senderInfo = await UserModel.findOne({ where: { id: rechargeData.userId }, raw: true });
    let walletInfo = await WalletModel.findOne({ where: { userId: senderInfo.id, ordertype: '5', trans_id: rechargeData.referenceid }, raw: true })
    if (body.status.message == "DECLINED") {
        //mark transaction as Failed
        await RechargeModel.update({ status: '8' }, { where: { id: rechargeData.id }, raw: true });
        await WalletModel.update({ order_status: 'failed' }, { where: { id: walletInfo.id }, raw: true });
        //add reversal entry for wallet transaction
        let reversalData = {
            userId: senderInfo.id,
            amount: Number(rechargeData.amount) * 100,
            order_date: new Date(),
            trans_id: await CommonHelper.getUniqueTransactionId(),
            order_status: 'reversal',
            ordertype: '5',
            reversed_wallet_recharge_id: walletInfo.id
        }
        let reversalWalletInfo = await WalletModel.create(reversalData);
        // manage log
        let senderBalanceLogData = {
            userId: senderInfo.id,
            amount: Number(rechargeData.amount),
            oldbalance: Number(senderInfo.balance),
            newbalance: Number(senderInfo.balance) + Number(rechargeData.amount),
            transaction_type: '1',
            wallet_id: reversalWalletInfo.id
        }
        await BalanceLogModel.create(senderBalanceLogData);
        //update balance in master user table
        await UserModel.update({ balance: Number(senderInfo.balance) + Number(rechargeData.amount) }, { where: { id: senderInfo.id } });
        //send notification and message
        let notificationDataSender = {
            title: "Your Recharge Request Failed for: " + rechargeData.mobile_no,
            subtitle: "Amount: " + rechargeData.amount + " Successfully Reveresed to Wallet",
            redirectscreen: "mobile_recharge_failed",
            wallet_id: reversalWalletInfo.id,
            transaction_id: reversalWalletInfo.trans_id,
            recharge_id: rechargeData.id
        }
        let country = await CountryModel.findOne({ where: { iso_code_2: senderInfo.region }, raw: true })
        await NotificationHelper.sendFriendRequestNotificationToUser(senderInfo.id, notificationDataSender);
        SEND_SMS.paymentMobileRechargeRequestFailedWebhookSMS(parseFloat(rechargeData.amount), "+" + country.isd_code + senderInfo.phone, rechargeData.mobile_no, rechargeData.referenceid);
    } else if(body.status.message == "COMPLETED") {
        await RechargeModel.update({ status: '4' }, { where: { id: rechargeData.id }, raw: true });
        await WalletModel.update({ order_status: 'success' }, { where: { id: walletInfo.id }, raw: true });
        //send notification and message
        let notificationDataSender = {
            title: "Congrats! Recharge Request Successfully Processed for : " + rechargeData.mobile_no,
            subtitle: "Amount: " + rechargeData.amount + " Successfully completed for: " + rechargeData.mobile_no,
            redirectscreen: "mobile_recharge_success",
            wallet_id: walletInfo.id,
            transaction_id: walletInfo.trans_id,
            recharge_id: rechargeData.id
        }
        let country = await CountryModel.findOne({ where: { iso_code_2: senderInfo.region }, raw: true })
        await NotificationHelper.sendFriendRequestNotificationToUser(senderInfo.id, notificationDataSender);
        SEND_SMS.paymentMobileRechargeRequestCompletedSMS(parseFloat(rechargeData.amount), "+" + country.isd_code + senderInfo.phone, rechargeData.mobile_no, rechargeData.referenceid);



    }
}
module.exports = {
    paymentSuccess: paymentSuccess,
    rechargeCallback: rechargeCallback

};

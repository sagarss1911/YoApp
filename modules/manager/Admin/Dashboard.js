'use  strict'



let BadRequestError = require('../../errors/badRequestError'),
BankModal = require('../../models/Bank_transfer'),
SupportModal = require('../../models/Admin/Support_request'),

    CustomQueryModel = require("../../models/Custom_query"),
    SequelizeObj = require("sequelize"),
    moment = require("moment");

let getBankTransferReporting = async () => {
    let todayStartDate = new Date(moment().startOf('date').format('YYYY-MM-DD hh:mm:ss'));    
    let startOfMonth = new Date(moment().startOf('month').format('YYYY-MM-DD hh:mm:ss'));
    let endOfMonth   = new Date(moment().endOf('month').format('YYYY-MM-DD hh:mm:ss'));    

    let totalBankTransferRequestToday = await BankModal.count({
        where: { createdAt: { $gte: todayStartDate} },
        raw: true
    })
    let totalBankTransferPendingRequestToday = await BankModal.count({
        where: {status:'pending', updatedAt: { $gte: todayStartDate} },
        raw: true
    })
    let totalBankTransferRequestForCurrentMonth = await BankModal.count({
        where: { createdAt: { $gte: startOfMonth, $lte: endOfMonth } },
        raw: true
    })
    let totalBankTransferPendingRequestForCurrentMonth = await BankModal.count({
        where: { status:'pending',updatedAt: { $gte: startOfMonth, $lte: endOfMonth } },
        raw: true
    })
    

    let totalBankTransferRequesttillDate = await BankModal.count()
    let totalBankTransferPendingRequesttillDate = await BankModal.count({
        where: { status:'pending' },
        raw: true
    })

    let totalBankTransferCompletedRequestToday = await BankModal.count({
        where: {status:'completed', updatedAt: { $gte: todayStartDate} },
        raw: true
    })
    let totalBankTransferCompletedRequestForCurrentMonth = await BankModal.count({
        where: {status:'completed', updatedAt: { $gte: startOfMonth, $lte: endOfMonth } },
        raw: true
    })
    let totalBankTransferCompletedRequesttillDate = await BankModal.count({
        where: {status:'completed' },
        raw: true
    })

    let totalSupportRequest = await SupportModal.count();
    let pendingSupportRequest = await SupportModal.count({
        where: {status:'pending' },
        raw: true
    })
    let completedSupportRequest = await BankModal.count({
        where: {status:'completed' },
        raw: true
    })
    return { 
        totalBankTransferRequestToday,
        totalBankTransferPendingRequestToday,
        totalBankTransferRequestForCurrentMonth,
        totalBankTransferPendingRequestForCurrentMonth,
        totalBankTransferRequesttillDate,
        totalBankTransferPendingRequesttillDate,
        totalBankTransferCompletedRequestToday,
        totalBankTransferCompletedRequestForCurrentMonth,
        totalBankTransferCompletedRequesttillDate,
        totalSupportRequest,
        pendingSupportRequest,
        completedSupportRequest
    }
}

module.exports = {
    getBankTransferReporting: getBankTransferReporting
}
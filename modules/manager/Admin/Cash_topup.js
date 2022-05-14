'use  strict'



let BadRequestError = require('../../errors/badRequestError'),
    CashpickupModal = require('../../models/Cash_pickup'),
    UserModal = require('../../models/Users'),
    CustomQueryModel = require("../../models/Custom_query"),
    SequelizeObj = require("sequelize"),
    WalletModel = require("../../models/Wallet"),
    SEND_SMS = require("../../helpers/send_sms"),
    BalanceLogModel = require("../../models/Balance_log"),
    NotificationHelper = require("../../helpers/notifications"),
    CountryModel = require("../../models/Country"),
    CommonHelper = require('../../helpers/helpers'),
    SEND_PUSH = require('../../helpers/send_push'),
    UserModel = require("../../models/Users"),
    moment = require("moment");



let getAllUsers = async (body) => {
    return UserModal.findAll({ attributes: ['id','name','email','username','phone','user_unique_id'], raw: true,order: [['id', 'DESC']]});
}

let addBalanceToUserWallet = async (body,adminId) => {
    if(!body) {
        throw new BadRequestError("Please provide Data");
    }
    if(!body.user){
        throw new BadRequestError("Please Select User");
    }
  
    if(!body.amount){
        throw new BadRequestError("Please Enter Valid Amount");
    }
 
    let findData = {}
    findData["$or"] = [
        { user_unique_id: { $eq: body.user } },
        { phone: { $eq: body.user } }
    ]
    let receiverInfo = await UserModel.findOne({ where: findData, raw: true });
    let receiverWalletData = {
        userId: receiverInfo.id,
        order_date: new Date(),
        amount: Number(body.amount) * 100,
        amountpaid: Number(body.amount) * 100,
        order_status: 'success',
        ordertype: '6',
        trans_id: await CommonHelper.getUniqueTransactionId(),
        source_adminId:adminId

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
        title: "Congrats! You have received money Using CashTopup ",
        subtitle: body.amount + " Successfully Transfered to Your Wallet",
        redirectscreen: "payment_received_wallet",
        wallet_id: receiverWalletInfo.id,
        transaction_id: receiverWalletInfo.trans_id
    }
    await NotificationHelper.sendFriendRequestNotificationToUser(receiverInfo.id, notificationDataReceiver);

    SEND_SMS.cashTopupReceivedSMS(parseFloat(body.amount),  receiverInfo.phone);
    var SearchSql = "SELECT (w.amount/100) AS amount,w.trans_id,w.order_date,u.name,u.username,u.email,u.phone,u.user_unique_id FROM wallet w INNER JOIN users u ON w.userId=u.id where w.id="+receiverWalletInfo.id ;        
    return CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });    
}
let getAllCashTopup = async (body,adminId) => {
    let limit = (body.limit) ? parseInt(body.limit) : 10;
    let page = body.page || 1;
    let offset = (page - 1) * limit;
    let SearchKeywordsQuery = "WHERE ordertype=6 and source_adminId = " + adminId;
    if (body.filters) {
      
        if (body.filters.searchtext) {
            SearchKeywordsQuery += "and (u.name like '%" + body.filters.searchtext + "%' or u.email like '%" + body.filters.searchtext + "%' or u.phone like '%" + body.filters.searchtext + "%' or w.amount like '%" + body.filters.searchtext + "%' or w.trans_id like '%" + body.filters.searchtext + "' or u.user_unique_id like '%" + body.filters.searchtext + "%')";
        }
        if (body.filters.from_date) {
            let from_date = moment(body.filters.from_date).format('YYYY-MM-DD');
            from_date += " 00:00:00"         
            SearchKeywordsQuery += " and w.order_date >= '" + from_date + "'";
        }
        if (body.filters.to_date) {
            let to_date = moment(body.filters.to_date).format('YYYY-MM-DD');
            to_date += " 23:59:59"            
            SearchKeywordsQuery += " and w.order_date <= '" + to_date + "'";
        }
        if (body.filters.selectedUser) {            
            SearchKeywordsQuery += " and w.userId = "+body.filters.selectedUser;
        }
    }

    var SearchSql = "SELECT (w.amount/100) AS amount,w.trans_id,w.order_date,u.name,u.username,u.email,u.phone,u.user_unique_id FROM wallet w INNER JOIN users u ON w.userId=u.id " + SearchKeywordsQuery + " order by w.id desc LIMIT " + offset + "," + limit;        
    let allCashTopup = await CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });


    let allRequestCountQuery = "SELECT (w.amount/100) AS amount,w.trans_id,w.order_date,u.name,u.username,u.email,u.phone,u.user_unique_id FROM wallet w INNER JOIN users u ON w.userId=u.id " + SearchKeywordsQuery + " order by w.id desc";
    let allRequestCount = await CustomQueryModel.query(allRequestCountQuery, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });

    let _result = { total_count: 0 };
    _result.slides = allCashTopup;
    _result.total_count = allRequestCount.length;
    return _result;
}
let exportAllCashTopup = async (body,adminId) => {
    
    let SearchKeywordsQuery = "WHERE ordertype=6 and source_adminId = " + adminId;
    if (body.filters) {
      
        if (body.filters.searchtext) {
            SearchKeywordsQuery += "and (u.name like '%" + body.filters.searchtext + "%' or u.email like '%" + body.filters.searchtext + "%' or u.phone like '%" + body.filters.searchtext + "%' or w.amount like '%" + body.filters.searchtext + "%' or w.trans_id like '%" + body.filters.searchtext + "' or u.user_unique_id like '%" + body.filters.searchtext + "%')";
        }
        if (body.filters.from_date) {
            let from_date = moment(body.filters.from_date).format('YYYY-MM-DD');
            from_date += " 00:00:00"         
            SearchKeywordsQuery += " and w.order_date >= '" + from_date + "'";
        }
        if (body.filters.to_date) {
            let to_date = moment(body.filters.to_date).format('YYYY-MM-DD');
            to_date += " 23:59:59"            
            SearchKeywordsQuery += " and w.order_date <= '" + to_date + "'";
        }
        if (body.filters.selectedUser) {            
            SearchKeywordsQuery += " and w.userId = "+body.filters.selectedUser;
        }
    }

    var SearchSql = "SELECT (w.amount/100) AS amount,w.trans_id,w.order_date,u.name,u.username,u.email,u.phone,u.user_unique_id FROM wallet w INNER JOIN users u ON w.userId=u.id " + SearchKeywordsQuery + " order by w.id desc ";        
    return CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });
}
module.exports = {
    getAllUsers:getAllUsers,
    addBalanceToUserWallet:addBalanceToUserWallet,
    getAllCashTopup:getAllCashTopup,
    exportAllCashTopup:exportAllCashTopup

}
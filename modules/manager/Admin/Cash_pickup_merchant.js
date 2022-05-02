'use  strict'



let BadRequestError = require('../../errors/badRequestError'),
    CashpickupModal = require('../../models/Cash_pickup'),
    UserModal = require('../../models/Users'),
    CustomQueryModel = require("../../models/Custom_query"),
    SequelizeObj = require("sequelize"),
    moment = require("moment");


let getAllCashPickupDetails = async (body) => {
    let limit = (body.limit) ? parseInt(body.limit) : 10;
    let page = body.page || 1;
    let offset = (page - 1) * limit;
    let SearchKeywordsQuery = "WHERE c.claimed_by IS NOT NULL ";
    if (body.filters) {
      
        if (body.filters.searchtext) {
            SearchKeywordsQuery += "and (c.name like '%" + body.filters.searchtext + "%' or c.email like '%" + body.filters.searchtext + "%' or c.phone like '%" + body.filters.searchtext + "%' or c.amount like '%" + body.filters.searchtext + "%' or c.transaction_id like '%" + body.filters.searchtext + "' or u.merchant_name like '%" + body.filters.searchtext + "%')";
        }
        if (body.filters.from_date) {
            let from_date = moment(body.filters.from_date).format('YYYY-MM-DD');
            from_date += " 00:00:00"         
            SearchKeywordsQuery += " and c.createdAt >= '" + from_date + "'";
        }
        if (body.filters.to_date) {
            let to_date = moment(body.filters.to_date).format('YYYY-MM-DD');
            to_date += " 23:59:59"            
            SearchKeywordsQuery += " and c.createdAt <= '" + to_date + "'";
        }
        if (body.filters.selectedMerchant) {
            
            SearchKeywordsQuery += " and c.claimed_by = "+body.filters.selectedMerchant;
        }
    }

    var SearchSql = "SELECT c.id,c.name,c.email,c.phone,c.amount,c.transaction_id,u.merchant_name AS merchantname,c.createdAt FROM cash_pickup c INNER JOIN users u ON c.sender_userId=u.id " + SearchKeywordsQuery + " order by id desc LIMIT " + offset + "," + limit;

    let allBankRequest = await CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });


    let allRequestCountQuery = "SELECT c.id,c.name,c.email,c.phone,c.amount,c.transaction_id,u.merchant_name,c.createdAt AS merchantname FROM cash_pickup c INNER JOIN users u ON c.sender_userId=u.id " + SearchKeywordsQuery + " order by id desc";
    let allRequestCount = await CustomQueryModel.query(allRequestCountQuery, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });

    let _result = { total_count: 0 };
    _result.slides = allBankRequest;
    _result.total_count = allRequestCount.length;
    return _result;
}



let exportAllCashPickupRequest = async (body) => {

    let SearchKeywordsQuery = "WHERE c.claimed_by IS NOT NULL ";
    if (body.filters) {
      
        if (body.filters.searchtext) {
            SearchKeywordsQuery += "and (c.name like '%" + body.filters.searchtext + "%' or c.email like '%" + body.filters.searchtext + "%' or c.phone like '%" + body.filters.searchtext + "%' or c.amount like '%" + body.filters.searchtext + "%' or c.transaction_id like '%" + body.filters.searchtext + "' or u.merchant_name like '%" + body.filters.searchtext + "%')";
        }
        if (body.filters.from_date) {
            let from_date = moment(body.filters.from_date).format('YYYY-MM-DD');
            from_date += " 00:00:00"         
            SearchKeywordsQuery += " and c.createdAt >= '" + from_date + "'";
        }
        if (body.filters.to_date) {
            let to_date = moment(body.filters.to_date).format('YYYY-MM-DD');
            to_date += " 23:59:59"            
            SearchKeywordsQuery += " and c.createdAt <= '" + to_date + "'";
        }
        if (body.filters.selectedMerchant) {
            
            SearchKeywordsQuery += " and c.claimed_by = "+body.filters.selectedMerchant;
        }
    }
    var SearchSql = "SELECT c.id,c.name,c.email,c.phone,c.amount,c.transaction_id,u.merchant_name AS merchantname,c.createdAt FROM cash_pickup c INNER JOIN users u ON c.sender_userId=u.id " + SearchKeywordsQuery + " order by id desc";

    return CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });
}

let getAllMerchants = async (body) => {
    return UserModal.findAll({ where: { isMerchant: 1,isMerchantVerified: 1,isMerchantEnabled: 1, },attributes: ['id','merchant_name'], raw: true,order: [['id', 'DESC']]});
}
module.exports = {
    getAllCashPickupDetails: getAllCashPickupDetails,
    exportAllCashPickupRequest: exportAllCashPickupRequest,
    getAllMerchants:getAllMerchants

}
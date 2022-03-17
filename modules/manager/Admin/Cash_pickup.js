'use  strict'



let BadRequestError = require('../../errors/badRequestError'),
    CashpickupModal = require('../../models/Cash_pickup'),
    CustomQueryModel = require("../../models/Custom_query"),
    SequelizeObj = require("sequelize");


let getAllCashPickupDetails = async(body) => {
    let limit = (body.limit) ? parseInt(body.limit) : 10;
    let page = body.page || 1;
    let offset = (page - 1) * limit;    
    let SearchKeywordsQuery = "";
    if (body.filters) {
        if (body.filters.searchtext) {
           SearchKeywordsQuery = "where (c.name like '%" + body.filters.searchtext + "%' or c.email like '%" + body.filters.searchtext + "%' or c.phone like '%" + body.filters.searchtext + "%' or c.amount like '%" + body.filters.searchtext + "%' or c.transaction_id like '%" + body.filters.searchtext+"' or u.email like '%" + body.filters.searchtext + "%')";
        }
    }
    var SearchSql = "SELECT c.id,c.name,c.email,c.phone,c.amount,c.transaction_id,u.email AS useremail FROM cash_pickup c INNER JOIN users u ON c.sender_userId=u.id "+SearchKeywordsQuery+" LIMIT " + offset + "," + limit;

    let allBankRequest = await CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });
 

    let allRequestCountQuery  = "SELECT c.id,c.name,c.email,c.phone,c.amount,c.transaction_id,u.email AS useremail FROM cash_pickup c INNER JOIN users u ON c.sender_userId=u.id "+SearchKeywordsQuery;
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
    let SearchKeywordsQuery = "";
    if (body.filters) {
        if (body.filters.searchtext) {
            SearchKeywordsQuery = "where (c.name like '%" + body.filters.searchtext + "%' or c.email like '%" + body.filters.searchtext + "%' or c.phone like '%" + body.filters.searchtext + "%' or c.amount like '%" + body.filters.searchtext + "%' or c.transaction_id like '%" + body.filters.searchtext+"' or u.email like '%" + body.filters.searchtext + "%')";
    }
}
    var SearchSql = "SELECT c.id,c.name,c.email,c.phone,c.amount,c.transaction_id,u.email AS useremail FROM cash_pickup c INNER JOIN users u ON c.sender_userId=u.id "+SearchKeywordsQuery;

    return CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    }); 
}


module.exports = {
    getAllCashPickupDetails: getAllCashPickupDetails,
    exportAllCashPickupRequest:exportAllCashPickupRequest

}
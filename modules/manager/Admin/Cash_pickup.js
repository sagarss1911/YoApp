'use  strict'



let BadRequestError = require('../../errors/badRequestError'),
    CashpickupModal = require('../../models/Cash_pickup'),
    CustomQueryModel = require("../../models/Custom_query"),
    SequelizeObj = require("sequelize"),
    moment = require("moment");


let getAllCashPickupDetails = async (body) => {
    let limit = (body.limit) ? parseInt(body.limit) : 10;
    let page = body.page || 1;
    let offset = (page - 1) * limit;
    let SearchKeywordsQuery = "";
    if (body.filters) {
        if (body.filters.searchtext || body.filters.from_date || body.filters.to_date) {
            SearchKeywordsQuery = "where ";
        }
        if (body.filters.searchtext) {
            SearchKeywordsQuery += "(c.name like '%" + body.filters.searchtext + "%' or c.email like '%" + body.filters.searchtext + "%' or c.phone like '%" + body.filters.searchtext + "%' or c.amount like '%" + body.filters.searchtext + "%' or c.transaction_id like '%" + body.filters.searchtext + "' or u.email like '%" + body.filters.searchtext + "%')";
        }
        if (body.filters.from_date) {
            let from_date = moment(body.filters.from_date).format('YYYY-MM-DD');
            from_date += " 00:00:00"
            if (body.filters.searchtext) {
                SearchKeywordsQuery = SearchKeywordsQuery + " and ";
            }
            SearchKeywordsQuery += " c.createdAt >= '" + from_date + "'";
        }
        if (body.filters.to_date) {
            let to_date = moment(body.filters.to_date).format('YYYY-MM-DD');
            to_date += " 23:59:59"
            if (body.filters.searchtext || body.filters.from_date) {
                SearchKeywordsQuery = SearchKeywordsQuery + " and ";
            }
            SearchKeywordsQuery += " c.createdAt <= '" + to_date + "'";
        }
    }

    var SearchSql = "SELECT c.id,c.name,c.email,c.phone,c.amount,c.transaction_id,u.email AS useremail,c.createdAt FROM cash_pickup c INNER JOIN users u ON c.sender_userId=u.id " + SearchKeywordsQuery + " order by id desc LIMIT " + offset + "," + limit;

    let allBankRequest = await CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });


    let allRequestCountQuery = "SELECT c.id,c.name,c.email,c.phone,c.amount,c.transaction_id,u.email,c.createdAt AS useremail FROM cash_pickup c INNER JOIN users u ON c.sender_userId=u.id " + SearchKeywordsQuery + " order by id desc";
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
        if (body.filters.searchtext || body.filters.from_date || body.filters.to_date) {
            SearchKeywordsQuery = "where ";
        }
        if (body.filters.searchtext) {
            SearchKeywordsQuery += "(c.name like '%" + body.filters.searchtext + "%' or c.email like '%" + body.filters.searchtext + "%' or c.phone like '%" + body.filters.searchtext + "%' or c.amount like '%" + body.filters.searchtext + "%' or c.transaction_id like '%" + body.filters.searchtext + "' or u.email like '%" + body.filters.searchtext + "%')";
        }
        if (body.filters.from_date) {
            let from_date = moment(body.filters.from_date).format('YYYY-MM-DD');
            from_date += " 00:00:00"
            if (body.filters.searchtext) {
                SearchKeywordsQuery = SearchKeywordsQuery + " and ";
            }
            SearchKeywordsQuery += " c.createdAt >= '" + from_date + "'";
        }
        if (body.filters.to_date) {
            let to_date = moment(body.filters.to_date).format('YYYY-MM-DD');
            to_date += " 23:59:59"
            if (body.filters.searchtext || body.filters.from_date) {
                SearchKeywordsQuery = SearchKeywordsQuery + " and ";
            }
            SearchKeywordsQuery += " c.createdAt <= '" + to_date + "'";
        }
    }
    var SearchSql = "SELECT c.id,c.name,c.email,c.phone,c.amount,c.transaction_id,u.email AS useremail,c.createdAt FROM cash_pickup c INNER JOIN users u ON c.sender_userId=u.id " + SearchKeywordsQuery + " order by id desc";

    return CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });
}


module.exports = {
    getAllCashPickupDetails: getAllCashPickupDetails,
    exportAllCashPickupRequest: exportAllCashPickupRequest

}
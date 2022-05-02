'use  strict'



let BadRequestError = require('../../errors/badRequestError'),
    BankModal = require('../../models/Merchant_bank_transfer'),
    CustomQueryModel = require("../../models/Custom_query"),
    SequelizeObj = require("sequelize"), moment = require("moment");


let getAllBankDetails = async(body) => {
    let limit = (body.limit) ? parseInt(body.limit) : 10;
    let page = body.page || 1;
    let offset = (page - 1) * limit;    
    let SearchKeywordsQuery = "";
    if (body.filters) {
        if (body.filters.searchtext || body.filters.from_date || body.filters.to_date) {
            SearchKeywordsQuery = "where ";
        }
        if (body.filters.searchtext) {
            SearchKeywordsQuery += "(b.name like '%" + body.filters.searchtext + "%' or b.address like '%" + body.filters.searchtext + "%' or b.phone like '%" + body.filters.searchtext + "%' or b.bank_name like '%" + body.filters.searchtext + "%' or b.bank_account like '%" + body.filters.searchtext + "%' or b.amount like '%" + body.filters.searchtext+"' or b.transaction_id like '%" + body.filters.searchtext + "%' or u.email like '%" + body.filters.searchtext + "%')";
        }
        if (body.filters.from_date) {
            let from_date = moment(body.filters.from_date).format('YYYY-MM-DD');
            from_date += " 00:00:00"
            if (body.filters.searchtext) {
                SearchKeywordsQuery = SearchKeywordsQuery + " and ";
            }
            SearchKeywordsQuery += " b.createdAt >= '" + from_date + "'";
        }
        if (body.filters.to_date) {
            let to_date = moment(body.filters.to_date).format('YYYY-MM-DD');
            to_date += " 23:59:59"
            if (body.filters.searchtext || body.filters.from_date) {
                SearchKeywordsQuery = SearchKeywordsQuery + " and ";
            }
            SearchKeywordsQuery += " b.createdAt <= '" + to_date + "'";
        }
    }
    
    var SearchSql = "select b.id,b.name,b.address,b.phone,b.bank_name,b.bank_account,b.country,b.amount,b.transaction_id,b.status,u.email,b.createdAt FROM merchant_bank_transfer b INNER JOIN users u ON b.sender_userId = u.id "+SearchKeywordsQuery+"  order by id desc LIMIT " + offset + "," + limit;

    let allBankRequest = await CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });
 

    let allRequestCountQuery  = "select b.id,b.name,b.address,b.phone,b.bank_name,b.bank_account,b.country,b.amount,b.transaction_id,b.status,u.email,b.createdAt FROM merchant_bank_transfer b INNER JOIN users u ON b.sender_userId = u.id "+SearchKeywordsQuery + "  order by id desc";
    let allRequestCount = await CustomQueryModel.query(allRequestCountQuery, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });

    let _result = { total_count: 0 };
    _result.slides = allBankRequest;
    _result.total_count = allRequestCount.length;
    return _result;
}



let exportAllBankRequest = async (body) => {
    let SearchKeywordsQuery = "";
    if (body.filters) {
        if (body.filters.searchtext || body.filters.from_date || body.filters.to_date) {
            SearchKeywordsQuery = "where ";
        }
        if (body.filters.searchtext) {
            SearchKeywordsQuery += "(b.name like '%" + body.filters.searchtext + "%' or b.address like '%" + body.filters.searchtext + "%' or b.phone like '%" + body.filters.searchtext + "%' or b.bank_name like '%" + body.filters.searchtext + "%' or b.bank_account like '%" + body.filters.searchtext + "%' or b.amount like '%" + body.filters.searchtext+"' or b.transaction_id like '%" + body.filters.searchtext + "%' or u.email like '%" + body.filters.searchtext + "%')";
        }
        if (body.filters.from_date) {
            let from_date = moment(body.filters.from_date).format('YYYY-MM-DD');
            from_date += " 00:00:00"
            if (body.filters.searchtext) {
                SearchKeywordsQuery = SearchKeywordsQuery + " and ";
            }
            SearchKeywordsQuery += " b.createdAt >= '" + from_date + "'";
        }
        if (body.filters.to_date) {
            let to_date = moment(body.filters.to_date).format('YYYY-MM-DD');
            to_date += " 23:59:59"
            if (body.filters.searchtext || body.filters.from_date) {
                SearchKeywordsQuery = SearchKeywordsQuery + " and ";
            }
            SearchKeywordsQuery += " b.createdAt <= '" + to_date + "'";
        }
    }
    var SearchSql = "select b.id,b.name,b.address,b.phone,b.bank_name,b.bank_account,b.country,b.amount,b.transaction_id,b.status,u.email,b.createdAt FROM merchant_bank_transfer b INNER JOIN users u ON b.sender_userId = u.id "+SearchKeywordsQuery + " order by id desc";

    return CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    }); 
}


let updateBankRequestStatus = async (req) => {
    let body = req.body;    
    await BankModal.update({status:body.newStatus}, { where: { id: req.params.slider_id }, raw: true });
    return true
    
}
module.exports = {
    getAllBankDetails: getAllBankDetails,
    exportAllBankRequest:exportAllBankRequest,
    updateBankRequestStatus:updateBankRequestStatus

}
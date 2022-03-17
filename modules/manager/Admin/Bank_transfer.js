'use  strict'



let BadRequestError = require('../../errors/badRequestError'),
    BankModal = require('../../models/Bank_transfer'),
    CustomQueryModel = require("../../models/Custom_query"),
    SequelizeObj = require("sequelize");


let getAllBankDetails = async(body) => {
    let limit = (body.limit) ? parseInt(body.limit) : 10;
    let page = body.page || 1;
    let offset = (page - 1) * limit;    
    let SearchKeywordsQuery = "";
    if (body.filters) {
        if (body.filters.searchtext) {
           SearchKeywordsQuery = "where (b.name like '%" + body.filters.searchtext + "%' or b.address like '%" + body.filters.searchtext + "%' or b.phone like '%" + body.filters.searchtext + "%' or b.bank_name like '%" + body.filters.searchtext + "%' or b.bank_account like '%" + body.filters.searchtext + "%' or b.amount like '%" + body.filters.searchtext+"' or b.transaction_id like '%" + body.filters.searchtext + "%' or u.email like '%" + body.filters.searchtext + "%')";
        }
    }
    var SearchSql = "select b.id,b.name,b.address,b.phone,b.bank_name,b.bank_account,b.country,b.amount,b.transaction_id,b.status,u.email FROM bank_transfer b INNER JOIN users u ON b.sender_userId = u.id "+SearchKeywordsQuery+"  order by id desc LIMIT " + offset + "," + limit;

    let allBankRequest = await CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });
 

    let allRequestCountQuery  = "select b.id,b.name,b.address,b.phone,b.bank_name,b.bank_account,b.country,b.amount,b.transaction_id,b.status,u.email FROM bank_transfer b INNER JOIN users u ON b.sender_userId = u.id "+SearchKeywordsQuery + "  order by id desc";
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
        if (body.filters.searchtext) {
            SearchKeywordsQuery = "where (b.name like '%" + body.filters.searchtext + "%' or b.address like '%" + body.filters.searchtext + "%' or b.phone like '%" + body.filters.searchtext + "%' or b.bank_name like '%" + body.filters.searchtext + "%' or b.bank_account like '%" + body.filters.searchtext + "%' or b.amount like '%" + body.filters.searchtext+"' or b.transaction_id like '%" + body.filters.searchtext + "%' or u.email like '%" + body.filters.searchtext + "%')";
    }
}
    var SearchSql = "select b.id,b.name,b.address,b.phone,b.bank_name,b.bank_account,b.country,b.amount,b.transaction_id,b.status,u.email FROM bank_transfer b INNER JOIN users u ON b.sender_userId = u.id "+SearchKeywordsQuery + " order by id desc";

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
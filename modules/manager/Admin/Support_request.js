'use strict';


let BadRequestError = require('../../errors/badRequestError'),
    RequestModal = require('../../models/Admin/Support_request'),
    CategoryModel = require('../../models/Admin/Support_category'),
    UserModel = require('../../models/Users'),
    CustomQueryModel = require("../../models/Custom_query"),
    SequelizeObj = require("sequelize"),
    
    Sequelize = require('sequelize'),
    Op = Sequelize.Op;


//get all support category
let getAllSupportRequest = async (body) => {
    let limit = (body.limit) ? parseInt(body.limit) : 10;
    let page = body.page || 1;
    let offset = (page - 1) * limit;    
    let SearchKeywordsQuery = "";
    if (body.filters) {
        if (body.filters.searchtext) {
         SearchKeywordsQuery = "where (u.name like '%" + body.filters.searchtext + "%' or u.username like '%" + body.filters.searchtext + "%' or u.email like '%" + body.filters.searchtext + "%' or u.phone like '%" + body.filters.searchtext + "%' or sr.text like '%" + body.filters.searchtext + "%' or sc.title like '%" + body.filters.searchtext+"')";
    }
}
    var SearchSql = "SELECT sr.id,sc.title,sr.text,u.name,u.email,u.phone,sr.status FROM support_request sr INNER JOIN support_category sc ON sr.supportCategoryId=sc.id INNER JOIN users u ON sr.userId=u.id "+SearchKeywordsQuery+"  order by id desc LIMIT " + offset + "," + limit;

    let allSupportRequest = await CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });
 

    let allRequestCountQuery  = "SELECT sr.id,sc.title,sr.text,u.name,u.email,u.phone,sr.status FROM support_request sr INNER JOIN support_category sc ON sr.supportCategoryId=sc.id INNER JOIN users u ON sr.userId=u.id "+SearchKeywordsQuery + " order by id desc";
    let allRequestCount = await CustomQueryModel.query(allRequestCountQuery, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });

    let _result = { total_count: 0 };
    _result.slides = allSupportRequest;
    _result.total_count = allRequestCount.length;
    return _result;

}

let exportAllSupportRequest = async (body) => {
    let SearchKeywordsQuery = "";
    if (body.filters) {
        if (body.filters.searchtext) {
         SearchKeywordsQuery = "where (u.name like '%" + body.filters.searchtext + "%' or u.username like '%" + body.filters.searchtext + "%' or u.email like '%" + body.filters.searchtext + "%' or u.phone like '%" + body.filters.searchtext + "%' or sr.text like '%" + body.filters.searchtext + "%' or sc.title like '%" + body.filters.searchtext+"')";
    }
}
    var SearchSql = "SELECT sr.id,sc.title,sr.text,u.name,u.email,u.phone,sr.status FROM support_request sr INNER JOIN support_category sc ON sr.supportCategoryId=sc.id INNER JOIN users u ON sr.userId=u.id "+SearchKeywordsQuery + " order by id desc";

    return CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    }); 
}


let updateSupportRequest = async (req) => {
    let body = req.body;
    let status = '0'
    if(body.newStatus){
        status = '1'
    }

    await RequestModal.update({status:status}, { where: { id: req.params.slider_id }, raw: true });
    return true
    
}


module.exports = {
    getAllSupportRequest: getAllSupportRequest,
    updateSupportRequest: updateSupportRequest,
    exportAllSupportRequest:exportAllSupportRequest
};

'use  strict'



let BadRequestError = require('../../errors/badRequestError'),
    UserModel = require('../../models/Users'),
    PlanModel = require('../../models/Admin/Plans'),
    CustomQueryModel = require("../../models/Custom_query"),
    s3Helper = require('../../helpers/awsS3Helper'),
    SequelizeObj = require("sequelize"), moment = require("moment");


let getAllMerchant = async(body) => {
    let limit = (body.limit) ? parseInt(body.limit) : 10;
    let page = body.page || 1;
    let offset = (page - 1) * limit;    
    let SearchKeywordsQuery = "";
    if (body.filters) { 
        if (body.filters.searchtext || body.filters.from_date || body.filters.to_date) {
            SearchKeywordsQuery = "and ";
        }       
        if (body.filters.searchtext) {
            SearchKeywordsQuery += " (u.merchant_name like '%" + body.filters.searchtext + "%' or u.merchant_address like '%" + body.filters.searchtext + "%' or u.merchant_phone like '%" + body.filters.searchtext + "%' )";
        } 
        if (body.filters.from_date) {
            let from_date = moment(body.filters.from_date).format('YYYY-MM-DD');
            from_date += " 00:00:00"
            if (body.filters.searchtext) {
                SearchKeywordsQuery = SearchKeywordsQuery + " and ";
            }
            SearchKeywordsQuery += " u.merchantCreatedAt >= '" + from_date + "'";
        }
        if (body.filters.to_date) {
            let to_date = moment(body.filters.to_date).format('YYYY-MM-DD');
            to_date += " 23:59:59"
            if (body.filters.searchtext || body.filters.from_date) {
                SearchKeywordsQuery = SearchKeywordsQuery + " and ";
            }
            SearchKeywordsQuery += " u.merchantCreatedAt <= '" + to_date + "'";
        }       
    }
    
    var SearchSql = "select p.planname,u.id,u.merchant_name,u.merchant_address,u.merchant_phone,u.licence_proof,u.address_proof,u.utility_proof,u.upgraded_image1,u.upgraded_image2,u.upgraded_image3,u.upgraded_image4,u.membershipId,u.merchantCreatedAt,u.isMerchantVerified,u.isMerchantEnabled,u.isUpgradeRequestSubmitted,u.isMerchantUpgraded from users u left join plans p on p.id=u.membershipId where u.isMerchant=1 "+SearchKeywordsQuery+"  order by u.merchantCreatedAt desc LIMIT " + offset + "," + limit;
   
    let allMerchant = await CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });
 
    
    let allRequestCountQuery  = "select id,merchant_name,merchant_address,merchant_phone,licence_proof,address_proof,utility_proof,merchantCreatedAt,isMerchantEnabled from users where isMerchant=1"+SearchKeywordsQuery+"  order by merchantCreatedAt desc";
    let allRequestCount = await CustomQueryModel.query(allRequestCountQuery, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    });

    let _result = { total_count: 0 };
    _result.slides = allMerchant;
    _result.total_count = allRequestCount.length;
    return _result;
}



let exportAllMerchant = async (body) => {
    let SearchKeywordsQuery = "";
    if (body.filters) {     
        if (body.filters.searchtext || body.filters.from_date || body.filters.to_date) {
            SearchKeywordsQuery = "and ";
        }
        if (body.filters.searchtext) {
            SearchKeywordsQuery += " (u.merchant_name like '%" + body.filters.searchtext + "%' or u.merchant_address like '%" + body.filters.searchtext + "%' or u.merchant_phone like '%" + body.filters.searchtext + "%' )";
        }
        if (body.filters.from_date) {
            let from_date = moment(body.filters.from_date).format('YYYY-MM-DD');
            from_date += " 00:00:00"
            if (body.filters.searchtext) {
                SearchKeywordsQuery = SearchKeywordsQuery + " and ";
            }
            SearchKeywordsQuery += " u.merchantCreatedAt >= '" + from_date + "'";
        }
        if (body.filters.to_date) {
            let to_date = moment(body.filters.to_date).format('YYYY-MM-DD');
            to_date += " 23:59:59"
            if (body.filters.searchtext || body.filters.from_date) {
                SearchKeywordsQuery = SearchKeywordsQuery + " and ";
            }
            SearchKeywordsQuery += " u.merchantCreatedAt <= '" + to_date + "'";
        } 
        
    }
    var SearchSql = "select p.planname,u.id,u.merchant_name,u.merchant_address,u.merchant_phone,u.licence_proof,u.address_proof,u.utility_proof,u.upgraded_image1,u.upgraded_image2,u.upgraded_image3,u.upgraded_image4,u.membershipId,u.merchantCreatedAt,u.isMerchantVerified,u.isMerchantEnabled,u.isUpgradeRequestSubmitted,u.isMerchantUpgraded from users u left join plans p on p.id=u.membershipId where u.isMerchant=1 "+SearchKeywordsQuery+"  order by u.merchantCreatedAt desc ";    
    console.log(SearchSql)
    return CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    }); 
}


let updateMerchantStatus = async (req) => {
    let body = req.body;    
    if(body.field == "isMerchantVerified"){
        await UserModel.update({isMerchantVerified:body.status}, { where: { id: req.params.slider_id }, raw: true });
        let userData  = await UserModel.findOne({ where: { id: req.params.slider_id }, raw: true });        
        if(!userData.membershipId){
            let defaultPlan = await PlanModel.findOne({ where: { isDefault: 1 }, raw: true });            
            await UserModel.update({membershipId:defaultPlan.id}, { where: { id: req.params.slider_id }, raw: true });
        }
    }else if(body.field == "isMerchantEnabled"){
        await UserModel.update({isMerchantEnabled:body.status}, { where: { id: req.params.slider_id }, raw: true });
    }else if(body.field == "isMerchantUpgraded"){
        await UserModel.update({isMerchantUpgraded:body.status}, { where: { id: req.params.slider_id }, raw: true });
    }
    
    return true
    
}
let merchantUpdate = async (req) => {
    let body = req.body.body ? JSON.parse(req.body.body) : req.body;    
    let updatedData = {}
    let requiredFields = ['merchant_name', 'merchant_phone', 'merchant_address','membershipId'];
    requiredFields.forEach(x => {
        if(!body[x]){
            throw new BadRequestError(x + ' is required');
        }
    }); 
    let optionalFiled = ['merchant_name', 'merchant_phone', 'merchant_address','membershipId'];
    optionalFiled.forEach(x => {
        updatedData[x] = body[x]
    });
    if (req.files.address_proof && req.files.address_proof.length > 0) {
        const result = await s3Helper.uploadFile(req.files.address_proof[0])                
        updatedData.address_proof = result.Location
        updatedData.address_proof_bucketkey = result.Key          
    }
    if (req.files.licence_proof && req.files.licence_proof.length > 0) {
        const result = await s3Helper.uploadFile(req.files.licence_proof[0])        
        updatedData.licence_proof = result.Location                
        updatedData.licence_proof_bucketkey = result.Key
    }
    if (req.files.utility_proof && req.files.utility_proof.length > 0) {
        const result = await s3Helper.uploadFile(req.files.utility_proof[0])        
        updatedData.utility_proof = result.Location                
        updatedData.utility_proof_bucketkey = result.Key
    }
    
    await UserModel.update(updatedData, { where: { id: req.params.merchant_id }, raw: true });
    let planData = await PlanModel.findOne({ where: { id: body.membershipId }, raw: true });

 let userData =  await UserModel.findOne({ where: { id: req.params.merchant_id } ,  raw: true,attributes: ['id', 'merchant_name', 'merchant_address', 'merchant_phone', 'licence_proof', 'address_proof', 'utility_proof', 'merchantCreatedAt', 'isMerchantVerified', 'isMerchantEnabled','upgraded_image1','upgraded_image2','upgraded_image3','upgraded_image4','membershipId','isUpgradeRequestSubmitted','isMerchantUpgraded'] });
 userData.planname = planData.planname 
 return userData
}

module.exports = {
    getAllMerchant: getAllMerchant,
    exportAllMerchant:exportAllMerchant,
    updateMerchantStatus:updateMerchantStatus,
    merchantUpdate:merchantUpdate

}
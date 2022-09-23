'use  strict'



let BadRequestError = require('../../errors/badRequestError'),
    UserModel = require('../../models/Users'),
    MerchantCashTopupPaidModel = require('../../models/MerchantCashTopupPaid'),
    PlanModel = require('../../models/Admin/Plans'),
    CustomQueryModel = require("../../models/Custom_query"),
    CountryModel= require("../../models/Country"),
    s3Helper = require('../../helpers/awsS3Helper'),
    NotificationHelper = require('../../helpers/notifications'),
    SEND_SMS =  require('../../helpers/send_sms'),
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
    if(body.isReuploaded){   
            SearchKeywordsQuery += " and u.image_reuploaded_needed = 1 and u.image_reuploaded=1 ";         
    }
    
    
    var SearchSql = "select u.image_reuploaded_needed,u.image_reuploaded_fields,u.image_reuploaded,u.isCashTopupEnabled,u.cash_topup_limit,u.merchant_due_payment,p.planname,p.cash_topup_limit as planTopUpLimit,u.id,u.merchant_name,u.merchant_address,u.merchant_phone,u.valid_ID,u.address_proof,u.TIN_card,u.upgraded_image1,u.upgraded_image2,u.upgraded_image3,u.upgraded_image4,u.membershipId,u.merchantCreatedAt,u.isMerchantVerified,u.isMerchantEnabled,u.isUpgradeRequestSubmitted,u.isMerchantUpgraded from users u left join plans p on p.id=u.membershipId where u.isMerchant=1 "+SearchKeywordsQuery+"  order by u.merchantCreatedAt desc LIMIT " + offset + "," + limit;
   
    let allMerchant = await CustomQueryModel.query(SearchSql, {
        type: SequelizeObj.QueryTypes.SELECT,
        raw: true
    }); 
    
    let allRequestCountQuery  = "select id,merchant_name,merchant_address,merchant_phone,valid_ID,address_proof,TIN_card,merchantCreatedAt,isMerchantEnabled from users where isMerchant=1"+SearchKeywordsQuery+"  order by merchantCreatedAt desc";
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
    var SearchSql = "select u.isCashTopupEnabled,u.cash_topup_limit,p.planname,u.id,u.merchant_name,u.merchant_address,u.merchant_phone,u.valid_ID,u.address_proof,u.TIN_card,u.upgraded_image1,u.upgraded_image2,u.upgraded_image3,u.upgraded_image4,u.membershipId,u.merchantCreatedAt,u.isMerchantVerified,u.isMerchantEnabled,u.isUpgradeRequestSubmitted,u.isMerchantUpgraded from users u left join plans p on p.id=u.membershipId where u.isMerchant=1 "+SearchKeywordsQuery+"  order by u.merchantCreatedAt desc ";     
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
    }else if(body.field == "isCashTopupEnabled"){
        await UserModel.update({isCashTopupEnabled:body.status}, { where: { id: req.params.slider_id }, raw: true });
    }
    
    return true
    
}
let acceptMerchantImageRequest = async (req) => {
    let senderInfo =  await UserModel.findOne({ where: { id: req.params.merchant_id } ,  raw: true});
    if(!senderInfo){
        throw new BadRequestError('Invalid Merchant'); 
    }
    await UserModel.update({image_reuploaded_needed:0,image_reuploaded_fields:'',image_reuploaded:0}, { where: { id: senderInfo.id }, raw: true });    
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
    let optionalFiled = ['merchant_name', 'merchant_phone', 'merchant_address','membershipId','cash_topup_limit'];
    optionalFiled.forEach(x => {
        updatedData[x] = body[x]
    });
    if (req.files.address_proof && req.files.address_proof.length > 0) {
        const result = await s3Helper.uploadFile(req.files.address_proof[0])                
        updatedData.address_proof = result.Location
        updatedData.address_proof_bucketkey = result.Key          
    }
    if (req.files.valid_ID && req.files.valid_ID.length > 0) {
        const result = await s3Helper.uploadFile(req.files.valid_ID[0])        
        updatedData.valid_ID = result.Location                
        updatedData.valid_ID_bucketkey = result.Key
    }
    if (req.files.TIN_card && req.files.TIN_card.length > 0) {
        const result = await s3Helper.uploadFile(req.files.TIN_card[0])        
        updatedData.TIN_card = result.Location                
        updatedData.TIN_card_bucketkey = result.Key
    }
    
    await UserModel.update(updatedData, { where: { id: req.params.merchant_id }, raw: true });
    let planData = await PlanModel.findOne({ where: { id: body.membershipId }, raw: true });

 let userData =  await UserModel.findOne({ where: { id: req.params.merchant_id } ,  raw: true,attributes: ['id', 'merchant_name', 'merchant_address', 'merchant_phone', 'valid_ID', 'address_proof', 'TIN_card', 'merchantCreatedAt', 'isMerchantVerified', 'isMerchantEnabled','upgraded_image1','upgraded_image2','upgraded_image3','upgraded_image4','membershipId','isUpgradeRequestSubmitted','isMerchantUpgraded','cash_topup_limit','isCashTopupEnabled'] });
 userData.planname = planData.planname 
 return userData
}
let resetMerchantImages = async (req) => {
    let body = req.body.body ? JSON.parse(req.body.body) : req.body;    
  
    if(!body.selected_fields.length)
    {
        throw new BadRequestError('Fields not Given '); 
    }
    let senderInfo =  await UserModel.findOne({ where: { id: req.params.merchant_id } ,  raw: true});
    if(!senderInfo){
        throw new BadRequestError('Invalid Merchant'); 
    }
    let updatedData = {}    
    updatedData["image_reuploaded_needed"] = 1
    updatedData["image_reuploaded"] = 0
    updatedData["image_reuploaded_fields"] = body.selected_fields.join()
    
    let notificationDataSender = {
        title: "Admin Has Reviewed your documents and found some issue. please resubmit your documents",
        subtitle: "Admin Has Reviewed your documents and found some issue. please resubmit your documents",
        redirectscreen: "merchant_document_resubmit",        
        merchant_id: senderInfo.id

    }
    let country = await CountryModel.findOne({ where: { iso_code_2: senderInfo.region }, raw: true })
    await NotificationHelper.sendFriendRequestNotificationToUser(senderInfo.id, notificationDataSender);
    SEND_SMS.imageResetSMSToMerchant("+" + country.isd_code + senderInfo.merchant_phone);
    
    await UserModel.update(updatedData, { where: { id: senderInfo.id }, raw: true });
    

  let userData =  await UserModel.findOne({ where: { id: req.params.merchant_id } ,  raw: true,attributes: ['id', 'merchant_name', 'merchant_address', 'merchant_phone', 'valid_ID', 'address_proof', 'TIN_card', 'merchantCreatedAt', 'isMerchantVerified', 'isMerchantEnabled','upgraded_image1','upgraded_image2','upgraded_image3','upgraded_image4','membershipId','isUpgradeRequestSubmitted','isMerchantUpgraded','cash_topup_limit','isCashTopupEnabled'] });
  let planData = await PlanModel.findOne({ where: { id: userData.membershipId }, raw: true });
  userData.planname = planData?.planname 
  return userData
}
let merchantDuePaymentUpdate = async (req) => {
    let body = req.body.body ? JSON.parse(req.body.body) : req.body;  
    if(!body['amount_paid']){
        throw new BadRequestError('amount_paid is required');
    }
    if(isNaN(body.amount_paid)) {
        throw new BadRequestError('Enter amount in proper format');
    }
    let merchant = await UserModel.findOne({ where: { id: req.params.merchant_id }, raw: true });
    if(!merchant){
        throw new BadRequestError('Invalid merchant');
    }
    if(body.amount_paid > merchant.merchant_due_payment) {
        throw new BadRequestError('Payable amount should be less then due amount');
    }
    let addLog = {
        merchant_id : req.params.merchant_id, 
        admin_id : req.admin.adminid,
        amount_due : Number(merchant.merchant_due_payment),
        amount_paid : Number(body.amount_paid),
        total_pending : Number(merchant.merchant_due_payment - body.amount_paid)
    };
    let duePaidLog = await MerchantCashTopupPaidModel.create(addLog);
    if(duePaidLog) {
        await UserModel.update({merchant_due_payment : duePaidLog.total_pending},{where : {id : duePaidLog.merchant_id}});
    }
    return {amount_due : duePaidLog.amount_due , amount_paid: duePaidLog.amount_paid, total_pending: duePaidLog.total_pending};
}


let getTopUpMerchantHistory = async(req) => {
    let body = req.body;
    let limit = (body.limit) ? parseInt(body.limit) : 10;
    let page = body.page || 1;
    let offset = (page - 1) * limit;
    if(!req.params.merchant_id){
        throw new BadRequestError('merchant_id is required');
    }
    let MerchantTopUpPaid = await MerchantCashTopupPaidModel.findAll({ where: { merchant_id: req.params.merchant_id }, raw: true, attributes: [ 'amount_due', 'amount_paid', 'total_pending'], limit, offset, order: [['id', 'DESC']] });
    let MerchantTopUpPaidCount = await MerchantCashTopupPaidModel.count({        
        where: { merchant_id: req.params.merchant_id },
        order: [['id', 'DESC']],
        raw: true
    });

    let _result = { total_count: 0 };
    _result.slides = MerchantTopUpPaid;
    _result.total_count = MerchantTopUpPaidCount;
    return _result;
}

module.exports = {
    getAllMerchant: getAllMerchant,
    exportAllMerchant:exportAllMerchant,
    updateMerchantStatus:updateMerchantStatus,
    merchantUpdate:merchantUpdate,
    acceptMerchantImageRequest:acceptMerchantImageRequest,
    resetMerchantImages:resetMerchantImages,
    merchantDuePaymentUpdate:merchantDuePaymentUpdate,
    getTopUpMerchantHistory:getTopUpMerchantHistory
}
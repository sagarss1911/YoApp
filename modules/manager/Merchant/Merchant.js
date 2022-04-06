'use strict';


let helper = require("../../helpers/helpers"),
    md5 = require('md5'),
    SEND_SMS = require("../../helpers/send_sms"),
    SEND_EMAIL = require("../../helpers/send_email"),
    CountryModel = require("../../models/Country"),
    UserModel = require("../../models/Users"),
    CommonHelper = require('../../helpers/helpers'),
    NotificationHelper = require("../../helpers/notifications"),
    config = process.config.global_config,
    s3Helper = require('../../helpers/awsS3Helper'),
    fs = require('fs'),
    axios = require('axios'),
    util = require('util'),
    unlinkFile = util.promisify(fs.unlink),
    BadRequestError = require('../../errors/badRequestError');
const { v4: uuidv4 } = require('uuid');

let merchantRegistration = async (userid, req) => {

    let body = req.body;
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }
    let updatedData = {}
    let requiredFields = ['merchant_name', 'merchant_phone', 'merchant_address'];
    requiredFields.forEach(x => {
        if(!body[x]){
            throw new BadRequestError(x + ' is required');
        }
    }); 
    if(!req.files.address_proof || !req.files.address_proof.length){
        throw new BadRequestError('Address proof is required');
    }
    if(!req.files.licence_proof || !req.files.licence_proof.length){
        throw new BadRequestError('Licence proof is required');
    }
    if(!req.files.utility_proof || !req.files.utility_proof.length){
        throw new BadRequestError('Utility proof is required');
    }
    let optionalFiled = ['merchant_name', 'merchant_phone', 'merchant_address'];
    optionalFiled.forEach(x => {
        updatedData[x] = body[x]
    });

    let user = await UserModel
        .findOne({ where: { id: userid }, raw: true });

    if(user.isMerchant){
        throw new BadRequestError('User already registered as merchant');
    }
    

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
    updatedData.isMerchant = 1;
    updatedData.merchantCreatedAt = new Date();
    await UserModel.update(updatedData, { where: { id: userid }, raw: true });
    return { message: 'Merchant registration successful' };
}







module.exports = {  
    merchantRegistration: merchantRegistration
};

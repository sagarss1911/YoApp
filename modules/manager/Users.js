'use strict';


let helper = require("../helpers/helpers"),
    _ = require("lodash"),
    md5 = require('md5'),
    SEND_SMS = require("../helpers/send_sms"),
    CountryModel = require("../models/Country"),
    UserModel = require("../models/Users"),
    UserAuthModel = require("../models/Users_auth"),
    UserImagesModel = require("../models/User_images"),
    OTPModel = require("../models/OTP"),  
    config = process.config.global_config,
    BadRequestError = require('../errors/badRequestError'),
    fs = require('fs'),
    moment = require("moment");

let signup = async (req) => {
    let req_body = req.body
    if (helper.undefinedOrNull(req_body)) {
        throw new BadRequestError('Request body comes empty');
    }
    ['name', 'email', 'phone', 'region', 'password', 'gender' ].forEach(x => {
        if (!req_body[x]) {
            throw new BadRequestError(x + " is required");
        }
    });
    let findData = {}
    findData["$or"] = [
        {phone: {$eq:  req_body.phone}},
        {email: { $eq: req_body.email}}
    ]
    let user = await UserModel
        .findOne({ where: findData, attributes: ['id', 'phone'] });

    if (user) {
        throw new BadRequestError("User already exit. Please signin");
    }
    let createData = {
        name: req_body.name,
        email: req_body.email,
        phone: req_body.phone,
        region: req_body.region,
        password: md5(req_body.password),
        gender: req_body.gender,
        
    }
    
    try {
        let _customer;
        let customer = await UserModel.create(createData);
        _customer = customer.toJSON();
        let authToken = md5(Date.now() + _customer.phone);
        let otp = Date.now().toString().slice(-6);
        let authRecord = {
            userid: _customer.id,
            token: authToken,
            otp: otp
        }
        await UserAuthModel.destroy({ where: { userid: _customer.id } });
        await UserAuthModel.create(authRecord);
        let country = await CountryModel.findOne({ where: { iso_code_2: _customer.region }, raw: true })
        await SEND_SMS.sms(otp, "+"+country.isd_code + _customer.phone);
        return authRecord;
    } catch (error) {
        if (error && error.errors && error.errors[0] && error.errors[0].message && error.errors[0].message.indexOf("unique") != -1) {
            let uniqueText = error.errors[0].path == "email" ? "email" : "mobile number"
            throw new BadRequestError('The ' + uniqueText + ' is already registered, please use login option or use alternate ' + uniqueText + ' to sign up');
        } else {
            throw new BadRequestError(error);
        };
    }

}

let uploadImages = async (req) => {
    let userid = req.user ? req.user.userId : null;
    for (var x in req.files.image) {
        await UserImagesModel.create({ userId: userid, image: req.files.image[x].filename });
    }
    let allUserImages = await UserImagesModel.count({
        where: { userId: userid },       
        raw: true
    });
    if (allUserImages > 6) {
        let limit = allUserImages - 6;
        let offset = 0;
        let allDeletedImages = await UserImagesModel.findAll({
            limit,
            offset,
            order: [['id', 'ASC']],
            raw: true
        });
        for (var x in allDeletedImages) {
            fs.unlink(config.upload_folder + config.upload_entities.user_images + allDeletedImages[x].image, function (err) {
                if (err) {
                    console.error(err);
                }
            });
            await UserImagesModel.destroy({ where: { id: allDeletedImages[x].id } });
        }
    }

    return true

}
let resendOTP = async (userid) => {
    if (helper.undefinedOrNull(userid)) {
        throw new BadRequestError('User Not Found With Provided Token');
    }
    let user = await UserModel.findOne({ where: { id: userid }, attributes: ['id','region', 'phone'], raw: true })
    let authToken = md5(Date.now() + user.phone);
    let otp = Date.now().toString().slice(-6);
    let authRecord = {
        userid: user.id,
        token: authToken,
        otp: otp
    }
    await UserAuthModel.destroy({ where: { userid: user.id } });
    await UserAuthModel.create(authRecord);
    let country = await CountryModel.findOne({ where: { iso_code_2: user.region }, raw: true })
    await SEND_SMS.sms(otp, "+"+country.isd_code + user.phone);
    return { token: authToken }
}

let verifyOTP = async (userid,otp) => {
    
    
    let userAuth = await UserAuthModel.findOne({ where: { userid: userid, otp: otp }, raw: true, attributes: ['userid', 'token'] });
    
    if (!userAuth || !userAuth.userid) {
        throw new BadRequestError("Invalid OTP");
    }
    await UserAuthModel.update({ otp: null }, { where: {  userid: userid, otp: otp }, raw: true });
    return { token: userAuth.token };

}


let sendOTP = async (req_body) => {
    if (helper.undefinedOrNull(req_body)) {
        throw new BadRequestError('Request body comes empty');
    }

    if (helper.undefinedOrNull(req_body.phone)) {
        throw new BadRequestError("phone is required");
    }

    let _customer;
    let otp = Date.now().toString().slice(-6);
    let isAvailable = await UserModel.findOne({ where: { phone: req_body.phone }, attributes: ['id', 'email'], raw: true })
    if (isAvailable) {
        throw new BadRequestError("User Already Available, Please Sign in")
    }
    //

    //send OTP here
    await OTPModel.destroy({ where: { phone: req_body.phone } });
    return await OTPModel.create({ phone: req_body.phone, country: req_body.countrycode, otp: otp });
}

let phoneSignIn = async (req_body) => {
    if (helper.undefinedOrNull(req_body)) {
        throw new BadRequestError('Request body comes empty');
    }

    if (helper.undefinedOrNull(req_body.phone)) {
        throw new BadRequestError("phone is required");
    }

    let _customer;
    let otp = Date.now().toString().slice(-6);
    let isAvailable = await UserModel.findOne({ where: { phone: req_body.phone }, attributes: ['id', 'email'], raw: true })
    if (!isAvailable) {
        throw new BadRequestError("User Not Available, Please Signup")
    }
    //

    //send OTP here
    await OTPModel.destroy({ where: { phone: req_body.phone } });
    return await OTPModel.create({ phone: req_body.phone, country: req_body.countrycode, otp: otp });
}



let signout = async (userid) => {
    if (!userid) {
        throw new BadRequestError("Id is required");
    }
    await UserAuthModel
        .destroy({ where: { userid: userid } });
    return true;
}


let phoneSignInVerification = async (req_body) => {
    if (helper.undefinedOrNull(req_body)) {
        throw new BadRequestError('Request body comes empty');
    }


    if (helper.undefinedOrNull(req_body.otp)) {
        throw new BadRequestError("otp is required");
    }
    if (helper.undefinedOrNull(req_body.phone)) {
        throw new BadRequestError("Phone is required");
    }
    let OTPAvailable = await OTPModel.findOne({ where: { phone: req_body.phone, otp: req_body.otp }, raw: true })
    if (!OTPAvailable) {
        throw new BadRequestError("Invalid OTP")
    }
    let userAvailable = await UserModel.findOne({ where: { phone: req_body.phone }, raw: true })
    let authToken = md5(Date.now() + userAvailable.phone);
    let authRecord = {
        userid: userAvailable.id,
        token: authToken
    }
    await UserAuthModel.destroy({ where: { userid: userAvailable.id } });
    await UserAuthModel.create(authRecord);
    return authRecord;
}

let isUserAvailable = async (req_body) => {
    if (helper.undefinedOrNull(req_body)) {
        throw new BadRequestError('Request body comes empty');
    }

    if (helper.undefinedOrNull(req_body.phone)) {
        throw new BadRequestError("Phone is required");
    }

    let userAvailable = await UserModel.findOne({ where: { phone: req_body.phone }, raw: true })
    if (!userAvailable) {
        return false;
    }
    return true;

}
let countryList = async (req_body) => {
    return await CountryModel.findAll({order: [['name', 'ASC']],raw: true})

}

module.exports = {
    countryList: countryList,
    signup: signup,
    resendOTP:resendOTP,
    uploadImages: uploadImages,
    phoneSignIn: phoneSignIn,
    verifyOTP: verifyOTP,
    signout: signout,
    sendOTP: sendOTP,
    phoneSignInVerification: phoneSignInVerification,
    isUserAvailable: isUserAvailable
};

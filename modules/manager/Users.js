'use strict';


let helper = require("../helpers/helpers"),
    md5 = require('md5'),
    SEND_SMS = require("../helpers/send_sms"),
    SEND_EMAIL = require("../helpers/send_email"),
    CountryModel = require("../models/Country"),
    UserModel = require("../models/Users"),
    TermsConditionModel = require("../models/TermsCondition"),
    UserAuthModel = require("../models/Users_auth"),
    config = process.config.global_config,
    s3Helper = require('../helpers/awsS3Helper'),
    fs = require('fs'),
    util = require('util'),
    unlinkFile = util.promisify(fs.unlink),
    BadRequestError = require('../errors/badRequestError');

let sendOtpForRegistration = async (req) => {
    let body = req.body
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }
    ['name', 'email', 'username', 'phone', 'region', 'password', 'gender'].forEach(x => {
        if (!body[x]) {
            throw new BadRequestError(req.t(x) + req.t("is_required"));
        }
    });
    let user = await UserModel
        .findOne({ where: { username: body.username.trim() }, attributes: ['id', 'phone'] });

    if (user) {
        throw new BadRequestError(req.t("user_exist"));
    }
    user = await UserModel
        .findOne({ where: { phone: body.phone.trim() }, attributes: ['id', 'phone'] });

    if (user) {
        throw new BadRequestError(req.t("phone_exist"));
    }
    user = await UserModel
        .findOne({ where: { email: body.email.trim() }, attributes: ['id', 'phone'] });

    if (user) {
        throw new BadRequestError(req.t("email_exist"));
    }
    try {
        let otp = await generateOTP();
        let authRecord = {
            otp: otp
        }
        let country = await CountryModel.findOne({ where: { iso_code_2: body.region }, raw: true })

        await SEND_SMS.sms(otp, "+" + country.isd_code + body.phone);

        return authRecord;
    } catch (error) {
        if (error && error.errors && error.errors[0] && error.errors[0].message && error.errors[0].message.indexOf("unique") != -1) {
            let uniqueText = error.errors[0].path == "email" ? req.t("alternate_login_option_error_email") : req.t("alternate_login_error_option_mobile")
            throw new BadRequestError(uniqueText);
        } else {
            throw new BadRequestError(error);
        };
    }

}
let signup = async (body) => {

    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }
    ['name', 'email', 'phone', 'username', 'region', 'password', 'gender'].forEach(x => {
        if (!body[x]) {
            throw new BadRequestError(req.t(x) + " is required");
        }
    });

    let user = await UserModel
        .findOne({ where: { username: body.username.trim() }, attributes: ['id', 'phone'] });

    if (user) {
        throw new BadRequestError(req.t("user_exist"));
    }
    user = await UserModel
        .findOne({ where: { phone: body.phone.trim() }, attributes: ['id', 'phone'] });

    if (user) {
        throw new BadRequestError(req.t("phone_exist"));
    }
    user = await UserModel
        .findOne({ where: { email: body.email.trim() }, attributes: ['id', 'phone'] });

    if (user) {
        throw new BadRequestError(req.t("email_exist"));
    }

    let createData = {
        name: body.name.trim(),
        email: body.email.trim(),
        phone: body.phone.trim(),
        region: body.region.trim(),
        username: body.username.trim(),
        password: md5(body.password.trim()),
        gender: body.gender,
        latitude: body.latitude,
        longitude: body.longitude,
        notification_token: body.notification_token,
        isVerified: 1,
        isTermsConditionAccepted: body.termscondition,
        user_unique_id: Date.now().toString()

    }

    try {
        let _customer;
        let customer = await UserModel.create(createData);
        _customer = customer.toJSON();
        let authToken = await generateAuthToken(_customer.phone);
        let authRecord = {
            userid: _customer.id,
            token: authToken,
        }
        await UserAuthModel.destroy({ where: { userid: _customer.id } });
        await UserAuthModel.create(authRecord);
        delete authRecord.userid;
        return authRecord;
    } catch (error) {
        if (error && error.errors && error.errors[0] && error.errors[0].message && error.errors[0].message.indexOf("unique") != -1) {
            let uniqueText = error.errors[0].path == "email" ? req.t("alternate_login_option_error_email") : req.t("alternate_login_error_option_mobile")
            throw new BadRequestError(uniqueText);
        } else {
            throw new BadRequestError(error);
        };
    }

}


let resendOTP = async (userid) => {
    if (helper.undefinedOrNull(userid)) {
        throw new BadRequestError(req.t("user_token_404"));
    }
    let user = await UserModel.findOne({ where: { id: userid }, attributes: ['id', 'region', 'phone'], raw: true })
    let authToken = await generateAuthToken(user.phone);
    let otp = await generateOTP();
    let authRecord = {
        userid: user.id,
        token: authToken,
        otp: otp
    }
    await UserAuthModel.destroy({ where: { userid: user.id } });
    await UserAuthModel.create(authRecord);
    let country = await CountryModel.findOne({ where: { iso_code_2: user.region }, raw: true })
    await SEND_SMS.sms(otp, "+" + country.isd_code + user.phone);
    return { token: authToken }
}

let verifyOTP = async (userid, otp) => {


    let userAuth = await UserAuthModel.findOne({ where: { userid: userid, otp: otp }, raw: true, attributes: ['userid', 'token'] });

    if (!userAuth || !userAuth.userid) {
        throw new BadRequestError(req.t("invalid_otp"));
    }
    await UserAuthModel.update({ otp: null }, { where: { userid: userid, otp: otp }, raw: true });
    return { token: userAuth.token };

}



let phoneSignIn = async (body) => {
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }

    if (helper.undefinedOrNull(body.phone)) {
        throw new BadRequestError(req.t("phone")+'/'+req.t("email")+' '+req.t("is_required"));
    }
    if (helper.undefinedOrNull(body.password)) {
        throw new BadRequestError(req.t("password")+' '+req.t("is_required"));
    }

    let findData = {}
    findData["$or"] = [
        { phone: { $eq: body.phone } },
        { email: { $eq: body.phone } },
        { username: { $eq: body.phone } }
    ]
    findData["$and"] = [
        { password: { $eq: md5(body.password) } }
    ]

    let user = await UserModel
        .findOne({ where: findData, attributes: ['id', 'phone'], raw: true });
    if (!user) {
        throw new BadRequestError(req.t("invalid_creds"));
    }
    let authToken = await generateAuthToken(user.phone);
    let authRecord = {
        userid: user.id,
        token: authToken
    }
    await UserAuthModel.destroy({ where: { userid: user.id } });
    await UserAuthModel.create(authRecord);
    return { token: authToken }


}

let phoneSignInWithOTP = async (body) => {
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }

    if (helper.undefinedOrNull(body.phone)) {
        throw new BadRequestError(req.t("phone")+'/'+req.t("email")+' '+req.t("is_required"));
    }
    if (helper.undefinedOrNull(body.region)) {
        throw new BadRequestError(req.t("region")+' '+req.t("is_required"));
    }


    let country = await CountryModel.findOne({ where: { iso_code_2: body.region }, raw: true })

    let user = await UserModel
        .findOne({ where: { phone: body.phone, region: body.region }, attributes: ['id', 'phone'], raw: true });
    if (!user) {
        throw new BadRequestError(req.t("user_404"));
    }

    let authToken = await generateAuthToken(user.phone);
    let otp = await generateOTP();
    let authRecord = {
        userid: user.id,
        token: authToken,
        otp: otp
    }
    await UserAuthModel.destroy({ where: { userid: user.id } });
    await UserAuthModel.create(authRecord);

    await SEND_SMS.sms(otp, "+" + country.isd_code + user.phone);
    return { token: authToken }
}
let forgotPassword = async (body) => {
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }

    if (helper.undefinedOrNull(body.phone)) {
        throw new BadRequestError(req.t("phone")+'/'+req.t("email")+' '+req.t("is_required"));
    }
    // if (helper.undefinedOrNull(body.region)) {
    //     throw new BadRequestError("Region is required");
    // }

    let findData = {}
    findData["$or"] = [
        { phone: { $eq: body.phone } },
        { email: { $eq: body.phone } },
        { username: { $eq: body.phone } }
    ]
    let user = await UserModel
        .findOne({ where: findData, attributes: ['id', 'phone', 'email', 'region'], raw: true });
    if (!user) {
        throw new BadRequestError(req.t("user_404"));
    }
    let country = await CountryModel.findOne({ where: { iso_code_2: user.region }, raw: true })
    let authToken = await generateAuthToken(user.phone);
    let otp = await generateOTP();
    let authRecord = {
        userid: user.id,
        token: authToken,
        otp: otp
    }
    await UserAuthModel.destroy({ where: { userid: user.id } });
    await UserAuthModel.create(authRecord);
    if (user.email) {
        await SEND_EMAIL.SendPasswordResetOTP(user.email, otp);
    }
    if (user.phone) {
        await SEND_SMS.sms(otp, "+" + country.isd_code + user.phone);
    }
    return { token: authToken }
}
let changePassword = async (userid, body) => {
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }

    if (helper.undefinedOrNull(body.password)) {
        throw new BadRequestError(req.t("phone")+'/'+req.t("email")+' '+req.t("is_required"));
    }
    if (helper.undefinedOrNull(body.confirmpassword)) {
        throw new BadRequestError(req.t("region")+' '+req.t("is_required"));
    }
    if (body.password != body.confirmpassword) {
        throw new BadRequestError(req.t("password_not_matched"));
    }


    await UserModel.update({ password: md5(body.password) }, { where: { id: userid }, raw: true });
    return { message: req.t("password")+' '+req.t("changed_success") }
}

let signout = async (userid) => {
    if (!userid) {
        throw new BadRequestError(req.t("id")+' '+req.t("is_required"));
    }
    await UserAuthModel
        .destroy({ where: { userid: userid } });
    return true;
}




let countryList = async () => {
    let Country = await CountryModel.findAll({ order: [['name', 'ASC']], raw: true })
    Country = Country.map((country) => { country.flag = process.env.BASE_URL + process.env.FLAG_PATH + country.iso_code_2.toLowerCase() + ".png"; return country })
    return Country;

}
let generateAuthToken = async (phone) => {
    return md5(Date.now() + phone);
}
let generateOTP = async () => {
    return Date.now().toString().slice(process.env.OTP_LENGTH);
}

let loginWithSocial = async (body) => {
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }
    if (helper.undefinedOrNull(body.social_id)) {
        throw new BadRequestError(req.t("social_id")+' '+req.t("comes_empty"));
    }
    if (helper.undefinedOrNull(body.type)) {
        throw new BadRequestError(req.t("type")+' '+req.t("comes_empty"));
    }
    let findData = {}
    if (body.type == 1) {
        findData = { gmail_id: body.social_id };
    } else if (body.type == 2) {
        findData = { twitter_id: body.social_id };
    } else if (body.type == 3) {
        findData = { facebook_id: body.social_id };
    } else if (body.type == 4) {
        findData = { linkedin_id: body.social_id };
    }

    let user = await UserModel
        .findOne({ where: findData, attributes: ['id', 'phone', 'email', 'region'], raw: true });
    if (!user) {
        findData["user_unique_id"]= Date.now().toString()
        let user = await UserModel.create(findData);
        let authToken = await generateAuthToken(user.phone);
        let authRecord = {
            userid: user.id,
            token: authToken
        }
        await UserAuthModel.destroy({ where: { userid: user.id } });
        await UserAuthModel.create(authRecord);
        return { token: authToken }
    } else {
        let authToken = await generateAuthToken(user.phone);
        let authRecord = {
            userid: user.id,
            token: authToken
        }
        await UserAuthModel.destroy({ where: { userid: user.id } });
        await UserAuthModel.create(authRecord);
        return { token: authToken }
    }

}
let getTermsCondition = async (body) => {
    return await TermsConditionModel.findAll({ order: [['displayorder', 'ASC']], raw: true })
}
let getProfile = async (userid) => {

    let user = await UserModel
        .findOne({ where: { id: userid }, attributes: ['user_unique_id', 'name', 'profileimage', 'username', 'email', 'phone', 'region', 'dob', 'latitude', 'longitude', 'gender', 'isactive', 'notification_token', 'isSound', 'isVibration', 'isNotification', 'isTermsConditionAccepted'] });   

    return user;
}
let updateProfile = async (userid, req) => {

    let body = req.body;
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }
    let updatedData = {}
    let optionalFiled = ['name', 'latitude', 'longitude', 'gender', 'notification_token', 'isSound', 'isVibration', 'isNotification', 'isTermsConditionAccepted'];
    optionalFiled.forEach(x => {
        updatedData[x] = body[x]
    });
    let user = await UserModel
        .findOne({ where: { id: userid }, attributes: ['id','bucketKey'], raw: true });


    if (req.files.profileimage && req.files.profileimage.length > 0) {
        const result = await s3Helper.uploadFile(req.files.profileimage[0])
        await unlinkFile(req.files.profileimage[0].path)
        if(user.bucketKey){
            await s3Helper.deleteFileFromBucket(user.bucketKey)
        }
        updatedData.profileimage = result.Location
        updatedData.bucketKey = result.Key        
   }
    
    

    await UserModel.update(updatedData, { where: { id: userid }, raw: true });
    return { message: req.t("profile")+' '+req.t("update_success") };
}
let updateUsername = async (userid, body) => {
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }
    if (helper.undefinedOrNull(body.username)) {
        throw new BadRequestError(req.t('username')+' '+req.t("is_required"));
    }

    let user = await UserModel
        .findOne({ where: { username: body.username.trim() }, attributes: ['id'], raw: true });
    if (user && user.id != userid) {
        throw new BadRequestError(req.t('user_exist'));
    }
    await UserModel.update({ username: body.username.trim() }, { where: { id: userid }, raw: true });
    return { message: req.t("username")+' '+req.t("update_success") };

}
let updateEmail = async (userid, body) => {

    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }
    if (helper.undefinedOrNull(body.email)) {
        throw new BadRequestError(req.t("email")+' '+req.t("is_required"));
    }

    let user = await UserModel
        .findOne({ where: { email: body.email.trim() }, attributes: ['id'], raw: true });
    if (user && user.id != userid) {
        throw new BadRequestError(req.t("email_exist"));
    }
    if (!body.isVerified) {
        let otp = await generateOTP();
        await SEND_EMAIL.SendUpdateEmailOTP(body.email.trim(), otp);
        return { otp: otp }
    }
    await UserModel.update({ email: body.email.trim() }, { where: { id: userid }, raw: true });
    return { message: req.t("email")+' '+req.t("update_success") };
}
let updatePassword = async (userid, body) => {


    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }
   
    if (helper.undefinedOrNull(body.newpassword)) {
        throw new BadRequestError(req.t("new_password")+' '+req.t("is_required"));
    }
    if (helper.undefinedOrNull(body.confirmpassword)) {
        throw new BadRequestError(req.t("confirm_password")+' '+req.t("is_required"));
    }
    if (body.newpassword != body.confirmpassword) {
        throw new BadRequestError(req.t("new_pass_old_pass_not_match"));
    }    
    await UserModel.update({ password: md5(body.newpassword) }, { where: { id: userid }, raw: true });
    return { message: req.t("password")+' '+req.t("update_success")};
}
let updatePhone = async (userid, body) => {


    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError(req.t("body_empty"));
    }
    if (helper.undefinedOrNull(body.phone)) {
        throw new BadRequestError(req.t("phone")+'/'+req.t("is_required"));
    }
    if (helper.undefinedOrNull(body.region)) {
        throw new BadRequestError(req.t("region")+' '+req.t("is_required"));
    }


    let user = await UserModel
        .findOne({ where: { phone: body.phone.trim(), region: body.region.trim() }, attributes: ['id'], raw: true });
    if (user && user.id != userid) {
        throw new BadRequestError(req.t("phone_exist"));
    }
    if (!body.isVerified) {
        let otp = await generateOTP();
        let country = await CountryModel.findOne({ where: { iso_code_2: body.region }, raw: true })
        await SEND_SMS.sms(otp, "+" + country.isd_code + body.phone);
        return { otp: otp }
    }
    await UserModel.update({ phone: body.phone.trim(), region: body.region.trim() }, { where: { id: userid }, raw: true });
    return { message: req.t("phone")+ +req.t("update_success") };
}


module.exports = {
    countryList: countryList,
    signup: signup,
    sendOtpForRegistration: sendOtpForRegistration,
    resendOTP: resendOTP,
    changePassword: changePassword,
    phoneSignIn: phoneSignIn,
    forgotPassword: forgotPassword,
    phoneSignInWithOTP: phoneSignInWithOTP,
    verifyOTP: verifyOTP,
    signout: signout,
    generateAuthToken: generateAuthToken,
    generateOTP: generateOTP,
    loginWithSocial: loginWithSocial,
    getProfile: getProfile,
    updateProfile: updateProfile,
    updateUsername: updateUsername,
    updateEmail: updateEmail,
    updatePassword: updatePassword,
    updatePhone: updatePhone,
    getTermsCondition: getTermsCondition
};

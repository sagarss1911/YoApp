'use strict';


let helper = require("../helpers/helpers"),
    md5 = require('md5'),
    SEND_SMS = require("../helpers/send_sms"),
    SEND_EMAIL = require("../helpers/send_email"),
    CountryModel = require("../models/Country"),
    UserModel = require("../models/Users"),
    UserAuthModel = require("../models/Users_auth"),
    BadRequestError = require('../errors/badRequestError');

let signup = async (body) => {

    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError('Request body comes empty');
    }
    ['name', 'email', 'phone', 'region', 'password', 'gender'].forEach(x => {
        if (!body[x]) {
            throw new BadRequestError(x + " is required");
        }
    });
    let findData = {}
    findData["$or"] = [
        { phone: { $eq: body.phone } },
        { email: { $eq: body.email } }
    ]
    let user = await UserModel
        .findOne({ where: findData, attributes: ['id', 'phone'] });

    if (user) {
        throw new BadRequestError("User already exit. Please signin");
    }
    let createData = {
        name: body.name,
        email: body.email,
        phone: body.phone,
        region: body.region,
        password: md5(body.password),
        gender: body.gender,

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
        await SEND_SMS.sms(otp, "+" + country.isd_code + _customer.phone);
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


let resendOTP = async (userid) => {
    if (helper.undefinedOrNull(userid)) {
        throw new BadRequestError('User Not Found With Provided Token');
    }
    let user = await UserModel.findOne({ where: { id: userid }, attributes: ['id', 'region', 'phone'], raw: true })
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
    await SEND_SMS.sms(otp, "+" + country.isd_code + user.phone);
    return { token: authToken }
}

let verifyOTP = async (userid, otp) => {


    let userAuth = await UserAuthModel.findOne({ where: { userid: userid, otp: otp }, raw: true, attributes: ['userid', 'token'] });

    if (!userAuth || !userAuth.userid) {
        throw new BadRequestError("Invalid OTP");
    }
    await UserAuthModel.update({ otp: null }, { where: { userid: userid, otp: otp }, raw: true });
    return { token: userAuth.token };

}



let phoneSignIn = async (body) => {
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError('Request body comes empty');
    }

    if (helper.undefinedOrNull(body.phone)) {
        throw new BadRequestError("phone/email is required");
    }
    if (helper.undefinedOrNull(body.password)) {
        throw new BadRequestError("password is required");
    }

    let findData = {}
    findData["$or"] = [
        { phone: { $eq: body.phone } },
        { email: { $eq: body.phone } }
    ]
    findData["$and"] = [
        { password: { $eq: md5(body.password) } }
    ]

    let user = await UserModel
        .findOne({ where: findData, attributes: ['id', 'phone'], raw: true });
    if(!user){
        throw new BadRequestError("Invalid Credentials");
    }    
    let authToken = md5(Date.now() + user.phone);
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
        throw new BadRequestError('Request body comes empty');
    }

    if (helper.undefinedOrNull(body.phone)) {
        throw new BadRequestError("phone/email is required");
    }
    if (helper.undefinedOrNull(body.region)) {
        throw new BadRequestError("Region is required");
    }


    let country = await CountryModel.findOne({ where: { iso_code_2: body.region }, raw: true })

    let user = await UserModel
        .findOne({ where: { phone: body.phone, region: body.region }, attributes: ['id', 'phone'], raw: true });
    if (!user) {
        throw new BadRequestError("User Not Found");
    }

    let authToken = md5(Date.now() + user.phone);
    let otp = Date.now().toString().slice(-6);
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
        throw new BadRequestError('Request body comes empty');
    }

    if (helper.undefinedOrNull(body.phone)) {
        throw new BadRequestError("phone/email is required");
    }
    if (helper.undefinedOrNull(body.region)) {
        throw new BadRequestError("Region is required");
    }


  //  let country = await CountryModel.findOne({ where: { iso_code_2: body.region }, raw: true })
    let findData = {}
    findData["$or"] = [
        { phone: { $eq: body.phone } },
        { email: { $eq: body.phone } }
    ]
    // findData["$and"] = [
    //     { region: { $eq: body.region } }
    // ]
    let user = await UserModel
        .findOne({ where: findData, attributes: ['id', 'phone', 'email'], raw: true });
    if (!user) {
        throw new BadRequestError("User Not Found");
    }

    let authToken = md5(Date.now() + user.phone);
    let otp = Date.now().toString().slice(-6);
    let authRecord = {
        userid: user.id,
        token: authToken,
        otp: otp
    }
    await UserAuthModel.destroy({ where: { userid: user.id } });
    await UserAuthModel.create(authRecord);
    await SEND_EMAIL.SendPasswordReesetOTP(user.email, otp);    
    
    return { token: authToken }
}
let changePassword = async (userid, body) => {
    if (helper.undefinedOrNull(body)) {
        throw new BadRequestError('Request body comes empty');
    }

    if (helper.undefinedOrNull(body.password)) {
        throw new BadRequestError("phone/email is required");
    }
    if (helper.undefinedOrNull(body.confirmpassword)) {
        throw new BadRequestError("Region is required");
    }
    if (body.password != body.confirmpassword) {
        throw new BadRequestError("Password and Confirm Password does not match");
    }


    await UserModel.update({ password: md5(body.password) }, { where: { id: userid }, raw: true });
    return { message: "Password Changed Successfully" }
}

let signout = async (userid) => {
    if (!userid) {
        throw new BadRequestError("Id is required");
    }
    await UserAuthModel
        .destroy({ where: { userid: userid } });
    return true;
}




let countryList = async () => {
    let Country = await CountryModel.findAll({ order: [['name', 'ASC']], raw: true })
    Country = Country.map((country) => {country.flag = process.env.BASE_URL + process.env.FLAG_PATH +  country.iso_code_2.toLowerCase() + ".png"; return country})
    return Country;
    
}

module.exports = {
    countryList: countryList,
    signup: signup,
    resendOTP: resendOTP,
    changePassword: changePassword,
    phoneSignIn: phoneSignIn,
    forgotPassword: forgotPassword,
    phoneSignInWithOTP: phoneSignInWithOTP,
    verifyOTP: verifyOTP,
    signout: signout
};

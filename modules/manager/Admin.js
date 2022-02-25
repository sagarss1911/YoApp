'use strict';


let helper = require("../helpers/helpers"),
    _ = require("lodash"),
    md5 = require('md5'),    
    UserModel = require("../models/Admin"),     
    BadRequestError = require('../errors/badRequestError');
    
    


let Login = async (req_body) => {
    
    if (helper.undefinedOrNull(req_body)) {
        throw new BadRequestError('Request body comes empty');
    }

    if (helper.undefinedOrNull(req_body.email)) {
        throw new BadRequestError("Email is required");
    }
    if (helper.undefinedOrNull(req_body.password)) {
        throw new BadRequestError("password is required");
    }
    let user = await UserModel.findOne({ where: { email: req_body.email,password:md5(req_body.password) }, attributes: ['id','email'] ,raw:true})
    if(!user){
        throw new BadRequestError("no user found");
    }
    let authToken = md5(Date.now() + user.email);
    await UserModel.update({ token: authToken }, { where: { id: user.id }, raw: true });
    return { userId:user.id,accessToken :authToken};

}
let changePassword = async (adminid,req_body) => {
    
    
    if (helper.undefinedOrNull(req_body)) {
        throw new BadRequestError('Request body comes empty');
    }

    if (helper.undefinedOrNull(req_body.new_password)) {
        throw new BadRequestError("New Password is required");
    }
    if (helper.undefinedOrNull(req_body.old_password)) {
        throw new BadRequestError("Old Password is required");
    }
     let user = await UserModel.findOne({ where: { password:md5(req_body.old_password),id:adminid }, attributes: ['id','email'] ,raw:true})
    if(!user){
        throw new BadRequestError("no user found");
    }
    
     await UserModel.update({ password: md5(req_body.new_password) }, { where: { id: user.id }, raw: true });
    return { userId:user.id};

}


let signout = async (adminid, authToken) => {    
    if (!authToken) {
        throw new BadRequestError("authToken is required");
    }
    await UserModel.update({ token:null }, { where: { id: adminid}, raw: true });
    return true;
}


module.exports = {
    Login: Login,
    signout: signout,
    changePassword:changePassword
};

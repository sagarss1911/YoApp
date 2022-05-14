'use  strict'
let 
    BadRequestError = require('../../errors/badRequestError'),
    AdminUserModal = require('../../models/Admin'),
    md5 = require('md5');

let addAdminUser = async (req) => {
    let body = req.body;
   
    if (!body.email) {
        throw new BadRequestError('Email can not empty');
    }
    if (!body.password) {
        throw new BadRequestError('Password can not empty');
    }
    if (!body.modules.length) {
        throw new BadRequestError('modules can not empty');
    }
    let adminUser = await AdminUserModal.findOne({ where: {email:body.email.trim()}, raw: true });
    if(adminUser){
        throw new BadRequestError('Email already exist');
    }
    let adminUserData = {
        email:body.email.trim(),
        password:md5(body.password),
        modules:JSON.stringify(body.modules)
    }
    return  AdminUserModal.create(adminUserData);
  
}

let getAllUserList = async (body) => {
    let limit = (body.limit) ? parseInt(body.limit) : 10;
    let page = body.page || 1;
    let offset = (page - 1) * limit;
    let findData = {}
    
    if (body.filters) {
        if (body.filters.searchtext) {
            findData["$or"] = [
                { email: { $like: '%' + body.filters.searchtext + '%' } },
                { modules: { $like: '%' + body.filters.searchtext + '%' } },
            ]
            findData["$and"] = [
                { type: 2}
            ]
        }
    }else{
        findData = { type: 2}
    }
    let allUser = await AdminUserModal.findAll({
        where: findData,
        limit,
        offset,
        order: [['id', 'DESC']],
        raw: true
    });
    let allUserCount = await AdminUserModal.count({
        where:{type:2},
        order: [['id', 'DESC']],
        raw: true
    });
    let _result = { total_count: 0 };
    _result.slides = allUser;
    _result.total_count = allUserCount;
    return _result;

}
let updateStatus = async (req,id) => {    
    if(!id){
        throw new BadRequestError('Invalid User');
    }
    let adminUser = await AdminUserModal.findOne({ where: {id:id}, raw: true });
    if(!adminUser){
        throw new BadRequestError('Invalid User');
    }
    let updateData = {
        isEnabled:!adminUser.isEnabled
    }
    return  AdminUserModal.update(updateData,{where:{id:id}});

}
let updateUser = async (req,id) => {    
    let body = req.body;
   
    if(!id){
        throw new BadRequestError('Invalid User');
    }
    let adminUser = await AdminUserModal.findOne({ where: {id:id}, raw: true });
    if(!adminUser){
        throw new BadRequestError('Invalid User');
    }

    if (!body.modules.length) {
        throw new BadRequestError('modules can not empty');
    }

    let adminUserData = {        
        modules:JSON.stringify(body.modules)
    }
    if(body.resetpassword){
        adminUserData.password = md5(body.password)
    }
    
    return  AdminUserModal.update(adminUserData,{where:{id:id}});

}

module.exports = {
    addAdminUser: addAdminUser,
    getAllUserList:getAllUserList,
    updateStatus:updateStatus,
    updateUser:updateUser
}
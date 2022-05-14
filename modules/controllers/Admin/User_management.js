'use strict'

let permissionManager = require('../../manager/Admin/User_management');


let addAdminUser = (req, res, next) => {
    return permissionManager
        .addAdminUser(req)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}
let getAllUserList = (req, res, next) => {
    return permissionManager
        .getAllUserList(req)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}
let updateStatus = (req, res, next) => {
    let id = req.params.slider_id;
    return permissionManager
        .updateStatus(req,id)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}
let updateUser = (req, res, next) => {
    let id = req.params.slider_id;
    return permissionManager
        .updateUser(req,id)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}

module.exports = {
    
    addAdminUser: addAdminUser,
     getAllUserList: getAllUserList,
     updateStatus: updateStatus,
     updateUser:updateUser
}
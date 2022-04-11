'use strict'

let permissionManager = require('../../manager/Admin/Permission_url');

let getAllPermissionUrls = (req, res, next) => {

    return permissionManager
        .getAllPermissionUrls()
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}
let addPermission = (req, res, next) => {
    return permissionManager
        .addPermission(req)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}
let getAllPermissionList = (req, res, next) => {
    return permissionManager
        .getAllPermissionList(req)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}
let updatePermission = (req, res, next) => {
    return permissionManager
        .updatePermission(req)
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
    getAllPermissionUrls: getAllPermissionUrls,
    addPermission: addPermission,
    getAllPermissionList: getAllPermissionList,
    updatePermission: updatePermission
}
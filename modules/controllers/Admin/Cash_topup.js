'use strict'

let cashPickupManger = require('../../manager/Admin/Cash_topup')

let getAllUsers = (req, res, next) => {
    return cashPickupManger
        .getAllUsers(req.body)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result)
        })
        .catch(next);
}
let addBalanceToUserWallet = (req, res, next) => {
    let adminId = req.admin ? req.admin.adminid : null;
    return cashPickupManger
        .addBalanceToUserWallet(req.body,adminId)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result)
        })
        .catch(next);
}
let getAllCashTopup = (req, res, next) => {
    let adminId = req.admin ? req.admin.adminid : null;
    return cashPickupManger
        .getAllCashTopup(req.body,adminId)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result)
        })
        .catch(next);
}
let exportAllCashTopup = (req, res, next) => {
    let adminId = req.admin ? req.admin.adminid : null;
    return cashPickupManger
        .exportAllCashTopup(req.body,adminId)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result)
        })
        .catch(next);
}


module.exports = {
    getAllUsers: getAllUsers,
    addBalanceToUserWallet:addBalanceToUserWallet,
    getAllCashTopup:getAllCashTopup,
    exportAllCashTopup:exportAllCashTopup


}
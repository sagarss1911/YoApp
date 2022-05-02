'use strict'

let bankManger = require('../../manager/Admin/Bank_transfer_merchant')

let getAllBankDetails = (req, res, next) => {
    return bankManger
        .getAllBankDetails(req.body)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result)
        })
        .catch(next);
}

let exportAllBankRequest = (req, res, next) => {
    return bankManger
        .exportAllBankRequest(req.body)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}

let updateBankRequestStatus = (req, res, next) => {
    return bankManger
        .updateBankRequestStatus(req)
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
    getAllBankDetails: getAllBankDetails,
    exportAllBankRequest:exportAllBankRequest,
    updateBankRequestStatus:updateBankRequestStatus

}
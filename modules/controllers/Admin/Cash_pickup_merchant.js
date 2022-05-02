'use strict'

let cashPickupManger = require('../../manager/Admin/Cash_pickup_merchant')

let getAllCashPickupDetails = (req, res, next) => {
    return cashPickupManger
        .getAllCashPickupDetails(req.body)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result)
        })
        .catch(next);
}

let exportAllCashPickupRequest = (req, res, next) => {
    return cashPickupManger
        .exportAllCashPickupRequest(req.body)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}
let getAllMerchants = (req, res, next) => {
    return cashPickupManger
        .getAllMerchants(req.body)
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
    getAllCashPickupDetails: getAllCashPickupDetails,
    exportAllCashPickupRequest:exportAllCashPickupRequest,
    getAllMerchants:getAllMerchants

}
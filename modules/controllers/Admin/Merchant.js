'use strict'

let merchantManager = require('../../manager/Admin/Merchant')

let getAllMerchant = (req, res, next) => {
    return merchantManager
        .getAllMerchant(req.body)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result)
        })
        .catch(next);
}

let exportAllMerchant = (req, res, next) => {
    return merchantManager
        .exportAllMerchant(req.body)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}

let resetMerchantImages = (req, res, next) => {
    return merchantManager
        .resetMerchantImages(req)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}
let acceptMerchantImageRequest = (req, res, next) => {
    return merchantManager
        .acceptMerchantImageRequest(req)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}

let updateMerchantStatus = (req, res, next) => {
    return merchantManager
        .updateMerchantStatus(req)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}
let merchantUpdate = (req, res, next) => {
    return merchantManager
        .merchantUpdate(req)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}
let merchantDuePaymentUpdate = (req, res, next) => {
    return merchantManager
        .merchantDuePaymentUpdate(req)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}

let getTopUpMerchantHistory = (req, res, next) => {
    return merchantManager
        .getTopUpMerchantHistory(req)
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
    getAllMerchant: getAllMerchant,
    exportAllMerchant:exportAllMerchant,
    updateMerchantStatus:updateMerchantStatus,
    resetMerchantImages:resetMerchantImages,
    acceptMerchantImageRequest:acceptMerchantImageRequest,
    merchantUpdate:merchantUpdate,
    merchantDuePaymentUpdate:merchantDuePaymentUpdate,
    getTopUpMerchantHistory:getTopUpMerchantHistory
}
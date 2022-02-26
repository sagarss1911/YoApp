'use strict'

let bankManger = require('../../manager/Admin/Bank_transfer')

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


module.exports = {
    getAllBankDetails: getAllBankDetails

}
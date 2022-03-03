'use strict'

let DashboardManger = require('../../manager/Admin/Dashboard')

let getBankTransferReporting = (req, res, next) => {
    return DashboardManger
        .getBankTransferReporting(req.body)
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
    getBankTransferReporting: getBankTransferReporting

}
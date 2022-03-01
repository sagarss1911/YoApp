 'use strict';

 let categoryManager = require('../../manager/Admin/Support_request');
 

let getAllSupportRequest = (req, res, next) => {
    return categoryManager
        .getAllSupportRequest(req.body)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}
let exportAllSupportRequest = (req, res, next) => {
    return categoryManager
        .exportAllSupportRequest(req.body)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}

let updateSupportRequestStatus = (req, res, next) => {
    return categoryManager
        .updateSupportRequest(req)
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
    getAllSupportRequest : getAllSupportRequest,
    updateSupportRequestStatus : updateSupportRequestStatus,
    exportAllSupportRequest:exportAllSupportRequest
 }
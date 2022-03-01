 'use strict';

 let categoryManager = require('../../manager/Admin/Support_category');
 
 let addSupportCategory = (req, res, next) => {
    return categoryManager
        .addSupportCategory(req)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}

let getAllSupportCategory = (req, res, next) => {
    return categoryManager
        .getAllSupportCategory(req.body)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}
let updateSupportCategory = (req, res, next) => {
    return categoryManager
        .updateSupportCategory(req)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}
let deleteSupportCategory = (req, res, next) => {
    return categoryManager
        .deleteSupportCategory(req.params.slider_id)
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
    addSupportCategory:addSupportCategory,
    getAllSupportCategory:getAllSupportCategory,
    updateSupportCategory:updateSupportCategory,
    deleteSupportCategory:deleteSupportCategory
 };
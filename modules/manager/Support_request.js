'use strict';


let BadRequestError = require('../errors/badRequestError'),
    RequestModal = require('../models/Support_request');

    let addSupportRequest = async (userid,req) => {
        let body = req.body
        if (!body.categoryId) {
            throw new BadRequestError('Category can not empty');
        }
        if (!body.text) {
            throw new BadRequestError('Text can not empty');
        }
        let requestData = {
            categoryId: body.categoryId,
            text: body.text,
            userId : userid
        }
        console.log(requestData)
        await RequestModal.create(requestData);
        return true;
    
    }
module.exports = {
    addSupportRequest : addSupportRequest
};

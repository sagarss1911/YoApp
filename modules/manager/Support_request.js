'use strict';


let BadRequestError = require('../errors/badRequestError'),
    RequestModal = require('../models/Support_request');

    let addSupportRequest = async (userid,req) => {
        let body = req.body
        if (!body.supportCategoryId) {
            throw new BadRequestError('Category can not empty');
        }
        if (!body.text) {
            throw new BadRequestError('Text can not empty');
        }
        let requestData = {
            supportCategoryId: body.supportCategoryId,
            text: body.text,
            userId : userid
        }        
        await RequestModal.create(requestData);
        return true;
    
    }
module.exports = {
    addSupportRequest : addSupportRequest
};

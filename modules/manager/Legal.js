'use strict';

let BadRequestError = require('../errors/badRequestError'),
    ContentPageModal = require('../models/content_page');

let addLegal = async (req_body) => {
    await ContentPageModal.update({ option_value: req_body.option_value }, { where: { option_key: req_body.content }, raw: true });
    return true;
}
let updateMerchantLimit = async (req_body) => {
    await ContentPageModal.update({ option_value: req_body.merchant_cashpickup }, { where: { option_key: "merchant_cashpickup" }, raw: true });
    await ContentPageModal.update({ option_value: req_body.merchant_cashtopup }, { where: { option_key: "merchant_cashtopup" }, raw: true });
    return true;
}

let getLegal = async (req_body) => {

    return ContentPageModal.findOne({
        where: { option_key: req_body.content },
        order: [['id', 'DESC']],
        attributes: ['option_key', 'option_value'],
        raw: true
    });
}
let getMerchantLimit = async (req_body) => {
    let merchant_cashpickup = await ContentPageModal.findOne({
        where: { option_key: 'merchant_cashpickup' },
        order: [['id', 'DESC']],
        attributes: ['option_value'],
        raw: true
    });    
    let merchant_cashtopup = await ContentPageModal.findOne({
        where: { option_key: 'merchant_cashtopup' },
        order: [['id', 'DESC']],
        attributes: ['option_value'],
        raw: true
    });  
    return {merchant_cashpickup:Number(merchant_cashpickup.option_value),merchant_cashtopup:Number(merchant_cashtopup.option_value)}
}

let getLegalDataForAPP = async (req_body) => {

    let Legal = await ContentPageModal.findOne({
        where: { option_key: 'legal' },
        order: [['id', 'DESC']],
        attributes: ['option_value'],
        raw: true
    });
    return Legal.option_value
}

module.exports = {
    addLegal,
    getLegal,
    getMerchantLimit,
    updateMerchantLimit,
    getLegalDataForAPP
};
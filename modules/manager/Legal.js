'use strict';

let BadRequestError = require('../errors/badRequestError'),
    ContentPageModal = require('../models/content_page');

let addLegal = async (req_body) => {
    await ContentPageModal.update({ option_value: req_body.option_value }, { where: { option_key: req_body.content }, raw: true });
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

module.exports = {
    addLegal,
    getLegal
};
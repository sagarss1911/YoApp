'use strict';

let BadRequestError = require('../errors/badRequestError'),
    FaqsModal = require('../models/faqs');

let addFaqs = async (req) => {
    let body = req.body;
    if (!body.question) {
        throw new BadRequestError('question can not empty');
    }
    if (!body.answer) {
        throw new BadRequestError('Answer can not empty');
    }
    let sliderData = {
        question: body.question,
        answer: body.answer,
    }
    return await FaqsModal.create(sliderData);
    
}

let getAllFaqs = async (body) => {
    let limit = (body.limit) ? parseInt(body.limit) : 10;
    let page = body.page || 1;
    let offset = (page - 1) * limit;
    let allCategory = await FaqsModal.findAll({
        limit,
        offset,
        order: [['id', 'DESC']],
        raw: true
    });

    let allCategoryCount = await FaqsModal.count({        
        order: [['id', 'DESC']],
        raw: true
    });
    let _result = { total_count: 0 };
    _result.slides = allCategory;
    _result.total_count = allCategoryCount;
    return _result;

}

let updateFaqs = async (req) => {
    let body = req.body.body ? JSON.parse(req.body.body) : req.body;
    if (!body.question) {
        throw new BadRequestError('question can not empty');
    }
    if (!body.answer) {
        throw new BadRequestError('Answer can not empty');
    }
    let updateData = {};
    let optionalFiled = ["question", "answer", "seotitle", "seodescription", "seokeyword"];
    optionalFiled.forEach(x => {
        if (body[x]) {
            updateData[x] = body[x];
        }
    });
    await FaqsModal.update(updateData, { where: { id: req.params.slider_id }, raw: true });
    let faqsAdded = await FaqsModal.findOne({where:{id: req.params.slider_id},raw:true});
     

    return faqsAdded;
}
let deleteFaqs = async (id) => {
    return  FaqsModal.destroy({ where: { id: id } });
    
}

module.exports = {
    addFaqs,
    getAllFaqs,
    updateFaqs,
    deleteFaqs,    

};
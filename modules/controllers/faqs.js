'use strict';

let faqsManager = require('../manager/faqs');

let addFaqs = (req, res, next) => {

    return faqsManager
        .addFaqs(req)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}

let getAllFaqs = (req, res, next) => {
    return faqsManager
        .getAllFaqs(req.body)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}

let updateFaqs = (req, res, next) => {
    return faqsManager
        .updateFaqs(req)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}
let deleteFaqs = (req, res, next) => {
    return faqsManager
        .deleteFaqs(req.params.slider_id)
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
    addFaqs,
    getAllFaqs,
    updateFaqs,
    deleteFaqs,
    
}
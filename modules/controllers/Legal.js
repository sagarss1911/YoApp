'use strict';

let termConditionManager = require('../manager/Legal');

let addLegal = (req, res, next) => {
    return termConditionManager
        .addLegal(req.body)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
}

let getLegal = (req, res, next) => {
    return termConditionManager
        .getLegal(req.body)
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
    addLegal,
    getLegal
}
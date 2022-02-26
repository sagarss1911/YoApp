'use strict';


let BadRequestError = require('../errors/badRequestError'),
    CategoryModal = require('../models/Support_category');

    let getAllSupportCategory = async (body) => {

        let allCategory = await CategoryModal.findAll({
            order: [['id', 'DESC']],
            raw: true
        });

        let allCategoryCount = await CategoryModal.count({        
            order: [['id', 'DESC']],
            raw: true
        });
        let _result = { total_count: 0 };
        _result.category = allCategory;
        _result.total_count = allCategoryCount;
        return _result;
    
    }
module.exports = {
    getAllSupportCategory : getAllSupportCategory
};

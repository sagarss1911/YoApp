'use strict';


let BadRequestError = require('../../errors/badRequestError'),
    CategoryModal = require('../../models/Admin/Support_category');
    const Sequelize = require('sequelize')
    const Op = Sequelize.Op;

    //create
    let addSupportCategory = async (req) => {
        let body = req.body;
    if (!body.title) {
        throw new BadRequestError('title can not empty');
    }
    let sliderData = {
        title: body.title,
    }
    return await CategoryModal.create(sliderData);
    }

    //get all support category
    let getAllSupportCategory =async(body)=>{
        let limit = (body.limit) ? parseInt(body.limit) : 10;
        let page = body.page || 1;
        let offset = (page - 1) * limit;
        let findData = {}
        if (body.filters) {
            if (body.filters.searchtext) {
					findData["$or"] = [
						{title: {$like: '%' + body.filters.searchtext + '%'}},
					]
            }
        }
        let allCategory = await CategoryModal.findAll({
            where: findData,
            limit,
            offset,
            order: [['id', 'DESC']],
            raw: true
        });

        let allCategoryCount = await CategoryModal.count({        
            where: findData,
            order: [['id', 'DESC']],
            raw: true
        });
        let _result = { total_count: 0 };
        _result.slides = allCategory;
        _result.total_count = allCategoryCount;
        return _result;
        
    }

   //update
    let updateSupportCategory = async(req)=>{
        let body = req.body.body ? JSON.parse(req.body.body) : req.body;

        if (!body.title) {
            throw new BadRequestError('title can not empty');
        }
        let updateData = {};
        let optionalFiled = ["title"];
        optionalFiled.forEach(x => {
            if (body[x]) {
                updateData[x] = body[x];
            }
        });
        await CategoryModal.update(updateData, { where: { id: req.params.slider_id }, raw: true });
        let  categoryadded = await CategoryModal.findOne({where:{id: req.params.slider_id},raw:true});
        return categoryadded
    }

//delete
    let deleteSupportCategory = async(id)=>{
        return  CategoryModal.destroy({ where: { id: id } });
    }
    
module.exports = {
    addSupportCategory : addSupportCategory,
    getAllSupportCategory:getAllSupportCategory,
    updateSupportCategory:updateSupportCategory,
    deleteSupportCategory:deleteSupportCategory
};

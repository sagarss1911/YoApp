'use strict';


let BadRequestError = require('../../errors/badRequestError'),
    RequestModal = require('../../models/Admin/Support_request'),
    CategoryModel = require('../../models/Admin/Support_category'),
    Sequelize = require('sequelize'),
    Op = Sequelize.Op;


    //get all support category
    let getAllSupportRequest =async(body)=>{
        let limit = (body.limit) ? parseInt(body.limit) : 10;
        let page = body.page || 1;
        let offset = (page - 1) * limit;
        let findData = {};
        if (body.filters) {
            if (body.filters.searchtext) {
					findData["$or"] = [
						{text: {$like: '%' + body.filters.searchtext + '%'}},
					]
            }
        }
        console.log("findData", findData)
        let allRequest = await RequestModal.findAll({
            where: findData,
            limit,
            offset,
            order: [['id', 'DESC']],
            raw: true
        });

        let allRequestCount = await RequestModal.count({        
            where: findData,
            order: [['id', 'DESC']],
            raw: true
        });
        let _result = { total_count: 0 };
        _result.slides = allRequest;
        _result.total_count = allRequestCount;
        return _result;
        
    }

   //update
    let updateSupportRequest = async(req)=>{
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
        await RequestModal.update(updateData, { where: { id: req.params.slider_id }, raw: true });
        let  requestadded = await RequestModal.findOne({where:{id: req.params.slider_id},raw:true});
        return requestadded
    }

//delete
    let deleteSupportRequest = async(id)=>{
        return  RequestModal.destroy({ where: { id: id } });
    }
    
module.exports = {
    getAllSupportRequest:getAllSupportRequest,
    updateSupportRequest:updateSupportRequest,
    deleteSupportRequest:deleteSupportRequest
};
	
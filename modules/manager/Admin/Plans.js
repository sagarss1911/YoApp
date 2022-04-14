'use  strict'



let BadRequestError = require('../../errors/badRequestError'),
    PlanModel = require('../../models/Admin/Plans'),
    CustomQueryModel = require("../../models/Custom_query"),
    s3Helper = require('../../helpers/awsS3Helper'),
    fs = require('fs'),
    util = require('util'),    
    unlinkFile = util.promisify(fs.unlink),    
    SequelizeObj = require("sequelize");


let getAllPlans = async (body) => {
    let limit = (body.limit) ? parseInt(body.limit) : 10;
    let page = body.page || 1;
    let offset = (page - 1) * limit;
    let findData = {}
    if (body.filters) {
        if (body.filters.searchtext) {
            findData["$or"] = [
                { planname: { $like: '%' + body.filters.searchtext + '%' } },
                { cash_pickup_limit: { $like: '%' + body.filters.searchtext + '%' } },
                { cash_topup_limit: { $like: '%' + body.filters.searchtext + '%' } },
            ]
        }
    }
  
    let PlanData = await PlanModel.findAll({ where: findData, raw: true, limit, offset, order: [['id', 'DESC']] });
    let PlanDataCount = await PlanModel.count({ where: findData, raw: true, order: [['id', 'DESC']] });
    let _result = { total_count: 0 };
    _result.slides = PlanData;
    _result.total_count = PlanDataCount;
    return _result;
}


let addPlan = async (req) => {
    let body = req.body.body ? JSON.parse(req.body.body) : req.body;
    if (!body.planname) {
        throw new BadRequestError('planname is required');
    }
    if (!body.cash_pickup_limit) {
        throw new BadRequestError('cash_pickup_limit is required');

    }
    if (!body.cash_topup_limit) {
        throw new BadRequestError('cash_topup_limit is required');
    }

    let addedData = {
        planname: body.planname,
        cash_pickup_limit: body.cash_pickup_limit,
        cash_topup_limit: body.cash_topup_limit,
    }
    if (req.files.plan_image && req.files.plan_image.length > 0) {
        const result = await s3Helper.uploadFile(req.files.plan_image[0])
        addedData.image = result.Location
        addedData.bucketKey = result.Key
        await unlinkFile(req.files.plan_image[0].path)
    }
    return PlanModel.create(addedData)
}
let updatePlan = async (req,plan_id) => {
    let body = req.body.body ? JSON.parse(req.body.body) : req.body;
    if (!body.planname) {
        throw new BadRequestError('planname is required');
    }
    if (!body.cash_pickup_limit) {
        throw new BadRequestError('cash_pickup_limit is required');

    }
    if (!body.cash_topup_limit) {
        throw new BadRequestError('cash_topup_limit is required');
    }
    let ExistingData = PlanModel.findOne({ where: { id: plan_id }, raw: true });
    if(!ExistingData){
        throw new BadRequestError('Plan not found');
    }

    let addedData = {
        planname: body.planname,
        cash_pickup_limit: body.cash_pickup_limit,
        cash_topup_limit: body.cash_topup_limit,
    }
    if (req.files.plan_image && req.files.plan_image.length > 0) {
        const result = await s3Helper.uploadFile(req.files.plan_image[0])
        addedData.image = result.Location
        addedData.bucketKey = result.Key
        await unlinkFile(req.files.plan_image[0].path)
        if (ExistingData.bucketKey) {
            await s3Helper.deleteFileFromBucket(ExistingData.bucketKey)
        }
    }
    await PlanModel.update(addedData, { where: { id: plan_id } })
    return PlanModel.findOne({ where: { id: plan_id }, raw: true });
}

let updatePlanStatus = async (req,plan_id) => {
    
    if (!plan_id) {
        throw new BadRequestError('plan_id is required');
    }
    
        await PlanModel.update({isDefault:0},{where:{isDefault:1}})
        await PlanModel.update({isDefault:1},{where:{id:plan_id}})
        return true
    

    
    
}
let getAllPlansForDropdown = async () => {
    return PlanModel.findAll({ raw: true });
    

    
    
}

module.exports = {
    getAllPlans: getAllPlans,
    addPlan: addPlan,
    updatePlan: updatePlan,
    updatePlanStatus: updatePlanStatus,
    getAllPlansForDropdown:getAllPlansForDropdown

}
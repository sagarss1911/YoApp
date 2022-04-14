'use strict';

let PlanManager = require('../../manager/Admin/Plans');

let getAllPlans = (req, res, next) => {
   return PlanManager
       .getAllPlans(req.body)
       .then(data => {
           let result = {
               status: 200,
               data: data
           }
           return res.json(result);
       })
       .catch(next);
}
let exportAllPlans = (req, res, next) => {
    return PlanManager
        .exportAllPlans(req)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
 }
 let addPlan = (req, res, next) => {
    return PlanManager
        .addPlan(req)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
 }
 let updatePlan = (req, res, next) => {
    return PlanManager
        .updatePlan(req,req.params.plan_id)
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
 }
 let getAllPlansForDropdown = (req, res, next) => {
    return PlanManager
        .getAllPlansForDropdown()
        .then(data => {
            let result = {
                status: 200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
 }
 
 let updatePlanStatus = (req, res, next) => {
    return PlanManager
        .updatePlanStatus(req,req.params.plan_id)
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
    getAllPlans:getAllPlans,    
    addPlan:addPlan,
    updatePlan:updatePlan,
    updatePlanStatus:updatePlanStatus,
    getAllPlansForDropdown:getAllPlansForDropdown
};
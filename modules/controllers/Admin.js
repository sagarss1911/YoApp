

 let adminManager = require('../manager/Admin');

 let Login = (req, res, next) => {
     return adminManager
         .Login(req.body)
         .then(data => {
             let result = {
                 status:200,
                 data: data
             }
             return res.json(result);
         })
         .catch(next);
 } 
 let changePassword = (req, res, next) => {
    let adminid = req.admin ? req.admin.adminid : null;
    return adminManager
        .changePassword(adminid,req.body)
        .then(data => {
            let result = {
                status:200,
                data: data
            }
            return res.json(result);
        })
        .catch(next);
} 
 
 let signout = (req,res,next) => {
     let adminid = req.admin ? req.admin.adminid : null;
     let authToken = req.get('x-auth-token');
 
     return adminManager
         .signout(adminid,authToken)
         .then(data => {
             let result = {
                 status:200
             }
             return res.json(result);
         })
         .catch(next);
 }
 

 
 
 
 module.exports = {
    Login           : Login,  
    changePassword:changePassword, 
     signout          : signout
 };
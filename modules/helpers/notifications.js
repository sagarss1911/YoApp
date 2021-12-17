let UserModel = require("../models/Users"),      
    SEND_PUSH = require('./send_push');
  

let sendFriendRequestNotificationToUser = async (userid, notificationData) => {
    
     let customerSetting = await UserModel.findOne({where:{id: userid},raw:true,attributes: ['device_id','isNotification']});
     let message =  notificationData.subtitle;    

    if(customerSetting && customerSetting.isNotification) {        
        let nr = await SEND_PUSH.notifyAndroidOrIOS(customerSetting.device_id, message, notificationData);
    }
    return true;
}
module.exports = {
    sendFriendRequestNotificationToUser: sendFriendRequestNotificationToUser,
}
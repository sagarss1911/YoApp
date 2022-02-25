let UserModel = require("../models/Users"),      
    SEND_PUSH = require('./send_push');
  

let sendFriendRequestNotificationToUser = async (userid, notificationData) => {
  
    
     let customerSetting = await UserModel.findOne({where:{id: userid},raw:true,attributes: ['notification_token','isNotification']});
   
     let message =  notificationData.subtitle;   
    
    if(customerSetting && customerSetting.isNotification) {        
        await SEND_PUSH.notifyAndroidOrIOS(customerSetting.notification_token, message, notificationData);
       
    }
    return true;
}
module.exports = {
    sendFriendRequestNotificationToUser: sendFriendRequestNotificationToUser,
}
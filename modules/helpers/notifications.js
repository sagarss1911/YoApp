let UserModel = require("../models/Users"),      
    SEND_PUSH = require('./send_push');
  

let sendFriendRequestNotificationToUser = async (userid, notificationData) => {
    console.log(userid);
    console.log(notificationData);
    
     let customerSetting = await UserModel.findOne({where:{id: userid},raw:true,attributes: ['notification_token','isNotification']});
     console.log(customerSetting)
     let message =  notificationData.subtitle;   
    
    if(customerSetting && customerSetting.isNotification) {        
        let nr = await SEND_PUSH.notifyAndroidOrIOS(customerSetting.notification_token, message, notificationData);
       
    }
    return true;
}
module.exports = {
    sendFriendRequestNotificationToUser: sendFriendRequestNotificationToUser,
}
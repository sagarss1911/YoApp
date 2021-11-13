let KiranaModel = require("../models/Kirana"),  
    NotificationModel = require("../models/Notification"),
    serverInitiatedSocket = require('../socket/server_initiated_socket'),    
    SEND_PUSH = require('./send_push');
  

let sendMessageOfOrderStatusChangeToCustomer = async (customerId, notificationData) => {
    
     let customerSetting = await KiranaModel.findOne({where:{id: customerId},raw:true,attributes: ['device_id','notification']});
     let message =  notificationData.subtitle;    

    if(customerSetting && customerSetting.notification) {
        let notificationData1 = {
            title: notificationData.title,
            subtitle: notificationData.subtitle,
            applicationid: notificationData.redirectscreen,
            orderid: notificationData.orderid,
            alreadyread: 0,            
            userid: customerId
        }
        await NotificationModel.create(notificationData1);
        let nr = await SEND_PUSH.notifyAndroidOrIOS(customerSetting.device_id, message, notificationData1);
    }
    return true;
}

let sendNewOrderNotificationToMerchant = async (merchantIds, notificationData) => {
    console.log("merchantIds")
    console.log(merchantIds)
    let allDeviceIds = await KiranaModel.findAll({ where: { id: { $in: merchantIds } }, raw: true, attributes: ['device_id'] })    
        for(var x in allDeviceIds) {
            let device = allDeviceIds[x];
            let nr = await SEND_PUSH.notifyAndroidOrIOS(device.device_id, notificationData.title, notificationData);
            console.log(nr)
        }
        for(var x in merchantIds) {
            serverInitiatedSocket.sendUserNewNotificationCount({user_id:merchantIds[x],notificationData:notificationData});
        }
        return true;
};
let sendMessageOfOrderStatusChangeToMerchant = async (merchantId, notificationData) => {
    
    // let merchantSetting = await MerchantMenuSettingsModel.findOne({where:{merchant_id: merchantId},raw:true,attributes: ['enable_order_updates_push_notifications','enable_order_updates_sms_notifications']});

    // let message = "";
    // if(notificationData.status == "NEW") {
    //     message = "You have received an "+notificationData.shipping_type+" order from "+notificationData.customer_name;
    // }
    // if(merchantSetting && merchantSetting.enable_order_updates_push_notifications) {
    //     let registerDevicesList = await RegisterDevicesModel.findAll({where:{merchant_id: merchantId},raw:true,attributes:['device_type','device_uid']});

    //     for(var x in registerDevicesList) {
    //         let device = registerDevicesList[x];
    //         let nr = await SEND_PUSH.notifyAndroidOrIOS(device.device_uid, message, notificationData);
    //     }
    // }

    // console.log(message,notificationData);
    // if(merchantSetting && merchantSetting.enable_order_updates_sms_notifications) {
    //     let merchant = await MerchantsModel.findOne({where:{id: merchantId},raw:true,attributes:['phone']});

    // }
    // return true;
}

module.exports = {
  sendMessageOfOrderStatusChangeToCustomer: sendMessageOfOrderStatusChangeToCustomer,
  sendMessageOfOrderStatusChangeToMerchant: sendMessageOfOrderStatusChangeToMerchant,
  sendNewOrderNotificationToMerchant:sendNewOrderNotificationToMerchant
}
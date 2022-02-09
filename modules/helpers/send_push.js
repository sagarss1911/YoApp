// let FCM = require('fcm-node');
// var serverKey = require('../../fcmkey.json');
const admin = require("firebase-admin");
const serviceAccount = require("../../fcmkey.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)    
});
let notifyAndroidOrIOS =  async (device, sentmessage, info_data) => {
	 
    // var fcm = new FCM(serverKey);
    info_data.body = sentmessage;
    info_data.title = (info_data && info_data.title) ? info_data.title :"Alcophony";
    info_data['content-available'] = 1;
    info_data['sound'] = 'default';

    for(var x in info_data) { info_data[x] = info_data[x].toString(); }
    
    var message = {       
        notification: {
            title: info_data.title, 
            body: info_data.body  
        },        
        data: info_data
        
    };
 

    try {

        const { failureCount, successCount } = await admin.messaging().sendToDevice(device, message, { priority: 'high' });
    
        console.log(`Successfully sent the notification to ${successCount} devices (${failureCount} failed).`);    
    
    } catch (err) {
        console.log(err)
        console.log('An error occurred while connecting to Firebase');
    
    }
    // await fcm.send(message, function(err, response){
    //     if (err) {            
    //         console.log("Notification Error:",err)
            
    //     } else {
    //         console.log("Successfully sent with response: ", response);
    //     }
    // });

};

module.exports = {
    notifyAndroidOrIOS: notifyAndroidOrIOS
}
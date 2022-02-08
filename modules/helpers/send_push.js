var fcm = require('fcm-notification');
var FCM = new fcm('fcmkey.json');
let notifyAndroidOrIOS =  async (device, sentmessage, info_data) => {	
    info_data.body = sentmessage;
    info_data.title = (info_data && info_data.title) ? info_data.title :"Alcophony";
    info_data['content-available'] = 1;
    info_data['sound'] = 'default';

    for(var x in info_data) { info_data[x] = info_data[x].toString(); }
    
    var message = { 
        token : device,        
        notification: {
            title: info_data.title, 
            body: info_data.body  
        },        
        data: info_data
    };
    
    FCM.send(message, function(err, response){
        if (err) {            
            console.log("Notification Error:",err)
            
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });

};

module.exports = {
    notifyAndroidOrIOS: notifyAndroidOrIOS
}
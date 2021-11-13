let FCM = require('fcm-node');

let notifyAndroidOrIOS = (device, message, info_data) => {
	var serverKey = process.env.FIREBASE_SERVER_KEY;
    var fcm = new FCM(serverKey);
    info_data.body = message;
    info_data.title = (info_data && info_data.title) ? info_data.title :"HOFO";
    info_data['content-available'] = 1;
    info_data['sound'] = 'default';

    for(var x in info_data) { info_data[x] = info_data[x].toString(); }
    
    var message = { 
        to: device, 
        collapse_key: 'your_collapse_key',        
        notification: {
            title: info_data.title, 
            body: info_data.body  
        },        
        data: info_data
    };
    
    fcm.send(message, function(err, response){
        if (err) {
            console.log(err)
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });

};

module.exports = {
    notifyAndroidOrIOS: notifyAndroidOrIOS
}
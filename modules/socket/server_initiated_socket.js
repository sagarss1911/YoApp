'use strict';

let _ = require('lodash');

let sendUserNewNotificationCount = (data) => {
        let gsObj = require("./global_socket");
        gsObj.io().sockets.to(data.user_id.toString()).emit('new_user_order', {data:data.notificationData});    
}

module.exports = {
    sendUserNewNotificationCount    : sendUserNewNotificationCount
};  
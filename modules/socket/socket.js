module.exports = function(serverSocket){
    var users = [];
    var _ = require('lodash');

    serverSocket.on("connection", function(socket){       
     
        var getIdFlag = false;

        socket.emit("get_id", "");
        socket.on('disconnect', function(){
            removeUserFromSocket(socket);
        })

        socket.on('error', function(){
            removeUserFromSocket(socket);
        });

        socket.on('user_id', function(data){                       
            let user_id = data.user_id;
            addUserToSocket(socket.id, user_id.toString(),socket);           
        });

        socket.on("error", function(data){
            console.log("Error", data);
        });

        socket.on("heartbeat", function(data){
            socket.emit("heartbeat", data);
        });

        
    });   
    
    function getIdOfAllSockets(){
        for(var key in serverSocket.sockets.sockets){
            if(serverSocket.sockets.sockets.hasOwnProperty(key)){
                serverSocket.sockets.sockets[serverSocket.sockets.sockets[key].id].emit("get_id", "");
            }
        }
    }

    function addUserToSocket(sid, uid,socket){
        var sent_data_for_pending = true;
        if(!uid || uid.length < 4){
            return;
        }

        var previous_socket_ids = [];
        _.remove(users, user => {
            if (user.user_id == uid) {
                previous_socket_ids.push(user.socket_id);
                sent_data_for_pending = false;
                return true;
            }

            return false;
        });

        users.push({
            socket_id : sid,
            user_id : uid
        });

        _.forEach(previous_socket_ids, socket_id => {
            users.push({
                socket_id : socket_id,
                user_id   : uid
            });
        });
        
        socket.uid = uid;
        socket.join(uid);    
        return sent_data_for_pending;
    }


    function removeUserFromSocket(socket) {
        _.remove(users, user => {
            if (user.socket_id == socket.id) {
                socket.leave(user.user_id);

                console.log("UserRemoved", user);
                return true;
            }
        });
    }
    setInterval(getIdOfAllSockets, 5000);
}



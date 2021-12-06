const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
let sms = async (message, phone) => {   
  let msgbody  ="Thanks for using Alcophony, Your OTP is "+message+". Please do not share your OTP with anyone else. Have a great day."
  let sentmessage = await client.messages 
      .create({ 
         body: msgbody,  
         messagingServiceSid: process.env.MESSAGE_SERVICE_SID,      
         to: phone 
       });
  return sentmessage.sid
};

module.exports = {
  
    sms             : sms
}

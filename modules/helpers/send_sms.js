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
let paymentSuccessSMS = async (amount, phone) => {   
  let msgbody  ="Thanks for using Alcophony, Your Transaction with Amount "+amount+" is Successfully Done. Have a great day."
  let sentmessage = await client.messages 
      .create({ 
         body: msgbody,  
         messagingServiceSid: process.env.MESSAGE_SERVICE_SID,      
         to: phone 
       });
  return sentmessage.sid
};
let paymentFailedSMS = async (amount, phone) => {   
  let msgbody  ="Thanks for using Alcophony, Your Transaction with Amount "+amount+" is Failed."
  let sentmessage = await client.messages 
      .create({ 
         body: msgbody,  
         messagingServiceSid: process.env.MESSAGE_SERVICE_SID,      
         to: phone 
       });
  return sentmessage.sid
};
let paymentCancelledSMS = async (amount, phone) => {   
  let msgbody  ="Thanks for using Alcophony, Your Transaction with Amount "+amount+" is Cancelled."
  let sentmessage = await client.messages 
      .create({ 
         body: msgbody,  
         messagingServiceSid: process.env.MESSAGE_SERVICE_SID,      
         to: phone 
       });
  return sentmessage.sid
};
let paymentReceivedWithoutAccount = async (amount, phone,reference_id) => {   
  let msgbody  ="Someone Sent Money To Your Alcophony Account. Your Transaction with Amount "+amount+" is Successfully Done. Have a great day. Please use referenceid: "+reference_id+" While Creating Account." 
  let sentmessage = await client.messages 
      .create({ 
         body: msgbody,  
         messagingServiceSid: process.env.MESSAGE_SERVICE_SID,      
         to: phone 
       });
  return sentmessage.sid
};
let paymentSentSMS = async (amount, senderPhone,reeceiverPhone) => {   
  let msgbody  ="you have successfully sent money to "+reeceiverPhone+" with amount "+amount+"."
  let sentmessage = await client.messages 
      .create({ 
         body: msgbody,  
         messagingServiceSid: process.env.MESSAGE_SERVICE_SID,      
         to: senderPhone
       });
  return sentmessage.sid
};
let paymentReceivedSMS = async (amount, senderPhone,receiverPhone) => {   
  let msgbody  ="you have received money to your Wallet  from "+senderPhone+" with amount "+amount+"."
  let sentmessage = await client.messages 
      .create({ 
         body: msgbody,  
         messagingServiceSid: process.env.MESSAGE_SERVICE_SID,      
         to: receiverPhone
       });       
  return sentmessage.sid
};

module.exports = {
    sms: sms,
    paymentSuccessSMS:paymentSuccessSMS,
    paymentFailedSMS:paymentFailedSMS,
    paymentCancelledSMS:paymentCancelledSMS,
    paymentReceivedWithoutAccount:paymentReceivedWithoutAccount,
    paymentSentSMS:paymentSentSMS,
    paymentReceivedSMS:paymentReceivedSMS
}
